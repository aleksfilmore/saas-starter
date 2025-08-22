import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { ByteService } from '@/lib/shop/ByteService';
import { SHOP_PRODUCTS } from '@/lib/shop/constants';
import { db } from '@/lib/db';
import { shopOrders, shopOrderItems, digitalProductAccess } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, variant } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = SHOP_PRODUCTS[productId as keyof typeof SHOP_PRODUCTS];
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.bytePrice) {
      return NextResponse.json(
        { error: 'This product cannot be purchased with Bytes' },
        { status: 400 }
      );
    }

    // Check if user has enough bytes
    const userBalance = await ByteService.getUserBalance(user.id);
    if (userBalance < product.bytePrice) {
      return NextResponse.json(
        { 
          error: 'Insufficient Bytes',
          required: product.bytePrice,
          current: userBalance,
          message: `You need ${product.bytePrice - userBalance} more Bytes to unlock this item.`
        },
        { status: 400 }
      );
    }

    // Check if user already owns this digital product
    if (product.isDigital) {
      const existingAccess = await db
        .select()
        .from(digitalProductAccess)
        .where(
          eq(digitalProductAccess.userId, user.id)
        )
        .limit(1);

      const hasAccess = existingAccess.some(access => access.productId === productId);
      
      if (hasAccess) {
        return NextResponse.json(
          { error: 'You already own this digital product' },
          { status: 400 }
        );
      }
    }

    // Start transaction
    const orderId = uuidv4();
    const orderItemId = uuidv4();

    try {
      // Create order record
      await db.insert(shopOrders).values({
        userId: user.id,
        orderNumber: `BYTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'processing',
        paymentMethod: 'bytes',
        totalBytes: product.bytePrice,
        totalCash: 0,
        notes: `Byte purchase: ${product.name}${variant ? ` (${variant})` : ''}`
      });

      // Create order item
      await db.insert(shopOrderItems).values({
        orderId,
        productId,
        variant: variant || null,
        quantity: 1,
        bytePricePerItem: product.bytePrice,
        cashPricePerItem: 0
      });

      // Spend the bytes
      const transaction = await ByteService.spendBytes(
        user.id,
        product.bytePrice,
        `Purchased: ${product.name}${variant ? ` (${variant})` : ''}`,
        orderId,
        { productId }
      );

      // For digital products, grant immediate access
      if (product.isDigital) {
        await db.insert(digitalProductAccess).values({
          userId: user.id,
          productId,
          accessType: 'purchased',
          orderId,
          isActive: true
        });
      }

      // Update order status to completed
      await db
        .update(shopOrders)
        .set({ 
          status: 'delivered',
          deliveredAt: new Date()
        })
        .where(eq(shopOrders.id, orderId));

      // Prepare response data
      const responseData = {
        success: true,
        order: {
          id: orderId,
          productId,
          productName: product.name,
          variant,
          bytesCost: product.bytePrice,
          newBalance: userBalance - product.bytePrice,
          isDigital: product.isDigital
        },
        message: product.isDigital 
          ? `🎉 You've unlocked ${product.name}! Check your digital library.`
          : `🎉 Order confirmed! Your ${product.name} will be processed and shipped.`
      };

      // Add digital content access info if applicable
      if (product.isDigital && (product as any).digitalContent) {
        (responseData.order as any).digitalContent = (product as any).digitalContent;
      }

      return NextResponse.json(responseData);

    } catch (transactionError) {
      // Rollback: Delete order records if they were created
      try {
        await db.delete(shopOrders).where(eq(shopOrders.id, orderId));
        await db.delete(shopOrderItems).where(eq(shopOrderItems.orderId, orderId));
      } catch (cleanupError) {
        console.error('Failed to cleanup failed order:', cleanupError);
      }
      
      throw transactionError;
    }

  } catch (error) {
    console.error('Byte purchase error:', error);
    
    return NextResponse.json(
      { 
        error: 'Purchase failed',
        message: 'Unable to process your Byte purchase. Please try again.'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { shopCart, shopProducts } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { SHOP_PRODUCTS } from '@/lib/shop/constants';

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await db
      .select()
      .from(shopCart)
      .where(eq(shopCart.userId, user.id));

    // Enrich with product details
    const enrichedItems = cartItems.map(item => {
      const product = SHOP_PRODUCTS[item.productId as keyof typeof SHOP_PRODUCTS];
      return {
        ...item,
        product: product || null
      };
    }).filter(item => item.product); // Filter out items with missing products

    // Calculate totals
    const totalBytes = enrichedItems.reduce((sum, item) => 
      sum + (item.product?.bytePrice || 0) * item.quantity, 0);
    const totalCash = enrichedItems.reduce((sum, item) => 
      sum + (item.product?.cashPrice || 0) * item.quantity, 0);

    return NextResponse.json({
      success: true,
      data: {
        items: enrichedItems,
        totals: {
          items: enrichedItems.length,
          quantity: enrichedItems.reduce((sum, item) => sum + item.quantity, 0),
          bytes: totalBytes,
          cash: totalCash
        }
      }
    });

  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, variant, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = SHOP_PRODUCTS[productId as keyof typeof SHOP_PRODUCTS];
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if item already exists in cart
    const existingItem = await db
      .select()
      .from(shopCart)
      .where(
        and(
          eq(shopCart.userId, user.id),
          eq(shopCart.productId, productId),
          variant ? eq(shopCart.variant, variant) : isNull(shopCart.variant)
        )
      )
      .limit(1);

    if (existingItem.length > 0) {
      // Update quantity
      await db
        .update(shopCart)
        .set({ 
          quantity: existingItem[0].quantity + quantity,
          updatedAt: new Date()
        })
        .where(eq(shopCart.id, existingItem[0].id));
    } else {
      // Add new item
      await db.insert(shopCart).values({
        userId: user.id,
        productId,
        variant: variant || null,
        quantity
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart'
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid cart item ID or quantity' },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await db
        .delete(shopCart)
        .where(
          and(
            eq(shopCart.id, cartItemId),
            eq(shopCart.userId, user.id)
          )
        );
    } else {
      // Update quantity
      await db
        .update(shopCart)
        .set({ 
          quantity,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(shopCart.id, cartItemId),
            eq(shopCart.userId, user.id)
          )
        );
    }

    return NextResponse.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated'
    });

  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db
      .delete(shopCart)
      .where(eq(shopCart.userId, user.id));

    return NextResponse.json({
      success: true,
      message: 'Cart cleared'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

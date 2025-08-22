/**
 * Shop Purchase API - Cash Transactions
 * 
 * Handles purchases using Stripe for cash payments.
 * This is the "direct purchase" side of the shop.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { SHOP_PRODUCTS } from '@/lib/shop/constants';
import { db } from '@/lib/db';
import { shopOrders, shopOrderItems, digitalProductAccess } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, variant, shippingAddress } = body;

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

    if (!product.cashPrice) {
      return NextResponse.json(
        { error: 'This product is only available for Byte purchase' },
        { status: 400 }
      );
    }

    // Validate shipping address for physical products
    if (product.requiresShipping && !shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required for physical products' },
        { status: 400 }
      );
    }

    // Create order record first
    const orderId = uuidv4();
    const orderItemId = uuidv4();

    try {
      await db.insert(shopOrders).values({
        userId: user.id,
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        paymentMethod: 'stripe',
        totalBytes: 0,
        totalCash: Math.round(product.cashPrice * 100), // Convert to cents
        shippingName: shippingAddress?.name || null,
        shippingEmail: shippingAddress?.email || user.email,
        shippingAddress1: shippingAddress?.address1 || null,
        shippingAddress2: shippingAddress?.address2 || null,
        shippingCity: shippingAddress?.city || null,
        shippingState: shippingAddress?.state || null,
        shippingZip: shippingAddress?.zip || null,
        shippingCountry: shippingAddress?.country || null,
        notes: `Cash purchase: ${product.name}${variant ? ` (${variant})` : ''}`
      });

      await db.insert(shopOrderItems).values({
        orderId,
        productId,
        variant: variant || null,
        quantity: 1,
        bytePricePerItem: 0,
        cashPricePerItem: Math.round(product.cashPrice * 100)
      });

      // Create Stripe checkout session
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [...(product.images || [])],
              metadata: {
                productId,
                variant: variant || '',
                category: product.category,
                type: product.type
              }
            },
            unit_amount: Math.round(product.cashPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ];

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/success?order_id=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?canceled=true`,
        customer_email: user.email,
        metadata: {
          orderId,
          userId: user.id,
          productId,
          variant: variant || '',
        },
        // Add shipping for physical products
        ...(product.requiresShipping && {
          shipping_address_collection: {
            allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'DK', 'NO', 'FI'],
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 999, // $9.99 shipping
                  currency: 'usd',
                },
                display_name: 'Standard Shipping',
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 5,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 10,
                  },
                },
              },
            },
          ],
        })
      };

      const session = await stripe.checkout.sessions.create(sessionParams);

      // Update order with Stripe session ID
      await db
        .update(shopOrders)
        .set({ 
          stripeSessionId: session.id,
          updatedAt: new Date()
        })
        .where(eq(shopOrders.id, orderId));

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        orderId,
        sessionId: session.id
      });

    } catch (orderError) {
      // Cleanup failed order
      try {
        await db.delete(shopOrders).where(eq(shopOrders.id, orderId));
        await db.delete(shopOrderItems).where(eq(shopOrderItems.orderId, orderId));
      } catch (cleanupError) {
        console.error('Failed to cleanup failed order:', cleanupError);
      }
      
      throw orderError;
    }

  } catch (error) {
    console.error('Cash purchase error:', error);
    
    return NextResponse.json(
      { 
        error: 'Purchase failed',
        message: 'Unable to create checkout session. Please try again.'
      },
      { status: 500 }
    );
  }
}

// Handle Stripe webhook for payment completion
export async function PUT(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const body = await request.text();

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Update order status to completed
        await db
          .update(shopOrders)
          .set({ 
            status: 'completed',
            stripePaymentIntentId: session.payment_intent as string,
            updatedAt: new Date()
          })
          .where(eq(shopOrders.id, orderId));

        // Handle digital product access if needed
        const orderItems = await db
          .select()
          .from(shopOrderItems)
          .where(eq(shopOrderItems.orderId, orderId));

        if (orderItems.length > 0) {
          for (const item of orderItems) {
            const product = SHOP_PRODUCTS[item.productId as keyof typeof SHOP_PRODUCTS];
            if (product?.isDigital) {
              await db.insert(digitalProductAccess).values({
                userId: session.metadata?.userId || '',
                productId: item.productId,
                accessType: 'purchased',
                orderId,
                isActive: true
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

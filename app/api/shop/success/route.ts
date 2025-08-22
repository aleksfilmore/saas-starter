import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { shopOrders, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ searchParams: URLSearchParams }> }
) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      // For non-authenticated users, show general success message
      return NextResponse.json({
        success: true,
        message: 'Thank you for your purchase! Check your email for order details.',
        guest: true
      });
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get('order_id');
    const sessionId = url.searchParams.get('session_id');

    if (orderId) {
      // Fetch order details
      const order = await db
        .select()
        .from(shopOrders)
        .where(eq(shopOrders.id, orderId))
        .limit(1);

      if (order.length > 0 && order[0].userId === user.id) {
        return NextResponse.json({
          success: true,
          data: {
            order: order[0],
            message: 'Purchase completed successfully!',
            orderNumber: order[0].orderNumber
          }
        });
      }
    }

    // Default success response
    return NextResponse.json({
      success: true,
      message: 'Purchase completed successfully! Check your email for order details.'
    });

  } catch (error) {
    console.error('Success page error:', error);
    return NextResponse.json({
      success: true,
      message: 'Purchase completed! If you have any issues, please contact support.',
      fallback: true
    });
  }
}

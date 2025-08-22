import { NextRequest, NextResponse } from 'next/server'
import { SHOP_PRODUCTS } from '@/lib/shop/constants'

// Unlock notification messages for each product
const UNLOCK_NOTIFICATIONS = {
  workbook_ctrlaltblock: {
    title: "Unlocked: CTRL+ALT+BLOCK Workbook",
    message: "Your starter kit for healing is ready. Open it now and start stacking wins.",
    action: "Open Now",
    type: "digital_instant"
  },
  audiobook_worst_boyfriends: {
    title: "🎧 You did it — 900 Bytes earned!",
    message: "The Worst Boyfriends Ever audiobook is unlocked. Claim it now and start listening.",
    action: "Claim Now",
    type: "digital_instant"
  },
  signed_worst_boyfriends: {
    title: "📖 Milestone reached: 3000 Bytes!",
    message: "You've unlocked a signed copy of The Worst Boyfriends Ever. Order it now with your Bytes and I'll send it worldwide with a personal note.",
    action: "Order Now",
    type: "physical_shipping"
  },
  candle_closure_ritual: {
    title: "🔥 4000 Bytes stacked!",
    message: "You've unlocked the CTRL+ALT+BLOCK Candle. Light it when you're ready to burn the past. Order yours now.",
    action: "Order Now",
    type: "physical_shipping"
  },
  phone_case_ctrlaltblock: {
    title: "📱 5000 Bytes strong.",
    message: "The CTRL+ALT+BLOCK phone case is unlocked. Carry your streak everywhere. Order now to claim it.",
    action: "Order Now",
    type: "physical_shipping"
  },
  hoodie_wear_healing: {
    title: "👕 You've earned 8000 Bytes!",
    message: "The CTRL+ALT+BLOCK hoodie is unlocked. Wear your healing — order it now to make it yours.",
    action: "Order Now",
    type: "physical_shipping"
  },
  blanket_cocoon_closure: {
    title: "🛋️ Legendary unlocked: 10,000 Bytes.",
    message: "The CTRL+ALT+BLOCK blanket is now yours to claim. Wrap yourself in proof that you made it. Order now to complete your journey.",
    action: "Order Now",
    type: "physical_shipping"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId } = await request.json()

    if (!productId || !userId) {
      return NextResponse.json(
        { error: 'Product ID and User ID are required' },
        { status: 400 }
      )
    }

    const notification = UNLOCK_NOTIFICATIONS[productId as keyof typeof UNLOCK_NOTIFICATIONS]
    if (!notification) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Here you would typically:
    // 1. Save the notification to the database
    // 2. Send push notification to user's device
    // 3. Trigger in-app notification

    console.log(`🎯 UNLOCK NOTIFICATION TRIGGERED for user ${userId}:`)
    console.log(`📱 ${notification.title}`)
    console.log(`💬 ${notification.message}`)
    console.log(`🔘 Action: ${notification.action}`)
    console.log(`🏷️ Type: ${notification.type}`)

    // For now, we'll just log it and return success
    // In production, you'd integrate with:
    // - Push notification service (FCM, APNS)
    // - In-app notification system
    // - Email notifications

    return NextResponse.json({
      success: true,
      notification: {
        title: notification.title,
        message: notification.message,
        action: notification.action,
        type: notification.type,
        productId,
        userId
      }
    })

  } catch (error) {
    console.error('Unlock notification error:', error)
    return NextResponse.json(
      { error: 'Failed to trigger unlock notification' },
      { status: 500 }
    )
  }
}

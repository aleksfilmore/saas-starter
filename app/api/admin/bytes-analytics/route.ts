import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, byteTransactions } from '@/lib/db/schema';
import { eq, gte, and, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const adminCheck = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    
    if (!adminCheck.length || !adminCheck[0].isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Get total earned bytes (positive amounts from activities)
    const totalEarnedResult = await db
      .select({
        total: sql<number>`SUM(${byteTransactions.amount})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          sql`${byteTransactions.source} != 'purchase'`,
          gte(byteTransactions.createdAt, startDate)
        )
      );

    // Get total spent bytes (negative amounts)
    const totalSpentResult = await db
      .select({
        total: sql<number>`SUM(ABS(${byteTransactions.amount}))`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} < 0`,
          gte(byteTransactions.createdAt, startDate)
        )
      );

    // Get total purchased bytes (positive amounts from purchases)
    const totalPurchasedResult = await db
      .select({
        total: sql<number>`SUM(${byteTransactions.amount})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          eq(byteTransactions.source, 'purchase'),
          gte(byteTransactions.createdAt, startDate)
        )
      );

    // Get active users (users with byte transactions in the period)
    const activeUsersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${byteTransactions.userId})`
      })
      .from(byteTransactions)
      .where(gte(byteTransactions.createdAt, startDate));

    // Get daily earning/spending trends
    const dailyTrends = await db
      .select({
        date: sql<string>`DATE(${byteTransactions.createdAt})`,
        earned: sql<number>`SUM(CASE WHEN ${byteTransactions.amount} > 0 AND ${byteTransactions.source} != 'purchase' THEN ${byteTransactions.amount} ELSE 0 END)`,
        spent: sql<number>`SUM(CASE WHEN ${byteTransactions.amount} < 0 THEN ABS(${byteTransactions.amount}) ELSE 0 END)`,
        purchased: sql<number>`SUM(CASE WHEN ${byteTransactions.amount} > 0 AND ${byteTransactions.source} = 'purchase' THEN ${byteTransactions.amount} ELSE 0 END)`
      })
      .from(byteTransactions)
      .where(gte(byteTransactions.createdAt, startDate))
      .groupBy(sql`DATE(${byteTransactions.createdAt})`)
      .orderBy(sql`DATE(${byteTransactions.createdAt})`);

    // Get earning by activity (only positive amounts from non-purchase sources)
    const earningByActivity = await db
      .select({
        activity: byteTransactions.source,
        total: sql<number>`SUM(${byteTransactions.amount})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          sql`${byteTransactions.source} != 'purchase'`,
          gte(byteTransactions.createdAt, startDate)
        )
      )
      .groupBy(byteTransactions.source);

    // Get spending by category (only negative amounts)
    const spendingByCategory = await db
      .select({
        category: byteTransactions.description,
        total: sql<number>`SUM(ABS(${byteTransactions.amount}))`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} < 0`,
          gte(byteTransactions.createdAt, startDate)
        )
      )
      .groupBy(byteTransactions.description);

    // Get user distribution
    const earnersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${byteTransactions.userId})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          sql`${byteTransactions.source} != 'purchase'`,
          gte(byteTransactions.createdAt, startDate)
        )
      );

    const spendersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${byteTransactions.userId})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} < 0`,
          gte(byteTransactions.createdAt, startDate)
        )
      );

    const purchasersResult = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${byteTransactions.userId})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          eq(byteTransactions.source, 'purchase'),
          gte(byteTransactions.createdAt, startDate)
        )
      );

    // Process daily trends
    const dailyEarning: Array<{ date: string; amount: number }> = [];
    const dailySpending: Array<{ date: string; amount: number }> = [];

    // Convert daily trends to arrays
    dailyTrends.forEach(trend => {
      dailyEarning.push({ date: trend.date, amount: trend.earned || 0 });
      dailySpending.push({ date: trend.date, amount: trend.spent || 0 });
    });

    // Process earning by activity with percentages
    const totalEarning = totalEarnedResult[0]?.total || 0;
    const earningByActivityWithPercentage = earningByActivity.map(item => ({
      activity: item.activity || 'Unknown',
      amount: item.total || 0,
      percentage: totalEarning > 0 ? Math.round(((item.total || 0) / totalEarning) * 100) : 0
    }));

    // Process spending by category with percentages
    const totalSpending = totalSpentResult[0]?.total || 0;
    const spendingByCategoryWithPercentage = spendingByCategory.map(item => ({
      category: item.category || 'Unknown',
      amount: item.total || 0,
      percentage: totalSpending > 0 ? Math.round(((item.total || 0) / totalSpending) * 100) : 0
    }));

    // Calculate monthly trends (comparing to previous period)
    const previousPeriodStart = new Date(startDate);
    const previousPeriodEnd = new Date(startDate);
    const daysDiff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    previousPeriodStart.setDate(previousPeriodStart.getDate() - daysDiff);

    const prevEarnedResult = await db
      .select({
        total: sql<number>`SUM(${byteTransactions.amount})`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} > 0`,
          sql`${byteTransactions.source} != 'purchase'`,
          gte(byteTransactions.createdAt, previousPeriodStart),
          sql`${byteTransactions.createdAt} < ${startDate.toISOString()}`
        )
      );

    const prevSpentResult = await db
      .select({
        total: sql<number>`SUM(ABS(${byteTransactions.amount}))`
      })
      .from(byteTransactions)
      .where(
        and(
          sql`${byteTransactions.amount} < 0`,
          gte(byteTransactions.createdAt, previousPeriodStart),
          sql`${byteTransactions.createdAt} < ${startDate.toISOString()}`
        )
      );

    const currentEarning = totalEarnedResult[0]?.total || 0;
    const previousEarning = prevEarnedResult[0]?.total || 0;
    const currentSpending = totalSpentResult[0]?.total || 0;
    const previousSpending = prevSpentResult[0]?.total || 0;

    const earningTrend = previousEarning > 0 
      ? Math.round(((currentEarning - previousEarning) / previousEarning) * 100)
      : 0;
    
    const spendingTrend = previousSpending > 0 
      ? Math.round(((currentSpending - previousSpending) / previousSpending) * 100)
      : 0;

    const analyticsData = {
      totalEarned: currentEarning,
      totalSpent: currentSpending,
      totalPurchased: totalPurchasedResult[0]?.total || 0,
      activeUsers: activeUsersResult[0]?.count || 0,
      dailyEarning: dailyEarning.slice(-30), // Last 30 days max
      dailySpending: dailySpending.slice(-30),
      earningByActivity: earningByActivityWithPercentage,
      spendingByCategory: spendingByCategoryWithPercentage,
      userDistribution: {
        earners: earnersResult[0]?.count || 0,
        spenders: spendersResult[0]?.count || 0,
        purchasers: purchasersResult[0]?.count || 0
      },
      monthlyTrends: {
        earning: earningTrend,
        spending: spendingTrend,
        netFlow: currentEarning - currentSpending
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Bytes analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

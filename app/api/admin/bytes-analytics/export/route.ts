import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, byteTransactions } from '@/lib/db/unified-schema';
import { eq, gte, and, sql } from 'drizzle-orm';

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

    // Get all byte transactions for the period
    const transactions = await db
      .select({
        id: byteTransactions.id,
        userId: byteTransactions.userId,
        amount: byteTransactions.amount,
        source: byteTransactions.source,
        description: byteTransactions.description,
        relatedId: byteTransactions.relatedId,
        createdAt: byteTransactions.createdAt
      })
      .from(byteTransactions)
      .where(gte(byteTransactions.createdAt, startDate))
      .orderBy(byteTransactions.createdAt);

    // Convert to CSV format
    const csvHeaders = [
      'Date',
      'User ID',
      'Type',
      'Amount',
      'Source',
      'Description',
      'Related ID'
    ];

    const csvRows = transactions.map(transaction => {
      // Determine type based on amount and source
      let type = 'unknown';
      if (transaction.amount > 0) {
        type = transaction.source === 'purchase' ? 'purchased' : 'earned';
      } else if (transaction.amount < 0) {
        type = 'spent';
      }

      return [
        transaction.createdAt.toISOString().split('T')[0],
        transaction.userId,
        type,
        transaction.amount.toString(),
        transaction.source || '',
        transaction.description || '',
        transaction.relatedId || ''
      ];
    });

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bytes-analytics-${range}-${now.toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Bytes analytics export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

# Analytics and Referral System Setup Guide

This guide walks you through setting up and using the comprehensive analytics and referral system that has been added to your SaaS application.

## 🚀 Quick Setup

### 1. Run Database Migration

First, create the required database tables:

```bash
npx tsx migrate-analytics.ts
```

This will create the following tables:
- `analytics_events` - Track all user interactions
- `user_sessions` - Monitor user activity sessions
- `conversion_funnels` - Track conversion stages
- `referrals` - Manage referral codes and rewards
- `subscription_events` - Monitor subscription lifecycle

### 2. Test the System

Run the test script to verify everything works:

```bash
npx tsx test-analytics-clean.ts
```

### 3. Access Admin Dashboard

Visit `/admin` to see comprehensive analytics including:
- Real-time conversion funnel metrics
- User retention cohort analysis
- Feature usage statistics
- Revenue breakdown and trends

## 📊 Features Overview

### Analytics Tracking
- **30+ predefined events** for consistent tracking
- **Real-time metrics** calculation and reporting  
- **Session tracking** with device and browser detection
- **Conversion funnel** analysis with dropoff identification

### Admin Dashboard
- **Executive overview** with key business metrics
- **Conversion funnels** with visual progress tracking
- **Retention analysis** showing day 1, 7, 30 retention rates
- **Feature usage** ranking and adoption metrics
- **Revenue insights** including MRR, ARR, and ARPU

### Referral System
- **Unique referral codes** for each user
- **Click tracking** with IP and user agent logging
- **Automatic rewards** when referrals complete signup
- **Detailed statistics** for referrers and admins

### Conversion Optimization
- **A/B testing framework** with hash-based variant assignment
- **Engagement scoring** (0-100) based on user activity
- **Churn risk assessment** using predictive analytics
- **Funnel performance analysis** with optimization recommendations

## 🛠 API Usage

### Track Events

```typescript
import { AnalyticsService } from '@/lib/analytics/service';
import { AnalyticsEvents } from '@/lib/analytics/events';

// Track user signup
await AnalyticsService.track({
  event: AnalyticsEvents.USER_SIGNED_UP,
  userId: user.id,
  sessionId: session.id,
  properties: {
    source: 'organic',
    campaign: 'homepage'
  }
});

// Track feature usage
await AnalyticsService.track({
  event: AnalyticsEvents.AI_THERAPY_SESSION_STARTED,
  userId: user.id,
  properties: {
    sessionType: 'crisis-support',
    promptLength: 150
  }
});
```

### Generate Referral Codes

```typescript
import { ReferralService } from '@/lib/referrals/service';

// Generate code for user
const referralCode = await ReferralService.generateReferralCode(userId);

// Track referral click
await ReferralService.trackReferralClick(referralCode, userIP);

// Complete referral when new user signs up
await ReferralService.completeReferralSignup(referralCode, newUserId);
```

### Analyze Conversion

```typescript
import { ConversionOptimizer } from '@/lib/conversion/optimizer';

// Calculate engagement score
const score = await ConversionOptimizer.calculateEngagementScore(userId);

// Assess churn risk
const churnRisk = await ConversionOptimizer.assessChurnRisk(userId);

// Get A/B test variant
const variant = ConversionOptimizer.getABTestVariant(userId, 'pricing_test');
```

## 📈 Key Metrics Available

### User Analytics
- Total events tracked per user
- Unique active days
- Average events per day
- Feature usage breakdown
- Recent activity timeline

### Business Metrics
- **Revenue**: Total, MRR, ARR, ARPU
- **Retention**: Day 1, 7, 30 retention rates
- **Conversion**: Funnel completion rates
- **Engagement**: Session duration, feature adoption
- **Referrals**: Click-through and completion rates

### Conversion Funnels
Pre-configured funnels for:
- **Subscription**: Landing → Pricing → Checkout → Payment → Active
- **Onboarding**: Signup → Profile → First Feature → Completion
- **Engagement**: Login → Dashboard → Feature Use → Return Visit

## 🎯 Best Practices

### Event Tracking
1. **Be consistent** - Use predefined events from `AnalyticsEvents`
2. **Include context** - Add relevant properties to events
3. **Track early** - Capture events immediately when actions occur
4. **Respect privacy** - Don't track sensitive personal information

### Performance
1. **Async tracking** - All analytics calls are non-blocking
2. **Batch processing** - Events are efficiently batched in database
3. **Index optimization** - Database indexes are created for fast queries
4. **Error handling** - Analytics failures won't break main application flow

### Data Analysis
1. **Regular review** - Check admin dashboard weekly for insights
2. **A/B testing** - Use built-in framework for optimization experiments
3. **Cohort analysis** - Monitor retention trends over time
4. **Funnel optimization** - Identify and fix conversion bottlenecks

## 🔧 Customization

### Adding New Events
Add to `lib/analytics/events.ts`:

```typescript
export const AnalyticsEvents = {
  // ... existing events
  MY_CUSTOM_EVENT: 'my_custom_event',
} as const;
```

### Custom Funnels
Define in `lib/analytics/events.ts`:

```typescript
export const ConversionFunnels = {
  // ... existing funnels
  MY_FUNNEL: {
    name: 'my_funnel',
    stages: ['step1', 'step2', 'step3']
  }
} as const;
```

### Dashboard Widgets
Extend `components/admin/AdminDashboard.tsx` with new tabs and metrics visualization.

## 🚨 Troubleshooting

### Common Issues

1. **Database connection errors**
   - Verify your database URL in environment variables
   - Ensure database is running and accessible

2. **TypeScript compilation errors**
   - Run `npm run build` to check for type issues
   - Verify imports match actual exported functions

3. **Missing data in dashboard**
   - Check that events are being tracked in API routes
   - Verify database tables were created correctly
   - Run test script to validate functionality

4. **Performance issues**
   - Monitor database query performance
   - Consider adding more indexes for frequently queried data
   - Use dashboard filtering to limit data ranges

### Getting Help

- Check the test script output for specific error messages
- Review API route responses for debugging information
- Monitor browser console for client-side tracking issues

## 🎉 You're Ready!

Your SaaS now has enterprise-level analytics capabilities including:
- ✅ Comprehensive event tracking
- ✅ Real-time business intelligence dashboard  
- ✅ Automated referral system with rewards
- ✅ Advanced conversion optimization tools
- ✅ Predictive churn analysis
- ✅ A/B testing framework

Start tracking events, analyze your conversion funnels, and optimize for growth! 🚀

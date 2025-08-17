# Admin Dashboard Documentation

## Overview
The admin dashboard provides system administrators with comprehensive control and monitoring capabilities for the CTRL+ALT+BLOCK application.

## Access Control

### System Administrator Account
- **Email:** `system_admin@ctrlaltblock.com`
- **Password:** `SecureAdmin2024!`
- **Created:** Automatically via `scripts/create-admin.ts`

### Security Features
1. **Email-based Access Control:** Only the specific admin email can access the dashboard
2. **Authentication Required:** Users must be signed in to attempt access
3. **Automatic Redirects:** 
   - Non-authenticated users → Sign In page
   - Authenticated non-admin users → Dashboard
4. **Admin Guard Component:** Protects all admin routes with `AdminGuard`

## Dashboard Features

### Overview Tab
- **User Statistics:**
  - Total registered users
  - Active users (last 30 days)
  - Wall posts count
  - Pending posts for review
- **Revenue Metrics:**
  - Total revenue (this month)
  - Active subscriptions count
- **System Status:**
  - Database health
  - Authentication system status
  - Stripe integration status
  - Analytics service status

### Analytics Tab
- Comprehensive analytics dashboard via `AdminDashboard` component
- Revenue tracking and conversion metrics
- User retention analysis
- Feature usage statistics

### System Status Indicators
- **Healthy (Green):** System component working normally
- **Warning (Yellow):** System component has minor issues
- **Error (Red):** System component has critical issues

## API Endpoints

### Admin-Only APIs
- `GET /api/admin/user-stats` - Real user statistics from database
- `GET /api/analytics/revenue` - Revenue and subscription metrics
- `GET /api/analytics/retention` - User retention analysis

### Security
All admin APIs validate that the requesting user has the admin email address before returning data.

## File Structure

```
app/admin/
├── layout.tsx              # Admin layout with AdminGuard
└── dashboard/
    └── page.tsx            # Main admin dashboard

components/admin/
├── AdminGuard.tsx          # Security component
└── AdminDashboard.tsx      # Analytics dashboard

api/admin/
└── user-stats/
    └── route.ts           # Admin user statistics API

scripts/
└── create-admin.ts        # Admin user creation script
```

## Usage Instructions

### Accessing the Admin Dashboard
1. Navigate to `/admin/dashboard`
2. If not signed in, you'll be redirected to sign in
3. Sign in with the system admin credentials
4. If signed in with a different account, you'll see an access denied message

### Managing the System
1. **Monitor System Health:** Check the system status cards on the Overview tab
2. **Review Analytics:** Use the Analytics tab for detailed metrics
3. **Refresh Data:** Click "Refresh Data" to update statistics
4. **Sign Out:** Use the "Sign Out" button to end the admin session

## Creating Additional Admin Users

To create additional admin users:

1. Update the `ADMIN_EMAIL` constant in `AdminGuard.tsx` to accept multiple emails
2. Or modify the security logic to check against a database role/permission system
3. Run the `create-admin.ts` script with different credentials

## Security Considerations

- Admin credentials should be changed from defaults in production
- Consider implementing 2FA for admin accounts
- Admin access should be logged and monitored
- Regular security audits of admin functionality recommended

## Development

### Adding New Admin Features
1. Create new admin-only API routes in `/api/admin/`
2. Add authentication checks using the admin email validation
3. Update the dashboard UI in `/app/admin/dashboard/page.tsx`
4. Consider adding new tabs to the Tabs component for organization

### Testing Admin Features
1. Start the development server: `npm run dev`
2. Navigate to `/admin/dashboard`
3. Sign in with admin credentials
4. Test all functionality and API endpoints

## Error Handling

The admin dashboard includes comprehensive error handling:
- API failures fall back to mock data
- System status accurately reflects service availability
- User-friendly error messages for access issues
- Graceful degradation when services are unavailable

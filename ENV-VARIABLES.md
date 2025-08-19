# Environment Variables

Copy this template to create your `.env.local` file:

```env
# Database
POSTGRES_URL="postgresql://user:password@host:port/database"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_FIREWALL_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# OpenAI (for AI Therapy)
OPENAI_API_KEY="sk-..."

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# Optional: Redis Cache
REDIS_URL="redis://localhost:6379"

# Optional: Error Monitoring
NEXT_PUBLIC_SENTRY_DSN="your_sentry_dsn_here"
SENTRY_DSN="your_sentry_dsn_here"

# Optional: Analytics
GOOGLE_SITE_VERIFICATION="your-verification-code"

# Optional: Site Configuration
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Rate Limiting (Optional)
RATE_LIMIT_ENABLED=true
```

## Required vs Optional

### Required for Core Functionality
- `POSTGRES_URL` - Database connection
- `NEXTAUTH_SECRET` - Authentication security
- `OPENAI_API_KEY` - AI therapy features
- `STRIPE_SECRET_KEY` - Payment processing

### Optional (Graceful Fallbacks)
- `REDIS_URL` - Falls back to memory cache
- `SENTRY_DSN` - Falls back to console logging
- `RESEND_API_KEY` - Email features won't work
- `GOOGLE_SITE_VERIFICATION` - SEO optimization

## Security Notes
- Never commit `.env.local` to version control
- Use different keys for development/production
- Regularly rotate API keys
- Use environment-specific Stripe keys

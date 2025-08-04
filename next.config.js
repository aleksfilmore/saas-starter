/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', 'drizzle-orm'],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
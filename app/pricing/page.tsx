import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing - CTRL+ALT+BLOCK',
  description: 'Choose the healing plan that works for your budget and needs.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-300">
            TODO: Detailed pricing tiers and subscription options will be implemented here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Free Tier</h2>
            <div className="space-y-4 text-gray-300">
              <p>• Basic ritual access</p>
              <p>• Limited AI therapy messages</p>
              <p>• Wall of Wounds participation</p>
              <p>• Progress tracking</p>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Premium</h2>
            <div className="space-y-4 text-gray-300">
              <p>• Unlimited ritual access</p>
              <p>• Unlimited AI therapy</p>
              <p>• Advanced analytics</p>
              <p>• Priority support</p>
              <p className="text-purple-400 font-semibold">$9.99/month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

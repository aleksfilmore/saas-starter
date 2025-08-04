import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact - CTRL+ALT+BLOCK',
  description: 'Get support and connect with the CTRL+ALT+BLOCK team.',
}

export default function ContactPage() {
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
            Contact Support
          </h1>
          <p className="text-xl text-gray-300">
            TODO: Contact form and support information will be implemented here.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-600/50 backdrop-blur-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Support Channels
          </h2>
          <div className="space-y-4 text-gray-300">
            <p><strong>Email:</strong> support@ctrlaltblock.com</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
            <p><strong>Emergency:</strong> If you're in crisis, please contact emergency services or a crisis hotline immediately.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

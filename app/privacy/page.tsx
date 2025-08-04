import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      
      {/* Header */}
      <header className="w-full border-b border-gray-600/30 bg-gray-800/60 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full py-3 sm:py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white">
              <span>CTRL</span>
              <span className="text-gray-400">+</span>
              <span>ALT</span>
              <span className="text-gray-400">+</span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BLOCK</span>
            </Link>
            <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-800/90 border border-gray-600/50 backdrop-blur-xl rounded-lg p-8">
          
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            
            <p className="text-gray-300 text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We collect minimal information necessary to provide our healing platform services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email address for account creation and communication</li>
                  <li>Anonymized quiz responses for personalized healing recommendations</li>
                  <li>Usage data to improve our platform and services</li>
                  <li>Optional feedback and interaction data to enhance your experience</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>Your information is used exclusively to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide personalized healing recommendations and content</li>
                  <li>Send important updates about your healing journey</li>
                  <li>Improve our platform's effectiveness and user experience</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Data Security & Anonymity</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We are committed to protecting your privacy and maintaining anonymity:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All personal data is encrypted and securely stored</li>
                  <li>We never share your personal information with third parties</li>
                  <li>Your healing journey remains completely anonymous</li>
                  <li>You can delete your account and data at any time</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <div className="text-gray-300 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and all associated data</li>
                  <li>Opt out of communications at any time</li>
                  <li>Export your data in a portable format</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have any questions about this Privacy Policy or your data, please contact us at{' '}
                  <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                    our contact page
                  </Link>.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
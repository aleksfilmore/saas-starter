import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
          
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            
            <p className="text-gray-300 text-lg mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  By accessing and using CTRL+ALT+BLOCK, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Description of Service</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  CTRL+ALT+BLOCK is a digital platform providing personalized healing resources, AI-powered therapy tools, and emotional support content. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Attachment style assessment and personalized recommendations</li>
                  <li>AI-powered therapeutic conversations and guidance</li>
                  <li>Daily healing rituals and mindfulness exercises</li>
                  <li>Progress tracking and achievement systems</li>
                  <li>Educational content about attachment theory and healing</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
              <div className="text-gray-300 space-y-4">
                <p>As a user of our platform, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information during registration and assessments</li>
                  <li>Use the platform for personal healing and growth purposes only</li>
                  <li>Respect other users and maintain a supportive community environment</li>
                  <li>Not share your account credentials with others</li>
                  <li>Report any technical issues or inappropriate content</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Important Disclaimer</h2>
              <div className="text-gray-300 space-y-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                <p className="font-semibold text-yellow-200">
                  CTRL+ALT+BLOCK is not a substitute for professional mental health treatment.
                </p>
                <p>
                  Our platform provides educational content and supportive tools, but does not constitute medical advice, therapy, or clinical treatment. If you are experiencing a mental health crisis or need professional support, please consult with a licensed mental health professional or contact emergency services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy and Data</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  Your privacy is important to us. Please review our{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </Link>{' '}
                  to understand how we collect, use, and protect your information.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  CTRL+ALT+BLOCK provides content and tools "as is" without warranties of any kind. We are not liable for any decisions made or actions taken based on the information provided through our platform.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of any changes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <div className="text-gray-300 space-y-4">
                <p>
                  If you have questions about these Terms of Service, please contact us at{' '}
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
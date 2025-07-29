import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-foreground">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url(/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-black text-white" style={{fontFamily: 'system-ui, -apple-system, sans-serif', WebkitTextStroke: '1px #ec4899'}}>
              CTRL+ALT+<span className="text-glitch-pink" style={{textShadow: '0 0 20px rgba(255,20,147,0.8)'}}>BLOCK</span>
            </h1>
          </Link>
          <h2 className="text-4xl font-bold text-white mb-4">Terms of Service</h2>
          <p className="text-purple-300 text-lg">Last Updated: July 30, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/60 border-2 border-purple-400/30 rounded-xl p-8 backdrop-blur-sm space-y-8">
          
          <section>
            <h3 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h3>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using CTRL+ALT+BLOCK™ ("the Service"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">2. Description of Service</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              CTRL+ALT+BLOCK™ is an emotional wellness platform designed to help users navigate heartbreak recovery through:
            </p>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                No Contact tracking and support tools
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Daily ritual and mindfulness exercises
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                AI-powered emotional support tools
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Anonymous community support features
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h3>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>You agree to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Provide accurate registration information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Use the service for personal, non-commercial purposes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Respect other users and maintain community guidelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Not share harmful, illegal, or inappropriate content
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">4. Important Disclaimers</h3>
            <div className="bg-red-900/20 border border-red-400/50 rounded-lg p-4 text-red-300">
              <p className="font-semibold mb-2">⚠️ Mental Health Notice:</p>
              <p className="leading-relaxed">
                CTRL+ALT+BLOCK™ is not a substitute for professional mental health care. If you are experiencing severe depression, 
                suicidal thoughts, or mental health crisis, please contact a licensed mental health professional or crisis helpline immediately.
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">5. Privacy and Data</h3>
            <p className="text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              By using our service, you consent to our data practices as outlined in our Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h3>
            <p className="text-gray-300 leading-relaxed">
              CTRL+ALT+BLOCK™ is provided "as is" without warranties. We are not liable for any damages arising from your use of the service.
              Users assume full responsibility for their emotional well-being and decisions made while using our platform.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">7. Contact Information</h3>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@ctrlaltblock.com" className="text-purple-400 hover:text-purple-300 underline">
                support@ctrlaltblock.com
              </a>
            </p>
          </section>

        </div>

        {/* Navigation */}
        <div className="text-center mt-8 space-x-6">
          <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 underline font-medium">
            ← Back to Sign Up
          </Link>
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline font-medium">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}

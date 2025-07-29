import Link from 'next/link';

export default function PrivacyPage() {
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
          <h2 className="text-4xl font-bold text-white mb-4">Privacy Policy</h2>
          <p className="text-purple-300 text-lg">Last Updated: July 30, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/60 border-2 border-blue-400/30 rounded-xl p-8 backdrop-blur-sm space-y-8">
          
          <section>
            <h3 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h3>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p><strong className="text-white">Account Information:</strong> Email address, password (securely hashed), and profile preferences.</p>
              <p><strong className="text-white">Usage Data:</strong> No Contact tracking, ritual completions, mood entries, and app interaction patterns.</p>
              <p><strong className="text-white">Anonymous Content:</strong> Posts to the Anonymous Wall (not linked to your identity).</p>
              <p><strong className="text-white">Technical Data:</strong> IP address, device information, and analytics for service improvement.</p>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h3>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Provide personalized emotional wellness features
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Track your progress and provide insights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Improve our AI-powered tools and recommendations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Send service updates and ritual reminders (if opted in)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Ensure platform safety and prevent abuse
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">3. Data Protection & Security</h3>
            <div className="bg-green-900/20 border border-green-400/50 rounded-lg p-4 text-green-300 mb-4">
              <p className="font-semibold mb-2">🔒 Your Emotional Data is Sacred</p>
              <p className="leading-relaxed">
                We understand how sensitive emotional healing data is. All personal information is encrypted, 
                and we use industry-standard security measures to protect your privacy.
              </p>
            </div>
            <ul className="text-gray-300 space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                End-to-end encryption for sensitive data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Secure password hashing (Argon2id)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Regular security audits and updates
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Anonymous Wall posts are truly anonymous
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">4. Data Sharing & Third Parties</h3>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p><strong className="text-white">We DO NOT sell your personal data.</strong></p>
              <p>Limited sharing only occurs for:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Essential service providers (hosting, payments) under strict privacy agreements
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Legal compliance when required by law
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Anonymized, aggregated analytics for service improvement
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">5. Your Privacy Rights</h3>
            <div className="text-gray-300 leading-relaxed space-y-3">
              <p>You have the right to:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Access and download your personal data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Correct or update your information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Delete your account and associated data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Opt out of optional data collection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Control email communication preferences
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">6. Cookies & Analytics</h3>
            <p className="text-gray-300 leading-relaxed">
              We use essential cookies for authentication and session management. Optional analytics cookies help us improve the service. 
              You can control cookie preferences in your browser settings.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">7. Data Retention</h3>
            <p className="text-gray-300 leading-relaxed">
              Personal data is retained while your account is active and for a reasonable period after deletion to comply with legal obligations. 
              Anonymous Wall posts remain anonymous and may be retained for community benefit.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">8. Changes to Privacy Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
              Material changes will be communicated via email or in-app notification.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold text-white mb-4">9. Contact Us</h3>
            <p className="text-gray-300 leading-relaxed">
              For privacy-related questions or to exercise your rights, contact us at{' '}
              <a href="mailto:privacy@ctrlaltblock.com" className="text-blue-400 hover:text-blue-300 underline">
                privacy@ctrlaltblock.com
              </a>
            </p>
          </section>

        </div>

        {/* Navigation */}
        <div className="text-center mt-8 space-x-6">
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline font-medium">
            ← Terms of Service
          </Link>
          <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 underline font-medium">
            Back to Sign Up →
          </Link>
        </div>
      </div>
    </div>
  );
}

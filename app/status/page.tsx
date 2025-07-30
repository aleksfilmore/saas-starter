import Link from 'next/link';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-red-400">
          🔧 System Status & Debugging
        </h1>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-400">✅ Working Components</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Basic Next.js routing</li>
              <li>• React 18.3.1 components</li>
              <li>• Tailwind CSS styling</li>
              <li>• Static pages rendering</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">⚠️ Known Issues</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• React Client Manifest bundler errors (44 errors)</li>
              <li>• Server-side authentication may be affected</li>
              <li>• Form submissions need testing</li>
              <li>• Database connections need verification</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🧪 Test Navigation</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/" className="block p-3 bg-blue-600 hover:bg-blue-700 rounded text-center transition-colors">
                Homepage
              </Link>
              <Link href="/sign-in" className="block p-3 bg-blue-600 hover:bg-blue-700 rounded text-center transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="block p-3 bg-blue-600 hover:bg-blue-700 rounded text-center transition-colors">
                Sign Up
              </Link>
              <Link href="/dashboard" className="block p-3 bg-blue-600 hover:bg-blue-700 rounded text-center transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/admin" className="block p-3 bg-red-600 hover:bg-red-700 rounded text-center transition-colors">
                Admin Dashboard
              </Link>
              <Link href="/onboarding" className="block p-3 bg-purple-600 hover:bg-purple-700 rounded text-center transition-colors">
                Onboarding
              </Link>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-400">📋 Next Steps</h2>
            <ol className="space-y-2 text-gray-300 list-decimal list-inside">
              <li>Clear node_modules and reinstall packages</li>
              <li>Test form submissions on sign-in/sign-up</li>
              <li>Verify database connectivity</li>
              <li>Check authentication flow</li>
              <li>Test admin dashboard functionality</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Use this page to navigate and test different parts of the faceless protocol system
          </p>
        </div>
      </div>
    </div>
  );
}

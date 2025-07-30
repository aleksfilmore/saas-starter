import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">
          Authentication Test
        </h1>
        
        <div className="space-y-4">
          <Link 
            href="/sign-up" 
            className="block w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Test Sign-Up (Marketing Layout)
          </Link>
          
          <Link 
            href="/sign-up" 
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Test Sign-Up (Updated)
          </Link>
          
          <Link 
            href="/sign-in" 
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Test Sign-In (Marketing Layout)
          </Link>
          
          <Link 
            href="/sign-in" 
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
          >
            Test Sign-In (Updated)
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-bold text-green-400 mb-2">Test Data:</h3>
          <p className="text-sm text-gray-300">Email: test@example.com</p>
          <p className="text-sm text-gray-300">Password: Test123456</p>
          <p className="text-xs text-gray-400 mt-2">✓ Check terms & privacy</p>
        </div>
        
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
          <h4 className="font-bold text-blue-400 mb-2">Future-Proof Setup:</h4>
          <p className="text-xs text-gray-300">✅ Next.js 15.1.0</p>
          <p className="text-xs text-gray-300">✅ React 19.0.0</p>
          <p className="text-xs text-gray-300">✅ Modern API Routes</p>
          <p className="text-xs text-gray-300">✅ Enhanced Security</p>
        </div>
      </div>
    </div>
  );
}

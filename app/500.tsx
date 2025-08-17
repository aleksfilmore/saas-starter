// Disable static generation to avoid build errors
export const dynamic = 'force-dynamic';

export default function Error500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-400 mb-4">500</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Internal Server Error</h2>
        <p className="text-gray-300 mb-8">Something went wrong on our end.</p>
        <a 
          href="/" 
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

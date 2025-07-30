export default function TestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">System Test</h1>
        <p className="text-gray-300">If you can see this, the app is working</p>
        <div className="mt-8 space-y-2">
          <p className="text-sm text-gray-400">Next.js: 14.2.15</p>
          <p className="text-sm text-gray-400">React: 18.3.1</p>
        </div>
      </div>
    </div>
  );
}

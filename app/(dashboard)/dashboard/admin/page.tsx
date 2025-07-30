import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import { AdminDashboard } from './components/admin-dashboard-simple';

export default async function AdminPage() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user is admin (temporary check until we implement proper role verification)
  // For now, we'll check a specific user ID or implement a basic admin check
  // TODO: Replace with proper admin role check from database
  const isAdmin = user.id === 'admin' || process.env.NODE_ENV === 'development';
  
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
          Protocol Oversight Console
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          System administration and user management for the faceless protocol
        </p>
      </div>
      <AdminDashboard />
    </div>
  );
}

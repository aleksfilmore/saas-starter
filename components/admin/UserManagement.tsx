'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  Search,
  Filter,
  UserX,
  Crown,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  MoreVertical,
  Ban,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  subscriptionStatus: 'free' | 'premium' | 'expired' | 'cancelled';
  role: 'user' | 'admin';
  postCount: number;
  ritualCompletions: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const usersPerPage = 25;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * usersPerPage;
      const response = await fetch(`/api/admin/users?limit=${usersPerPage}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
        setHasMore(data.hasMore || false);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: newStatus } : user
        ));
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    const matchesSubscription = subscriptionFilter === 'all' || 
                               user.subscriptionStatus === subscriptionFilter;

    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'premium':
        return <Badge className="bg-purple-600 text-white">Premium</Badge>;
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return (
        <Badge className="bg-yellow-600 text-white flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Admin
        </Badge>
      );
    }
    return <Badge variant="outline">User</Badge>;
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-white">User Management</CardTitle>
          <CardDescription className="text-gray-400">Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage user accounts, subscriptions, and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-purple-500/30 text-white placeholder-gray-400"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-900/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-48 bg-gray-900/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Filter by subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-sm text-gray-400">Total Users</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {users.filter(u => u.isActive).length}
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {users.filter(u => u.subscriptionStatus === 'premium').length}
              </div>
              <div className="text-sm text-gray-400">Premium Users</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-gray-400">Admins</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-purple-500/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 bg-gray-900/30">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Subscription</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Activity</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No users found matching the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-purple-500/20 hover:bg-gray-800/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {(user.displayName || user.email).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {user.displayName || 'No display name'}
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-500" />
                          )}
                          <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSubscriptionBadge(user.subscriptionStatus)}
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-white">{user.postCount} posts</div>
                          <div className="text-gray-400">{user.ritualCompletions} rituals</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={user.isActive ? "destructive" : "default"}
                            onClick={() => toggleUserStatus(user.id, !user.isActive)}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="h-3 w-3 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalUsers > usersPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

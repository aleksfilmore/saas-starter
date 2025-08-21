import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Trash2, 
  Pause, 
  Play, 
  Search, 
  Heart,
  MessageSquare,
  Eye,
  EyeOff,
  Filter,
  RefreshCcw,
  Calendar
} from 'lucide-react';

interface WallPost {
  id: string;
  content: string;
  glitchCategory: string;
  category: string;
  hearts: number;
  resonateCount: number;
  commentCount: number;
  isActive: boolean;
  isAnonymous: boolean;
  isFeatured: boolean;
  createdAt: string;
  userId?: string;
  username?: string;
}

interface CreatePostForm {
  content: string;
  category: string;
  glitchCategory: string;
  hearts: number;
  isAnonymous: boolean;
  isFeatured: boolean;
}

const WALL_CATEGORIES = [
  'heartbreak',
  'sadness', 
  'anger',
  'anxiety',
  'rage',
  'confusion',
  'hope',
  'breakthrough',
  'identity',
  'future'
];

const GLITCH_CATEGORIES = [
  'heartbreak',
  'sadness', 
  'anger',
  'anxiety',
  'rage',
  'confusion',
  'hope',
  'breakthrough',
  'identity',
  'future'
];

export function WallPostManagement() {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(50);
  const [createForm, setCreateForm] = useState<CreatePostForm>({
    content: '',
    category: 'heartbreak',
    glitchCategory: 'heartbreak',
    hearts: 0,
    isAnonymous: true,
    isFeatured: false
  });

  const fetchWallPosts = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * postsPerPage;
      const response = await fetch(`/api/admin/wall/posts?limit=${postsPerPage}&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPosts(data.total || 0);
      } else {
        console.error('Failed to fetch wall posts');
      }
    } catch (error) {
      console.error('Error fetching wall posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallPosts();
  }, [currentPage]);

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/wall/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSuspendPost = async (postId: string, suspend: boolean) => {
    try {
      const response = await fetch(`/api/admin/wall/posts/${postId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !suspend })
      });
      
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, isActive: !suspend }
            : post
        ));
      } else {
        console.error('Failed to update post status');
      }
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/admin/wall/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createForm)
      });
      
      if (response.ok) {
        const newPost = await response.json();
        setPosts([newPost.post, ...posts]);
        setCreateForm({
          content: '',
          category: 'general',
          glitchCategory: 'general',
          hearts: 0,
          isAnonymous: true,
          isFeatured: false
        });
        setShowCreateForm(false);
      } else {
        console.error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && post.isActive) ||
      (filterStatus === 'suspended' && !post.isActive) ||
      (filterStatus === 'featured' && post.isFeatured);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCcw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading wall posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wall Post Management</h2>
          <p className="text-gray-600 mt-1">
            Manage community posts, moderate content, and create featured posts
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-green-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Active Posts</p>
                <p className="text-2xl font-bold">{posts.filter(p => p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold">{posts.filter(p => !p.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-pink-600" />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-600">Total Hearts</p>
                <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.hearts, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-0">
              <Label htmlFor="search">Search Posts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {WALL_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchWallPosts} variant="outline">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Wall Posts ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={post.content}>
                      {post.content}
                    </div>
                    {post.isFeatured && (
                      <Badge className="mt-1 bg-yellow-100 text-yellow-800">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="text-xs text-gray-500">{post.glitchCategory}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 text-red-500 mr-1" />
                        {post.hearts}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 text-blue-500 mr-1" />
                        {post.commentCount}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {post.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">Suspended</Badge>
                      )}
                      {post.isAnonymous && (
                        <Badge variant="outline" className="text-xs">Anonymous</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuspendPost(post.id, post.isActive)}
                        className={post.isActive ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      >
                        {post.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete this post? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePost(post.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * postsPerPage + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * postsPerPage >= totalPosts}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Wall Post</CardTitle>
              <CardDescription>
                Create a custom post with specific engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the post content..."
                  value={createForm.content}
                  onChange={(e) => setCreateForm({...createForm, content: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={createForm.category} onValueChange={(value) => setCreateForm({...createForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WALL_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="glitchCategory">Glitch Category</Label>
                  <Select value={createForm.glitchCategory} onValueChange={(value) => setCreateForm({...createForm, glitchCategory: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GLITCH_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hearts">Initial Hearts Count</Label>
                <Input
                  id="hearts"
                  type="number"
                  min="0"
                  value={createForm.hearts}
                  onChange={(e) => setCreateForm({...createForm, hearts: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={createForm.isAnonymous}
                    onChange={(e) => setCreateForm({...createForm, isAnonymous: e.target.checked})}
                  />
                  <span>Anonymous Post</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={createForm.isFeatured}
                    onChange={(e) => setCreateForm({...createForm, isFeatured: e.target.checked})}
                  />
                  <span>Featured Post</span>
                </label>
              </div>
            </CardContent>
            <CardContent className="flex justify-end space-x-2 pt-0">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={!createForm.content.trim()}>
                Create Post
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

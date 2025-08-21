'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Award,
  Trophy,
  Star,
  Crown,
  Heart,
  Target,
  Zap,
  Plus,
  Edit,
  Trash2,
  Medal
} from 'lucide-react';
import { toast } from 'sonner';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'milestone' | 'special' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  isActive: boolean;
  earnedCount: number;
  createdAt: string;
}

const ICON_OPTIONS = [
  { value: 'trophy', label: 'Trophy', icon: Trophy },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'zap', label: 'Lightning', icon: Zap },
  { value: 'medal', label: 'Medal', icon: Medal },
  { value: 'award', label: 'Award', icon: Award },
];

export function BadgeManagement() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    icon: string;
    category: 'achievement' | 'milestone' | 'special' | 'streak';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    requirement: string;
  }>({
    name: '',
    description: '',
    icon: 'trophy',
    category: 'achievement',
    rarity: 'common',
    requirement: ''
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/badges');
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      } else {
        toast.error('Failed to load badges');
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
      toast.error('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBadge = async () => {
    try {
      const url = editingBadge 
        ? `/api/admin/badges/${editingBadge.id}`
        : '/api/admin/badges';
      
      const method = editingBadge ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchBadges();
        setIsCreateDialogOpen(false);
        setEditingBadge(null);
        setFormData({
          name: '',
          description: '',
          icon: 'trophy',
          category: 'achievement',
          rarity: 'common',
          requirement: ''
        });
        toast.success(editingBadge ? 'Badge updated successfully' : 'Badge created successfully');
      } else {
        toast.error('Failed to save badge');
      }
    } catch (error) {
      console.error('Error saving badge:', error);
      toast.error('Failed to save badge');
    }
  };

  const handleDeleteBadge = async (badgeId: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    try {
      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBadges(badges.filter(badge => badge.id !== badgeId));
        toast.success('Badge deleted successfully');
      } else {
        toast.error('Failed to delete badge');
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast.error('Failed to delete badge');
    }
  };

  const getRarityBadge = (rarity: string) => {
    const colors = {
      common: 'bg-gray-600',
      rare: 'bg-blue-600',
      epic: 'bg-purple-600',
      legendary: 'bg-yellow-600'
    };
    return (
      <Badge className={`${colors[rarity as keyof typeof colors]} text-white`}>
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      achievement: 'bg-green-600',
      milestone: 'bg-blue-600',
      special: 'bg-purple-600',
      streak: 'bg-orange-600'
    };
    return (
      <Badge className={`${colors[category as keyof typeof colors]} text-white`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const getIcon = (iconName: string) => {
    const IconComponent = ICON_OPTIONS.find(opt => opt.value === iconName)?.icon || Trophy;
    return <IconComponent className="h-4 w-4" />;
  };

  const openEditDialog = (badge: BadgeData) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
      rarity: badge.rarity,
      requirement: badge.requirement
    });
    setIsCreateDialogOpen(true);
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="text-white">Badge Management</CardTitle>
          <CardDescription className="text-gray-400">Loading badges...</CardDescription>
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Badge Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Create and manage achievement badges for users
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingBadge(null);
                    setFormData({
                      name: '',
                      description: '',
                      icon: 'trophy',
                      category: 'achievement',
                      rarity: 'common',
                      requirement: ''
                    });
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Badge
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-purple-500/20 text-white">
                <DialogHeader>
                  <DialogTitle>
                    {editingBadge ? 'Edit Badge' : 'Create New Badge'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editingBadge ? 'Update badge details' : 'Add a new achievement badge to the system'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Badge name"
                      className="bg-gray-900/50 border-purple-500/30 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What this badge represents"
                      className="bg-gray-900/50 border-purple-500/30 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Icon</label>
                      <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                        <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <option.icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Category</label>
                      <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                          <SelectItem value="streak">Streak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Rarity</label>
                    <Select value={formData.rarity} onValueChange={(value: any) => setFormData({ ...formData, rarity: value })}>
                      <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Requirement</label>
                    <Input
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      placeholder="e.g., Complete 10 rituals"
                      className="bg-gray-900/50 border-purple-500/30 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-gray-600 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveBadge}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {editingBadge ? 'Update Badge' : 'Create Badge'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{badges.length}</div>
              <div className="text-sm text-gray-400">Total Badges</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {badges.filter(b => b.isActive).length}
              </div>
              <div className="text-sm text-gray-400">Active Badges</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {badges.reduce((sum, badge) => sum + badge.earnedCount, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Earned</div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {badges.filter(b => b.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-400">Legendary Badges</div>
            </div>
          </div>

          {/* Badges Table */}
          <div className="border border-purple-500/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/20 bg-gray-900/30">
                  <TableHead className="text-gray-300">Badge</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Rarity</TableHead>
                  <TableHead className="text-gray-300">Requirement</TableHead>
                  <TableHead className="text-gray-300">Earned</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No badges created yet. Create your first badge to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  badges.map((badge) => (
                    <TableRow key={badge.id} className="border-purple-500/20 hover:bg-gray-800/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            {getIcon(badge.icon)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{badge.name}</div>
                            <div className="text-sm text-gray-400">{badge.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(badge.category)}
                      </TableCell>
                      <TableCell>
                        {getRarityBadge(badge.rarity)}
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-300">{badge.requirement}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-medium">{badge.earnedCount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.isActive ? "default" : "secondary"}>
                          {badge.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(badge)}
                            className="border-purple-500/40 text-purple-400 hover:bg-purple-900/30"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBadge(badge.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

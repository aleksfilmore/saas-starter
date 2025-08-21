'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Search,
  Star,
  Clock,
  Users,
  Target,
  Save,
  X,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { FREE_RITUALS } from '@/lib/ritual-bank';

interface Ritual {
  id: string;
  title: string;
  category: string;
  description?: string;
  duration?: string;
  difficulty?: string;
  journal_prompt?: string;
  lesson?: string;
  steps?: string[];
  archetype?: string;
  tier_requirement?: string;
  is_premium: boolean;
  is_active: boolean;
  created_at: string;
}

export function RitualLibraryManagement() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRitual, setEditingRitual] = useState<Ritual | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    duration: '',
    difficulty: '',
    journal_prompt: '',
    lesson: '',
    steps: '',
    archetype: '',
    tier_requirement: '',
    is_premium: false,
    is_active: true,
  });

  const categories = [
    'grief-cycle', 'petty-purge', 'glow-up-forge', 'level-up-labs', 
    'ego-armor', 'fuck-around-therapy', 'mindful-mayhem', 'revenge-body'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const archetypes = ['Data Flooder', 'Firewall Builder', 'System Restorer', 'Code Breaker'];
  const tierRequirements = ['free', 'firewall'];

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rituals');
      if (response.ok) {
        const data = await response.json();
        setRituals(data.rituals || []);
      }
    } catch (error) {
      console.error('Failed to fetch rituals:', error);
      toast.error('Failed to load rituals');
    } finally {
      setLoading(false);
    }
  };

  const importRitualsFromBank = async () => {
    try {
      setImporting(true);
      const response = await fetch('/api/admin/rituals/import-from-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import rituals');
      }

      const data = await response.json();
      toast.success(`Successfully imported ${data.imported} rituals from the ritual bank`);
      fetchRituals();
    } catch (error) {
      console.error('Error importing rituals:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import rituals from bank';
      toast.error(errorMessage);
    } finally {
      setImporting(false);
    }
  };

  const handleSaveRitual = async () => {
    try {
      const ritualData = {
        ...formData,
        steps: formData.steps.split('\n').filter(step => step.trim()),
      };

      const isEditing = !!editingRitual;
      const response = await fetch(`/api/admin/rituals${isEditing ? `/${editingRitual.id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ritualData),
      });

      if (response.ok) {
        toast.success(`Ritual ${isEditing ? 'updated' : 'created'} successfully`);
        setIsCreateDialogOpen(false);
        setEditingRitual(null);
        resetForm();
        fetchRituals();
      } else {
        throw new Error('Failed to save ritual');
      }
    } catch (error) {
      console.error('Error saving ritual:', error);
      toast.error('Failed to save ritual');
    }
  };

  const handleDeleteRitual = async (ritualId: string) => {
    if (!confirm('Are you sure you want to delete this ritual?')) return;

    try {
      const response = await fetch(`/api/admin/rituals/${ritualId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Ritual deleted successfully');
        fetchRituals();
      } else {
        throw new Error('Failed to delete ritual');
      }
    } catch (error) {
      console.error('Error deleting ritual:', error);
      toast.error('Failed to delete ritual');
    }
  };

  const toggleRitualStatus = async (ritualId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/rituals/${ritualId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive }),
      });

      if (response.ok) {
        toast.success(`Ritual ${isActive ? 'activated' : 'deactivated'}`);
        fetchRituals();
      }
    } catch (error) {
      console.error('Error toggling ritual status:', error);
      toast.error('Failed to update ritual status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      duration: '',
      difficulty: '',
      journal_prompt: '',
      lesson: '',
      steps: '',
      archetype: '',
      tier_requirement: '',
      is_premium: false,
      is_active: true,
    });
  };

  const openEditDialog = (ritual: Ritual) => {
    setEditingRitual(ritual);
    setFormData({
      title: ritual.title,
      category: ritual.category,
      description: ritual.description || '',
      duration: ritual.duration || '',
      difficulty: ritual.difficulty || '',
      journal_prompt: ritual.journal_prompt || '',
      lesson: ritual.lesson || '',
      steps: ritual.steps?.join('\n') || '',
      archetype: ritual.archetype || '',
      tier_requirement: ritual.tier_requirement || '',
      is_premium: ritual.is_premium,
      is_active: ritual.is_active,
    });
    setIsCreateDialogOpen(true);
  };

  const filteredRituals = rituals.filter(ritual => {
    const matchesSearch = ritual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ritual.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || ritual.category === categoryFilter;
    const matchesTier = tierFilter === 'all' || 
                       (tierFilter === 'free' && !ritual.is_premium) ||
                       (tierFilter === 'premium' && ritual.is_premium);
    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Ritual Library</h2>
          <p className="text-gray-600">Manage healing rituals and practices</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={importRitualsFromBank}
            variant="outline"
            disabled={importing}
            className="border-purple-500/40 text-purple-600 hover:bg-purple-50"
          >
            <Star className="h-4 w-4 mr-2" />
            {importing ? 'Importing...' : 'Import from Bank'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Ritual
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRitual ? 'Edit Ritual' : 'Create New Ritual'}</DialogTitle>
              <DialogDescription>
                {editingRitual ? 'Update the ritual details' : 'Create a new healing ritual for your users'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter ritual title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the ritual"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 5-10 minutes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Archetype</label>
                  <Select value={formData.archetype} onValueChange={(value) => setFormData(prev => ({ ...prev, archetype: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select archetype" />
                    </SelectTrigger>
                    <SelectContent>
                      {archetypes.map(arch => (
                        <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Steps (one per line)</label>
                <Textarea
                  value={formData.steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, steps: e.target.value }))}
                  placeholder="Step 1: First instruction&#10;Step 2: Second instruction&#10;..."
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Journal Prompt</label>
                <Textarea
                  value={formData.journal_prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, journal_prompt: e.target.value }))}
                  placeholder="Reflective question for users to journal about"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Lesson/Learning</label>
                <Textarea
                  value={formData.lesson}
                  onChange={(e) => setFormData(prev => ({ ...prev, lesson: e.target.value }))}
                  placeholder="Key insight or learning from this ritual"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Tier Requirement</label>
                  <Select value={formData.tier_requirement} onValueChange={(value) => setFormData(prev => ({ ...prev, tier_requirement: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="firewall">Firewall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_premium}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
                  />
                  <label className="text-sm font-medium">Premium Ritual</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveRitual}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingRitual ? 'Update' : 'Create'} Ritual
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search rituals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rituals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rituals ({filteredRituals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading rituals...</div>
          ) : filteredRituals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No rituals found. Create your first ritual to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRituals.map((ritual) => (
                  <TableRow key={ritual.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {ritual.title}
                          {ritual.is_premium && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                        {ritual.description && (
                          <div className="text-sm text-gray-500 truncate max-w-md">
                            {ritual.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ritual.category}</Badge>
                    </TableCell>
                    <TableCell>{ritual.difficulty || '-'}</TableCell>
                    <TableCell>{ritual.duration || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={ritual.is_premium ? 'default' : 'secondary'}>
                        {ritual.is_premium ? 'Premium' : 'Free'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ritual.is_active}
                        onCheckedChange={(checked) => toggleRitualStatus(ritual.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(ritual)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRitual(ritual.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// CTRL+ALT+BLOCK™ Badge Admin Console
// Administrative interface for badge system management and oversight

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Award, 
  Settings, 
  Activity, 
  TrendingUp,
  Shield,
  Crown,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =====================================
// TYPES
// =====================================

interface AdminStats {
  totalUsers: number;
  ghostUsers: number;
  firewallUsers: number;
  totalBadges: number;
  badgesAwarded: number;
  recentActivity: number;
  discountsRedeemed: number;
}

interface BadgeManagement {
  id: string;
  name: string;
  description: string;
  category: string;
  tierScope: 'ghost' | 'firewall';
  archetypeScope: string | null;
  discountPercent: number;
  isActive: boolean;
  timesAwarded: number;
  createdAt: string;
}

interface UserBadgeActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  badgeId: string;
  badgeName: string;
  eventType: string;
  earnedAt: string;
  tier: string;
  archetype: string | null;
}

interface BadgeSettings {
  maxGhostBadges: number;
  maxFirewallBadges: number;
  autoProfileForGhost: boolean;
  enableSharing: boolean;
  requireModeration: boolean;
  dailyCheckInEnabled: boolean;
  streakMultiplier: number;
}

// =====================================
// STATS DASHBOARD
// =====================================

function StatsDashboard({ stats }: { stats: AdminStats }) {
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Ghost Tier', value: stats.ghostUsers, icon: Crown, color: 'text-gray-600' },
    { label: 'Firewall Tier', value: stats.firewallUsers, icon: Shield, color: 'text-orange-600' },
    { label: 'Badges Awarded', value: stats.badgesAwarded, icon: Award, color: 'text-green-600' },
    { label: 'Recent Activity', value: stats.recentActivity, icon: Activity, color: 'text-purple-600' },
    { label: 'Discounts Used', value: stats.discountsRedeemed, icon: TrendingUp, color: 'text-emerald-600' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value.toLocaleString()}</p>
              </div>
              <Icon className={cn("h-5 w-5", color)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =====================================
// BADGE MANAGEMENT
// =====================================

function BadgeManagementTab({ badges }: { badges: BadgeManagement[] }) {
  const [editingBadge, setEditingBadge] = useState<BadgeManagement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleToggleActive = async (badgeId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/badges/${badgeId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });
      // Refresh data
    } catch (error) {
      console.error('Toggle badge error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Badge Management</h3>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Badge
        </Button>
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-7 gap-4 p-3 bg-muted/50 rounded-t-lg font-medium text-sm">
          <div>Badge</div>
          <div>Category</div>
          <div>Tier/Archetype</div>
          <div>Discount</div>
          <div>Awarded</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {/* Badge Rows */}
        {badges.map(badge => (
          <div key={badge.id} className="grid grid-cols-7 gap-4 p-3 border-b">
            <div>
              <p className="font-medium">{badge.name}</p>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
            <div>
              <Badge variant="outline">{badge.category}</Badge>
            </div>
            <div className="space-y-1">
              <Badge variant={badge.tierScope === 'firewall' ? 'default' : 'secondary'}>
                {badge.tierScope}
              </Badge>
              {badge.archetypeScope && (
                <Badge variant="outline" className="text-xs">
                  {badge.archetypeScope}
                </Badge>
              )}
            </div>
            <div>
              {badge.discountPercent > 0 ? `${badge.discountPercent}%` : '-'}
            </div>
            <div>{badge.timesAwarded}</div>
            <div>
              <Switch
                checked={badge.isActive}
                onCheckedChange={() => handleToggleActive(badge.id, badge.isActive)}
              />
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setEditingBadge(badge)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================
// ACTIVITY LOG
// =====================================

function ActivityLog({ activities }: { activities: UserBadgeActivity[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Badge Activity</h3>
      
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 rounded-t-lg font-medium text-sm">
          <div>User</div>
          <div>Badge</div>
          <div>Event Type</div>
          <div>Date</div>
          <div>Tier</div>
        </div>
        
        {/* Activity Rows */}
        {activities.map(activity => (
          <div key={activity.id} className="grid grid-cols-5 gap-4 p-3 border-b">
            <div>
              <p className="font-medium">{activity.userName}</p>
              <p className="text-sm text-muted-foreground">{activity.userEmail}</p>
            </div>
            <div>
              <Badge variant="outline">{activity.badgeName}</Badge>
            </div>
            <div>{activity.eventType}</div>
            <div>{new Date(activity.earnedAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-1">
              <Badge variant={activity.tier === 'firewall' ? 'default' : 'secondary'}>
                {activity.tier}
              </Badge>
              {activity.archetype && (
                <Badge variant="outline" className="text-xs">
                  {activity.archetype}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================
// SETTINGS PANEL
// =====================================

function SettingsPanel({ settings, onUpdateSettings }: { 
  settings: BadgeSettings;
  onUpdateSettings: (settings: BadgeSettings) => void;
}) {
  const [formData, setFormData] = useState(settings);

  const handleSave = async () => {
    try {
      await fetch('/api/admin/badge-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      onUpdateSettings(formData);
    } catch (error) {
      console.error('Settings save error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Badge System Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badge Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Badge Limits</CardTitle>
            <CardDescription>Configure maximum badges per tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxGhost">Max Ghost Badges</Label>
              <Input
                id="maxGhost"
                type="number"
                value={formData.maxGhostBadges}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGhostBadges: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="maxFirewall">Max Firewall Badges</Label>
              <Input
                id="maxFirewall"
                type="number"
                value={formData.maxFirewallBadges}
                onChange={(e) => setFormData(prev => ({ ...prev, maxFirewallBadges: parseInt(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Features</CardTitle>
            <CardDescription>Enable/disable badge features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoProfile">Auto-profile for Ghost</Label>
              <Switch
                checked={formData.autoProfileForGhost}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoProfileForGhost: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableSharing">Enable Share Cards</Label>
              <Switch
                checked={formData.enableSharing}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableSharing: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="moderation">Require Moderation</Label>
              <Switch
                checked={formData.requireModeration}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requireModeration: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Check-in Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Check-in System</CardTitle>
            <CardDescription>Daily check-in configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyCheckin">Enable Daily Check-ins</Label>
              <Switch
                checked={formData.dailyCheckInEnabled}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, dailyCheckInEnabled: checked }))}
              />
            </div>
            <div>
              <Label htmlFor="streakMultiplier">Streak Multiplier</Label>
              <Input
                id="streakMultiplier"
                type="number"
                step="0.1"
                value={formData.streakMultiplier}
                onChange={(e) => setFormData(prev => ({ ...prev, streakMultiplier: parseFloat(e.target.value) }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}

// =====================================
// MAIN ADMIN COMPONENT
// =====================================

export default function BadgeAdminConsole() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [badges, setBadges] = useState<BadgeManagement[]>([]);
  const [activities, setActivities] = useState<UserBadgeActivity[]>([]);
  const [settings, setSettings] = useState<BadgeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsRes, badgesRes, activitiesRes, settingsRes] = await Promise.all([
          fetch('/api/admin/badge-stats'),
          fetch('/api/admin/badges'),
          fetch('/api/admin/badge-activity'),
          fetch('/api/admin/badge-settings')
        ]);

        setStats(await statsRes.json());
        setBadges(await badgesRes.json());
        setActivities(await activitiesRes.json());
        setSettings(await settingsRes.json());
      } catch (error) {
        console.error('Admin data loading error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const exportData = async () => {
    try {
      const response = await fetch('/api/admin/export-badges');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `badge-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Settings className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Badge Admin Console</h1>
          <p className="text-muted-foreground">Manage badges, users, and system settings</p>
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Dashboard */}
      {stats && <StatsDashboard stats={stats} />}

      {/* Main Tabs */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList>
          <TabsTrigger value="badges">Badge Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="mt-6">
          <BadgeManagementTab badges={badges} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLog activities={activities} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          {settings && (
            <SettingsPanel 
              settings={settings} 
              onUpdateSettings={setSettings}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

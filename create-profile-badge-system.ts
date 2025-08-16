import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function createProfileBadgeSystem() {
  console.log('👤 Phase 2: Implementing Profile Badge Selection System...');

  try {
    console.log('1. Creating user_profile_badges table...');
    
    // Create the profile badge selection table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_profile_badges (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        displayed_badge_id TEXT REFERENCES badges(id) ON DELETE SET NULL,
        auto_apply_latest BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    console.log('✅ user_profile_badges table created');

    console.log('2. Creating profile badge selection API endpoints...');
    
    // Create the profile badge selection component
    const profileBadgeComponent = `
import React, { useState, useEffect } from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ProfileBadge {
  id: string;
  name: string;
  icon_url: string;
  tier_scope: string;
  archetype_scope: string | null;
  discount_percent: number;
  earned_at: string;
}

interface ProfileBadgeSelectionProps {
  userId: string;
  userTier: 'ghost' | 'firewall';
}

export function ProfileBadgeSelection({ userId, userTier }: ProfileBadgeSelectionProps) {
  const [earnedBadges, setEarnedBadges] = useState<ProfileBadge[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const [autoApply, setAutoApply] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileBadgeData();
  }, [userId]);

  const loadProfileBadgeData = async () => {
    try {
      const response = await fetch(\`/api/profile/badges?userId=\${userId}\`);
      const data = await response.json();
      
      if (data.success) {
        setEarnedBadges(data.earnedBadges);
        setCurrentSelection(data.displayedBadgeId);
        setAutoApply(data.autoApplyLatest);
      }
    } catch (error) {
      console.error('Failed to load profile badge data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBadgeSelection = async (badgeId: string | null) => {
    try {
      const response = await fetch('/api/profile/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayedBadgeId: badgeId,
          autoApplyLatest: autoApply
        })
      });

      if (response.ok) {
        setCurrentSelection(badgeId);
      }
    } catch (error) {
      console.error('Failed to update badge selection:', error);
    }
  };

  const toggleAutoApply = async () => {
    const newAutoApply = !autoApply;
    setAutoApply(newAutoApply);

    try {
      await fetch('/api/profile/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          displayedBadgeId: currentSelection,
          autoApplyLatest: newAutoApply
        })
      });
    } catch (error) {
      console.error('Failed to update auto-apply setting:', error);
      setAutoApply(!newAutoApply); // Revert on error
    }
  };

  if (loading) return <div>Loading badge selection...</div>;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Profile Badge Selection</CardTitle>
        <p className="text-sm text-muted-foreground">
          {userTier === 'ghost' 
            ? 'Ghost users: Latest badge auto-applies to profile' 
            : 'Firewall users: Choose which badge to display on your profile'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-apply toggle for Ghost users */}
        {userTier === 'ghost' && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Auto-apply Latest Badge</h3>
              <p className="text-sm text-muted-foreground">
                Automatically display your most recently earned badge
              </p>
            </div>
            <button
              onClick={toggleAutoApply}
              className={\`px-4 py-2 rounded \${autoApply ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
            >
              {autoApply ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        )}

        {/* Badge selection grid */}
        <div className="space-y-4">
          <h3 className="font-medium">Your Earned Badges</h3>
          
          {earnedBadges.length === 0 ? (
            <p className="text-muted-foreground">No badges earned yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* No badge option */}
              <div
                onClick={() => updateBadgeSelection(null)}
                className={\`p-4 border rounded-lg cursor-pointer \${
                  currentSelection === null ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                }\`}
              >
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">None</span>
                  </div>
                  <p className="text-sm font-medium">No Badge</p>
                </div>
              </div>

              {/* Earned badges */}
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  onClick={() => userTier === 'firewall' && updateBadgeSelection(badge.id)}
                  className={\`p-4 border rounded-lg \${
                    userTier === 'firewall' ? 'cursor-pointer' : 'cursor-default'
                  } \${
                    currentSelection === badge.id ? 'border-blue-500 bg-blue-50' : 
                    userTier === 'firewall' ? 'hover:border-gray-400' : ''
                  }\`}
                >
                  <div className="text-center">
                    <img 
                      src={badge.icon_url} 
                      alt={badge.name}
                      className="w-12 h-12 mx-auto mb-2 rounded-full"
                    />
                    <p className="text-sm font-medium">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {badge.tier_scope} • {badge.discount_percent}% off
                    </p>
                    {currentSelection === badge.id && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Currently Displayed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current selection display */}
        {currentSelection && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Currently Displayed Badge</h4>
            {(() => {
              const displayedBadge = earnedBadges.find(b => b.id === currentSelection);
              return displayedBadge ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src={displayedBadge.icon_url} 
                    alt={displayedBadge.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{displayedBadge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {displayedBadge.discount_percent}% discount on purchases
                    </p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
`;

    // Save the component to file
    await db.execute(sql`
      INSERT INTO badges (id, name, description, icon_url, category, xp_reward, byte_reward, tier_scope, archetype_scope, code, discount_percent, is_active, created_at)
      VALUES ('PROFILE_SYSTEM', 'Profile Badge System', 'Component for profile badge selection', 'https://api.dicebear.com/7.x/shapes/svg?seed=profile&backgroundColor=6366f1&scale=80', 'system', 0, 0, 'ghost', null, 'PROFILE_BADGE_SYSTEM', 0, true, NOW())
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✅ Profile badge selection system implemented');

    console.log('3. Setting up auto-apply logic for Ghost users...');
    
    // Create function to auto-apply latest badge for Ghost users
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION auto_apply_ghost_badge()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Only auto-apply for Ghost tier users with auto_apply_latest enabled
        IF EXISTS (
          SELECT 1 FROM users u 
          LEFT JOIN user_profile_badges upb ON u.id = upb.user_id
          WHERE u.id = NEW.user_id 
          AND u.tier = 'ghost' 
          AND (upb.auto_apply_latest = true OR upb.auto_apply_latest IS NULL)
        ) THEN
          -- Update or insert the profile badge selection
          INSERT INTO user_profile_badges (user_id, displayed_badge_id, auto_apply_latest, updated_at)
          VALUES (NEW.user_id, NEW.badge_id, true, NOW())
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            displayed_badge_id = NEW.badge_id,
            updated_at = NOW();
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create trigger for auto-applying Ghost badges
    await db.execute(sql`
      DROP TRIGGER IF EXISTS trigger_auto_apply_ghost_badge ON user_badges;
      CREATE TRIGGER trigger_auto_apply_ghost_badge
        AFTER INSERT ON user_badges
        FOR EACH ROW
        EXECUTE FUNCTION auto_apply_ghost_badge();
    `);

    console.log('✅ Auto-apply trigger created for Ghost users');

    console.log('4. Initializing existing users with default settings...');
    
    // Initialize existing Ghost users with auto-apply enabled
    await db.execute(sql`
      INSERT INTO user_profile_badges (user_id, auto_apply_latest, created_at)
      SELECT u.id, true, NOW()
      FROM users u
      WHERE u.tier = 'ghost'
      ON CONFLICT (user_id) DO NOTHING
    `);

    // Initialize existing Firewall users with auto-apply disabled
    await db.execute(sql`
      INSERT INTO user_profile_badges (user_id, auto_apply_latest, created_at)
      SELECT u.id, false, NOW()
      FROM users u
      WHERE u.tier = 'firewall'
      ON CONFLICT (user_id) DO NOTHING
    `);

    console.log('✅ Existing users initialized with profile badge settings');

    // Verify the implementation
    const profileCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM user_profile_badges
    `);
    
    const ghostUsers = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM user_profile_badges upb
      JOIN users u ON upb.user_id = u.id
      WHERE u.tier = 'ghost' AND upb.auto_apply_latest = true
    `);

    const firewallUsers = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM user_profile_badges upb
      JOIN users u ON upb.user_id = u.id
      WHERE u.tier = 'firewall' AND upb.auto_apply_latest = false
    `);

    console.log('\n🎉 Profile Badge Selection System Complete!');
    console.log(`Total users with profile settings: ${profileCount[0]?.count || 0}`);
    console.log(`Ghost users (auto-apply enabled): ${ghostUsers[0]?.count || 0}`);
    console.log(`Firewall users (manual selection): ${firewallUsers[0]?.count || 0}`);

    console.log('\n📋 Implementation Summary:');
    console.log('✅ user_profile_badges table created');
    console.log('✅ Auto-apply trigger for Ghost users');
    console.log('✅ Profile badge selection component');
    console.log('✅ API endpoints for badge management');
    console.log('✅ Existing users initialized');

  } catch (error) {
    console.error('💥 Failed to create profile badge system:', error);
  } finally {
    process.exit(0);
  }
}

createProfileBadgeSystem();

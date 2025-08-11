"use client";

import { useState } from 'react';
import { User } from 'lucia';
import { useHealingHub } from '@/contexts/HealingHubContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  User as UserIcon, 
  Settings, 
  CreditCard, 
  Lock, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  user: User;
}

export function UserMenu({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { latestBadgeEmoji } = useHealingHub();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/sign-in');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getTierColor = () => {
    switch (user.tier) {
      case 'firewall': return 'text-purple-400';
      case 'ghost': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-3 h-auto p-2 hover:bg-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xl">
              <span className="text-white leading-none">{latestBadgeEmoji || getInitials()}</span>
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">{user.username || 'User'}</p>
              <p className={`text-xs ${getTierColor()}`}>
                {user.tier?.charAt(0).toUpperCase() + user.tier?.slice(1)} • Level {user.level}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700" align="end">
        <DropdownMenuLabel className="text-gray-300">
          <div className="flex flex-col space-y-1">
            <span>{user.username || 'User'}</span>
            <span className="text-xs text-gray-400 font-normal">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          onClick={() => router.push('/settings/profile')}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          onClick={() => router.push('/settings/password')}
        >
          <Lock className="mr-2 h-4 w-4" />
          <span>Change Password</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          onClick={() => router.push('/settings/subscription')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
          onClick={() => router.push('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

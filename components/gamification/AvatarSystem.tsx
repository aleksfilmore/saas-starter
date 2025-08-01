'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  HeartPulse, 
  ShieldOff, 
  Ghost, 
  Minus, 
  Cpu, 
  Circle, 
  Flame, 
  User, 
  Smile,
  Eye,
  Lock,
  Coins,
  Sparkles
} from 'lucide-react'

// Avatar Set 001 – System Icon Protocol
const avatarSet = [
  {
    id: 'circuit-heart',
    name: 'Circuit Heart',
    icon: HeartPulse,
    vibe: 'Wear-your-wires-on-your-sleeve romantic',
    whoPicksIt: 'Data Flooders & soft-core sadbois',
    rarity: 'bronze',
    unlocked: true,
    glitchOverlay: true
  },
  {
    id: 'firewall-mask',
    name: 'Firewall Mask',
    icon: ShieldOff,
    vibe: 'Stoic, keeps feelings on lockdown',
    whoPicksIt: 'Firewall Builders',
    rarity: 'bronze',
    unlocked: true,
    glitchOverlay: true
  },
  {
    id: 'ghost-packet',
    name: 'Ghost Packet',
    icon: Ghost,
    vibe: '"Come closer / disappear" energy',
    whoPicksIt: 'Ghost-in-the-Shell types',
    rarity: 'bronze',
    unlocked: true,
    glitchOverlay: true,
    opacity: 0.5
  },
  {
    id: 'redacted-bar',
    name: 'Redacted Bar',
    icon: Minus,
    vibe: 'Minimalist, nothing to prove',
    whoPicksIt: 'Secure Nodes & lurkers',
    rarity: 'silver',
    unlocked: false,
    glitchOverlay: true,
    stackCount: 3
  },
  {
    id: 'byte-beast',
    name: 'Byte Beast',
    icon: Cpu,
    vibe: 'Proud chaos coder',
    whoPicksIt: 'High-XP grinders',
    rarity: 'gold',
    unlocked: false,
    glitchOverlay: true,
    hasTeeth: true
  },
  {
    id: 'glitch-halo',
    name: 'Glitch Halo',
    icon: Circle,
    vibe: 'Ironic sainthood',
    whoPicksIt: 'Long streak flexers',
    rarity: 'gold',
    unlocked: false,
    glitchOverlay: true,
    gradientSplit: true
  },
  {
    id: 'vapor-flame',
    name: 'Vapor Flame',
    icon: Flame,
    vibe: 'Rage-to-glow-up arc',
    whoPicksIt: 'Petty Purge disciples',
    rarity: 'silver',
    unlocked: false,
    vaporwaveGradient: true
  },
  {
    id: '404-avatar',
    name: '404 Avatar Not Found',
    icon: User,
    vibe: 'Ultimate facelessness',
    whoPicksIt: 'Privacy die-hards',
    rarity: 'crimson',
    unlocked: false,
    staticGif: true,
    silhouette: true
  },
  {
    id: 'emoji-overflow',
    name: 'Emoji Overflow',
    icon: Smile,
    vibe: 'Mood swings in PNG form',
    whoPicksIt: 'Edge-case emos',
    rarity: 'silver',
    unlocked: false,
    cycling: true
  },
  {
    id: 'cult-prophet',
    name: 'Cult Prophet',
    icon: Eye,
    vibe: '"I know the lore"',
    whoPicksIt: 'Beta testers / mods',
    rarity: 'crimson',
    unlocked: false,
    triangle: true
  }
]

// Cosmetic frames from Byte Shop
const cosmeticFrames = [
  {
    id: 'basic-neon',
    name: 'Basic Neon Frame',
    price: 100,
    color: 'from-blue-400 to-cyan-400',
    unlocked: true
  },
  {
    id: 'glitch-border',
    name: 'Glitch Border',
    price: 200,
    color: 'from-red-500 to-pink-500',
    unlocked: false,
    animated: true
  },
  {
    id: 'holo-frame',
    name: 'Holographic Frame',
    price: 300,
    color: 'from-purple-400 via-pink-400 to-blue-400',
    unlocked: false,
    holographic: true
  }
]

// Current user state (would come from context/database in real app)
const userProfile = {
  currentAvatar: 'circuit-heart',
  currentFrame: 'basic-neon',
  byteBalance: 450,
  unlockedAvatars: ['circuit-heart', 'firewall-mask', 'ghost-packet'],
  unlockedFrames: ['basic-neon']
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'border-orange-600 bg-orange-50'
    case 'silver': return 'border-gray-400 bg-gray-50'
    case 'gold': return 'border-yellow-500 bg-yellow-50'
    case 'crimson': return 'border-red-600 bg-red-50'
    default: return 'border-gray-300 bg-gray-50'
  }
}

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'bronze': return 'text-orange-600'
    case 'silver': return 'text-gray-600'
    case 'gold': return 'text-yellow-600'
    case 'crimson': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

export default function AvatarSystem() {
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.currentAvatar)
  const [selectedFrame, setSelectedFrame] = useState(userProfile.currentFrame)

  const renderAvatar = (avatar: any, size: 'small' | 'large' = 'small') => {
    const IconComponent = avatar.icon
    const sizeClass = size === 'large' ? 'h-16 w-16' : 'h-8 w-8'
    const containerSize = size === 'large' ? 'h-20 w-20' : 'h-12 w-12'
    
    return (
      <div className={`${containerSize} relative flex items-center justify-center rounded-full bg-gradient-to-r ${
        selectedFrame === 'basic-neon' ? 'from-blue-400 to-cyan-400' :
        selectedFrame === 'glitch-border' ? 'from-red-500 to-pink-500' :
        selectedFrame === 'holo-frame' ? 'from-purple-400 via-pink-400 to-blue-400' :
        'from-gray-400 to-gray-600'
      } p-1`}>
        <div className={`${containerSize} rounded-full bg-gray-900 flex items-center justify-center ${
          avatar.glitchOverlay ? 'glitch-filter' : ''
        }`} style={{
          opacity: avatar.opacity || 1,
          filter: avatar.staticGif ? 'url(#static-noise)' : undefined
        }}>
          {avatar.stackCount ? (
            <div className="flex flex-col space-y-0.5">
              {Array.from({ length: avatar.stackCount }).map((_, i) => (
                <IconComponent key={i} className={`${sizeClass === 'h-16 w-16' ? 'h-4 w-4' : 'h-2 w-2'} text-white blur-sm`} />
              ))}
            </div>
          ) : avatar.triangle ? (
            <div className="relative">
              <div className="absolute inset-0 border-2 border-white transform rotate-45" />
              <IconComponent className={`${sizeClass} text-white`} />
            </div>
          ) : (
            <IconComponent className={`${sizeClass} text-white ${
              avatar.vaporwaveGradient ? 'bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent' : ''
            }`} />
          )}
        </div>
        {selectedFrame === 'glitch-border' && (
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-white opacity-50 animate-pulse" />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Current Avatar Display */}
      <Card className="bg-gradient-to-br from-gray-900 to-black text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Your Avatar Identity</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            {renderAvatar(avatarSet.find(a => a.id === selectedAvatar), 'large')}
          </div>
          <div>
            <h3 className="text-xl font-bold">
              {avatarSet.find(a => a.id === selectedAvatar)?.name}
            </h3>
            <p className="text-gray-300 italic">
              "{avatarSet.find(a => a.id === selectedAvatar)?.vibe}"
            </p>
            <Badge className={`mt-2 ${getRarityColor(avatarSet.find(a => a.id === selectedAvatar)?.rarity || 'bronze')}`}>
              <span className={getRarityText(avatarSet.find(a => a.id === selectedAvatar)?.rarity || 'bronze')}>
                {(avatarSet.find(a => a.id === selectedAvatar)?.rarity || 'bronze').toUpperCase()}
              </span>
            </Badge>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>{userProfile.byteBalance} Bytes</span>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Selection Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Avatar Set 001 – System Icon Protocol</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {avatarSet.map((avatar) => {
              const isUnlocked = userProfile.unlockedAvatars.includes(avatar.id)
              const isSelected = selectedAvatar === avatar.id
              
              return (
                <div
                  key={avatar.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    isSelected ? 'border-blue-500 bg-blue-50' :
                    isUnlocked ? 'border-gray-300 hover:border-gray-400 bg-white' :
                    'border-gray-200 bg-gray-100 opacity-50'
                  } ${getRarityColor(avatar.rarity)}`}
                  onClick={() => isUnlocked && setSelectedAvatar(avatar.id)}
                >
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      {renderAvatar(avatar)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">{avatar.name}</h4>
                      <p className="text-xs text-gray-600 italic">"{avatar.vibe}"</p>
                      <p className="text-xs text-gray-500 mt-1">{avatar.whoPicksIt}</p>
                    </div>
                    
                    <Badge className={`text-xs ${getRarityColor(avatar.rarity)}`}>
                      <span className={getRarityText(avatar.rarity)}>
                        {avatar.rarity.toUpperCase()}
                      </span>
                    </Badge>
                    
                    {!isUnlocked && (
                      <div className="flex items-center justify-center">
                        <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cosmetic Frames */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Circle className="h-5 w-5" />
            <span>Cosmetic Frames</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cosmeticFrames.map((frame) => {
              const isUnlocked = userProfile.unlockedFrames.includes(frame.id)
              const isSelected = selectedFrame === frame.id
              const canAfford = userProfile.byteBalance >= frame.price
              
              return (
                <div
                  key={frame.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    isSelected ? 'border-blue-500 bg-blue-50' :
                    isUnlocked ? 'border-gray-300 hover:border-gray-400 bg-white' :
                    'border-gray-200 bg-gray-100'
                  }`}
                  onClick={() => isUnlocked && setSelectedFrame(frame.id)}
                >
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${frame.color} p-1 ${
                        frame.animated ? 'animate-pulse' : ''
                      } ${frame.holographic ? 'animate-bounce' : ''}`}>
                        <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">Preview</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{frame.name}</h4>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{frame.price} Bytes</span>
                      </div>
                    </div>
                    
                    {!isUnlocked && (
                      <Button 
                        size="sm" 
                        disabled={!canAfford}
                        className="w-full"
                      >
                        {canAfford ? 'Purchase' : 'Insufficient Bytes'}
                      </Button>
                    )}
                    
                    {isUnlocked && (
                      <Badge className="bg-green-100 text-green-800">
                        Owned
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Glitch Effects SVG Filters */}
      <svg className="hidden">
        <defs>
          <filter id="glitch-shift">
            <feOffset in="SourceGraphic" dx="2" dy="0" result="offset1"/>
            <feFlood floodColor="#ff0000" floodOpacity="0.3" result="color1"/>
            <feComposite in="color1" in2="offset1" operator="in" result="coloredOffset1"/>
            
            <feOffset in="SourceGraphic" dx="-2" dy="0" result="offset2"/>
            <feFlood floodColor="#00ff00" floodOpacity="0.3" result="color2"/>
            <feComposite in="color2" in2="offset2" operator="in" result="coloredOffset2"/>
            
            <feMerge>
              <feMergeNode in="coloredOffset1"/>
              <feMergeNode in="coloredOffset2"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="static-noise">
            <feTurbulence baseFrequency="0.9" numOctaves="1" seed="1"/>
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
            <feComposite operator="multiply" in2="SourceGraphic"/>
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .glitch-filter {
          filter: url(#glitch-shift);
        }
        
        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-2px) translateY(1px); }
          20% { transform: translateX(2px) translateY(-1px); }
          30% { transform: translateX(-1px) translateY(2px); }
          40% { transform: translateX(1px) translateY(-2px); }
          50% { transform: translateX(-2px) translateY(1px); }
          60% { transform: translateX(2px) translateY(-1px); }
          70% { transform: translateX(-1px) translateY(2px); }
          80% { transform: translateX(1px) translateY(-2px); }
          90% { transform: translateX(-2px) translateY(1px); }
        }
        
        .glitch-filter:hover {
          animation: glitch-shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

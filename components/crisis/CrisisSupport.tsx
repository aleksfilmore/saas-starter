"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Phone, MessageSquare, Heart, Shield, Clock, ExternalLink, CheckCircle2 } from "lucide-react";

interface CrisisResource {
  name: string;
  contact: string;
  action: 'call' | 'text' | 'chat' | 'visit';
  description: string;
  available: string;
  specialty?: string;
}

interface CrisisSupportProps {
  isEmergency?: boolean;
  onResourceUsed?: (resource: string) => void;
}

const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: '988',
    action: 'call',
    description: 'Call or text for immediate crisis support',
    available: '24/7',
    specialty: 'Suicide prevention and crisis intervention'
  },
  {
    name: 'Crisis Text Line',
    contact: '741741',
    action: 'text',
    description: 'Text HOME for crisis counseling',
    available: '24/7',
    specialty: 'Text-based crisis support'
  },
  {
    name: 'National Domestic Violence Hotline',
    contact: '1-800-799-7233',
    action: 'call',
    description: 'Support for domestic violence situations',
    available: '24/7',
    specialty: 'Domestic violence and abuse'
  },
  {
    name: 'LGBTQ National Hotline',
    contact: '1-888-843-4564',
    action: 'call',
    description: 'Support for LGBTQ+ individuals',
    available: 'Daily 4PM-12AM ET',
    specialty: 'LGBTQ+ specific support'
  },
  {
    name: 'National Sexual Assault Hotline',
    contact: '1-800-656-4673',
    action: 'call',
    description: 'Support for sexual assault survivors',
    available: '24/7',
    specialty: 'Sexual assault and trauma'
  }
];

const IMMEDIATE_ACTIONS = [
  'Take slow, deep breaths',
  'Move to a safe, comfortable space',
  'Call a trusted friend or family member',
  'Remove any immediate means of harm',
  'Stay with someone if possible',
  'Go to the nearest emergency room if needed'
];

const GROUNDING_TECHNIQUES = [
  {
    name: '5-4-3-2-1 Technique',
    description: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste'
  },
  {
    name: 'Box Breathing',
    description: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat.'
  },
  {
    name: 'Cold Water',
    description: 'Splash cold water on your face or hold ice cubes'
  },
  {
    name: 'Physical Grounding',
    description: 'Press your feet firmly into the ground and notice the sensation'
  }
];

export function CrisisSupport({ isEmergency = false, onResourceUsed }: CrisisSupportProps) {
  const [selectedGrounding, setSelectedGrounding] = useState<number | null>(null);
  const [completedActions, setCompletedActions] = useState<number[]>([]);

  const handleResourceClick = (resource: CrisisResource) => {
    let contactMethod = '';
    
    switch (resource.action) {
      case 'call':
        contactMethod = `tel:${resource.contact}`;
        break;
      case 'text':
        contactMethod = `sms:${resource.contact}`;
        break;
      case 'chat':
        contactMethod = resource.contact; // URL for chat
        break;
      default:
        contactMethod = `tel:${resource.contact}`;
    }

    window.open(contactMethod, '_self');
    onResourceUsed?.(resource.name);
  };

  const toggleActionComplete = (index: number) => {
    setCompletedActions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={`${isEmergency 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-orange-600 hover:bg-orange-700'
          } text-white`}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          {isEmergency ? 'Emergency Support' : 'Crisis Resources'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl bg-gray-900 border-red-500/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-400 text-center flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Crisis Support Center
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emergency Banner */}
          {isEmergency && (
            <Card className="bg-red-500/10 border-red-500/50">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-red-400">🚨 IMMEDIATE DANGER?</h3>
                  <p className="text-red-300">If you are in immediate physical danger, call 911 right now.</p>
                  <Button 
                    onClick={() => window.open('tel:911', '_self')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call 911 Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Crisis Hotlines */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Crisis Hotlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CRISIS_RESOURCES.map((resource, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-white">{resource.name}</h4>
                      <p className="text-sm text-gray-300">{resource.description}</p>
                      {resource.specialty && (
                        <p className="text-xs text-blue-400 mt-1">{resource.specialty}</p>
                      )}
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      {resource.available}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono text-yellow-400">{resource.contact}</span>
                    <Button 
                      onClick={() => handleResourceClick(resource)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {resource.action === 'call' && <Phone className="w-4 h-4 mr-2" />}
                      {resource.action === 'text' && <MessageSquare className="w-4 h-4 mr-2" />}
                      {resource.action === 'chat' && <ExternalLink className="w-4 h-4 mr-2" />}
                      {resource.action.charAt(0).toUpperCase() + resource.action.slice(1)} Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Immediate Safety Actions */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Immediate Safety Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-300 text-sm mb-4">
                Check off each action as you complete it. You're taking control.
              </p>
              {IMMEDIATE_ACTIONS.map((action, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleActionComplete(index)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
                      completedActions.includes(index)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400 hover:border-green-400'
                    }`}
                  >
                    {completedActions.includes(index) && (
                      <CheckCircle2 className="w-3 h-3 text-white m-0.5" />
                    )}
                  </button>
                  <span className={`${
                    completedActions.includes(index) 
                      ? 'text-green-400 line-through' 
                      : 'text-gray-300'
                  }`}>
                    {action}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Grounding Techniques */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Grounding Techniques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-300 text-sm">
                These techniques can help you feel more present and calm. Try one that resonates with you.
              </p>
              {GROUNDING_TECHNIQUES.map((technique, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                  <button
                    onClick={() => setSelectedGrounding(selectedGrounding === index ? null : index)}
                    className="w-full text-left"
                  >
                    <h4 className="font-bold text-white mb-1">{technique.name}</h4>
                    <p className="text-sm text-gray-300">{technique.description}</p>
                  </button>
                  
                  {selectedGrounding === index && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-blue-300 text-sm">
                        Take your time with this technique. There's no rush. Focus on each step.
                      </p>
                      <Button 
                        onClick={() => setSelectedGrounding(null)}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed This Technique
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Safety Planning */}
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Create a Safety Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-300 text-sm">
                Having a plan can help you feel more prepared and in control.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <div>📱 <strong>Emergency contacts:</strong> Save 988 and trusted friends</div>
                <div>🏠 <strong>Safe spaces:</strong> Identify places where you feel secure</div>
                <div>🧘 <strong>Coping strategies:</strong> List what helps you feel better</div>
                <div>⚠️ <strong>Warning signs:</strong> Recognize your personal triggers</div>
                <div>💊 <strong>Remove means:</strong> Secure or remove harmful items</div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Detailed Safety Plan
              </Button>
            </CardContent>
          </Card>

          {/* Recovery Message */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-bold text-white mb-2">You Are Not Alone</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Crisis moments are temporary. You have survived difficult times before, and you can get through this too. 
                Your life has value, and there are people who want to help. Reaching out takes courage, and you're already taking that step.
              </p>
              <div className="mt-4 flex justify-center">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  You've taken the first step by being here
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

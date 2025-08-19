'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Clock,
  Eye,
  Flag,
  Shield
} from 'lucide-react';

interface ModerationItem {
  id: string;
  postId: string;
  userId: string;
  content: string;
  flagReason: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  suggestedAction: 'approve' | 'flag' | 'reject' | 'edit';
  detectedIssues: string[];
  moderatorNotes?: string;
  createdAt: string;
  moderatedAt?: string;
  postTitle?: string;
  postCategory?: string;
  postActive?: boolean;
}

interface ModerationResponse {
  items: ModerationItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function ModerationDashboard() {
  const [pendingItems, setPendingItems] = useState<ModerationItem[]>([]);
  const [reviewedItems, setReviewedItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [editContent, setEditContent] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchModerationData();
  }, []);

  const fetchModerationData = async () => {
    try {
      setLoading(true);
      
      const [pendingResponse, reviewedResponse] = await Promise.all([
        fetch('/api/admin/moderation?status=pending'),
        fetch('/api/admin/moderation?status=approved,rejected,edited&limit=50')
      ]);

      if (pendingResponse.ok) {
        const pendingData: ModerationResponse = await pendingResponse.json();
        setPendingItems(pendingData.items);
      }

      if (reviewedResponse.ok) {
        const reviewedData: ModerationResponse = await reviewedResponse.json();
        setReviewedItems(reviewedData.items);
      }
    } catch (error) {
      console.error('Failed to fetch moderation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (action: 'approve' | 'reject' | 'edit', item: ModerationItem) => {
    try {
      setActionLoading(true);
      
      const payload: any = {
        queueId: item.id,
        action,
        reason: moderatorNotes
      };

      if (action === 'edit') {
        payload.newContent = editContent;
      }

      const response = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Refresh data and close modal
        await fetchModerationData();
        setSelectedItem(null);
        setModeratorNotes('');
        setEditContent('');
      } else {
        const error = await response.json();
        alert(`Failed to ${action} post: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Failed to ${action} post:`, error);
      alert(`Failed to ${action} post. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Flag className="w-4 h-4" />;
      case 'low': return <Eye className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const openActionModal = (item: ModerationItem) => {
    setSelectedItem(item);
    setEditContent(item.content);
    setModeratorNotes('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-gray-400">Loading moderation queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Moderation</h1>
          <p className="text-gray-400">Review and moderate Wall of Wounds posts</p>
        </div>
        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
          {pendingItems.length} Pending Review
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingItems.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Reviewed ({reviewedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">All Clear!</h3>
                <p className="text-gray-400">No posts are pending moderation review.</p>
              </CardContent>
            </Card>
          ) : (
            pendingItems.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(item.severity)}>
                          {getSeverityIcon(item.severity)}
                          {item.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{item.suggestedAction.toUpperCase()}</Badge>
                        {item.postCategory && (
                          <Badge variant="secondary">{item.postCategory}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-sm font-medium text-red-400">
                        {item.flagReason}
                      </CardTitle>
                      <CardDescription>
                        Detected: {item.detectedIssues.join(', ')}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openActionModal(item)}
                    >
                      Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Post ID: {item.postId} • Flagged: {new Date(item.createdAt).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Reviewed Items</h3>
                <p className="text-gray-400">Moderated posts will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            reviewedItems.map((item) => (
              <Card key={item.id} className={`border-l-4 ${
                item.status === 'approved' ? 'border-l-green-500' : 
                item.status === 'rejected' ? 'border-l-red-500' : 
                'border-l-blue-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {item.status === 'approved' && <CheckCircle2 className="w-4 h-4" />}
                          {item.status === 'rejected' && <XCircle className="w-4 h-4" />}
                          {item.status === 'edited' && <Edit3 className="w-4 h-4" />}
                          {item.status.toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription>
                        {item.moderatorNotes || 'No notes provided'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Reviewed: {item.moderatedAt ? new Date(item.moderatedAt).toLocaleString() : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Review Post</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Post Content */}
              <div>
                <Label className="text-sm font-medium text-gray-300">Original Content</Label>
                <div className="bg-gray-800 p-4 rounded-lg mt-2">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedItem.content}
                  </p>
                </div>
              </div>

              {/* Moderation Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Severity</Label>
                  <Badge className={`mt-2 ${getSeverityColor(selectedItem.severity)}`}>
                    {selectedItem.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Suggested Action</Label>
                  <Badge variant="outline" className="mt-2">
                    {selectedItem.suggestedAction.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-300">Detected Issues</Label>
                <div className="mt-2 space-y-1">
                  {selectedItem.detectedIssues.map((issue, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Edit Content (if editing) */}
              <div>
                <Label htmlFor="editContent" className="text-sm font-medium text-gray-300">
                  Edit Content (Optional)
                </Label>
                <Textarea
                  id="editContent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Edit the post content if needed..."
                  className="mt-2"
                />
              </div>

              {/* Moderator Notes */}
              <div>
                <Label htmlFor="moderatorNotes" className="text-sm font-medium text-gray-300">
                  Moderator Notes
                </Label>
                <Textarea
                  id="moderatorNotes"
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  className="mt-2"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleModerationAction('approve', selectedItem)}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleModerationAction('edit', selectedItem)}
                  disabled={actionLoading || !editContent.trim()}
                  variant="outline"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit & Approve
                </Button>
                <Button
                  onClick={() => handleModerationAction('reject', selectedItem)}
                  disabled={actionLoading}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

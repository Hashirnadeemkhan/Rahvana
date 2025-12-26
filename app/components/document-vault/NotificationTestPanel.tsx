'use client';

import React, { useState } from 'react';
import { useDocumentVaultStore } from '@/lib/document-vault/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TestTube, RefreshCw, Calendar, Clock, AlertCircle } from 'lucide-react';

/**
 * Testing panel for notification system - only shows in development
 * Allows you to simulate different expiry scenarios
 */
export function NotificationTestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { uploadedDocuments, updateDocument, refreshNotifications, getNotifications } = useDocumentVaultStore();

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const simulateExpiryScenarios = () => {
    const now = new Date();

    uploadedDocuments.forEach((doc, index) => {
      if (!doc.expirationDate) return;

      let newExpiry: Date;

      // Distribute documents across different expiry scenarios
      switch (index % 5) {
        case 0:
          // Expired 5 days ago
          newExpiry = new Date(now);
          newExpiry.setDate(newExpiry.getDate() - 5);
          break;
        case 1:
          // Expires in 3 days (critical)
          newExpiry = new Date(now);
          newExpiry.setDate(newExpiry.getDate() + 3);
          break;
        case 2:
          // Expires in 15 days (urgent)
          newExpiry = new Date(now);
          newExpiry.setDate(newExpiry.getDate() + 15);
          break;
        case 3:
          // Expires in 45 days (warning)
          newExpiry = new Date(now);
          newExpiry.setDate(newExpiry.getDate() + 45);
          break;
        case 4:
          // Expires in 120 days (ok)
          newExpiry = new Date(now);
          newExpiry.setDate(newExpiry.getDate() + 120);
          break;
        default:
          return;
      }

      updateDocument(doc.id, { expirationDate: newExpiry });
    });

    refreshNotifications();
    toast.success('Test expiry dates applied!');
  };

  const resetExpiryDates = () => {
    const now = new Date();

    uploadedDocuments.forEach((doc) => {
      if (!doc.expirationDate) return;

      // Set all to 6 months from now (safe)
      const newExpiry = new Date(now);
      newExpiry.setMonth(newExpiry.getMonth() + 6);

      updateDocument(doc.id, { expirationDate: newExpiry });
    });

    refreshNotifications();
    toast.success('Expiry dates reset to 6 months from now');
  };

  const setSpecificExpiry = (days: number) => {
    if (uploadedDocuments.length === 0) {
      toast.error('No documents uploaded yet!');
      return;
    }

    const now = new Date();
    const newExpiry = new Date(now);
    newExpiry.setDate(newExpiry.getDate() + days);

    // Apply to first document with expiry date
    const docWithExpiry = uploadedDocuments.find(d => d.expirationDate);
    if (docWithExpiry) {
      updateDocument(docWithExpiry.id, { expirationDate: newExpiry });
      refreshNotifications();
      toast.success(`Set expiry to ${days} days from now`);
    } else {
      toast.error('No documents with expiration dates found');
    }
  };

  const notifications = getNotifications();

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Test Notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="border-purple-600 border-2 shadow-xl">
        <CardHeader className="bg-purple-50 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Notification Testing</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>
          <CardDescription>
            Dev mode only - Test expiry notifications
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Current Status */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Active Notifications</span>
              <Badge variant="secondary">{notifications.length}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-red-600 font-semibold">
                  {notifications.filter(n => n.severity === 'error').length}
                </span>
                {' '}errors
              </div>
              <div>
                <span className="text-yellow-600 font-semibold">
                  {notifications.filter(n => n.severity === 'warning').length}
                </span>
                {' '}warnings
              </div>
              <div>
                <span className="text-blue-600 font-semibold">
                  {notifications.filter(n => n.severity === 'info').length}
                </span>
                {' '}info
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Quick Test Scenarios</h4>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start"
                onClick={simulateExpiryScenarios}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Simulate All Scenarios
              </Button>
              <div className="text-xs text-muted-foreground pl-6">
                Sets: Expired, 3 days, 15 days, 45 days, 120 days
              </div>
            </div>
          </div>

          {/* Set Specific Expiry */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Set Specific Expiry</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setSpecificExpiry(-5)}
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Expired (-5d)
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setSpecificExpiry(3)}
              >
                <Clock className="h-3 w-3 mr-1" />
                3 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSpecificExpiry(15)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                15 days
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSpecificExpiry(45)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                45 days
              </Button>
            </div>
          </div>

          {/* Reset */}
          <div>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={resetExpiryDates}
            >
              Reset All (6 months)
            </Button>
          </div>

          {/* Info */}
          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
            <strong>Note:</strong> These changes are temporary and only for testing.
            Refresh page to restore original dates.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

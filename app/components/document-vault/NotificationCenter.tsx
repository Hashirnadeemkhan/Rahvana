'use client';

import React from 'react';
import { Bell, X, AlertCircle, AlertTriangle, Info, Clock, CheckCheck } from 'lucide-react';
import { useDocumentVaultStore } from '@/lib/document-vault/store';
import { NotificationMessage } from '@/lib/document-vault/types';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NotificationBell() {
  const unreadCount = useDocumentVaultStore((state) => state.getUnreadNotificationCount());
  const { notificationCenterOpen, toggleNotificationCenter } = useDocumentVaultStore();

  return (
    <Sheet open={notificationCenterOpen} onOpenChange={toggleNotificationCenter}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <NotificationCenter />
      </SheetContent>
    </Sheet>
  );
}

export function NotificationCenter() {
  const notifications = useDocumentVaultStore((state) => state.getNotifications());
  const markAllAsRead = useDocumentVaultStore((state) => state.markAllNotificationsAsRead);
  const snoozeAll = useDocumentVaultStore((state) => state.snoozeAllNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <SheetHeader>
        <div className="flex items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} new</Badge>
          )}
        </div>
        <SheetDescription>
          Stay updated on your document status
        </SheetDescription>
      </SheetHeader>

      {notifications.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Snooze all
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => snoozeAll(1)}>
                1 hour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => snoozeAll(4)}>
                4 hours
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => snoozeAll(24)}>
                24 hours
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-200px)] mt-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

function NotificationItem({ notification }: { notification: NotificationMessage }) {
  const markAsRead = useDocumentVaultStore((state) => state.markNotificationAsRead);
  const dismiss = useDocumentVaultStore((state) => state.dismissNotification);
  const snooze = useDocumentVaultStore((state) => state.snoozeNotification);
  const openUploadModal = useDocumentVaultStore((state) => state.openUploadModal);

  const getIcon = () => {
    switch (notification.severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const handleClick = () => {
    markAsRead(notification.id);

    // If notification has a document, open upload modal
    if (notification.documentDefId) {
      openUploadModal(notification.documentDefId);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        notification.read
          ? 'bg-background border-border'
          : 'bg-muted/50 border-primary/20'
      } ${notification.actionRequired ? 'border-l-4 border-l-destructive' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold leading-tight">
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 leading-tight">
                {notification.message}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={() => dismiss(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {notification.actionRequired && notification.documentDefId && (
              <Button
                size="sm"
                variant="default"
                onClick={handleClick}
              >
                Upload Document
              </Button>
            )}

            {!notification.read && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Clock className="h-4 w-4 mr-1" />
                  Snooze
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => snooze(notification.id, 1)}>
                  1 hour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => snooze(notification.id, 4)}>
                  4 hours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => snooze(notification.id, 24)}>
                  24 hours
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

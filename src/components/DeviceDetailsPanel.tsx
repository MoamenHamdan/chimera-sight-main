import React from 'react';
import { Device, DeviceAction } from '@/lib/deviceTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, ShieldOff, ToggleLeft, ToggleRight, Monitor, Smartphone, Tv, Printer, Wifi, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceDetailsPanelProps {
  device: Device | null;
  onClose: () => void;
  onAction: (deviceId: number, action: DeviceAction) => void;
}

export function DeviceDetailsPanel({ device, onClose, onAction }: DeviceDetailsPanelProps) {
  if (!device) return null;

  const getDeviceIcon = () => {
    switch (device.ai_classification.device_category) {
      case 'computer':
        return <Monitor className="w-5 h-5" />;
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'entertainment':
        return <Tv className="w-5 h-5" />;
      case 'office':
        return <Printer className="w-5 h-5" />;
      default:
        return <Wifi className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    if (!device.is_active) return 'text-device-inactive';
    return 'text-device-active';
  };

  const blocklistCategories = [
    { key: 'social_media', label: 'Social Media' },
    { key: 'gaming', label: 'Gaming' },
    { key: 'streaming', label: 'Streaming' },
    { key: 'ads_trackers', label: 'Ads & Trackers' },
    { key: 'gambling', label: 'Gambling' },
    { key: 'porn', label: 'Adult Content' },
    { key: 'youtube', label: 'YouTube' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'netflix', label: 'Netflix' },
    { key: 'ai', label: 'AI Services' }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-elevation z-50 overflow-y-auto">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-secondary", getStatusColor())}>
                {getDeviceIcon()}
              </div>
              <div>
                <CardTitle className="text-lg">{device.given_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{device.hostname}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="font-semibold mb-3">Status & Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={device.is_active ? "success" : "secondary"}>
                  {device.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Group</p>
                <Badge variant="outline">{device.group.name}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="text-sm font-mono">{device.ip}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MAC Address</p>
                <p className="text-sm font-mono">{device.mac}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="text-sm">{device.vendor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">OS</p>
                <p className="text-sm">{device.os_name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid gap-2">
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => onAction(device.id, { action: 'isolate' })}
              >
                <Shield className="w-4 h-4 mr-2" />
                Isolate Device
              </Button>
              <Button
                variant="success"
                className="w-full justify-start"
                onClick={() => onAction(device.id, { action: 'release' })}
              >
                <ShieldOff className="w-4 h-4 mr-2" />
                Release Device
              </Button>
            </div>
          </div>

          <Separator />

          {/* Blocklist Controls */}
          <div>
            <h3 className="font-semibold mb-3">Content Filtering</h3>
            <div className="space-y-2">
              {blocklistCategories.map(category => {
                const isBlocked = device.blocklist[category.key as keyof typeof device.blocklist];
                return (
                  <div key={category.key} className="flex items-center justify-between p-2 rounded border border-border">
                    <span className="text-sm">{category.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAction(device.id, { 
                        action: 'toggle_block', 
                        category: category.key 
                      })}
                      className={cn(
                        "p-1 h-auto",
                        isBlocked ? "text-device-blocked" : "text-muted-foreground"
                      )}
                    >
                      {isBlocked ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* AI Classification */}
          <div>
            <h3 className="font-semibold mb-3">AI Classification</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Device Type</p>
                <p className="text-sm capitalize">{device.ai_classification.device_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-sm capitalize">{device.ai_classification.device_category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${device.ai_classification.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{Math.round(device.ai_classification.confidence * 100)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reasoning</p>
                <p className="text-xs text-muted-foreground">{device.ai_classification.reasoning}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
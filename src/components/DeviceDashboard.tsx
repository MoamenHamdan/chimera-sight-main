import React, { useState, useEffect } from 'react';
import { Device, DeviceSummary, DeviceAction } from '@/lib/deviceTypes';
import { deviceAPI } from '@/lib/deviceApi';
import { sampleDevices } from '@/lib/sampleData';
import { DashboardHeader } from './DashboardHeader';
import { NetworkVisualization } from './NetworkVisualization';
import { DeviceDetailsPanel } from './DeviceDetailsPanel';
import { useToast } from '@/hooks/use-toast';

export function DeviceDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [summary, setSummary] = useState<DeviceSummary | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // For development, use sample data
      // In production, this would call: const deviceData = await deviceAPI.getDevices();
      const deviceData = sampleDevices;
      setDevices(deviceData);

      // Generate summary from sample data
      const summaryData: DeviceSummary = {
        total: deviceData.length,
        active: deviceData.filter(d => d.is_active).length,
        by_group: deviceData.reduce((acc, device) => {
          acc[device.group.name] = (acc[device.group.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_category: deviceData.reduce((acc, device) => {
          acc[device.ai_classification.device_category] = (acc[device.ai_classification.device_category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setSummary(summaryData);

    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load device information. Using sample data.",
        variant: "destructive",
      });
      
      // Fallback to sample data
      setDevices(sampleDevices);
      const summaryData: DeviceSummary = {
        total: sampleDevices.length,
        active: sampleDevices.filter(d => d.is_active).length,
        by_group: sampleDevices.reduce((acc, device) => {
          acc[device.group.name] = (acc[device.group.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_category: sampleDevices.reduce((acc, device) => {
          acc[device.ai_classification.device_category] = (acc[device.ai_classification.device_category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setSummary(summaryData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceAction = async (deviceId: number, action: DeviceAction) => {
    try {
      // For development, simulate the action locally
      // In production: const updatedDevice = await deviceAPI.executeAction(deviceId, action);
      
      setDevices(prevDevices => {
        return prevDevices.map(device => {
          if (device.id !== deviceId) return device;

          const updatedDevice = { ...device };
          
          switch (action.action) {
            case 'isolate':
              Object.keys(updatedDevice.blocklist).forEach(key => {
                if (key !== 'safesearch') {
                  (updatedDevice.blocklist as any)[key] = true;
                }
              });
              updatedDevice.has_custom_blocklist = true;
              break;
              
            case 'release':
              Object.keys(updatedDevice.blocklist).forEach(key => {
                if (key !== 'safesearch') {
                  (updatedDevice.blocklist as any)[key] = false;
                }
              });
              updatedDevice.blocklist.safesearch = true;
              updatedDevice.has_custom_blocklist = true;
              break;
              
            case 'toggle_block':
              if (action.category && action.category in updatedDevice.blocklist) {
                (updatedDevice.blocklist as any)[action.category] = !(updatedDevice.blocklist as any)[action.category];
                updatedDevice.has_custom_blocklist = true;
              }
              break;
          }
          
          return updatedDevice;
        });
      });

      // Update selected device if it's the one being modified
      if (selectedDevice?.id === deviceId) {
        const updatedDevice = devices.find(d => d.id === deviceId);
        if (updatedDevice) {
          setSelectedDevice(updatedDevice);
        }
      }

      const actionMessages = {
        isolate: 'Device isolated successfully',
        release: 'Device released successfully',
        toggle_block: `Content filter ${action.category} toggled`
      };

      toast({
        title: "Action Completed",
        description: actionMessages[action.action],
      });

    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Unable to perform device action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeviceSelect = (device: Device | null) => {
    setSelectedDevice(device);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading device data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <DashboardHeader
          summary={summary}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          groupFilter={groupFilter}
          onGroupFilterChange={setGroupFilter}
        />

        <div className="relative">
          {/* Main visualization area */}
          <div className={`transition-all duration-300 ${selectedDevice ? 'mr-96' : ''}`}>
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
              <NetworkVisualization
                devices={devices}
                onDeviceSelect={handleDeviceSelect}
                selectedDevice={selectedDevice}
                searchTerm={searchTerm}
                groupFilter={groupFilter}
              />
            </div>
          </div>

          {/* Device details panel */}
          <DeviceDetailsPanel
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
            onAction={handleDeviceAction}
          />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeviceSummary } from '@/lib/deviceTypes';
import { Search, Shield, Activity, Users, Cpu } from 'lucide-react';

interface DashboardHeaderProps {
  summary: DeviceSummary | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  groupFilter: string | null;
  onGroupFilterChange: (value: string | null) => void;
}

export function DashboardHeader({ 
  summary, 
  searchTerm, 
  onSearchChange, 
  groupFilter, 
  onGroupFilterChange 
}: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chimera Device Viz
          </h1>
          <p className="text-muted-foreground">Build, Visualize, Act</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Network Operations
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-card to-secondary/20 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                  <p className="text-2xl font-bold text-foreground">{summary.total}</p>
                </div>
                <Cpu className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-device-active/10 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                  <p className="text-2xl font-bold text-device-active">{summary.active}</p>
                </div>
                <Activity className="w-8 h-8 text-device-active" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-device-inactive/10 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-device-inactive">{summary.total - summary.active}</p>
                </div>
                <Users className="w-8 h-8 text-device-inactive" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/10 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Groups</p>
                  <p className="text-2xl font-bold text-warning">{Object.keys(summary.by_group).length}</p>
                </div>
                <Shield className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search devices by name, IP, vendor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary"
          />
        </div>
        
        <Select value={groupFilter || "all"} onValueChange={(value) => onGroupFilterChange(value === "all" ? null : value)}>
          <SelectTrigger className="w-full md:w-48 bg-card border-border">
            <SelectValue placeholder="Filter by group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {summary && Object.keys(summary.by_group).map(group => (
              <SelectItem key={group} value={group}>
                {group} ({summary.by_group[group]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-border hover:bg-secondary">
          Refresh
        </Button>
      </div>
    </div>
  );
}
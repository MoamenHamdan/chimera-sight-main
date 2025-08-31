// Device schema types based on the API specification

export interface DeviceGroup {
  id: number;
  name: string;
  is_default: boolean;
}

export interface BlockList {
  ads_trackers: boolean;
  gambling: boolean;
  social_media: boolean;
  porn: boolean;
  gaming: boolean;
  streaming: boolean;
  facebook: boolean;
  instagram: boolean;
  tiktok: boolean;
  netflix: boolean;
  youtube: boolean;
  ai: boolean;
  safesearch: boolean;
}

export interface AIClassification {
  device_type: string;
  device_category: string;
  confidence: number;
  reasoning: string;
  indicators: string[];
  last_classified: string;
}

export interface Device {
  // Identity & Network
  id: number;
  mac: string;
  hostname: string;
  vendor: string;
  given_name: string;
  ip: string;
  user_agent: string[];
  group: DeviceGroup;

  // Activity & Meta
  is_active: boolean;
  has_custom_blocklist: boolean;
  first_seen: string;
  last_seen: string;
  is_mac_universal: boolean;

  // Operating System
  os_name: string;
  os_accuracy: number;
  os_type: string;
  os_vendor: string;
  os_family: string;
  os_gen: string;
  os_cpe: string[];
  os_last_updated: string;

  // Blocklist
  blocklist: BlockList;

  // AI Classification
  ai_classification: AIClassification;
}

export interface DeviceSummary {
  total: number;
  active: number;
  by_group: Record<string, number>;
  by_category: Record<string, number>;
}

export interface DeviceAction {
  action: 'isolate' | 'release' | 'toggle_block';
  category?: string;
}

export interface DeviceUpdate {
  given_name?: string;
  'group.id'?: number;
  [key: string]: any; // For blocklist updates
}
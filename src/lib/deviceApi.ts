import { Device, DeviceSummary, DeviceAction, DeviceUpdate } from './deviceTypes';

const API_BASE_URL = 'http://localhost:8000/api';

export class DeviceAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getDevices(): Promise<Device[]> {
    const response = await fetch(`${this.baseUrl}/devices`);
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    return response.json();
  }

  async getSummary(): Promise<DeviceSummary> {
    const response = await fetch(`${this.baseUrl}/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    return response.json();
  }

  async updateDevice(id: number, updates: DeviceUpdate): Promise<Device> {
    const response = await fetch(`${this.baseUrl}/devices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update device');
    }
    return response.json();
  }

  async executeAction(id: number, action: DeviceAction): Promise<Device> {
    const response = await fetch(`${this.baseUrl}/devices/${id}/actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action),
    });
    if (!response.ok) {
      throw new Error('Failed to execute action');
    }
    return response.json();
  }
}

export const deviceAPI = new DeviceAPI();
"""
Chimera Device Viz API - FastAPI Backend
Provides device inventory and management endpoints
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import json
from datetime import datetime

app = FastAPI(title="Chimera Device Viz API", version="1.0.0")

# Enable CORS for web client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class DeviceGroup(BaseModel):
    id: int
    name: str
    is_default: bool

class BlockList(BaseModel):
    ads_trackers: bool
    gambling: bool
    social_media: bool
    porn: bool
    gaming: bool
    streaming: bool
    facebook: bool
    instagram: bool
    tiktok: bool
    netflix: bool
    youtube: bool
    ai: bool
    safesearch: bool

class AIClassification(BaseModel):
    device_type: str
    device_category: str
    confidence: float
    reasoning: str
    indicators: List[str]
    last_classified: str

class Device(BaseModel):
    id: int
    mac: str
    hostname: str
    vendor: str
    given_name: str
    ip: str
    user_agent: List[str]
    group: DeviceGroup
    is_active: bool
    has_custom_blocklist: bool
    first_seen: str
    last_seen: str
    is_mac_universal: bool
    os_name: str
    os_accuracy: int
    os_type: str
    os_vendor: str
    os_family: str
    os_gen: str
    os_cpe: List[str]
    os_last_updated: str
    blocklist: BlockList
    ai_classification: AIClassification

class DeviceSummary(BaseModel):
    total: int
    active: int
    by_group: Dict[str, int]
    by_category: Dict[str, int]

class DeviceAction(BaseModel):
    action: str  # "isolate" | "release" | "toggle_block"
    category: Optional[str] = None

class DeviceUpdate(BaseModel):
    given_name: Optional[str] = None
    group_id: Optional[int] = None

# In-memory storage (use database in production)
devices_db: List[Device] = []

def load_sample_devices():
    """Load sample devices from JSON file"""
    try:
        with open("devices.sample.json", "r") as f:
            devices_data = json.load(f)
            return [Device(**device) for device in devices_data]
    except FileNotFoundError:
        # Return empty list if sample file not found
        return []

# Initialize with sample data
devices_db = load_sample_devices()

@app.get("/api/devices", response_model=List[Device])
async def get_devices():
    """Get all devices"""
    return devices_db

@app.get("/api/summary", response_model=DeviceSummary)
async def get_summary():
    """Get device summary statistics"""
    total = len(devices_db)
    active = sum(1 for device in devices_db if device.is_active)
    
    by_group = {}
    by_category = {}
    
    for device in devices_db:
        # Group by group name
        group_name = device.group.name
        by_group[group_name] = by_group.get(group_name, 0) + 1
        
        # Group by device category
        category = device.ai_classification.device_category
        by_category[category] = by_category.get(category, 0) + 1
    
    return DeviceSummary(
        total=total,
        active=active,
        by_group=by_group,
        by_category=by_category
    )

@app.patch("/api/devices/{device_id}", response_model=Device)
async def update_device(device_id: int, updates: DeviceUpdate):
    """Update device properties"""
    device_index = None
    for i, device in enumerate(devices_db):
        if device.id == device_id:
            device_index = i
            break
    
    if device_index is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = devices_db[device_index]
    
    if updates.given_name is not None:
        device.given_name = updates.given_name
    
    if updates.group_id is not None:
        # Update group (simplified - in production, validate group exists)
        group_names = {1: "Default", 2: "Staff", 3: "Guests", 4: "IoT"}
        if updates.group_id in group_names:
            device.group.id = updates.group_id
            device.group.name = group_names[updates.group_id]
            device.group.is_default = updates.group_id == 1
    
    return device

@app.post("/api/devices/{device_id}/actions", response_model=Device)
async def execute_device_action(device_id: int, action: DeviceAction):
    """Execute actions on a device"""
    device_index = None
    for i, device in enumerate(devices_db):
        if device.id == device_id:
            device_index = i
            break
    
    if device_index is None:
        raise HTTPException(status_code=404, detail="Device not found")
    
    device = devices_db[device_index]
    
    if action.action == "isolate":
        # Set all blocklist items to true except safesearch
        for key in device.blocklist.__fields__:
            if key != "safesearch":
                setattr(device.blocklist, key, True)
        device.has_custom_blocklist = True
        
    elif action.action == "release":
        # Set all blocklist items to false except safesearch
        for key in device.blocklist.__fields__:
            if key != "safesearch":
                setattr(device.blocklist, key, False)
        device.blocklist.safesearch = True
        device.has_custom_blocklist = True
        
    elif action.action == "toggle_block":
        if not action.category:
            raise HTTPException(status_code=400, detail="Category required for toggle_block action")
        
        if hasattr(device.blocklist, action.category):
            current_value = getattr(device.blocklist, action.category)
            setattr(device.blocklist, action.category, not current_value)
            device.has_custom_blocklist = True
        else:
            raise HTTPException(status_code=400, detail=f"Invalid category: {action.category}")
    
    else:
        raise HTTPException(status_code=400, detail=f"Invalid action: {action.action}")
    
    return device

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
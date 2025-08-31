video number 1 : 
https://baudom-my.sharepoint.com/:v:/g/personal/mmh249_student_bau_edu_lb/ETfishdcIqZNsA0w6VDJXsYBScbQWE4fTVh98ptpQi9EVA?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=JgzSgM

video number 2 : 
https://baudom-my.sharepoint.com/:v:/g/personal/mmh249_student_bau_edu_lb/EdjT600IOkBIu3-5ofM84W4Bj9Hxlmeq7Ibqh-goHnDDFw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=ZuB5eL


# Chimera Device Viz - Network Operations Dashboard

Advanced device visualization and network operations management platform. Transform your device inventory into actionable insights with cutting-edge visualizations.

## 🚀 Features

- **Interactive Network Visualization**: Force-directed graph showing device relationships and groupings
- **Real-time Device Management**: Monitor active/inactive devices with live status updates  
- **Advanced Filtering**: Search by device name, IP, vendor, and filter by groups
- **Quick Actions**: Isolate, release, and configure content filtering with one click
- **AI-Powered Classification**: Intelligent device categorization with confidence metrics
- **Modern Design**: Dark theme optimized for network operations centers

## 🛠 Technology Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS with custom design system
- D3.js for data visualization
- shadcn/ui components
- React Query for state management

**Backend:**
- Python FastAPI
- Pydantic for data validation
- CORS enabled for web client
- In-memory storage (JSON file based)

## 🏃‍♂️ Quick Start

### Frontend (React App)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Backend (Python API) - Optional

```bash
# Navigate to API directory
cd api

# Install Python dependencies
pip install fastapi uvicorn python-multipart

# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📊 Visualization Features

### Network Graph Visualization
- **Device Nodes**: Color-coded by category (computers, mobile, IoT, office equipment)
- **Size Encoding**: Node size reflects AI classification confidence
- **Status Indicators**: Visual indicators for active/inactive and restricted devices
- **Group Clustering**: Devices automatically cluster by organizational groups
- **Interactive Selection**: Click devices for detailed management options

### Device Categories
- 🖥️ **Computers**: Desktops, laptops, workstations (Yellow)
- 📱 **Mobile**: Smartphones, tablets (Cyan) 
- 📺 **Entertainment/IoT**: Smart TVs, home automation (Purple)
- 🖨️ **Office**: Printers, network equipment (Blue)

## 🎯 Quick Actions

### Device Management
- **Isolate**: Block all content categories except safe search
- **Release**: Remove all restrictions while maintaining safe search
- **Toggle Categories**: Fine-grained control over specific content types

### Content Filtering Categories
- Social Media, Gaming, Streaming
- Ads & Trackers, Gambling, Adult Content
- Platform-specific: YouTube, Facebook, Instagram, TikTok, Netflix
- AI Services

## 🔧 Configuration

### API Base URL
Update the API base URL in `src/lib/deviceApi.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api'; // Development
// const API_BASE_URL = 'https://your-api-domain.com/api'; // Production
```

### Sample Data
The app includes sample device data for demonstration. To use real API data:

1. Start the Python API server
2. Uncomment API calls in `src/components/DeviceDashboard.tsx`
3. Comment out sample data usage

## 📱 Responsive Design

Optimized for:
- Desktop network operations centers
- Tablet field operations  
- Mobile device management

## 🎨 Design System

Custom dark theme designed for network operations:
- **Primary**: Electric cyan for high visibility
- **Device Status**: Green (active), Red (blocked), Gray (inactive)
- **Categories**: Color-coded for instant recognition
- **Animations**: Subtle glows and smooth transitions

## 🚀 Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder to your web server
```

### Backend
```bash
# Using Docker
docker build -t chimera-api ./api
docker run -p 8000:8000 chimera-api

# Or direct deployment
cd api && uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📋 Device Schema

The application expects devices with the following structure:

```typescript
interface Device {
  id: number;
  mac: string;
  hostname: string;
  vendor: string;
  given_name: string;
  ip: string;
  user_agent: string[];
  group: { id: number; name: string; is_default: boolean };
  is_active: boolean;
  has_custom_blocklist: boolean;
  first_seen: string; // ISO-8601
  last_seen: string;  // ISO-8601
  // ... additional fields for OS, blocklist, AI classification
}
```

## 🔒 Security

- CORS properly configured for production
- Input validation with Pydantic models
- No external credentials required
- Local data storage (extend with database as needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable  
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Chimera Device Viz** - Build, Visualize, Act

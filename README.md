# AI-Assisted Property Inspection Prototype

A complete demonstration of how artificial intelligence can streamline move-in/move-out inspections for rental properties.

## 🏠 Overview

This prototype showcases an end-to-end property inspection workflow that combines mobile-first photo capture, AI-powered damage detection, automated report generation, and cost estimation. Built for property management companies to evaluate the feasibility of AI-assisted inspections.

## ✨ Key Features

### 📱 Real-time Capture Quality Control
- Blur detection algorithms
- Exposure level validation  
- Camera shake detection
- Interactive inspection checklist overlay

### 🤖 AI Damage Detection System
- Mock YOLO-style bounding box overlays
- Damage classification (scratches, holes, stains, etc.)
- Confidence scoring for detected issues
- Support for multiple damage categories

### 📊 Automated Report Generation
- Structured condition reports in Markdown
- PDF export with embedded media
- Inspection metadata and timestamps
- Professional formatting

### 🔍 Comparison Interface  
- Side-by-side move-in vs move-out photos
- Delta highlighting for changes
- Visual difference indicators
- Timeline comparison

### 💰 Cost Estimation Engine
- Rules-based repair cost calculation
- Configurable pricing via JSON
- Editable estimation tables
- CSV export for estimates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Modern web browser with camera support

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
pip install fastapi uvicorn python-multipart pillow fpdf2 opencv-python numpy
```

3. **Start the Application**
```bash
# Frontend (runs on http://localhost:5173)
npm run dev

# Backend (runs on http://localhost:8000) - In a separate terminal
cd backend && python main.py
```

## 📱 Application Routes

- `/` - Dashboard overview with inspection status
- `/capture` - Photo/video capture with quality validation
- `/review` - Manager dashboard for AI detection confirmation  
- `/report` - Generated condition report with PDF download
- `/compare` - Before/after photo comparison interface
- `/estimate` - Repair cost estimation and CSV export

## 🎯 Demo Walkthrough

### Step 1: Property Inspection Capture
1. Navigate to `/capture`
2. Select inspection type (move-in/move-out)
3. Choose room category
4. Capture photos with real-time quality feedback
5. Review and confirm captured media

### Step 2: AI Processing & Review
1. System processes images for damage detection
2. Navigate to `/review` for manager approval
3. Confirm or adjust AI-detected damages
4. Add manual annotations as needed

### Step 3: Report Generation
1. Visit `/report` to view generated condition report
2. Review all detected issues and photos
3. Download PDF report for records
4. Share with relevant stakeholders

### Step 4: Comparison Analysis
1. Go to `/compare` for before/after analysis
2. View side-by-side photo comparisons
3. Identify changes between inspection periods
4. Generate change summary

### Step 5: Cost Estimation  
1. Access `/estimate` for repair cost calculation
2. Review auto-calculated estimates
3. Adjust costs as needed
4. Export estimates to CSV

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **PWA** capabilities for mobile installation
- **Camera API** for native photo capture

### Backend Stack
- **FastAPI** for high-performance API
- **Python** for image processing and AI simulation
- **OpenCV** for image quality analysis
- **FPDF** for PDF report generation
- **Uvicorn** ASGI server for production readiness

### Mock AI Implementation
The application includes sophisticated mock AI functionality with clearly defined integration points for real models:

- **Damage Detection**: `detect_damage()` function with realistic bounding boxes
- **Quality Analysis**: `analyze_image_quality()` for blur/exposure checks  
- **Classification**: Multi-class damage categorization with confidence scores
- **Cost Calculation**: Rules-based estimation engine

## 📁 Project Structure

```
├── src/                     # Frontend React application
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route-specific page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── data/               # Sample data and configurations
├── backend/                # FastAPI backend application
│   ├── main.py            # FastAPI application entry point
│   ├── api/               # API endpoint definitions
│   ├── services/          # Business logic services
│   ├── models/            # Data models and schemas
│   └── utils/             # Backend utility functions
├── public/                # Static assets and sample images
│   ├── sample-images/     # Demo property photos
│   └── manifest.json      # PWA manifest
└── docs/                  # Additional documentation
```

## 🔮 Future AI Integration Roadmap

### Phase 1: Computer Vision Models
- Integrate real YOLO v8 for object detection
- Implement semantic segmentation for precise damage localization
- Add image classification for damage severity assessment

### Phase 2: Advanced Analytics
- Damage progression tracking across multiple inspections
- Predictive maintenance recommendations
- Cost trend analysis and optimization

### Phase 3: Enhanced Automation  
- Natural language report generation
- Voice-to-text inspection notes
- Automated compliance checking

### Phase 4: Integration & Scale
- Property management system APIs
- Multi-tenant architecture
- Real-time collaboration features

## 🛠️ API Documentation

### Core Endpoints

#### Image Processing
- `POST /api/upload-image` - Upload and process inspection photos
- `POST /api/analyze-quality` - Real-time image quality analysis
- `GET /api/detections/{image_id}` - Retrieve AI damage detections

#### Inspection Management  
- `POST /api/inspections` - Create new inspection session
- `GET /api/inspections/{id}` - Retrieve inspection details
- `PUT /api/inspections/{id}` - Update inspection data

#### Reports & Export
- `GET /api/reports/{inspection_id}` - Generate condition report
- `GET /api/reports/{inspection_id}/pdf` - Download PDF report  
- `GET /api/estimates/{inspection_id}/csv` - Export cost estimates

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563EB) - Trust and professionalism
- **Secondary**: Teal (#14B8A6) - Success and completion
- **Accent**: Orange (#EA580C) - Warnings and attention
- **Success**: Green (#059669) - Positive actions
- **Error**: Red (#DC2626) - Issues and problems
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Headings**: 120% line height for clear hierarchy
- **Body**: 150% line height for optimal readability
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)

### Spacing System
- Consistent 8px base unit for all spacing
- Component padding: 16px, 24px, 32px
- Section margins: 24px, 32px, 48px

## 🔧 Configuration

### Pricing Rules (`backend/data/pricing_rules.json`)
Customize repair costs and damage categories:

```json
{
  "damage_types": {
    "wall_damage": {
      "small_hole": { "base_cost": 25, "per_unit": "item" },
      "large_hole": { "base_cost": 75, "per_unit": "item" },
      "scratch": { "base_cost": 15, "per_unit": "linear_foot" }
    }
  }
}
```

### Camera Settings (`src/config/camera.ts`)
Adjust capture quality thresholds and validation rules.

## 📞 Support & Contributing

For questions about implementation or extending functionality:
- Review the comprehensive code documentation
- Check the API endpoint definitions
- Refer to the component prop interfaces
- Follow the established architectural patterns

## 📄 License

This prototype is intended for demonstration and evaluation purposes. All code is provided as-is for assessment of AI-assisted property inspection feasibility.
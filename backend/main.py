#!/usr/bin/env python3

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
import json
import cv2
import numpy as np
from PIL import Image
import io
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from fpdf import FPDF
import tempfile

# Initialize FastAPI app
app = FastAPI(
    title="PropertyAI Backend",
    description="AI-powered property inspection backend API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage (in production, use a proper database)
inspection_data = {
    "inspections": {},
    "photos": {},
    "detections": {}
}

# Load pricing rules
with open('data/pricing_rules.json', 'r') as f:
    pricing_rules = json.load(f)

class ImageQualityAnalyzer:
    """Mock image quality analysis - in production, use proper computer vision"""
    
    @staticmethod
    def analyze_blur(image_data: np.ndarray) -> float:
        """Calculate blur score using Laplacian variance"""
        # Mock implementation - real version would use OpenCV
        return float(np.random.uniform(0.5, 1.0))
    
    @staticmethod
    def analyze_exposure(image_data: np.ndarray) -> float:
        """Analyze exposure using histogram"""
        # Mock implementation - real version would analyze histogram
        return float(np.random.uniform(0.6, 1.0))
    
    @staticmethod
    def analyze_shake(image_data: np.ndarray) -> float:
        """Detect camera shake/motion blur"""
        # Mock implementation - real version would detect motion patterns
        return float(np.random.uniform(0.7, 1.0))
    
    @staticmethod
    def check_resolution(image_data: np.ndarray) -> bool:
        """Check if image meets minimum resolution requirements"""
        height, width = image_data.shape[:2]
        return width >= 640 and height >= 480

class DamageDetector:
    """Mock AI damage detection - in production, integrate YOLO/TensorFlow"""
    
    damage_types = [
        "Wall Damage", "Floor Damage", "Stain", "Scratch", 
        "Water Damage", "Paint Damage", "Fixture Damage"
    ]
    
    @classmethod
    def detect_damage(cls, image_data: np.ndarray) -> List[Dict[str, Any]]:
        """Mock damage detection with realistic results"""
        # Simulate processing time
        import time
        time.sleep(1)
        
        # Generate 0-3 random detections
        num_detections = np.random.randint(0, 4)
        detections = []
        
        height, width = image_data.shape[:2]
        
        for i in range(num_detections):
            # Random bounding box
            x = np.random.randint(0, width - 100)
            y = np.random.randint(0, height - 100)
            w = np.random.randint(50, min(200, width - x))
            h = np.random.randint(50, min(150, height - y))
            
            damage_type = np.random.choice(cls.damage_types)
            confidence = float(np.random.uniform(0.65, 0.95))
            severity = np.random.choice(['low', 'medium', 'high'], p=[0.5, 0.3, 0.2])
            
            detection = {
                "id": f"det_{i+1}_{int(time.time())}",
                "type": damage_type,
                "confidence": confidence,
                "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                "severity": severity,
                "description": cls._generate_description(damage_type, severity),
                "confirmed": False
            }
            detections.append(detection)
        
        return detections
    
    @staticmethod
    def _generate_description(damage_type: str, severity: str) -> str:
        """Generate realistic damage descriptions"""
        descriptions = {
            "Wall Damage": {
                "low": "Minor scuff marks or small nail holes",
                "medium": "Small hole or dent in drywall", 
                "high": "Large hole or significant structural damage"
            },
            "Floor Damage": {
                "low": "Light surface scratches",
                "medium": "Visible scratches or small gouges",
                "high": "Deep gouges or damaged floorboards"
            },
            "Stain": {
                "low": "Light discoloration or minor staining",
                "medium": "Noticeable stain requiring treatment",
                "high": "Severe staining requiring replacement"
            },
            "Scratch": {
                "low": "Superficial surface scratches",
                "medium": "Visible scratches through finish",
                "high": "Deep scratches requiring refinishing"
            }
        }
        
        return descriptions.get(damage_type, {}).get(severity, f"{severity.title()} {damage_type.lower()}")

def base64_to_image(base64_string: str) -> np.ndarray:
    """Convert base64 string to OpenCV image"""
    # Remove data URL prefix if present
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]
    
    # Decode base64
    image_data = base64.b64decode(base64_string)
    
    # Convert to PIL Image
    pil_image = Image.open(io.BytesIO(image_data))
    
    # Convert to OpenCV format
    opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    
    return opencv_image

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "PropertyAI Backend API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/upload-image")
async def upload_image(
    image_data: str = Form(...),
    room: str = Form(...),
    inspection_type: str = Form(...),
    inspection_id: Optional[str] = Form(None)
):
    """Upload and process inspection image"""
    try:
        # Convert base64 to image
        cv_image = base64_to_image(image_data)
        
        # Generate unique photo ID
        photo_id = f"photo_{int(datetime.now().timestamp())}"
        
        # Analyze image quality
        quality_analyzer = ImageQualityAnalyzer()
        blur_score = quality_analyzer.analyze_blur(cv_image)
        exposure_score = quality_analyzer.analyze_exposure(cv_image)
        shake_score = quality_analyzer.analyze_shake(cv_image)
        resolution_ok = quality_analyzer.check_resolution(cv_image)
        
        quality_check = {
            "blur": blur_score > 0.6,
            "exposure": exposure_score > 0.5,
            "shake": shake_score > 0.7,
            "resolution": resolution_ok
        }
        
        # Detect damage
        damage_detector = DamageDetector()
        detections = damage_detector.detect_damage(cv_image)
        
        # Store photo data
        inspection_data["photos"][photo_id] = {
            "id": photo_id,
            "room": room,
            "type": inspection_type,
            "timestamp": datetime.now().isoformat(),
            "quality_check": quality_check,
            "image_data": image_data  # Store for later use
        }
        
        # Store detections
        inspection_data["detections"][photo_id] = detections
        
        return JSONResponse({
            "success": True,
            "photo_id": photo_id,
            "quality_check": quality_check,
            "detections": detections,
            "message": f"Image processed successfully. Found {len(detections)} potential issues."
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

@app.post("/api/analyze-quality")
async def analyze_quality(image_data: str = Form(...)):
    """Real-time image quality analysis"""
    try:
        cv_image = base64_to_image(image_data)
        
        quality_analyzer = ImageQualityAnalyzer()
        blur_score = quality_analyzer.analyze_blur(cv_image)
        exposure_score = quality_analyzer.analyze_exposure(cv_image)
        shake_score = quality_analyzer.analyze_shake(cv_image)
        resolution_ok = quality_analyzer.check_resolution(cv_image)
        
        quality_metrics = {
            "blur": {"score": blur_score, "passed": blur_score > 0.6},
            "exposure": {"score": exposure_score, "passed": exposure_score > 0.5},
            "shake": {"score": shake_score, "passed": shake_score > 0.7},
            "resolution": {"passed": resolution_ok}
        }
        
        overall_quality = all([
            quality_metrics["blur"]["passed"],
            quality_metrics["exposure"]["passed"], 
            quality_metrics["shake"]["passed"],
            quality_metrics["resolution"]["passed"]
        ])
        
        return JSONResponse({
            "success": True,
            "metrics": quality_metrics,
            "overall_quality": overall_quality,
            "recommendations": _generate_quality_recommendations(quality_metrics)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quality analysis failed: {str(e)}")

@app.get("/api/detections/{photo_id}")
async def get_detections(photo_id: str):
    """Retrieve AI damage detections for a photo"""
    if photo_id not in inspection_data["detections"]:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    return JSONResponse({
        "success": True,
        "photo_id": photo_id,
        "detections": inspection_data["detections"][photo_id]
    })

@app.post("/api/inspections")
async def create_inspection(
    property_address: str = Form(...),
    tenant_name: str = Form(...),
    inspection_type: str = Form(...)
):
    """Create new inspection session"""
    inspection_id = f"insp_{int(datetime.now().timestamp())}"
    
    inspection_data["inspections"][inspection_id] = {
        "id": inspection_id,
        "property_address": property_address,
        "tenant_name": tenant_name,
        "inspection_type": inspection_type,
        "created_at": datetime.now().isoformat(),
        "status": "active",
        "photos": []
    }
    
    return JSONResponse({
        "success": True,
        "inspection_id": inspection_id,
        "message": "Inspection created successfully"
    })

@app.get("/api/inspections/{inspection_id}")
async def get_inspection(inspection_id: str):
    """Get inspection details"""
    if inspection_id not in inspection_data["inspections"]:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    return JSONResponse({
        "success": True,
        "inspection": inspection_data["inspections"][inspection_id]
    })

@app.get("/api/reports/{inspection_id}")
async def generate_report(inspection_id: str):
    """Generate inspection report"""
    # Mock report generation
    report = {
        "id": f"RPT-{inspection_id}",
        "inspection_id": inspection_id,
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "total_photos": len([p for p in inspection_data["photos"].values()]),
            "total_issues": sum(len(d) for d in inspection_data["detections"].values()),
            "rooms_inspected": len(set(p["room"] for p in inspection_data["photos"].values())),
            "ai_confidence": 0.89
        },
        "rooms": _generate_room_summary(),
        "recommendations": _generate_recommendations()
    }
    
    return JSONResponse({
        "success": True,
        "report": report
    })

@app.get("/api/reports/{inspection_id}/pdf")
async def download_pdf_report(inspection_id: str):
    """Generate and download PDF report"""
    try:
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font('Arial', 'B', 16)
        
        # Header
        pdf.cell(0, 10, 'PropertyAI Inspection Report', ln=True, align='C')
        pdf.ln(10)
        
        # Report details
        pdf.set_font('Arial', '', 12)
        pdf.cell(0, 8, f'Report ID: RPT-{inspection_id}', ln=True)
        pdf.cell(0, 8, f'Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True)
        pdf.ln(5)
        
        # Summary
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 10, 'Summary', ln=True)
        pdf.set_font('Arial', '', 12)
        
        total_photos = len([p for p in inspection_data["photos"].values()])
        total_issues = sum(len(d) for d in inspection_data["detections"].values())
        
        pdf.cell(0, 8, f'Total Photos Captured: {total_photos}', ln=True)
        pdf.cell(0, 8, f'Issues Detected: {total_issues}', ln=True)
        pdf.cell(0, 8, f'AI Confidence Score: 89%', ln=True)
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
        pdf.output(temp_file.name)
        
        return FileResponse(
            temp_file.name,
            media_type='application/pdf',
            filename=f'inspection_report_{inspection_id}.pdf'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@app.get("/api/estimates/{inspection_id}/csv")
async def export_estimates_csv(inspection_id: str):
    """Export cost estimates to CSV"""
    try:
        # Mock estimate data
        estimates = [
            ["Wall Damage", "Small hole in drywall", "1", "$75.00", "1.5", "$112.50", "Living room repair"],
            ["Stain", "Water stain on ceiling", "1", "$25.00", "1.2", "$30.00", "Kitchen ceiling"],
            ["Scratch", "Floor scratch repair", "2", "$50.00", "1.3", "$130.00", "Bedroom hardwood"]
        ]
        
        # Create CSV content
        csv_content = "Category,Description,Quantity,Unit Cost,Labor Multiplier,Total Cost,Notes\n"
        for estimate in estimates:
            csv_content += ",".join(f'"{field}"' for field in estimate) + "\n"
        
        # Save to temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.csv', mode='w')
        temp_file.write(csv_content)
        temp_file.close()
        
        return FileResponse(
            temp_file.name,
            media_type='text/csv',
            filename=f'repair_estimates_{inspection_id}.csv'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV export failed: {str(e)}")

@app.get("/api/pricing-rules")
async def get_pricing_rules():
    """Get pricing rules for cost estimation"""
    return JSONResponse({
        "success": True,
        "pricing_rules": pricing_rules
    })

def _generate_quality_recommendations(metrics: Dict[str, Any]) -> List[str]:
    """Generate recommendations based on quality metrics"""
    recommendations = []
    
    if not metrics["blur"]["passed"]:
        recommendations.append("Hold the camera steadier to reduce blur")
    if not metrics["exposure"]["passed"]:
        recommendations.append("Improve lighting conditions")
    if not metrics["shake"]["passed"]:
        recommendations.append("Use a tripod or stabilize the camera")
    if not metrics["resolution"]["passed"]:
        recommendations.append("Move closer to ensure adequate resolution")
    
    if not recommendations:
        recommendations.append("Image quality is excellent!")
    
    return recommendations

def _generate_room_summary() -> List[Dict[str, Any]]:
    """Generate summary by room"""
    rooms = {}
    
    for photo_id, photo in inspection_data["photos"].items():
        room = photo["room"]
        if room not in rooms:
            rooms[room] = {"name": room, "photos": 0, "issues": []}
        
        rooms[room]["photos"] += 1
        
        # Add detections for this photo
        if photo_id in inspection_data["detections"]:
            for detection in inspection_data["detections"][photo_id]:
                rooms[room]["issues"].append({
                    "type": detection["type"],
                    "severity": detection["severity"],
                    "description": detection["description"]
                })
    
    return list(rooms.values())

def _generate_recommendations() -> List[str]:
    """Generate inspection recommendations"""
    return [
        "Review all detected damage with property owner",
        "Obtain repair quotes from licensed contractors", 
        "Document resolution of all identified issues",
        "Consider preventive maintenance for high-wear areas"
    ]

# Create data directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Create pricing rules file if it doesn't exist
if not os.path.exists('data/pricing_rules.json'):
    with open('data/pricing_rules.json', 'w') as f:
        json.dump({
            "wall_damage": {"base_cost": 75, "unit": "item", "labor_multiplier": 1.5},
            "floor_damage": {"base_cost": 150, "unit": "sq_ft", "labor_multiplier": 2.0},
            "stain": {"base_cost": 25, "unit": "item", "labor_multiplier": 1.2},
            "scratch": {"base_cost": 50, "unit": "linear_ft", "labor_multiplier": 1.3}
        }, f, indent=2)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )
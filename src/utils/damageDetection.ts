import { Detection } from '../types';

// Mock AI damage detection
// In production, this would integrate with YOLO, TensorFlow, or similar models

export const detectDamage = async (imageData: string): Promise<Detection[]> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock detection results
  const mockDetections: Detection[] = [
    {
      id: '1',
      type: 'Wall Damage',
      confidence: 0.92,
      bbox: { x: 150, y: 200, width: 80, height: 60 },
      severity: 'medium',
      description: 'Small hole in drywall',
      confirmed: false
    },
    {
      id: '2',
      type: 'Stain',
      confidence: 0.87,
      bbox: { x: 300, y: 150, width: 120, height: 90 },
      severity: 'low',
      description: 'Water stain on ceiling',
      confirmed: false
    },
    {
      id: '3',
      type: 'Scratch',
      confidence: 0.78,
      bbox: { x: 50, y: 400, width: 200, height: 20 },
      severity: 'low',
      description: 'Scratch on hardwood floor',
      confirmed: false
    }
  ];
  
  // Randomly return 0-3 detections for variety
  const numDetections = Math.floor(Math.random() * 4);
  return mockDetections.slice(0, numDetections);
};

export const classifyDamage = (detection: Detection): string => {
  // Mock damage classification
  const classifications = {
    'wall': ['Wall Damage', 'Hole', 'Crack', 'Dent'],
    'floor': ['Scratch', 'Stain', 'Scuff', 'Gouge'],
    'ceiling': ['Water Damage', 'Stain', 'Crack'],
    'fixture': ['Damage', 'Wear', 'Malfunction']
  };
  
  // Simple keyword matching for demo
  for (const [category, types] of Object.entries(classifications)) {
    if (types.some(type => detection.type.toLowerCase().includes(type.toLowerCase()))) {
      return category;
    }
  }
  
  return 'general';
};

export const calculateConfidence = (detection: Detection): number => {
  // Mock confidence calculation
  // Real implementation would be based on model outputs
  return Math.round(detection.confidence * 100) / 100;
};

export const filterDetectionsByConfidence = (detections: Detection[], minConfidence: number = 0.7): Detection[] => {
  return detections.filter(detection => detection.confidence >= minConfidence);
};
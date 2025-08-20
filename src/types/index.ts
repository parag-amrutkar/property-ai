export interface Photo {
  id: string;
  imageData: string;
  room: string;
  type: 'move_in' | 'move_out';
  timestamp: string;
  qualityCheck: {
    blur: boolean;
    exposure: boolean;
    shake: boolean;
    resolution: boolean;
  };
}

export interface VideoRecording {
  id: string;
  videoData: string;
  room: string;
  type: 'move_in' | 'move_out';
  timestamp: string;
  duration: number;
  extractedFrames: ExtractedFrame[];
}

export interface ExtractedFrame {
  id: string;
  imageData: string;
  timestamp: number;
  qualityScore: number;
  selected: boolean;
  qualityCheck: {
    blur: boolean;
    exposure: boolean;
    shake: boolean;
    resolution: boolean;
  };
}

export interface Detection {
  id: string;
  type: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  severity: 'low' | 'medium' | 'high';
  description: string;
  confirmed: boolean;
}

export interface InspectionReport {
  id: string;
  propertyAddress: string;
  tenantName: string;
  inspectionType: 'move_in' | 'move_out';
  inspectionDate: string;
  inspectorName: string;
  totalIssues: number;
  summary: string;
  rooms: Array<{
    name: string;
    photos: number;
    issues: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
  }>;
}

export interface RepairItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  laborMultiplier: number;
  totalCost: number;
  notes: string;
}

export interface PricingRule {
  category: string;
  basePrice: number;
  unit: string;
  laborMultiplier: number;
}
import React, { useState } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  Edit3, 
  Save,
  RefreshCw,
  ZoomIn
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { useNavigate } from 'react-router-dom';

interface Detection {
  id: string;
  type: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  severity: 'low' | 'medium' | 'high';
  description: string;
  confirmed: boolean;
}

const Review: React.FC = () => {
  const { photos, selectedFrames } = useInspection();
  const navigate = useNavigate();
  
  // Normalize video frames to match photo interface
  const normalizedFrames = selectedFrames.map(frame => ({
    id: frame.id,
    imageData: frame.imageData,
    room: 'video_frame', // Default room for video frames
    type: 'move_out' as const, // Default type for video frames
    timestamp: new Date(Date.now() - (frame.timestamp * 1000)).toISOString(), // Convert relative timestamp
    qualityCheck: frame.qualityCheck
  }));
  
  const allImages = [...photos, ...normalizedFrames];
  const [selectedImage, setSelectedImage] = useState<string | null>(allImages[0]?.id || null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingDetection, setEditingDetection] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Mock AI damage detection
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

  React.useEffect(() => {
    if (selectedImage && allImages.length > 0) {
      // Simulate AI processing delay
      setIsProcessing(true);
      setTimeout(() => {
        setDetections(mockDetections);
        setIsProcessing(false);
      }, 2000);
    }
  }, [selectedImage]);

  const selectedImageData = allImages.find(img => img.id === selectedImage);

  const confirmDetection = (detectionId: string) => {
    setDetections(prev => 
      prev.map(d => 
        d.id === detectionId 
          ? { ...d, confirmed: true }
          : d
      )
    );
  };

  const rejectDetection = (detectionId: string) => {
    setDetections(prev => prev.filter(d => d.id !== detectionId));
  };

  const updateDetection = (detectionId: string, updates: Partial<Detection>) => {
    setDetections(prev => 
      prev.map(d => 
        d.id === detectionId 
          ? { ...d, ...updates }
          : d
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (allImages.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Images to Review
          </h3>
          <p className="text-gray-600 mb-4">
            Record videos or capture photos first to see AI damage detection in action.
          </p>
          <button
            onClick={() => window.location.href = '/capture'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Start Recording
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          AI Detection Review
        </h1>
        <p className="mt-2 text-gray-600">
          Review and confirm AI-detected damage in your inspection images
        </p>
      </div>

      {/* Generate Report Button */}
      {allImages.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Ready to Generate Report
              </h2>
              <p className="text-sm text-gray-600">
                Complete your review and generate a comprehensive inspection report
              </p>
            </div>
            <button
              onClick={() => navigate('/report')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
            >
              <span>Generate Report</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Captured Images ({allImages.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {photos.length} photos • {selectedFrames.length} video frames
              </p>
            </div>
            <div className="p-4 space-y-2">
              {allImages.map((image) => {
                const isFrame = 'qualityScore' in image;
                return (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedImage === image.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={image.imageData}
                      alt=""
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.room === 'video_frame' ? 'VIDEO FRAME' : image.room.replace('_', ' ').toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {image.type.replace('_', '-').toUpperCase()}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                        {image.room === 'video_frame' && (
                          <span className="bg-purple-100 text-purple-800 px-1 rounded">
                            Frame
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
              })}
            </div>
          </div>
        </div>

        {/* Main Review Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedImageData && (
            <>
              {/* Image Display with Detections */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedImageData.room === 'video_frame' ? 'Video Frame' : selectedImageData.room.replace('_', ' ')} - {selectedImageData.type.replace('_', '-')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedImageData.timestamp).toLocaleString()}
                      {selectedImageData.room === 'video_frame' && (
                        <span className="ml-2 text-purple-600">
                          • Video Frame
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoomedImage(selectedImageData.imageData)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={selectedImageData.imageData}
                    alt=""
                    className="w-full h-96 object-contain bg-gray-50"
                  />
                  
                  {/* Detection Overlays */}
                  {!isProcessing && detections.map((detection) => (
                    <div
                      key={detection.id}
                      className={`absolute border-2 ${
                        detection.confirmed 
                          ? 'border-green-500' 
                          : 'border-red-500'
                      }`}
                      style={{
                        left: `${(detection.bbox.x / 640) * 100}%`,
                        top: `${(detection.bbox.y / 480) * 100}%`,
                        width: `${(detection.bbox.width / 640) * 100}%`,
                        height: `${(detection.bbox.height / 480) * 100}%`,
                      }}
                    >
                      <div className={`absolute -top-8 left-0 px-2 py-1 text-xs font-medium rounded ${
                        detection.confirmed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {detection.type} ({Math.round(detection.confidence * 100)}%)
                      </div>
                    </div>
                  ))}

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="bg-white rounded-lg p-6 text-center">
                        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          AI Processing...
                        </p>
                        <p className="text-sm text-gray-600">
                          Analyzing image for damage detection
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Detection Results */}
              {!isProcessing && detections.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Detected Issues ({detections.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {detections.map((detection) => (
                      <div key={detection.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {detection.type}
                              </h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(detection.severity)}`}>
                                {detection.severity.toUpperCase()}
                              </span>
                              <span className={`text-sm font-medium ${getConfidenceColor(detection.confidence)}`}>
                                {Math.round(detection.confidence * 100)}% confidence
                              </span>
                            </div>
                            
                            {editingDetection === detection.id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={detection.description}
                                  onChange={(e) => updateDetection(detection.id, { description: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex items-center space-x-4">
                                  <select
                                    value={detection.severity}
                                    onChange={(e) => updateDetection(detection.id, { severity: e.target.value as 'low' | 'medium' | 'high' })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                  <button
                                    onClick={() => setEditingDetection(null)}
                                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                                  >
                                    <Save className="h-4 w-4" />
                                    <span>Save</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-gray-700">{detection.description}</p>
                                <button
                                  onClick={() => setEditingDetection(detection.id)}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {detection.confirmed ? (
                              <span className="flex items-center space-x-1 text-green-600">
                                <Check className="h-5 w-5" />
                                <span className="text-sm font-medium">Confirmed</span>
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => confirmDetection(detection.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Confirm detection"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => rejectDetection(detection.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Reject detection"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Detections */}
              {!isProcessing && detections.length === 0 && (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Issues Detected
                  </h3>
                  <p className="text-gray-600">
                    The AI analysis didn't find any damage in this photo.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={zoomedImage}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
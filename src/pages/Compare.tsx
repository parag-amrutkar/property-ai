import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff,
  RotateCcw,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';

interface ComparisonData {
  room: string;
  moveInPhoto: string;
  moveOutPhoto: string;
  moveInDate: string;
  moveOutDate: string;
  changes: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
  }>;
}

const Compare: React.FC = () => {
  const { photos } = useInspection();
  const [selectedComparison, setSelectedComparison] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'slider'>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [showDifferences, setShowDifferences] = useState(true);

  // Mock comparison data
  const mockComparisons: ComparisonData[] = [
    {
      room: 'Living Room',
      moveInPhoto: 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveOutPhoto: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveInDate: '2024-01-15',
      moveOutDate: '2025-01-08',
      changes: [
        {
          type: 'Wall Damage',
          description: 'New hole in drywall near entrance',
          severity: 'medium',
          confidence: 0.92
        },
        {
          type: 'Furniture Marks',
          description: 'Indentations on carpet from heavy furniture',
          severity: 'low',
          confidence: 0.78
        }
      ]
    },
    {
      room: 'Kitchen',
      moveInPhoto: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveOutPhoto: 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveInDate: '2024-01-15',
      moveOutDate: '2025-01-08',
      changes: [
        {
          type: 'Stain',
          description: 'Water stain on ceiling above sink',
          severity: 'low',
          confidence: 0.85
        }
      ]
    },
    {
      room: 'Bedroom',
      moveInPhoto: 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveOutPhoto: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      moveInDate: '2024-01-15',
      moveOutDate: '2025-01-08',
      changes: []
    }
  ];

  const currentComparison = mockComparisons[selectedComparison];

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

  const ViewModeButton: React.FC<{ 
    mode: typeof viewMode; 
    current: typeof viewMode; 
    onClick: () => void; 
    children: React.ReactNode;
  }> = ({ mode, current, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        current === mode
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  );

  if (mockComparisons.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Comparisons Available
          </h3>
          <p className="text-gray-600 mb-4">
            You need both move-in and move-out photos to perform comparisons.
          </p>
          <button
            onClick={() => window.location.href = '/capture'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Capture Photos
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
          Photo Comparison
        </h1>
        <p className="mt-2 text-gray-600">
          Compare move-in and move-out photos to identify changes and damage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Room Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Room Comparisons
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {mockComparisons.map((comparison, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedComparison(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedComparison === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {comparison.room}
                      </span>
                      {comparison.changes.length > 0 ? (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {comparison.changes.length} changes
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          No changes
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      <p>Move-in: {new Date(comparison.moveInDate).toLocaleDateString()}</p>
                      <p>Move-out: {new Date(comparison.moveOutDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Comparison Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* View Mode Controls */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentComparison.room} Comparison
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(currentComparison.moveInDate).toLocaleDateString()} to{' '}
                      {new Date(currentComparison.moveOutDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <ViewModeButton
                  mode="side-by-side"
                  current={viewMode}
                  onClick={() => setViewMode('side-by-side')}
                >
                  Side by Side
                </ViewModeButton>
                <ViewModeButton
                  mode="overlay"
                  current={viewMode}
                  onClick={() => setViewMode('overlay')}
                >
                  Overlay
                </ViewModeButton>
                <ViewModeButton
                  mode="slider"
                  current={viewMode}
                  onClick={() => setViewMode('slider')}
                >
                  Slider
                </ViewModeButton>
                <button
                  onClick={() => setShowDifferences(!showDifferences)}
                  className={`p-2 rounded-lg transition-colors ${
                    showDifferences
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  title={showDifferences ? 'Hide differences' : 'Show differences'}
                >
                  {showDifferences ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Photo Comparison Display */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              {viewMode === 'side-by-side' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Move-In ({new Date(currentComparison.moveInDate).toLocaleDateString()})
                    </div>
                    <img
                      src={currentComparison.moveInPhoto}
                      alt="Move-in"
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Move-Out ({new Date(currentComparison.moveOutDate).toLocaleDateString()})
                    </div>
                    <img
                      src={currentComparison.moveOutPhoto}
                      alt="Move-out"
                      className="w-full h-96 object-cover"
                    />
                    
                    {/* Mock difference indicators */}
                    {showDifferences && currentComparison.changes.length > 0 && (
                      <>
                        <div className="absolute top-1/3 left-1/4 w-8 h-8 border-2 border-red-500 bg-red-500 bg-opacity-25 rounded-full animate-pulse" />
                        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 border-2 border-yellow-500 bg-yellow-500 bg-opacity-25 rounded-full animate-pulse" />
                      </>
                    )}
                  </div>
                </div>
              )}

              {viewMode === 'overlay' && (
                <div className="relative h-96">
                  <img
                    src={currentComparison.moveInPhoto}
                    alt="Move-in"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <img
                    src={currentComparison.moveOutPhoto}
                    alt="Move-out"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: overlayOpacity / 100 }}
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
                    <div className="flex items-center space-x-4 text-white">
                      <span className="text-sm font-medium">Move-In</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium">Move-Out</span>
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'slider' && (
                <div className="relative h-96 overflow-hidden">
                  <div className="relative w-full h-full">
                    <img
                      src={currentComparison.moveInPhoto}
                      alt="Move-in"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img
                        src={currentComparison.moveOutPhoto}
                        alt="Move-out"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Slider Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <ArrowLeft className="h-3 w-3 text-gray-600 absolute left-1" />
                        <ArrowRight className="h-3 w-3 text-gray-600 absolute right-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Slider Controls */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Changes Summary */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Detected Changes ({currentComparison.changes.length})
              </h3>
            </div>
            
            <div className="p-4">
              {currentComparison.changes.length > 0 ? (
                <div className="space-y-3">
                  {currentComparison.changes.map((change, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {change.type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(change.severity)}`}>
                            {change.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-600">
                            {Math.round(change.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Changes Detected
                  </h4>
                  <p className="text-gray-600">
                    The AI analysis found no significant changes between move-in and move-out photos for this room.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedComparison(Math.max(0, selectedComparison - 1))}
              disabled={selectedComparison === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Room</span>
            </button>
            
            <span className="text-sm text-gray-600">
              {selectedComparison + 1} of {mockComparisons.length}
            </span>
            
            <button
              onClick={() => setSelectedComparison(Math.min(mockComparisons.length - 1, selectedComparison + 1))}
              disabled={selectedComparison === mockComparisons.length - 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Room</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
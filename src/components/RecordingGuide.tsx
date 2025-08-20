import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Lightbulb, 
  Target, 
  Clock, 
  Zap,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  ArrowRight,
  Eye,
  RotateCcw,
  MapPin
} from 'lucide-react';

interface RecordingGuideProps {
  isRecording: boolean;
  isStreamActive: boolean;
  recordingDuration: number;
  captureMode: 'video' | 'photo';
  selectedRoom: string;
  isCapturing?: boolean;
  qualityCheck?: any;
}

const RecordingGuide: React.FC<RecordingGuideProps> = ({
  isRecording,
  isStreamActive,
  recordingDuration,
  captureMode,
  selectedRoom,
  isCapturing = false,
  qualityCheck
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const videoRecordingSteps = [
    {
      icon: Play,
      title: "START AT THE ENTRANCE",
      instruction: "Begin recording from the doorway with a wide view of the entire room",
      duration: { start: 0, end: 5 },
      tips: ["Hold phone horizontally", "Keep camera steady", "Show the entire room"],
      color: "bg-blue-500"
    },
    {
      icon: ArrowRight,
      title: "SCAN LEFT TO RIGHT",
      instruction: "Slowly pan from left to right, pausing 3 seconds on each wall section",
      duration: { start: 5, end: 15 },
      tips: ["Move very slowly", "Pause on each section", "Keep walls in frame"],
      color: "bg-purple-500"
    },
    {
      icon: Target,
      title: "FOCUS ON DETAILS",
      instruction: "Get closer to walls, corners, and fixtures to capture potential damage",
      duration: { start: 15, end: 25 },
      tips: ["Move closer to walls", "Check corners carefully", "Include all fixtures"],
      color: "bg-orange-500"
    },
    {
      icon: Eye,
      title: "CHECK FLOORS & CEILING",
      instruction: "Tilt camera down to scan floors, then up to check ceiling areas",
      duration: { start: 25, end: 35 },
      tips: ["Scan entire floor surface", "Look for ceiling stains", "Check light fixtures"],
      color: "bg-green-500"
    },
    {
      icon: RotateCcw,
      title: "FINAL OVERVIEW",
      instruction: "Return to entrance position for a final wide shot of the complete room",
      duration: { start: 35, end: 45 },
      tips: ["Wide angle view", "Show room context", "Ensure good lighting"],
      color: "bg-teal-500"
    },
    {
      icon: CheckCircle,
      title: "RECORDING COMPLETE",
      instruction: "Excellent! You can stop recording now - you have comprehensive coverage",
      duration: { start: 45, end: 999 },
      tips: ["Great job!", "Stop when ready", "AI will extract best frames"],
      color: "bg-green-600"
    }
  ];

  const photoSteps = [
    {
      icon: Camera,
      title: "FRAME YOUR SHOT",
      instruction: "Center the area you want to document in your camera viewfinder",
      tips: ["Fill the frame", "Avoid cutting off edges", "Include context around damage"],
      color: "bg-blue-500"
    },
    {
      icon: Lightbulb,
      title: "CHECK LIGHTING",
      instruction: "Ensure you have good, even lighting without harsh shadows",
      tips: ["Avoid direct sunlight", "Turn on room lights", "No flash needed"],
      color: "bg-yellow-500"
    },
    {
      icon: Target,
      title: "HOLD STEADY",
      instruction: "Keep the camera perfectly still for 2-3 seconds, then capture",
      tips: ["Use both hands", "Brace against wall if needed", "Take a deep breath"],
      color: "bg-green-500"
    }
  ];

  const roomSpecificInstructions = {
    living_room: {
      priority_areas: ["Walls around furniture placement", "Carpet/flooring wear patterns", "Window areas and treatments", "Entertainment center wall"],
      common_issues: ["Furniture indentations", "Wall holes from mounting", "Carpet stains", "Scuff marks"]
    },
    bedroom: {
      priority_areas: ["Walls around bed area", "Closet doors and interiors", "Window and blinds", "Floor under furniture areas"],
      common_issues: ["Carpet impressions", "Wall holes from decor", "Closet damage", "Window treatment issues"]
    },
    kitchen: {
      priority_areas: ["All appliances", "Countertops and backsplash", "Cabinet doors and drawers", "Floor around cooking areas"],
      common_issues: ["Appliance damage", "Counter stains", "Cabinet wear", "Floor stains from spills"]
    },
    bathroom: {
      priority_areas: ["Toilet and surrounding area", "Tub/shower and tiles", "Vanity and mirror", "Floor and baseboards"],
      common_issues: ["Water damage", "Tile/grout issues", "Fixture problems", "Mold or mildew"]
    }
  };

  const currentRoomInfo = roomSpecificInstructions[selectedRoom as keyof typeof roomSpecificInstructions];
  
  // Get current step for video recording
  const getCurrentStep = () => {
    return videoRecordingSteps.find(step => 
      recordingDuration >= step.duration.start && recordingDuration < step.duration.end
    ) || videoRecordingSteps[videoRecordingSteps.length - 1];
  };

  const currentStep = getCurrentStep();
  const currentPhotoStep = photoSteps[currentStepIndex] || photoSteps[0];

  // Update current step and create blinking effect for step changes
  useEffect(() => {
    if (captureMode === 'video' && isRecording) {
      const newStepIndex = videoRecordingSteps.findIndex(step => 
        recordingDuration >= step.duration.start && recordingDuration < step.duration.end
      );
      
      if (newStepIndex !== -1 && newStepIndex !== currentStepIndex) {
        setCurrentStepIndex(newStepIndex);
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 1000);
      }
    }
  }, [recordingDuration, isRecording, captureMode, currentStepIndex]);

  // Auto-expand when recording starts
  useEffect(() => {
    if (isRecording || isCapturing) {
      setIsExpanded(true);
    }
  }, [isRecording, isCapturing]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg transition-colors ${
            isRecording ? 'bg-red-100 animate-pulse' : 
            isCapturing ? 'bg-green-100' :
            isStreamActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            {captureMode === 'video' ? (
              <Video className={`h-5 w-5 ${
                isRecording ? 'text-red-600' : isStreamActive ? 'text-blue-600' : 'text-gray-600'
              }`} />
            ) : (
              <Camera className={`h-5 w-5 ${
                isCapturing ? 'text-green-600' :
                isStreamActive ? 'text-blue-600' : 'text-gray-600'
              }`} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isRecording ? 'Recording Instructions' : 
               isCapturing ? 'Photo Instructions' :
               captureMode === 'video' ? 'Video Recording Guide' : 'Photo Capture Guide'}
            </h3>
            <p className="text-sm text-gray-600">
              {isRecording ? `Step ${currentStepIndex + 1}/6 • ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}` : 
               isCapturing ? 'Follow the steps for best quality' :
               isStreamActive ? 'Camera ready - follow guide below' : 'Tips for best results'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {(isRecording || isCapturing) && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isRecording ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {isRecording ? 'RECORDING' : 'CAPTURING'}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Current Active Instruction */}
          {(isRecording || isCapturing) && (
            <div className={`border-2 border-dashed rounded-lg p-4 transition-all duration-500 ${
              isBlinking ? 'border-yellow-400 bg-yellow-50' : 
              isRecording ? `border-red-400 bg-red-50` : 'border-green-400 bg-green-50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  isRecording ? currentStep.color : 'bg-green-500'
                } flex-shrink-0`}>
                  {isRecording ? (
                    <currentStep.icon className="h-6 w-6 text-white" />
                  ) : (
                    <currentPhotoStep.icon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {isRecording ? currentStep.title : currentPhotoStep.title}
                  </h3>
                  <p className="text-base text-gray-800 mb-3">
                    {isRecording ? currentStep.instruction : currentPhotoStep.instruction}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(isRecording ? currentStep.tips : currentPhotoStep.tips).map((tip, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        • {tip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recording Progress Bar for Video */}
          {captureMode === 'video' && isRecording && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Recording Progress</span>
                <span className="text-sm text-gray-600">{formatDuration(recordingDuration)} / 45s recommended</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((recordingDuration / 45) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Start</span>
                <span>Scan</span>
                <span>Details</span>
                <span>Floors</span>
                <span>Final</span>
                <span>Complete</span>
              </div>
            </div>
          )}

          {/* Room-Specific Instructions */}
          {currentRoomInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {selectedRoom.replace('_', ' ').toUpperCase()} - PRIORITY AREAS
              </h4>
              
              {isRecording || isCapturing ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-2">Focus on these areas:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentRoomInfo.priority_areas.map((area, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-2">Watch for common issues:</p>
                    <div className="flex flex-wrap gap-2">
                      {currentRoomInfo.common_issues.map((issue, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-blue-800">
                  When you start {captureMode === 'video' ? 'recording' : 'capturing'}, focus on: {currentRoomInfo.priority_areas.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Video Recording Steps Overview */}
          {captureMode === 'video' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Recording Steps</span>
                {isRecording && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
              </h4>
              
              <div className="space-y-2">
                {videoRecordingSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCurrentStep = isRecording && 
                    recordingDuration >= step.duration.start && 
                    recordingDuration < step.duration.end;
                  const isCompleted = isRecording && recordingDuration > step.duration.end;
                  const isUpcoming = isRecording && recordingDuration < step.duration.start;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                        isCurrentStep ? `${step.color.replace('500', '50')} border-2 ${step.color.replace('bg-', 'border-').replace('500', '400')} animate-pulse` : 
                        isCompleted ? 'bg-green-50 border border-green-200' : 
                        isUpcoming ? 'bg-gray-50 border border-gray-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isCurrentStep ? step.color : 
                        isCompleted ? 'bg-green-500' : 
                        'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Icon className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-bold ${
                            isCurrentStep ? 'text-gray-900' : 
                            isCompleted ? 'text-green-800' : 
                            'text-gray-600'
                          }`}>
                            Step {index + 1}: {step.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {step.duration.start}-{step.duration.end}s
                          </span>
                          {isCurrentStep && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                              NOW
                            </span>
                          )}
                        </div>
                        {isCurrentStep && (
                          <p className="text-sm text-gray-700 font-medium">
                            {step.instruction}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photo Capture Steps */}
          {captureMode === 'photo' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Photo Capture Steps</span>
                {isCapturing && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse">
                    CAPTURING
                  </span>
                )}
              </h4>
              
              <div className="space-y-2">
                {photoSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCurrentPhotoStep = isCapturing && index === currentStepIndex;
                  const isCompletedPhoto = isCapturing && index < currentStepIndex;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isCurrentPhotoStep ? `${step.color.replace('500', '50')} border-2 ${step.color.replace('bg-', 'border-').replace('500', '400')}` : 
                        isCompletedPhoto ? 'bg-green-50 border border-green-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isCurrentPhotoStep ? step.color : 
                        isCompletedPhoto ? 'bg-green-500' : 
                        'bg-gray-300'
                      }`}>
                        {isCompletedPhoto ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Icon className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-sm font-bold ${
                            isCurrentPhotoStep ? 'text-gray-900' : 
                            isCompletedPhoto ? 'text-green-800' : 
                            'text-gray-600'
                          }`}>
                            {step.title}
                          </span>
                          {isCurrentPhotoStep && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              NOW
                            </span>
                          )}
                        </div>
                        {isCurrentPhotoStep && (
                          <p className="text-sm text-gray-700 font-medium">
                            {step.instruction}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real-time Quality Feedback */}
          {qualityCheck && isCapturing && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Live Quality Check</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(qualityCheck).map(([key, passed]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      passed ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages Based on Recording State */}
          {isStreamActive && (
            <div className="space-y-2">
              {!isRecording && !isCapturing ? (
                <div className="flex items-center space-x-3 text-blue-700 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Camera Ready</p>
                    <p className="text-sm">Press the {captureMode === 'video' ? 'record' : 'capture'} button to begin following the guide above</p>
                  </div>
                </div>
              ) : isRecording && recordingDuration < 10 ? (
                <div className="flex items-center space-x-3 text-red-700 bg-red-50 rounded-lg p-4 border border-red-200">
                  <Play className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Recording Started</p>
                    <p className="text-sm">Great! Now follow the step-by-step guide above. Take your time and move slowly.</p>
                  </div>
                </div>
              ) : isRecording && recordingDuration < 30 ? (
                <div className="flex items-center space-x-3 text-purple-700 bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <Target className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Perfect Progress</p>
                    <p className="text-sm">You're doing great! Continue following the current step above for best AI analysis results.</p>
                  </div>
                </div>
              ) : isRecording && recordingDuration < 45 ? (
                <div className="flex items-center space-x-3 text-green-700 bg-green-50 rounded-lg p-4 border border-green-200">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Excellent Coverage</p>
                    <p className="text-sm">You have comprehensive room coverage. Complete the final step or stop recording when ready.</p>
                  </div>
                </div>
              ) : isRecording ? (
                <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <Clock className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Long Recording Detected</p>
                    <p className="text-sm">You can stop recording now - you have more than enough footage for AI frame extraction.</p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Quality Requirements Checklist */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Quality Checklist</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-800">Lighting & Exposure</h5>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Room lights turned on</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Avoid direct sunlight</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">No harsh shadows</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-800">Camera Technique</h5>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Hold device steady</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Move slowly and smoothly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Maintain proper distance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips for Active Recording */}
          {(isRecording || isCapturing) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                QUICK TIPS WHILE {isRecording ? 'RECORDING' : 'CAPTURING'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-800">
                <div>✓ Move at walking pace or slower</div>
                <div>✓ Pause 2-3 seconds on each area</div>
                <div>✓ Keep camera level with your target</div>
                <div>✓ Ensure good lighting on subject</div>
                {captureMode === 'video' && (
                  <>
                    <div>✓ Get close-ups of any visible damage</div>
                    <div>✓ Include wide shots for context</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default RecordingGuide;
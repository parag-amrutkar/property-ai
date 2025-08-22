import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Camera, 
  Play, 
  Square, 
  RotateCcw,
  Upload,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Trash2,
  Settings,
  Smartphone
} from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { extractFramesFromVideo, analyzeImageQuality } from '../utils/imageProcessing';
import RecordingGuide from '../components/RecordingGuide';
import { VideoRecording, ExtractedFrame } from '../types';

const Capture: React.FC = () => {
  const { addVideo, addSelectedFrame } = useInspection();
  const navigate = useNavigate();
  const [captureMode, setCaptureMode] = useState<'video' | 'photo'>('video');
  const [selectedRoom, setSelectedRoom] = useState('living_room');
  const [inspectionType, setInspectionType] = useState<'move_in' | 'move_out'>('move_out');
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<Set<string>>(new Set());
  const [currentVideo, setCurrentVideo] = useState<VideoRecording | null>(null);
  const [qualityCheck, setQualityCheck] = useState<any>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const rooms = [
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'dining_room', label: 'Dining Room' },
    { value: 'office', label: 'Office' },
  ];

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Simplified media constraints for better compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        },
        audio: false
      });
      
      console.log('Stream acquired:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready and then play
        videoRef.current.onloadedmetadata = async () => {
          console.log('Video metadata loaded');
          try {
            if (videoRef.current) {
              await videoRef.current.play();
              console.log('Video playing successfully');
            }
          } catch (playError) {
            console.warn('Autoplay prevented, user interaction may be required:', playError);
          }
        };
      }
      
      setIsStreamActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please check your camera settings and permissions.';
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    recordedChunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      await processRecordedVideo(videoBlob);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingDuration(0);

    // Start duration counter
    intervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const processRecordedVideo = async (videoBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Create video recording object
      const videoId = `video_${Date.now()}`;
      const videoDataUrl = URL.createObjectURL(videoBlob);
      
      // Extract frames from video
      const frames = await extractFramesFromVideo(videoBlob);
      
      const videoRecording: VideoRecording = {
        id: videoId,
        videoData: videoDataUrl,
        room: selectedRoom,
        type: inspectionType,
        timestamp: new Date().toISOString(),
        duration: recordingDuration,
        extractedFrames: frames
      };

      // Add to context
      addVideo(videoRecording);
      setCurrentVideo(videoRecording);
      setExtractedFrames(frames);
      
      // Auto-select high quality frames
      const highQualityFrames = frames.filter(frame => frame.qualityScore > 0.8);
      // If no high quality frames, select top 3 frames by quality
      const framesToSelect = highQualityFrames.length > 0 
        ? highQualityFrames 
        : frames.sort((a, b) => b.qualityScore - a.qualityScore).slice(0, 3);
      setSelectedFrames(new Set(framesToSelect.map(frame => frame.id)));
      
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFrameSelection = (frameId: string) => {
    setSelectedFrames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(frameId)) {
        newSet.delete(frameId);
      } else {
        newSet.add(frameId);
      }
      return newSet;
    });
  };

  const confirmFrameSelection = () => {
    const framesToAdd = extractedFrames.filter(frame => selectedFrames.has(frame.id));
    framesToAdd.forEach(frame => addSelectedFrame(frame));
    
    // Clear current video state
    setCurrentVideo(null);
    setExtractedFrames([]);
    setSelectedFrames(new Set());
    
    // Navigate to review page
    navigate('/review');
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !streamRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Analyze quality
    const quality = await analyzeImageQuality(imageData);
    setQualityCheck(quality);
    
    // Create photo object
    const photo = {
      id: `photo_${Date.now()}`,
      imageData,
      room: selectedRoom,
      type: inspectionType,
      timestamp: new Date().toISOString(),
      qualityCheck: quality
    };

    // Add to context (you might need to add addPhoto method to context)
    console.log('Photo captured:', photo);
    alert('Photo captured successfully!');
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Property Inspection Capture
        </h1>
        <p className="mt-3 text-lg text-gray-600 font-medium">
          Record video walkthroughs or capture photos for AI-powered damage detection
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Capture Mode */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
              Capture Mode
            </label>
            <div className="flex rounded-xl border border-gray-200 p-1 bg-gray-50">
              <button
                onClick={() => setCaptureMode('video')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                  captureMode === 'video'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setCaptureMode('photo')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                  captureMode === 'photo'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Photo</span>
              </button>
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
              Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="input-field"
            >
              {rooms.map((room) => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
            </select>
          </div>

          {/* Inspection Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
              Inspection Type
            </label>
            <select
              value={inspectionType}
              onChange={(e) => setInspectionType(e.target.value as 'move_in' | 'move_out')}
              className="input-field"
            >
              <option value="move_in">Move-In</option>
              <option value="move_out">Move-Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recording Guide */}
      <RecordingGuide
        isRecording={isRecording}
        isStreamActive={isStreamActive}
        recordingDuration={recordingDuration}
        captureMode={captureMode}
        selectedRoom={selectedRoom}
        isCapturing={false}
        qualityCheck={qualityCheck}
      />

      {/* Camera Feed */}
      <div className="card overflow-hidden p-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Camera Feed
            </h3>
            <div className="flex items-center space-x-2">
              {isRecording && (
                <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-xl border border-red-100">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold">
                    {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-xs text-gray-500 font-semibold">
                <Smartphone className="h-4 w-4" />
                <span>Hold horizontally for best results</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {!isStreamActive ? (
            <div className="h-96 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  Camera Access Required
                </h3>
                <p className="text-gray-600 mb-6 font-medium">
                  Allow camera access to begin inspection capture
                </p>
                <button
                  onClick={startCamera}
                  className="btn-primary"
                >
                  Enable Camera
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                controls={false}
                style={{ 
                  width: '100%', 
                  height: '384px', 
                  objectFit: 'cover',
                  backgroundColor: '#000'
                }}
                className="w-full h-96 object-cover"
                onClick={() => {
                  // Allow user to manually start video if autoplay fails
                  if (videoRef.current && videoRef.current.paused) {
                    videoRef.current.play().catch(console.error);
                  }
                }}
              />
              
              {/* Click to play overlay if video is paused */}
              {isStreamActive && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => {
                    if (videoRef.current && videoRef.current.paused) {
                      videoRef.current.play().catch(console.error);
                    }
                  }}
                >
                  <div className="bg-white bg-opacity-20 text-white p-4 rounded-full backdrop-blur-sm">
                    <Play className="h-8 w-8" />
                  </div>
                </div>
              )}</function>
              
              {/* Recording Overlay */}
              {isRecording && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-3 rounded-xl flex items-center space-x-3 shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-bold text-sm tracking-wide">RECORDING</span>
                </div>
              )}

              {/* Recording Controls */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-6">
                  {captureMode === 'video' ? (
                    <>
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="bg-red-500 hover:bg-red-600 text-white p-5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                        >
                          <Play className="h-7 w-7" />
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="bg-gray-700 hover:bg-gray-800 text-white p-5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                        >
                          <Square className="h-7 w-7" />
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={capturePhoto}
                      className="bg-primary-600 hover:bg-primary-700 text-white p-5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl"
                    >
                      <Camera className="h-7 w-7" />
                    </button>
                  )}
                  
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg transition-all duration-200"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Processing */}
      {isProcessing && (
        <div className="card">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
              Processing Video...
            </h3>
            <p className="text-gray-600 font-medium">
              Extracting frames and analyzing quality for AI detection
            </p>
          </div>
        </div>
      )}

      {/* Frame Selection */}
      {extractedFrames.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Extracted Frames ({extractedFrames.length})
                </h3>
                <p className="text-sm text-gray-600 font-semibold mt-1">
                  Select the best frames for AI analysis • {selectedFrames.size} selected
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    const highQualityFrames = extractedFrames.filter(frame => frame.qualityScore > 0.8);
                    setSelectedFrames(new Set(highQualityFrames.map(frame => frame.id)));
                  }}
                  className="text-primary-600 hover:text-primary-700 text-sm font-bold transition-colors"
                >
                  Select High Quality
                </button>
                <button
                  onClick={() => setSelectedFrames(new Set())}
                  className="text-gray-500 hover:text-gray-700 text-sm font-bold transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={confirmFrameSelection}
                  disabled={selectedFrames.size === 0}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:cursor-not-allowed"
                >
                  Submit for Review →
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {extractedFrames.map((frame) => (
                <div
                  key={frame.id}
                  onClick={() => toggleFrameSelection(frame.id)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedFrames.has(frame.id)
                      ? 'border-primary-500 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <img
                    src={frame.imageData}
                    alt=""
                    className="w-full h-28 object-cover"
                  />
                  
                  {/* Selection Indicator */}
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedFrames.has(frame.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-white bg-opacity-90 text-gray-600'
                  }`}>
                    {selectedFrames.has(frame.id) && <CheckCircle className="h-4 w-4" />}
                  </div>

                  {/* Quality Score */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {Math.round(frame.qualityScore * 100)}%
                  </div>

                  {/* Timestamp */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {Math.round(frame.timestamp)}s
                  </div>

                  {/* Quality Indicators */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {Object.entries(frame.qualityCheck).map(([key, passed]) => (
                      <div
                        key={key}
                        className={`w-2.5 h-2.5 rounded-full ${
                          passed ? 'bg-primary-500' : 'bg-red-500'
                        }`}
                        title={`${key}: ${passed ? 'Good' : 'Poor'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
        <h3 className="font-bold text-primary-900 mb-4 flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>How It Works</span>
        </h3>
        <div className="space-y-3 text-sm text-primary-800 font-semibold">
          <p>1. <strong className="font-bold">Select room and inspection type</strong> above</p>
          <p>2. <strong className="font-bold">Enable camera</strong> and position your device horizontally</p>
          <p>3. <strong className="font-bold">Start recording</strong> and follow the dynamic guide for best results</p>
          <p>4. <strong className="font-bold">Review extracted frames</strong> and select the best ones for AI analysis</p>
          <p>5. <strong className="font-bold">Proceed to Review</strong> to confirm AI-detected damage</p>
        </div>
      </div>
    </div>
  );
};

export default Capture;
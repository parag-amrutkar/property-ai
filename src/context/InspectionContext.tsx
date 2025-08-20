import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VideoRecording, ExtractedFrame } from '../types';

interface Photo {
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

interface InspectionContextType {
  photos: Photo[];
  videos: VideoRecording[];
  selectedFrames: ExtractedFrame[];
  addPhoto: (photo: Photo) => void;
  addVideo: (video: VideoRecording) => void;
  addSelectedFrame: (frame: ExtractedFrame) => void;
  removeSelectedFrame: (frameId: string) => void;
  removePhoto: (photoId: string) => void;
  clearPhotos: () => void;
  clearVideos: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};

export const InspectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<VideoRecording[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<ExtractedFrame[]>([]);

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [...prev, photo]);
  };

  const addVideo = (video: VideoRecording) => {
    setVideos(prev => [...prev, video]);
  };

  const addSelectedFrame = (frame: ExtractedFrame) => {
    setSelectedFrames(prev => [...prev, frame]);
  };

  const removeSelectedFrame = (frameId: string) => {
    setSelectedFrames(prev => prev.filter(frame => frame.id !== frameId));
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const clearPhotos = () => {
    setPhotos([]);
  };

  const clearVideos = () => {
    setVideos([]);
    setSelectedFrames([]);
  };

  const value: InspectionContextType = {
    photos,
    videos,
    selectedFrames,
    addPhoto,
    addVideo,
    addSelectedFrame,
    removeSelectedFrame,
    removePhoto,
    clearPhotos,
    clearVideos
  };

  return (
    <InspectionContext.Provider value={value}>
      {children}
    </InspectionContext.Provider>
  );
};
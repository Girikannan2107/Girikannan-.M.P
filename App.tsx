
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCamera } from './hooks/useCamera';
import { useSpeech } from './hooks/useSpeech';
import { analyzeImage } from './services/geminiService';
import type { DetectionResponse, DetectedObject } from './types';
import { PlayIcon, PauseIcon, SettingsIcon, CameraIcon, CameraOffIcon } from './components/Icons';
import { SettingsPanel } from './components/SettingsPanel';

type Status = 'IDLE' | 'STARTING' | 'RUNNING' | 'PROCESSING' | 'ERROR';

const App: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>('IDLE');
  const [lastMessage, setLastMessage] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [detectionInterval, setDetectionInterval] = useState<number>(3000); // ms

  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { videoRef, captureFrame, startCamera, stopCamera, error: cameraError } = useCamera();
  const { speak, cancel } = useSpeech();

  const handleToggleCamera = async () => {
    if (isCameraOn) {
      stopCamera();
      setIsCameraOn(false);
      setIsDetecting(false);
      setStatus('IDLE');
    } else {
      try {
        await startCamera();
        setIsCameraOn(true);
      } catch (err) {
        console.error("Failed to start camera:", err);
        setStatus('ERROR');
      }
    }
  };

  const processFrame = useCallback(async () => {
    if (!isCameraOn) return;
    const imageData = captureFrame();
    if (!imageData) return;

    setStatus('PROCESSING');
    try {
      const result = await analyzeImage(imageData);
      if (result && (result.objects.length > 0 || result.summary)) {
        const message = formatMessage(result);
        if (message && message !== lastMessage) {
          speak(message);
          setLastMessage(message);
        }
      }
      setStatus('RUNNING');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setStatus('ERROR');
      speak("An error occurred during analysis.");
    }
  }, [captureFrame, isCameraOn, speak, lastMessage]);
  
  useEffect(() => {
    if (isDetecting) {
      setStatus('RUNNING');
      detectionIntervalRef.current = setInterval(processFrame, detectionInterval);
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (status === 'RUNNING') setStatus('IDLE');
      cancel();
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetecting, processFrame, detectionInterval]);

  const toggleDetection = () => {
    if (!isCameraOn) {
      handleToggleCamera().then(() => {
         setIsDetecting(d => !d);
      });
    } else {
       setIsDetecting(d => !d);
    }
  };
  
  const formatMessage = (response: DetectionResponse): string => {
    if (response.objects.length === 0 && response.summary) {
      return response.summary;
    }

    const descriptions = response.objects.map(obj => {
        let description = `${obj.name}`;
        if (obj.distance !== 'medium') description += ` ${obj.distance}`;
        if (obj.position !== 'center') description += ` to your ${obj.position}`;
        return description;
    }).join('. ');
    
    return descriptions || "No objects detected.";
  };
  
  const getStatusInfo = (): { text: string; color: string } => {
    if (cameraError) return { text: cameraError, color: 'text-red-400' };
    switch (status) {
      case 'IDLE': return { text: 'System Idle. Press Play to start.', color: 'text-gray-400' };
      case 'STARTING': return { text: 'Starting camera...', color: 'text-yellow-400' };
      case 'RUNNING': return { text: 'Detection Active.', color: 'text-green-400' };
      case 'PROCESSING': return { text: 'Analyzing...', color: 'text-blue-400' };
      case 'ERROR': return { text: 'An error occurred. Please check console.', color: 'text-red-400' };
      default: return { text: 'Ready', color: 'text-gray-400' };
    }
  };
  
  const { text, color } = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="w-full text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-300">Aura Vision</h1>
          <p className="text-lg text-gray-300">Your AI guide to the world.</p>
        </header>

        <div className="relative w-full aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border-2 border-gray-700 mb-4">
          <video ref={videoRef} className={`w-full h-full object-cover ${!isCameraOn && 'hidden'}`} autoPlay playsInline muted />
          {!isCameraOn && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
               <CameraOffIcon className="w-24 h-24 mb-4"/>
               <p className="text-xl">Camera is off</p>
            </div>
          )}
           <div className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-sm font-semibold ${color} bg-black bg-opacity-50`}>
            {text}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleToggleCamera}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 transition-colors"
            aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
          >
            {isCameraOn ? <CameraOffIcon className="w-8 h-8"/> : <CameraIcon className="w-8 h-8"/>}
          </button>
          <button 
            onClick={toggleDetection}
            className={`p-6 rounded-full ${isDetecting ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-colors text-white shadow-lg`}
            aria-label={isDetecting ? "Stop detection" : "Start detection"}
          >
            {isDetecting ? <PauseIcon className="w-12 h-12" /> : <PlayIcon className="w-12 h-12" />}
          </button>
           <button 
            onClick={() => setShowSettings(s => !s)}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-300 transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-8 h-8"/>
          </button>
        </div>
      </div>
      
      {showSettings && (
        <SettingsPanel 
          detectionInterval={detectionInterval}
          setDetectionInterval={setDetectionInterval}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default App;


import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            if (err instanceof Error) {
              if (err.name === 'NotAllowedError') {
                setError('Camera permission denied. Please enable it in your browser settings.');
              } else if (err.name === 'NotFoundError') {
                 setError('No camera found. Please connect a camera.');
              }
              else {
                setError('Could not start camera.');
              }
            }
        }
    }, [stream]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if(videoRef.current){
            videoRef.current.srcObject = null;
        }
    }, [stream]);

    const captureFrame = useCallback((): string | null => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL('image/jpeg', 0.8);
            }
        }
        return null;
    }, []);

    return { videoRef, stream, startCamera, stopCamera, captureFrame, error };
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';

interface CameraCaptureModalProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

type CameraState = 'loading' | 'live' | 'captured' | 'error';

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ onCapture, onClose }) => {
    const [cameraState, setCameraState] = useState<CameraState>('loading');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' },
                    audio: false
                });

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Wait for video to be ready to play
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(e => {
                            console.error("Error playing video:", e);
                            setCameraState('error');
                            setErrorMsg("Failed to start video stream.");
                        });
                        setCameraState('live');
                    };
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraState('error');
                setErrorMsg("Camera not available. Please check permissions or use a different device.");
            }
        };

        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const handleCapture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Set canvas dimensions to a square crop based on the video's smallest dimension
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;

        // Calculate crop to center
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;

        // Draw the current video frame to the canvas
        // Note: The video preview is mirrored with CSS, but we draw the raw frame here.
        // If we wanted the captured image to be mirrored as the user sees it, we would need to flip it here.
        // Requirement said: "Do NOT mirror the final captured image." so we draw as is.
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

        // Pause video to show "frozen" state
        video.pause();
        setCameraState('captured');
    }, []);

    // Add keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (cameraState === 'live' && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                handleCapture();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cameraState, handleCapture]);

    const handleRetake = () => {
        setCameraState('live');
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Error resuming video:", e));
        }
    };

    const handleConfirm = () => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob(blob => {
            if (blob) {
                const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
                onCapture(file);
                // Camera cleanup happens in useEffect cleanup or we can do it here explicitly
                // But onCapture might unmount this component, triggering cleanup.
            } else {
                setErrorMsg("Failed to process captured image.");
            }
        }, 'image/jpeg', 0.92);
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-none sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-lg overflow-hidden shadow-2xl relative flex flex-col sm:max-h-[90vh]">

                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-indigo-600" />
                        Take a Selfie
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        aria-label="Close camera"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Camera Viewport */}
                <div className="relative aspect-square w-full bg-black overflow-hidden group shrink-0">

                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${cameraState === 'live' || cameraState === 'captured' ? 'opacity-100' : 'opacity-0'} ${cameraState === 'live' ? 'scale-x-[-1]' : ''}`} // Mirror only when live
                        playsInline
                        muted
                    />

                    {/* Hidden Canvas for Capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Loading State */}
                    {cameraState === 'loading' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                            <p className="text-sm font-medium">Starting camera...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {cameraState === 'error' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-4 bg-gray-900">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <p className="text-sm">{errorMsg}</p>
                            <button
                                onClick={() => onClose()} // Or retry logic if needed
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {/* Face Guide Overlay (Only in live mode) */}
                    {cameraState === 'live' && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-[70%] h-[70%] border-2 border-white/50 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
                            <p className="absolute bottom-8 text-white/90 text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                                Center your face
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer / Controls */}
                <div className="p-6 bg-white space-y-4 flex-1 flex flex-col justify-center pb-[env(safe-area-inset-bottom)]">

                    {/* Helper Text */}
                    {cameraState === 'live' && (
                        <p className="text-center text-sm text-gray-500">
                            Use good lighting. Remove sunglasses.
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        {cameraState === 'live' && (
                            <button
                                onClick={handleCapture}
                                className="w-16 h-16 rounded-full border-4 border-indigo-100 bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                                aria-label="Capture photo"
                            >
                                <div className="w-6 h-6 bg-white rounded-full"></div>
                            </button>
                        )}

                        {cameraState === 'captured' && (
                            <>
                                <button
                                    onClick={handleRetake}
                                    className="flex-1 py-4 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 h-14"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Retake
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 py-4 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 h-14"
                                >
                                    <Check className="w-5 h-5" />
                                    Use Photo
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

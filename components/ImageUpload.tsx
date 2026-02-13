
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Link, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, Camera } from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { resizeImage } from '../utils/image';
import { smartCropToHeadshot } from '../utils/smartCrop';

interface ImageUploadProps {
    onImageSelect: (base64: string, wasCropped: boolean) => void;
}

type Tab = 'upload' | 'url';

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
    const [activeTab, setActiveTab] = useState<Tab>('upload');
    const [urlInput, setUrlInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [validationState, setValidationState] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- File Handling ---

    const processFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setErrorMsg("Please upload a valid image file (JPG, PNG, WebP).");
            return;
        }

        // Max 10MB approx check
        if (file.size > 10 * 1024 * 1024) {
            setErrorMsg("Image is too large. Please upload an image under 10MB.");
            return;
        }

        setIsOptimizing(true);
        setErrorMsg(null);

        try {
            // Apply Smart Crop
            const result = await smartCropToHeadshot(file);
            const processedFile = result.file;
            const wasCropped = result.wasCropped;

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setIsOptimizing(false);
                onImageSelect(base64, wasCropped); // Pass up to parent
            };
            reader.readAsDataURL(processedFile);

        } catch (error) {
            console.error("Processing error:", error);
            setIsOptimizing(false);
            // Fallback to original if something fails, though smartCrop handles errors gracefully
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelect(reader.result as string, false);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // --- URL Handling ---

    const validateAndLoadUrl = async (url: string) => {
        if (!url) {
            setValidationState('idle');
            setErrorMsg(null);
            return;
        }

        setValidationState('validating');
        setErrorMsg(null);

        // Basic regex check for image extension
        // We allow things without extensions too if they render, but this is a comprehensive first pass
        const isImageParams = /\.(jpeg|jpg|gif|png|webp|bmp)$/i.test(url.split('?')[0]);

        // We try to load it into an Image object to verify it's a real image that we can use
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Try to request with CORS

        img.onload = () => {
            setValidationState('valid');
            // Draw to canvas to get base64
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            try {
                ctx?.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/jpeg');
                onImageSelect(base64);
            } catch (e) {
                console.error("CORS Error on Canvas", e);
                setValidationState('invalid');
                setErrorMsg("Cannot process this image due to CORS security restrictions. Please save it and upload properly, or try a different URL.");
            }
        };

        img.onerror = () => {
            setValidationState('invalid');
            setErrorMsg("Failed to load image. The URL might be broken or blocking access.");
        };

        img.src = url;
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInput(e.target.value);
        // Debounce validation could be added here, but simple onBlur or manual Enter might be better. 
        // For now, let's validate on change with a small delay or just wait for user action?
        // The prompt asked for "validate live".
    };

    // Effect to debounce URL validation
    useEffect(() => {
        const timer = setTimeout(() => {
            if (urlInput.length > 5 && activeTab === 'url') {
                validateAndLoadUrl(urlInput);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [urlInput, activeTab]);


    // --- Clipboard Handling ---

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            // Only handle paste if we are in this component tree (conceptually). 
            // Since this is the main upload screen, we can handle global paste when mounted.

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    if (blob) processFile(blob);
                    return; // Found image, stop
                }
            }

            // If no image, maybe it's a URL in text?
            const text = e.clipboardData?.getData('text');
            if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
                // It's a URL. Switch tab and populate.
                setActiveTab('url');
                setUrlInput(text);
                // Validation effect will trigger
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [processFile]);


    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-xl inline-flex flex-col sm:flex-row relative w-full sm:w-auto gap-1 sm:gap-0">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-6 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto ${activeTab === 'upload'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`px-6 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto ${activeTab === 'url'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Link className="w-4 h-4" />
                        URL
                    </button>
                    <button
                        onClick={() => setShowCameraModal(true)}
                        className="px-6 py-3 sm:py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <Camera className="w-4 h-4" />
                        Selfie
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-3xl transition-all duration-300">

                {activeTab === 'upload' && (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-6 sm:p-12 text-center transition-all cursor-pointer group animate-in fade-in zoom-in duration-300 ${isDragging
                            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                            : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className={`p-4 rounded-full transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {isDragging ? 'Drop image here' : 'Click to upload or drag & drop'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Supports JPG, PNG, WebP (Max 10MB)
                                </p>
                            </div>
                            {/* Quick Tip */}
                            <div className="mt-4 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                Tip: You can paste (Cmd+V) an image directly!
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className="border-2 border-transparent bg-gray-50 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="flex flex-col items-center gap-4 mb-2">
                                <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
                                    <Link className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Import from URL</h3>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={handleUrlChange}
                                    placeholder="https://example.com/image.jpg"
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${validationState === 'invalid' ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-200'
                                        }`}
                                />
                                <div className="absolute right-3 top-3 text-gray-400">
                                    {validationState === 'validating' && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
                                    {validationState === 'valid' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    {validationState === 'invalid' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg justify-center animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {errorMsg}
                                </div>
                            )}

                            <p className="text-xs text-gray-400 pt-2">
                                Paste an image URL directly. Ensure the link points to a direct image file.
                            </p>
                        </div>
                    </div>
                )}

            </div>
            {/* Global Error toast if file processing fails (optional, mostly handled nicely in UI above) */}
            {errorMsg && activeTab === 'upload' && (
                <div className="mt-4 text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
                    {errorMsg}
                </div>
            )}
            {/* Camera Modal */}
            {showCameraModal && (
                <CameraCaptureModal
                    onCapture={(file) => {
                        processFile(file);
                        setShowCameraModal(false);
                    }}
                    onClose={() => setShowCameraModal(false)}
                />
            )}
        </div>
    );
};

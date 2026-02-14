
import React, { useState } from 'react';
import {
    Upload,
    Camera,
    Sparkles,
    Image as ImageIcon,
    Loader2,
    ChevronRight,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    UserCheck,
    Aperture,
    Wand2,
    Download,
    Send,
    RotateCcw
} from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { HeadshotGallery, GeneratedHeadshot } from '../components/HeadshotGallery';
import { HEADSHOT_STYLES } from '../constants';
import { HeadshotStyle } from '../types';
import { generateHeadshot, editHeadshot } from '../services/gemini';
import { resizeImage } from '../utils/image';
import { Footer } from '../components/Footer';
import { LinkedInPreviewModal } from '../components/LinkedInPreviewModal';
import { ResumePreviewModal } from '../components/ResumePreviewModal';
import { ResultActionsBar } from '../components/ResultActionsBar';
import { BusinessCardPreviewModal } from '../components/BusinessCardPreviewModal';

const SUGGESTED_PROMPTS = [
    "Make me look more confident and approachable",
    "Change the background to a modern office blur",
    "Fix the lighting to be more even",
    "Make my suit dark navy blue",
    "Remove the glare from my glasses"
];

enum AppStep {
    UPLOAD = 'upload',
    STYLE = 'style',
    GENERATING = 'generating',
    RESULT = 'result'
}

const Home: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null); // Kept for backward compat if needed, but primary is 'results'
    const [isLoading, setIsLoading] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(() => {
        const shuffled = [...SUGGESTED_PROMPTS].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    });
    const [error, setError] = useState<string | null>(null);
    const [cropStatus, setCropStatus] = useState<boolean | null>(null);
    const [showLinkedInPreview, setShowLinkedInPreview] = useState(false);
    const [showResumePreview, setShowResumePreview] = useState(false);
    const [showBusinessCardPreview, setShowBusinessCardPreview] = useState(false);

    // 4x Variation State
    const [results, setResults] = useState<GeneratedHeadshot[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleRefreshSuggestions = () => {
        const shuffled = [...SUGGESTED_PROMPTS].sort(() => 0.5 - Math.random());
        setCurrentSuggestions(shuffled.slice(0, 3));
    };

    const handleStyleSelect = (style: HeadshotStyle) => {
        setSelectedStyle(style);
    };

    const handleGenerate = async () => {
        if (!sourceImage || !selectedStyle) return;

        setIsLoading(true);
        setStep(AppStep.GENERATING);
        setError(null);

        try {
            // 4x Parallel Generation
            const modifiers = [
                "soft studio lighting, balanced contrast",
                "neutral professional lighting, sharp focus",
                "high contrast dramatic lighting",
                "warm ambient lighting, soft bokeh"
            ];

            const promises = modifiers.map(modifier =>
                generateHeadshot(sourceImage, selectedStyle.prompt, modifier)
            );

            const generatedImages = await Promise.all(promises);

            const newResults: GeneratedHeadshot[] = generatedImages.map(url => ({
                id: crypto.randomUUID(),
                url
            }));

            setResults(newResults);
            if (newResults.length > 0) {
                setSelectedId(newResults[0].id);
            }

            setStep(AppStep.RESULT);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate headshots. Please try again.");
            setStep(AppStep.STYLE); // Go back on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!selectedId || !editPrompt.trim()) return;
        const currentResult = results.find(r => r.id === selectedId);
        if (!currentResult) return;

        setIsLoading(true);
        setError(null);

        try {
            // Note: Editor only edits one, so we might want to add the edited version to the list or replace the current one
            // For now, let's append the edited version as a new variation and select it
            const newImage = await editHeadshot(currentResult.url, editPrompt);

            const editedHeadshot: GeneratedHeadshot = {
                id: crypto.randomUUID(),
                url: newImage
            };

            setResults(prev => [editedHeadshot, ...prev]);
            setSelectedId(editedHeadshot.id);
            setEditPrompt('');
        } catch (err: any) {
            setError(err.message || "Failed to edit image.");
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setStep(AppStep.UPLOAD);
        setSourceImage(null);
        setSelectedStyle(null);
        setResults([]);
        setSelectedId(null);
        setError(null);
        setCropStatus(null);
        setShowLinkedInPreview(false);
        setShowResumePreview(false);
        setShowBusinessCardPreview(false);
        handleRefreshSuggestions();
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 flex md:grid md:grid-cols-3 justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3 md:justify-self-start" onClick={reset} style={{ cursor: 'pointer' }}>
                    <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
                        <Camera className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            ProShot AI
                        </h1>
                        <span className="text-xs text-gray-400 font-medium">by <a href="https://starterdev.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">starterdev.io</a></span>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4 text-sm font-medium md:justify-self-center">
                    <span className={`flex items-center gap-1 ${step === AppStep.UPLOAD ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-200">1</span> Upload
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className={`flex items-center gap-1 ${step === AppStep.STYLE ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-200">2</span> Style
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className={`flex items-center gap-1 ${step === AppStep.RESULT ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-200">3</span> Result
                    </span>
                </div>

                <button
                    onClick={reset}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 md:justify-self-end"
                    title="Reset session"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center p-4 md:p-8 max-w-6xl mx-auto w-full">

                {step === AppStep.UPLOAD && (
                    <div className="w-full max-w-2xl flex flex-col gap-8 animate-in fade-in duration-500">
                        <div className="text-center space-y-4 py-8 sm:py-16">
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mx-auto max-w-md sm:max-w-none text-balance">Turn Selfies into Professional Headshots</h2>
                            <p className="text-base sm:text-lg text-gray-500 px-4">Get studio-quality photos for LinkedIn, resumes, and social profiles in seconds. No photographer required.</p>
                        </div>

                        <ImageUpload onImageSelect={(base64, wasCropped) => {
                            setSourceImage(base64);
                            setCropStatus(wasCropped);
                            setStep(AppStep.STYLE);
                        }} />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-xs sm:text-sm text-gray-700 font-medium">
                            <div className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                    <UserCheck className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span>Keep likeness</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                                    <Aperture className="text-amber-600 w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span>Pro studio lighting</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                                    <Wand2 className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span>Unlimited edits</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === AppStep.STYLE && (
                    <div className="w-full flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setStep(AppStep.UPLOAD)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Select a style</h2>
                                <p className="text-gray-500">Choose how you want your professional headshot to look.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-red-800 font-medium">{error}</div>
                            </div>
                        )}

                        {/* Smart Crop Feedback */}
                        {sourceImage && (
                            <div className="flex justify-center -mt-4 mb-2">
                                {cropStatus === true ? (
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-green-100 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-green-100 p-1 rounded-full">
                                            <Sparkles className="w-3 h-3 text-green-600" />
                                        </div>
                                        Auto-framed for best results
                                    </div>
                                ) : cropStatus === false ? (
                                    <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-yellow-100 animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-yellow-100 p-1 rounded-full">
                                            <AlertCircle className="w-3 h-3 text-yellow-600" />
                                        </div>
                                        No face detected — using original image
                                    </div>
                                ) : null}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {HEADSHOT_STYLES.map((style) => (
                                <div
                                    key={style.id}
                                    onClick={() => handleStyleSelect(style)}
                                    className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${selectedStyle?.id === style.id
                                        ? 'border-indigo-600 ring-4 ring-indigo-50'
                                        : 'border-transparent hover:border-indigo-200'
                                        }`}
                                >
                                    <img src={style.previewUrl} alt={style.name} className="w-full aspect-square object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="font-bold text-lg">{style.name}</p>
                                        <p className="text-xs text-gray-200 line-clamp-1">{style.description}</p>
                                    </div>
                                    {selectedStyle?.id === style.id && (
                                        <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                disabled={!selectedStyle || isLoading}
                                onClick={handleGenerate}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                Generate My Headshot
                            </button>
                        </div>
                    </div>
                )}

                {step === AppStep.GENERATING && (
                    <div className="w-full max-w-md flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
                        <div className="relative mb-10">
                            <div className="w-48 h-48 rounded-full border-4 border-indigo-100 flex items-center justify-center overflow-hidden">
                                {sourceImage && (
                                    <img
                                        src={sourceImage}
                                        className="h-full w-full object-cover object-center translate-y-[-6%] sm:translate-y-0 opacity-50 grayscale"
                                        alt="Source"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Generating 4 variations...</h2>
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-500 animate-pulse">Creating different lighting setups</p>
                                <p className="text-gray-500 animate-pulse delay-75">Adjusting background depth</p>
                                <p className="text-gray-500 animate-pulse delay-150">Polishing details</p>
                            </div>

                            {/* Skeleton Grid for Waiting State */}
                            <div className="grid grid-cols-2 gap-4 mt-8 opacity-50 max-w-sm mx-auto">
                                {[1, 2, 3, 4].map(placeholder => (
                                    <div key={placeholder} className="aspect-square bg-gray-100 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === AppStep.RESULT && results.length > 0 && (
                    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700 max-w-4xl mx-auto">

                        <div className="flex flex-col gap-8">
                            {/* Selected Image Large Preview */}
                            <div className="w-full max-w-md mx-auto aspect-[4/5] bg-white p-2 rounded-3xl shadow-2xl border border-gray-100 relative group overflow-hidden">
                                {selectedId && (
                                    <img
                                        src={results.find(r => r.id === selectedId)?.url}
                                        className="w-full h-full object-cover object-top rounded-[1.25rem]"
                                        alt="Selected Headshot"
                                    />
                                )}
                            </div>

                            {/* Actions Bar */}
                            {/* Actions Bar */}
                            <ResultActionsBar
                                selectedImageUrl={results.find(r => r.id === selectedId)?.url}
                                selectedId={selectedId}
                                onDownload={() => { }} // Download handled by link in component
                                onPreviewLinkedIn={() => setShowLinkedInPreview(true)}
                                onPreviewResume={() => setShowResumePreview(true)}
                                onPreviewBusinessCard={() => setShowBusinessCardPreview(true)}
                                onChangeStyle={() => setStep(AppStep.STYLE)}
                                onStartOver={reset}
                            />

                            {/* Gallery */}
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <div className="text-center mb-4">
                                    <h3 className="font-bold text-gray-900">Variations</h3>
                                    <p className="text-sm text-gray-500">Select your favorite look</p>
                                </div>
                                <HeadshotGallery
                                    results={results}
                                    selectedId={selectedId}
                                    onSelect={setSelectedId}
                                />
                            </div>

                            {/* AI Editor Panel */}
                            <div className="flex flex-col gap-6 mt-8">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-amber-50 rounded-lg">
                                                <Sparkles className="text-amber-600 w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">AI Refinement Chat</h3>
                                        </div>
                                        <button
                                            onClick={handleRefreshSuggestions}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                            title="Get new suggestions"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-4 mb-8">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Not quite perfect? You can refine this image using natural language. Try saying things like:
                                        </p>
                                        <ul className="space-y-2">
                                            {currentSuggestions.map((suggestion, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => setEditPrompt(suggestion)}
                                                    className="text-indigo-600 text-sm font-medium bg-indigo-50/50 p-3 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors border border-indigo-100/50"
                                                >
                                                    "{suggestion}"
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-auto">
                                        {error && (
                                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}
                                        <div className="relative group">
                                            <textarea
                                                value={editPrompt}
                                                onChange={(e) => setEditPrompt(e.target.value)}
                                                placeholder="Describe your change..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none min-h-[100px] text-gray-900"
                                            />
                                            <button
                                                disabled={isLoading || !editPrompt.trim()}
                                                onClick={handleEdit}
                                                className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-100"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <p className="mt-3 text-xs text-gray-400 text-center">
                                            AI updates usually take 5-10 seconds to process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                )}
            </main >

            <Footer />

            <LinkedInPreviewModal
                isOpen={showLinkedInPreview}
                onClose={() => setShowLinkedInPreview(false)}
                photoUrl={results.find(r => r.id === selectedId)?.url || ''}
            />

            <ResumePreviewModal
                isOpen={showResumePreview}
                onClose={() => setShowResumePreview(false)}
                photoUrl={results.find(r => r.id === selectedId)?.url || ''}
            />

            <BusinessCardPreviewModal
                isOpen={showBusinessCardPreview}
                onClose={() => setShowBusinessCardPreview(false)}
                photoUrl={results.find(r => r.id === selectedId)?.url || ''}
            />
        </div >
    );
};

export default Home;

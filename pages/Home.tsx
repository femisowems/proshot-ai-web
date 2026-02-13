import React, { useState } from 'react';
import { AppStep, HeadshotStyle } from '../types';
import { HEADSHOT_STYLES } from '../constants';
import { generateHeadshot, editHeadshot } from '../services/gemini';
import { resizeImage } from '../utils/image';
import {
    Camera,
    ChevronRight,
    Sparkles,
    ArrowLeft,
    Download,
    RotateCcw,
    Send,
    Loader2,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    UserCheck,
    Aperture,
    Wand2
} from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';

const SUGGESTED_PROMPTS = [
    "Make me look more confident and approachable",
    "Change the background to a blurred modern office",
    "Fix the stray hairs on the top of my head",
    "Make the lighting warmer and more golden",
    "Adjust my suit color to a deep navy blue",
    "Brighten my eyes and whiten teeth slightly",
    "Remove the glare from my glasses",
    "Make my skin tone look more natural",
    "Turn this into a black and white photo",
    "Add a subtle smile to my expression",
    "Make the background pure white for LinkedIn",
    "Soften the shadows on my face",
    "Give me a fresh haircut look",
    "Change to a casual friday look",
    "Make it look like taken outside in sunlight",
    "Remove the wrinkles under my eyes"
];

const getRandomSuggestions = () => {
    const shuffled = [...SUGGESTED_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
};

const Home: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(getRandomSuggestions());
    const [error, setError] = useState<string | null>(null);

    const handleStyleSelect = (style: HeadshotStyle) => {
        setSelectedStyle(style);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!sourceImage || !selectedStyle) return;

        setIsLoading(true);
        setStep(AppStep.GENERATING);
        setError(null);

        try {
            const optimizedImage = await resizeImage(sourceImage, 1024, 1024);
            const result = await generateHeadshot(optimizedImage, selectedStyle.prompt);
            setResultImage(result);
            setStep(AppStep.RESULT);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setStep(AppStep.STYLE);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!resultImage || !editPrompt.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            const optimizedImage = await resizeImage(resultImage, 1024, 1024);
            const result = await editHeadshot(optimizedImage, editPrompt);
            setResultImage(result);
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
        setResultImage(null);
        setError(null);
        setCurrentSuggestions(getRandomSuggestions());
    };

    const handleRefreshSuggestions = () => {
        setCurrentSuggestions(getRandomSuggestions());
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2" onClick={reset} style={{ cursor: 'pointer' }}>
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-baseline gap-1">
                        ProShot AI <span className="text-sm font-normal text-gray-500">by <sub><a href="https://starterdev.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">starterdev.io</a></sub></span>
                    </h1>
                </div>

                <div className="hidden md:flex items-center gap-4 text-sm font-medium">
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
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
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

                        <ImageUpload onImageSelect={(base64) => {
                            setSourceImage(base64);
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
                                    <img src={sourceImage} className="w-full h-full object-cover opacity-50 grayscale" alt="Source" />
                                )}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Polishing your photos...</h2>
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-500 animate-pulse">Adjusting studio lighting</p>
                                <p className="text-gray-500 animate-pulse delay-75">Swapping casual attire for professional suit</p>
                                <p className="text-gray-500 animate-pulse delay-150">Enhancing resolution to HD</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === AppStep.RESULT && resultImage && (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-700">
                        {/* Image Preview Card */}
                        <div className="space-y-6">
                            <div className="bg-white p-2 rounded-3xl shadow-2xl border border-gray-100 relative group overflow-hidden">
                                <img
                                    src={resultImage}
                                    className={`w-full aspect-[4/5] object-cover rounded-[1.25rem] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                                    alt="Generated Headshot"
                                />

                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
                                        <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                                            <span className="font-semibold text-gray-700">Refining...</span>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-6 left-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={resultImage}
                                        download="proshot-headshot.png"
                                        className="flex-1 flex items-center justify-center gap-2 bg-white/90 backdrop-blur py-3 rounded-xl font-semibold text-gray-900 hover:bg-white transition-colors"
                                    >
                                        <Download className="w-5 h-5" /> Download
                                    </a>
                                    <button
                                        onClick={() => setStep(AppStep.STYLE)}
                                        className="flex items-center justify-center w-14 bg-white/90 backdrop-blur rounded-xl text-gray-700 hover:bg-white transition-colors"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Style Selected</p>
                                    <p className="text-indigo-900 font-semibold">{selectedStyle?.name}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dimensions</p>
                                    <p className="text-gray-900 font-semibold">1024 x 1280 (HD)</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Editor Panel */}
                        <div className="flex flex-col gap-6">
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
                )}
            </main>

            <Footer />
        </div>
    );
};

// Import Footer locally to avoid circular dependencies if any
import { Footer } from '../components/Footer';

export default Home;


import React, { useEffect, useState } from 'react';
import { X, Moon, Sun, Repeat, Download, User, Building, CreditCard } from 'lucide-react';
import { exportBusinessCard } from '../utils/exportBusinessCard';

interface BusinessCardPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    photoUrl: string;
    initialFullName?: string;
    initialTitle?: string;
    initialCompany?: string;
}

export const BusinessCardPreviewModal: React.FC<BusinessCardPreviewModalProps> = ({
    isOpen,
    onClose,
    photoUrl,
    initialFullName = "Your Name",
    initialTitle = "Senior Frontend Engineer",
    initialCompany = "StarterDev"
}) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [title, setTitle] = useState(initialTitle);
    const [company, setCompany] = useState(initialCompany);
    const [isDark, setIsDark] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportBusinessCard({
                fullName,
                title,
                company,
                photoUrl,
                theme: isDark ? 'dark' : 'light'
            }, `business-card-${isDark ? 'dark' : 'light'}.png`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose} // Close on backdrop click
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-card-preview-title"
        >
            <div
                className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent close on content click
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/80 hover:bg-gray-100 rounded-full text-gray-500 transition-colors backdrop-blur-sm shadow-sm border border-gray-100"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h2 id="business-card-preview-title" className="text-2xl font-bold text-gray-900">Business Card Preview</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Controls - Left Side */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col gap-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600" />
                                    Card Details
                                </h3>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-900"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Job Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-900"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Company</label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-200 my-2"></div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsDark(!isDark)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${isDark
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                        {isDark ? 'Dark Mode' : 'Light Mode'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Area - Right Side */}
                        <div className="lg:col-span-8 flex flex-col items-center gap-6 py-4">
                            {/* Card Container with Perspective */}
                            <div className="perspective-1000 w-full max-w-[480px] aspect-[3.5/2] relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>

                                {/* Inner Flipper */}
                                <div
                                    className="w-full h-full relative transition-all duration-700 transform-style-3d shadow-2xl rounded-xl"
                                    style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                                >
                                    {/* FRONT FACE */}
                                    <div className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden p-8 flex items-center gap-6 border ${isDark
                                        ? 'bg-gray-900 border-gray-800'
                                        : 'bg-white border-gray-200'
                                        }`}>
                                        {/* Headshot */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-opacity-20 shrink-0 shadow-sm"
                                            style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                                            <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Text Info */}
                                        <div className="flex flex-col justify-center min-w-0">
                                            <h3 className={`text-2xl sm:text-3xl font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {fullName}
                                            </h3>
                                            <p className={`text-sm sm:text-base font-medium uppercase tracking-wide mb-3 truncate ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                                {title}
                                            </p>
                                            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <Building className="w-3 h-3 shrink-0" />
                                                <span className="truncate">{company}</span>
                                            </div>
                                        </div>

                                        {/* Decorative Element */}
                                        <div className={`absolute top-0 right-0 w-32 h-full opacity-5 pointer-events-none transform skew-x-12 translate-x-16 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                                    </div>

                                    {/* BACK FACE */}
                                    <div
                                        className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden p-8 flex flex-col items-center justify-center text-center border ${isDark
                                            ? 'bg-gray-900 border-gray-800'
                                            : 'bg-white border-gray-200'
                                            }`}
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 rotate-3 shadow-sm ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                                            }`}>
                                            {getInitials(fullName)}
                                        </div>

                                        <h3 className={`text-3xl font-bold mb-2 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {fullName}
                                        </h3>

                                        <p className={`text-base font-medium mb-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            {title}
                                        </p>

                                        <div className={`mt-auto text-xs font-semibold uppercase tracking-widest opacity-50 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {company}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5"
                                >
                                    <Repeat className="w-4 h-4" />
                                    Flip Card
                                </button>

                                <button
                                    disabled={true} // Temporarily disabled until feature is ready
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium shadow-none cursor-not-allowed border border-gray-200"
                                    title="Export feature coming soon"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Card
                                </button>
                            </div>

                            <p className="text-sm text-gray-400 text-center max-w-xs">
                                Click the card above to flip between front and back views.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
};

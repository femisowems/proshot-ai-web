import React from 'react';
import { Download, ArrowLeft, RotateCcw, Linkedin, FileText, CreditCard } from 'lucide-react';

interface ResultActionsBarProps {
    selectedImageUrl: string | undefined;
    selectedId: string | null;
    onDownload: () => void;
    onPreviewLinkedIn: () => void;
    onPreviewResume: () => void;
    onPreviewBusinessCard: () => void;
    onChangeStyle: () => void;
    onStartOver: () => void;
}

export const ResultActionsBar: React.FC<ResultActionsBarProps> = ({
    selectedImageUrl,
    selectedId,
    onDownload,
    onPreviewLinkedIn,
    onPreviewResume,
    onPreviewBusinessCard,
    onChangeStyle,
    onStartOver
}) => {
    return (
        <div className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700 delay-150">
            {/* Primary Actions Card */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-2">

                {/* Main Download Action */}
                <a
                    href={selectedImageUrl}
                    download={`proshot-headshot-${selectedId || 'generated'}.png`}
                    onClick={onDownload}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${!selectedId ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Download className="w-6 h-6 mb-1" />
                    <span className="text-lg leading-none">Download Selected</span>
                </a>

                {/* Preview Actions Group */}
                <div className="flex flex-1 gap-2">
                    <button
                        onClick={onPreviewLinkedIn}
                        aria-label="Preview headshot on LinkedIn"
                        className="flex-1 flex flex-col items-center justify-center gap-2 bg-white text-indigo-700 border border-indigo-100 px-4 py-4 rounded-xl font-bold hover:border-indigo-200 hover:bg-indigo-50 transition-all active:scale-[0.98]"
                    >
                        <Linkedin className="w-5 h-5 text-indigo-600/80 mb-1" />
                        <span className="text-sm leading-tight">Preview on<br /><span className="text-indigo-800">LinkedIn</span></span>
                    </button>


                    <button
                        onClick={onPreviewResume}
                        aria-label="Preview headshot on Resume"
                        className="flex-1 flex flex-col items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                        <FileText className="w-5 h-5 text-gray-500 mb-1" />
                        <span className="text-sm leading-tight">Preview on<br /><span className="text-gray-900">Resume</span></span>
                    </button>

                    <button
                        onClick={onPreviewBusinessCard}
                        aria-label="Preview on Business Card"
                        className="flex-1 flex flex-col items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-[0.98]"
                    >
                        <CreditCard className="w-5 h-5 text-gray-500 mb-1" />
                        <span className="text-sm leading-tight">Preview on<br /><span className="text-gray-900">Card</span></span>
                    </button>
                </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-500">
                <button
                    onClick={onChangeStyle}
                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors px-4 py-2 hover:bg-indigo-50/50 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Change Style
                </button>
                <div className="w-px h-4 bg-gray-200"></div>
                <button
                    onClick={onStartOver}
                    className="flex items-center gap-2 hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50/50 rounded-lg"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </button>
            </div>
        </div>
    );
};

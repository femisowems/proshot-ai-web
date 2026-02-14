import React from 'react';
import { Download, ArrowLeft, RotateCcw, Linkedin } from 'lucide-react';

interface ResultActionsBarProps {
    selectedImageUrl: string | undefined;
    selectedId: string | null;
    onDownload: () => void;
    onPreviewLinkedIn: () => void;
    onChangeStyle: () => void;
    onStartOver: () => void;
}

export const ResultActionsBar: React.FC<ResultActionsBarProps> = ({
    selectedImageUrl,
    selectedId,
    onDownload,
    onPreviewLinkedIn,
    onChangeStyle,
    onStartOver
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
            {/* Primary Actions Group */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-end">
                <a
                    href={selectedImageUrl}
                    download={`proshot-headshot-${selectedId || 'generated'}.png`}
                    onClick={onDownload}
                    className={`flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:-translate-y-1 ${!selectedId ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Download className="w-5 h-5" />
                    Download Selected
                </a>

                <button
                    onClick={onPreviewLinkedIn}
                    aria-label="Preview headshot on LinkedIn"
                    className="flex items-center justify-center gap-2 bg-white text-indigo-700 border-2 border-indigo-100 px-6 py-3 rounded-xl font-bold hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm hover:-translate-y-1"
                >
                    <Linkedin className="w-5 h-5" />
                    Preview on LinkedIn
                </button>
            </div>

            {/* Secondary Actions Group */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-start">
                <button
                    onClick={onChangeStyle}
                    className="flex items-center justify-center px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Change Style
                </button>
                <button
                    onClick={onStartOver}
                    className="flex items-center justify-center px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                </button>
            </div>
        </div>
    );
};

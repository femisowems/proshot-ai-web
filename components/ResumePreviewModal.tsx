import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ResumePreviewCard } from './previews/ResumePreviewCard';

interface ResumePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    photoUrl: string;
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
    isOpen,
    onClose,
    photoUrl
}) => {
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose} // Close on backdrop click
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-preview-title"
        >
            <div
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
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
                    <ResumePreviewCard photoUrl={photoUrl} />
                </div>
            </div>
        </div>
    );
};

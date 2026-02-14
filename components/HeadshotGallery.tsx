import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export type GeneratedHeadshot = {
    id: string;
    url: string;
};

interface HeadshotGalleryProps {
    results: GeneratedHeadshot[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export const HeadshotGallery: React.FC<HeadshotGalleryProps> = ({ results, selectedId, onSelect }) => {
    if (!results || results.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
            {results.map((headshot) => {
                const isSelected = headshot.id === selectedId;
                return (
                    <div
                        key={headshot.id}
                        role="button"
                        tabIndex={0}
                        aria-selected={isSelected}
                        onClick={() => onSelect(headshot.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onSelect(headshot.id);
                            }
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-4 focus:ring-indigo-100 ${isSelected
                            ? 'ring-4 ring-indigo-600 border-2 border-transparent scale-[1.02]'
                            : 'border-2 border-gray-100 hover:border-indigo-200 hover:scale-[1.02]'
                            }`}
                    >
                        <img
                            src={headshot.url}
                            alt="Headshot variation"
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                        />

                        {/* Selected Indicator */}
                        {isSelected && (
                            <div className="absolute inset-0 ring-2 ring-inset ring-white/20 rounded-xl pointer-events-none">
                                <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-200">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-6">
                                    <span className="text-white text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-full">Selected</span>
                                </div>
                            </div>
                        )}

                        {/* Hover Overlay */}
                        {!isSelected && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

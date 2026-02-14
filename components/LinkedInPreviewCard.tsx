import React, { useState, useEffect } from 'react';
import { Download, Edit2, MapPin, Linkedin, Briefcase } from 'lucide-react';
import { cropToSquare } from '../utils/cropToSquare';

interface LinkedInPreviewCardProps {
    photoUrl: string;
    initialFullName?: string;
    initialHeadline?: string;
    initialLocation?: string;
}

export const LinkedInPreviewCard: React.FC<LinkedInPreviewCardProps> = ({
    photoUrl,
    initialFullName = "Your Name",
    initialHeadline = "Senior Frontend Engineer | React | TypeScript | AI",
    initialLocation = "Toronto, Canada"
}) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [headline, setHeadline] = useState(initialHeadline);
    const [location, setLocation] = useState(initialLocation);
    const [isEditing, setIsEditing] = useState(false);

    // Reset state when props change
    useEffect(() => {
        setFullName(initialFullName);
        setHeadline(initialHeadline);
        setLocation(initialLocation);
    }, [initialFullName, initialHeadline, initialLocation]);

    const handleDownloadCrop = async () => {
        try {
            const croppedDataUrl = await cropToSquare(photoUrl);
            const link = document.createElement('a');
            link.href = croppedDataUrl;
            link.download = `linkedin-profile-photo-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to crop and download image:', error);
            alert('Failed to process image for download.');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700">
            {/* Controls Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-[#0077b5] p-2 rounded-lg text-white">
                        <Linkedin className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">LinkedIn Preview</h3>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Edit2 className="w-4 h-4" />
                        {isEditing ? 'Done Editing' : 'Edit Details'}
                    </button>

                    <button
                        onClick={handleDownloadCrop}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        title="Download cropped 1:1 square image"
                    >
                        <Download className="w-4 h-4" />
                        Download Crop
                    </button>
                </div>
            </div>

            {/* Editing Form */}
            {isEditing && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 animate-in slide-in-from-top-2 fade-in">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="City, Country"
                        />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Headline</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Job Title | Company | Skills"
                        />
                    </div>
                </div>
            )}

            {/* LinkedIn Card Preview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 w-full max-w-[480px] mx-auto relative group">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"></div>
                </div>

                <div className="px-6 pb-6 relative">
                    {/* Profile Photo */}
                    <div className="-mt-20 mb-3 relative inline-block">
                        <div className="w-40 h-40 rounded-full border-[4px] border-white overflow-hidden bg-white shadow-sm relative group-hover:scale-[1.02] transition-transform duration-300">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <span className="text-4xl">?</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                {fullName || "Your Name"}
                            </h2>
                            <div className="flex gap-2 text-gray-600">
                                {/* Mock Icons - purely visual */}
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <div className="w-full h-full rounded-md border border-gray-300 flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-[16px] text-gray-900 leading-snug mb-1">
                            {headline || "Senior Frontend Engineer | React | TypeScript | AI"}
                        </p>

                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                            <span className="text-gray-500 font-normal">{location || "Toronto, Canada"}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-blue-600 font-bold cursor-pointer hover:underline">Contact info</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <button className="bg-[#0a66c2] hover:bg-[#004182] text-white px-5 py-1.5 rounded-full font-bold text-base transition-colors flex-1 text-center">
                                Connect
                            </button>
                            <button className="bg-white hover:bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-600 px-5 py-1.5 rounded-full font-bold text-base transition-colors flex-1 text-center">
                                Message
                            </button>
                            <button className="bg-white hover:bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-600 px-3 py-1.5 rounded-full font-bold text-base transition-colors">
                                More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4">
                This is a preview. Actual appearance on LinkedIn may vary slightly.
            </p>
        </div>
    );
};

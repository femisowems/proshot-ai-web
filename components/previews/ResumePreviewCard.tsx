import React, { useState, useEffect } from 'react';
import { Download, Edit2, FileText, ToggleLeft, ToggleRight, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import { cropToResumeAspect } from '../../utils/cropToResumeAspect';

interface ResumePreviewCardProps {
    photoUrl: string;
    initialFullName?: string;
    initialHeadline?: string;
    initialEmail?: string;
    initialLocation?: string;
}

export const ResumePreviewCard: React.FC<ResumePreviewCardProps> = ({
    photoUrl,
    initialFullName = "Your Name",
    initialHeadline = "Senior Frontend Engineer | React | TypeScript | AI",
    initialEmail = "you@example.com",
    initialLocation = "Toronto, Canada"
}) => {
    const [fullName, setFullName] = useState(initialFullName);
    const [headline, setHeadline] = useState(initialHeadline);
    const [email, setEmail] = useState(initialEmail);
    const [location, setLocation] = useState(initialLocation);
    const [isEditing, setIsEditing] = useState(false);
    const [showPhoto, setShowPhoto] = useState(true);

    // Reset state when props change
    useEffect(() => {
        setFullName(initialFullName);
        setHeadline(initialHeadline);
        setEmail(initialEmail);
        setLocation(initialLocation);
    }, [initialFullName, initialHeadline, initialEmail, initialLocation]);

    const handleDownloadCrop = async () => {
        try {
            const croppedDataUrl = await cropToResumeAspect(photoUrl);
            const link = document.createElement('a');
            link.href = croppedDataUrl;
            link.download = `resume-photo-4x5-${Date.now()}.png`;
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
                    <div className="bg-gray-800 p-2 rounded-lg text-white">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Resume Preview</h3>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => setShowPhoto(!showPhoto)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${showPhoto ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-600'
                            }`}
                        title="Toggle photo for ATS compatibility check"
                    >
                        {showPhoto ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        {showPhoto ? 'Photo On' : 'ATS Mode (No Photo)'}
                    </button>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isEditing
                            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Edit2 className="w-4 h-4" />
                        {isEditing ? 'Done' : 'Edit'}
                    </button>

                    <button
                        onClick={handleDownloadCrop}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        title="Download cropped 4:5 resume image"
                        disabled={!showPhoto}
                    >
                        <Download className="w-4 h-4" />
                        Save 4:5 Crop
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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Headline</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Job Title"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
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
                </div>
            )}

            {/* Resume Preview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-[700px] mx-auto overflow-hidden relative min-h-[800px] flex flex-col text-gray-800">

                {/* Header Section */}
                <div className="p-8 border-b border-gray-200">
                    <div className={`flex flex-col-reverse sm:flex-row gap-6 items-center sm:items-start ${!showPhoto ? 'sm:justify-center text-center' : 'justify-between'}`}>

                        <div className={`flex-1 space-y-2 ${!showPhoto ? 'text-center items-center flex flex-col' : 'text-left'}`}>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase">{fullName}</h1>
                            <p className="text-lg text-gray-600 font-medium">{headline}</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-2">
                                <span>{email}</span>
                                <span>•</span>
                                <span>{location}</span>
                            </div>
                        </div>

                        {showPhoto && (
                            <div className="shrink-0">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-gray-100 overflow-hidden shadow-sm">
                                    {photoUrl ? (
                                        <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                            <span className="text-4xl">?</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Body Content (Mock Data) */}
                <div className="p-8 space-y-8 bg-white flex-1">

                    {/* Experience */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Experience</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900">Senior Software Engineer</h3>
                                    <span className="text-sm text-gray-500">2023 - Present</span>
                                </div>
                                <p className="text-sm font-medium text-gray-700">TechCorp Inc.</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-gray-900">Frontend Developer</h3>
                                    <span className="text-sm text-gray-500">2020 - 2023</span>
                                </div>
                                <p className="text-sm font-medium text-gray-700">StartUp Studio</p>
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <Code2 className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Skills</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'TypeScript', 'Node.js', 'TailwindCSS', 'GraphQL', 'AWS', 'Docker', 'Next.js'].map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                            <GraduationCap className="w-5 h-5 text-gray-400" />
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Education</h2>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-900">B.S. Computer Science</h3>
                                <span className="text-sm text-gray-500">2016 - 2020</span>
                            </div>
                            <p className="text-sm text-gray-600">University of Technology</p>
                        </div>
                    </section>

                </div>

                {/* Footer decoration */}
                <div className="h-2 bg-gray-800 w-full mt-auto"></div>
            </div>
        </div>
    );
};

import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="border-b border-gray-200 py-4 px-6 fixed top-0 w-full bg-white/90 backdrop-blur-md z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-lg font-bold tracking-tight text-gray-900 flex items-baseline gap-1">
                        ProShot AI <span className="text-xs font-normal text-gray-500">by <sub><a href="https://starterdev.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">starterdev.io</a></sub></span>
                    </h1>
                </div>
            </header>

            <main className="flex-1 pt-24 pb-16 px-6">
                <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We collect information you provide directly to us when using ProShot AI by starterdev.io ("the Service"), including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Images you upload for processing</li>
                            <li>Image URLs you provide</li>
                            <li>Usage data and interaction with our AI tools</li>
                            <li>Device and browser information for analytics purposes</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Your data is used solely for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Providing and improving our AI headshot generation service</li>
                            <li>Processing your images via Google's Generative AI API</li>
                            <li>Analyzing service performance and debugging technical issues</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">3. Artificial Intelligence Processing</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We utilize Google's Generative AI technology to process your images. By using our Service, you acknowledge that your uploaded images will be processed by third-party AI models to generate the requested output. We do not use your images to train our own AI models.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">4. Data Retention</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We prioritize your privacy. Uploaded images and generated results are temporary and are not permanently stored on our servers. They are retained only for the duration of your session to allow for processing and editing. Once you close your session or refresh the page, the data is cleared from our application state.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">5. Third-Party Services</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We may share data with trusted third-party service providers to facilitate our Service:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li><strong>Google Cloud / Gemini API:</strong> For AI image processing</li>
                            <li><strong>Vercel / Netlify:</strong> For hosting and infrastructure</li>
                            <li><strong>Analytics Providers:</strong> To understand user behavior (e.g., Google Analytics)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">6. Security</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We implement industry-standard security measures to protect your data during transmission and processing. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">7. Children's Privacy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">8. International Users</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you are accessing the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers and third-party providers are located.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">9. Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 p-4 rounded-xl inline-flex mt-2">
                            <Mail className="w-5 h-5" />
                            <a href="mailto:proshot@ssowemimo.com">proshot@ssowemimo.com</a>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="py-8 px-6 text-center text-gray-400 text-xs border-t border-gray-100 mt-auto bg-gray-50">
                <p>&copy; {new Date().getFullYear()} ProShot AI by starterdev.io. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;

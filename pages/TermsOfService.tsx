import React from 'react';
import { ArrowLeft, Mail, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
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
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
                        <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing or using ProShot AI by starterdev.io ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">2. Description of Service</h2>
                        <p className="text-gray-600 leading-relaxed">
                            ProShot AI by starterdev.io provides an artificial intelligence-based tool that enhances and styles user-uploaded headshots. The Service uses third-party AI models to process images and generate new variations based on selected styles.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">3. User Eligibility</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You must be at least 13 years old to use the Service. By using ProShot AI, you represent and warrant that you have the right, authority, and capacity to enter into this agreement and to abide by all of the terms and conditions set forth herein.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">4. User Content & Ownership</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li><strong>Ownership:</strong> You retain all ownership rights to the images you upload ("User Content"). We do not claim ownership of your original photos.</li>
                            <li><strong>License:</strong> By uploading User Content, you grant ProShot AI a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and process your content solely for the purpose of providing the Service to you.</li>
                            <li><strong>Responsibility:</strong> You are solely responsible for the content you upload. You adhere that you have the necessary rights and consents to use the images you provide.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">5. Acceptable Use</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                            <li>Upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, or obscene.</li>
                            <li>Violate the intellectual property rights of others.</li>
                            <li>Upload images of individuals without their consent.</li>
                            <li>Generate content that promotes hate speech, violence, or discrimination.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">6. AI Output Disclaimer</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                            <AlertTriangle className="text-amber-600 w-6 h-6 shrink-0" />
                            <p className="text-sm text-amber-800">
                                <strong>Please Note:</strong> The outputs generated by ProShot AI are created by artificial intelligence. We cannot guarantee the accuracy, realism, or quality of the generated images. AI models may occasionally produce unexpected or distorted results.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To the fullest extent permitted by law, ProShot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">8. No Warranties</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. ProShot AI makes no express or implied warranties regarding the Service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">9. Termination</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">10. Governing Law</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">11. Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;

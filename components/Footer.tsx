import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="py-4 sm:py-8 px-6 text-center text-gray-400 text-xs border-t border-gray-100 mt-auto">
            <p className="mt-2 text-balance">&copy; {new Date().getFullYear()} ProShot AI by <a href="https://starterdev.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 hover:underline">starterdev.io</a>. All rights reserved.</p>
            <div className="mt-2 flex flex-row justify-center gap-4">
                <Link to="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-gray-600">Terms of Service</Link>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium self-center">v{__APP_VERSION__} • {__BUILD_TIMESTAMP__}</span>
            </div>
        </footer>
    );
};

import { useRef, useState, useCallback } from 'react';

interface UseScrollToLinkedInPreviewReturn {
    previewRef: React.RefObject<HTMLElement>;
    isHighlighted: boolean;
    scrollToPreview: () => void;
}

export const useScrollToLinkedInPreview = (): UseScrollToLinkedInPreviewReturn => {
    const previewRef = useRef<HTMLElement>(null);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const scrollToPreview = useCallback(() => {
        if (previewRef.current) {
            // Smooth scroll to center
            previewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Focus for accessibility
            previewRef.current.focus({ preventScroll: true });

            // Trigger highlight
            setIsHighlighted(true);

            // Remove highlight after timeout
            setTimeout(() => {
                setIsHighlighted(false);
            }, 1500);
        }
    }, []);

    return {
        previewRef,
        isHighlighted,
        scrollToPreview
    };
};

import { useRef, useCallback } from 'react';

export const useScrollIntoView = () => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    const scrollIntoView = useCallback(() => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, []);

    return { targetRef, scrollIntoView };
};

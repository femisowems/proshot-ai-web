/**
 * Crops an image to a 4:5 aspect ratio (resume standard), centering the crop.
 * @param imageUrl The URL or Data URI of the image to crop.
 * @returns A Promise that resolves to the cropped image as a Data URI.
 */
export const cropToResumeAspect = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS if needed
        img.onload = () => {
            const canvas = document.createElement('canvas');

            // Calculate 4:5 aspect ratio dimensions
            // We want to keep the maximum possible size while maintaining 4:5
            let width = img.width;
            let height = img.height;

            // Target aspect ratio 4:5 = 0.8
            const targetRatio = 4 / 5;
            const currentRatio = width / height;

            let renderWidth, renderHeight, sx, sy;

            if (currentRatio > targetRatio) {
                // Image is wider than 4:5, height is the limiting factor
                renderHeight = height;
                renderWidth = height * targetRatio;
                sx = (width - renderWidth) / 2;
                sy = 0;
            } else {
                // Image is taller than 4:5 (or equal), width is the limiting factor
                renderWidth = width;
                renderHeight = width / targetRatio;
                sx = 0;
                sy = (height - renderHeight) / 2;
            }

            canvas.width = renderWidth;
            canvas.height = renderHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw the cropped portion
            ctx.drawImage(img, sx, sy, renderWidth, renderHeight, 0, 0, renderWidth, renderHeight);

            // Convert to Data URI
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
    });
};

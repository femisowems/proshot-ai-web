
/**
 * Crops an image to a 1:1 square, centering the crop.
 * @param imageUrl The URL or Data URI of the image to crop.
 * @returns A Promise that resolves to the cropped image as a Data URI.
 */
export const cropToSquare = (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS if needed
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Calculate centering coordinates
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            // Draw the cropped portion
            ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

            // Convert to Data URI
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
    });
};

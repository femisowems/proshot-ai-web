
/**
 * Loads an image from a File object into an HTMLCanvasElement, 
 * correcting for EXIF orientation using createImageBitmap if available.
 */
const loadImageToCanvas = async (file: File): Promise<HTMLCanvasElement> => {
    // 1. Try createImageBitmap (modern, handles orientation)
    if ('createImageBitmap' in window) {
        try {
            const bitmap = await createImageBitmap(file);
            const canvas = document.createElement('canvas');
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(bitmap, 0, 0);
                bitmap.close();
                return canvas;
            }
        } catch (e) {
            console.warn("createImageBitmap failed, falling back to Image", e);
        }
    }

    // 2. Fallback to Image (might lose orientation on some older browsers/contexts)
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas);
            } else {
                reject(new Error("Failed to get canvas context"));
            }
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Simplified smart crop (center crop) since we disabled MediaPipe.
 * Maintains the interface for compatibility.
 */
export async function smartCropToHeadshot(file: File): Promise<{ file: File; wasCropped: boolean }> {
    try {
        const imgCanvas = await loadImageToCanvas(file);

        const width = imgCanvas.width;
        const height = imgCanvas.height;
        const minDim = Math.min(width, height);

        // Calculate center crop
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return { file, wasCropped: false };
        }

        // Draw centered square crop
        ctx.drawImage(imgCanvas, sx, sy, minDim, minDim, 0, 0, 1024, 1024);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve({ file, wasCropped: false });
                    return;
                }
                const newFile = new File([blob], "headshot-cropped.jpg", { type: "image/jpeg" });
                resolve({ file: newFile, wasCropped: true });
            }, 'image/jpeg', 0.95);
        });

    } catch (error) {
        console.error("Smart crop error:", error);
        return { file, wasCropped: false };
    }
}

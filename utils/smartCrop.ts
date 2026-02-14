
import { FaceDetection, Results } from '@mediapipe/face_detection';

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
 * Smartly crops an image to a 1:1 headshot using MediaPipe Face Detection.
 * 
 * Logic:
 * 1. Detects face
 * 2. Calculates a crop region that includes shoulders and headroom
 * 3. Centers the face horizontally
 * 4. Ensures the crop is square (1:1)
 * 5. Returns a new JPEG File
 */
export async function smartCropToHeadshot(file: File): Promise<{ file: File; wasCropped: boolean }> {
    try {
        // Load to canvas instead of Image to ensure orientation is baked in
        const imgCanvas = await loadImageToCanvas(file);

        // Initialize FaceDetection
        const faceDetection = new FaceDetection({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
            model: 'short', // 'short' is faster and good for selfies (faces within 2m)
            minDetectionConfidence: 0.5,
        });

        return new Promise((resolve) => {
            faceDetection.onResults((results: Results) => {
                // If no detection, return original
                if (!results.detections || results.detections.length === 0) {
                    resolve({ file, wasCropped: false });
                    return;
                }

                // 1. Find primary face (largest bounding box area)
                let primaryFace = results.detections[0];
                let maxArea = 0;

                results.detections.forEach(detection => {
                    const bbox = detection.boundingBox;
                    if (!bbox) return; // Should not happen
                    const area = bbox.width * bbox.height;
                    if (area > maxArea) {
                        maxArea = area;
                        primaryFace = detection;
                    }
                });

                if (!primaryFace.boundingBox) {
                    resolve({ file, wasCropped: false });
                    return;
                }

                const bbox = primaryFace.boundingBox;

                // bbox is relative (0.0 - 1.0)
                const imgW = imgCanvas.width;
                const imgH = imgCanvas.height;

                const faceX = bbox.xCenter * imgW;
                const faceY = bbox.yCenter * imgH;
                const faceW = bbox.width * imgW;
                const faceH = bbox.height * imgH;

                // 2. Calculate Crop Dimensions
                // Goal: Square 1:1
                // Expand width by ~2.2x to include shoulders
                // Expand height by ~2.6x to include headroom and chest

                // Base size on the face width (usually more consistent than height)
                // Increased from 2.5 to 3.2 to include more shoulders and prevent "aggressive" cropping
                const cropSize = faceW * 3.2;

                // 3. Calculate Crop Origin (Top-Left)
                // Center horizontally on the face center
                let cropX = faceX - (cropSize / 2);

                // Vertical positioning: 
                // We want to center the face vertically a bit more.
                // Previously used 0.45 (eyes at 45%). 
                // Let's try 0.5 (face center at 50%) which is geometrically centered.
                // This might cut off less chin/neck if that was the issue.
                let cropY = faceY - (cropSize * 0.5);

                // 4. Constraint / Clamp to Image Bounds
                // Let's shift to keep within bounds first
                if (cropX < 0) cropX = 0;
                if (cropY < 0) cropY = 0;
                if (cropX + cropSize > imgW) cropX = imgW - cropSize;
                if (cropY + cropSize > imgH) cropY = imgH - cropSize;

                // Double check bounds after shifting (e.g. if image is very narrow/short)
                // If image is smaller than calculated cropSize, we must shrink the crop to the smallest dimension of the image
                let finalCropSize = cropSize;
                if (finalCropSize > imgW) {
                    finalCropSize = imgW;
                    cropX = 0;
                }
                if (finalCropSize > imgH) {
                    finalCropSize = imgH;
                    cropY = 0;
                }

                // 5. Draw to Canvas
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve({ file, wasCropped: false });
                    return;
                }

                // Fill with white just in case (though we should cover it all)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 1024, 1024);

                ctx.drawImage(
                    imgCanvas,
                    cropX, cropY, finalCropSize, finalCropSize, // Source rect
                    0, 0, 1024, 1024 // Dest rect
                );

                // 6. Convert to File
                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve({ file, wasCropped: false });
                        return;
                    }
                    const newFile = new File([blob], "headshot-cropped.jpg", { type: "image/jpeg" });
                    resolve({ file: newFile, wasCropped: true });
                }, 'image/jpeg', 0.95);
            });

            // Start detection - Pass the canvas!
            // MediaPipe accepts HTMLCanvasElement
            faceDetection.send({ image: imgCanvas });
        });

    } catch (error) {
        console.error("Smart crop error:", error);
        return { file, wasCropped: false };
    }
}

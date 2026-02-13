
import { FaceDetection, Results } from '@mediapipe/face_detection';

/**
 * Loads an image from a File object into an HTMLImageElement.
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
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
        const img = await loadImage(file);

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
                const imgW = img.width;
                const imgH = img.height;

                const faceX = bbox.xCenter * imgW;
                const faceY = bbox.yCenter * imgH;
                const faceW = bbox.width * imgW;
                const faceH = bbox.height * imgH;

                // 2. Calculate Crop Dimensions
                // Goal: Square 1:1
                // Expand width by ~2.2x to include shoulders
                // Expand height by ~2.6x to include headroom and chest

                // Base size on the face width (usually more consistent than height)
                const cropSize = faceW * 2.5;

                // 3. Calculate Crop Origin (Top-Left)
                // Center horizontally on the face center
                let cropX = faceX - (cropSize / 2);

                // Vertical positioning: 
                // We want eyes to be roughly at the 1/3 - 40% line. 
                // MediaPipe bbox yCenter is roughly the middle of the face box (nose area).
                // If we put the face center at ~45% of the crop height, it usually looks good.
                let cropY = faceY - (cropSize * 0.45);

                // 4. Constraint / Clamp to Image Bounds
                // If the crop extends outside, we might need to shift it or shrink it, 
                // but shrinking breaks our "shoulders" guarantee. 
                // For a simple implementation, we shift to fits, then if it still doesn't fit (image too small), we might pad or just take max possible.
                // However, LinkedIn/Headshots usually prioritize the subject, so we might zoom in/crop tighter if needed.

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
                    img,
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

            // Start detection
            faceDetection.send({ image: img });
        });

    } catch (error) {
        console.error("Smart crop error:", error);
        return { file, wasCropped: false };
    }
}

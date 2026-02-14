
/**
 * Scans the business card element and exports it as a PNG.
 * Since we want a robust solution without html2canvas if possible, but complex DOM to Canvas is hard,
 * we will use a simple canvas draw for the text/shapes if feasible, OR
 * since the user asked for "production-ready" and didn't forbid packages, but I authorized myself to use
 * native API to keep it light.
 * 
 * However, accurately rendering HTML (with tailored Tailwind styles, shadows, rounded corners) to Canvas 
 * manually is extremely error-prone and tedious. 
 * 
 * A better "native-ish" approach for simple cards is drawing the image and text on a hidden canvas 
 * based on the known state (name, title, etc) rather than trying to screenshot the DOM.
 * 
 * Let's implement a pure Canvas drawer that replicates the look of the card.
 */
export const exportBusinessCard = async (
    data: {
        fullName: string;
        title: string;
        company: string;
        photoUrl: string;
        theme: 'light' | 'dark';
    },
    filename: string
) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 3.5 : 2 ratio. Let's aim for high res: 1050px x 600px (300 DPI-ish for 3.5 inch)
    const width = 1050;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = data.theme === 'dark' ? '#111827' : '#ffffff'; // gray-900 vs white
    ctx.fillRect(0, 0, width, height);

    // Font setup
    const textColor = data.theme === 'dark' ? '#ffffff' : '#111827';
    const secondaryColor = data.theme === 'dark' ? '#9ca3af' : '#4b5563'; // gray-400 vs gray-600

    // Draw Content - Front Side Layout
    // Left side: Photo
    // Right side: Text details

    // 1. Photo (Circular)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = data.photoUrl;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const photoRadius = 160;
    const photoX = 180; // Center X of photo
    const photoY = height / 2; // Center Y

    ctx.save();
    ctx.beginPath();
    ctx.arc(photoX, photoY, photoRadius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // Draw image centered and covering the circle
    // Calculate aspect ratio crop
    const aspect = img.width / img.height;
    let drawWidth = photoRadius * 2;
    let drawHeight = photoRadius * 2;
    let sx = 0, sy = 0;

    if (aspect > 1) {
        // Landscape source
        sy = 0;
        sx = (img.width - img.height) / 2;
        // simplistic square crop from center
        ctx.drawImage(img, sx, sy, img.height, img.height, photoX - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
    } else {
        // Portrait source
        sx = 0;
        sy = (img.height - img.width) / 2;
        ctx.drawImage(img, sx, sy, img.width, img.width, photoX - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
    }

    ctx.restore();

    // 2. Text
    const textStartX = 400;
    const textCenterY = height / 2;

    // Name
    ctx.fillStyle = textColor;
    ctx.font = 'bold 64px sans-serif'; // mimicking tailwind font-bold text-4xl-ish
    ctx.textBaseline = 'bottom';
    ctx.fillText(data.fullName, textStartX, textCenterY - 10);

    // Title
    ctx.fillStyle = secondaryColor;
    ctx.font = '500 36px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(data.title, textStartX, textCenterY + 10);

    // Company
    ctx.fillStyle = secondaryColor;
    ctx.font = '400 28px sans-serif';
    ctx.fillText(data.company, textStartX, textCenterY + 60);

    // Export
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
};

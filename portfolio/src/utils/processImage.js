/**
 * Process an image file:
 * - If size <= 10MB: Returns raw Base64 (original quality/format).
 * - If size > 10MB: Compresses to JPEG (max 2000px width, 0.9 quality).
 * @param {File} file - The image file to process
 * @returns {Promise<string>} - Resolves with Base64 string
 */
export const processImage = (file) => {
    return new Promise((resolve, reject) => {
        const LIMIT_10MB = 10 * 1024 * 1024;

        // Case 1: Small enough? Return raw.
        if (file.size <= LIMIT_10MB) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            return;
        }

        // Case 2: Too large? Compress.
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxWidth = 2000;

                // Resize logic
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG 0.9
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.9);
                resolve(compressedBase64);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

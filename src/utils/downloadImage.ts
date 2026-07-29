export type DownloadImageMethod = 'canvas' | 'fetch' | 'open-tab';

export type DownloadImageError =
  | {
      method: 'canvas';
      fallbackMethod: 'fetch';
      error: unknown;
    }
  | {
      method: 'fetch';
      fallbackMethod: 'open-tab';
      error: unknown;
    };

export type DownloadImageResult = {
  method: DownloadImageMethod;
  errors: DownloadImageError[];
};

const reportDownloadError = (
  errors: DownloadImageError[],
  error: DownloadImageError,
  message: string,
) => {
  errors.push(error);
  console.warn(message, error.error);
};

/**
 * Downloads an image using multiple fallback methods to handle CORS restrictions
 * @param imageSrc - The source URL of the image to download
 * @param filename - The filename to use for the downloaded file
 * @param imageElement - Optional image element (for canvas method)
 */
export const downloadImage = async (
  imageSrc: string,
  filename: string,
  imageElement?: HTMLImageElement | null,
): Promise<DownloadImageResult> => {
  const errors: DownloadImageError[] = [];

  // Method 1: Try using canvas (works for same-origin images, even without CORS headers)
  // This works because the image is already loaded in the browser
  if (imageElement && imageElement.complete) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      canvas.width = imageElement.naturalWidth || imageElement.width;
      canvas.height = imageElement.naturalHeight || imageElement.height;

      // Draw the image to canvas
      ctx.drawImage(imageElement, 0, 0);

      // Convert to blob using Promise
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (!blob) throw new Error('Canvas conversion failed');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return { method: 'canvas', errors };
    } catch (error) {
      // Canvas method failed (likely CORS issue with cross-origin image), try fetch
      reportDownloadError(
        errors,
        { method: 'canvas', fallbackMethod: 'fetch', error },
        'Canvas download failed, trying fetch:',
      );
    }
  }

  // Method 2: Try fetch with CORS (works if server has proper CORS headers)
  try {
    const response = await fetch(imageSrc);
    if (!response.ok) throw new Error('Fetch failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { method: 'fetch', errors };
  } catch (error) {
    // Fetch failed (likely CORS issue), try fallback
    reportDownloadError(
      errors,
      { method: 'fetch', fallbackMethod: 'open-tab', error },
      'Fetch download failed, using fallback:',
    );
  }

  // Method 3: Fallback - open in new tab (download attribute won't work for cross-origin)
  // This is the last resort when CORS prevents download
  // Note: This will open the image in a new tab instead of downloading
  const link = document.createElement('a');
  link.href = imageSrc;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return { method: 'open-tab', errors };
};

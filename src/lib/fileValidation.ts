export interface FileValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  dimensions?: { width: number; height: number };
  aspectRatio?: number;
}

export function validateUploadedFile(
  file: { name: string; size: number; type: string },
  productSlug: string,
  extraParams?: {
    pixelWidth?: number;
    pixelHeight?: number;
    bannerWidthFt?: number;
    bannerHeightFt?: number;
  }
): FileValidationResult {
  const result: FileValidationResult = {
    isValid: true,
    warnings: [],
    errors: []
  };

  // 1. File size checks (limit to 20MB)
  const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_SIZE) {
    result.errors.push('File size exceeds the 20MB limit. Please upload a compressed or smaller file.');
    result.isValid = false;
    return result;
  }

  // 2. File type validation
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.svg'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    result.errors.push(`Unsupported file format "${ext}". Please upload PNG, JPG, JPEG, PDF, or SVG.`);
    result.isValid = false;
    return result;
  }

  // 3. Image DPI & aspect ratio validations if pixel sizes are provided
  if (extraParams?.pixelWidth && extraParams?.pixelHeight) {
    const w = extraParams.pixelWidth;
    const h = extraParams.pixelHeight;
    result.dimensions = { width: w, height: h };
    
    const aspect = w / h;
    result.aspectRatio = aspect;

    // Check resolution thresholds per product type
    if (productSlug === 'business-cards') {
      // Standard: 1050 x 600 px (3.5x2 inches at 300 DPI)
      if (w < 700 || h < 400) {
        result.warnings.push(
          'Your design resolution is low. For a sharp 300 DPI print on business cards, we recommend at least 1050 x 600 pixels. It may appear blurry when printed.'
        );
      }
    } else if (productSlug === 't-shirts') {
      // Standard: A4 area (1200 x 1200 minimum for detail)
      if (w < 800 || h < 800) {
        result.warnings.push(
          'The resolution of your design is small. We recommend uploading an image of at least 1200 x 1200 pixels for a clean T-Shirt print.'
        );
      }
    } else if (productSlug === 'flex-banners') {
      // Check banner aspect ratio matching
      if (extraParams.bannerWidthFt && extraParams.bannerHeightFt) {
        const selectedAspect = extraParams.bannerWidthFt / extraParams.bannerHeightFt;
        const aspectDiff = Math.abs(aspect - selectedAspect);
        
        if (aspectDiff > 0.05) {
          result.warnings.push(
            `Aspect ratio mismatch: Your uploaded image aspect ratio (${aspect.toFixed(2)}) does not match your selected banner dimensions aspect ratio (${selectedAspect.toFixed(2)}). The image will be stretched or cropped to fit.`
          );
        }
      }
      
      // Banners are big, so raw file needs to have some detail
      if (w < 1200 && h < 1200) {
        result.warnings.push(
          'Your banner image file size is low. For large-format printing, we suggest uploading high-resolution designs to avoid pixelation.'
        );
      }
    } else if (productSlug === 'flyers' || productSlug === 'posters' || productSlug === 'brochures') {
      if (w < 1200 || h < 1600) {
        result.warnings.push(
          'Low-resolution warning: This document style requires high-density detail. We advise uploading designs containing at least 1200 x 1600 pixels.'
        );
      }
    }
  }

  return result;
}

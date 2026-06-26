/**
 * Optimizes a Cloudinary image URL for faster loading.
 * Adds f_auto (auto format) and q_auto (auto quality) parameters.
 * If a width is provided, it scales the image down using w_<width>,c_scale.
 */
export function optimizeCloudinaryUrl(url: string | undefined | null, width?: number): string {
  if (!url) return '';
  
  // Only apply to Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Find the 'upload/' segment to inject transformations
  const uploadIndex = url.indexOf('upload/');
  if (uploadIndex === -1) {
    return url; // Cannot parse correctly, return original
  }

  const beforeUpload = url.substring(0, uploadIndex + 7); // include 'upload/'
  const afterUpload = url.substring(uploadIndex + 7);

  // If transformations are already present right after upload/ (no /v prefix), 
  // we could potentially double up, but Cloudinary usually handles comma-separated chained transformations.
  // We'll insert our optimizations.
  const transformations = ['f_auto', 'q_auto'];
  if (width) {
    transformations.push(`w_${width}`, 'c_scale');
  }

  return `${beforeUpload}${transformations.join(',')}/${afterUpload}`;
}

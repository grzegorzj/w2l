/**
 * SVG to Image Converter
 * 
 * Converts SVG strings to PNG or JPG using Sharp library.
 */

import sharp from 'sharp';

/**
 * Converts SVG string to PNG or JPG buffer
 * 
 * @param {string} svg - SVG string
 * @param {object} options - Conversion options
 * @param {string} options.format - Output format ('png' or 'jpg')
 * @param {number} options.width - Output width (optional)
 * @param {number} options.height - Output height (optional)
 * @param {number} options.quality - JPEG quality 1-100 (default: 90)
 * @returns {Promise<Buffer>} Image buffer
 */
export async function convertSVGToImage(svg, options = {}) {
  const {
    format = 'png',
    width,
    height,
    quality = 90
  } = options;

  try {
    // Create sharp instance from SVG buffer
    let image = sharp(Buffer.from(svg));

    // Get SVG metadata to determine dimensions
    const metadata = await image.metadata();

    // Resize if dimensions specified
    if (width || height) {
      image = image.resize({
        width: width ? Math.round(width) : undefined,
        height: height ? Math.round(height) : undefined,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: format === 'png' ? 0 : 1 }
      });
    }

    // Convert to requested format
    if (format === 'png') {
      image = image.png({ 
        compressionLevel: 9,
        quality: 100 
      });
    } else if (format === 'jpg' || format === 'jpeg') {
      image = image.jpeg({ 
        quality: Math.max(1, Math.min(100, quality)),
        mozjpeg: true 
      });
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    // Return buffer
    return await image.toBuffer();

  } catch (error) {
    throw new Error(`Image conversion failed: ${error.message}`);
  }
}

/**
 * Gets dimensions from SVG string
 * 
 * @param {string} svg - SVG string
 * @returns {Promise<{width: number, height: number}>} SVG dimensions
 */
export async function getSVGDimensions(svg) {
  try {
    const metadata = await sharp(Buffer.from(svg)).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    throw new Error(`Failed to get SVG dimensions: ${error.message}`);
  }
}


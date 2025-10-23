/**
 * Advanced Image Processing for Signature Background Removal
 * Uses adaptive thresholding and aggressive noise removal
 */

export interface ProcessingOptions {
  threshold?: number;
  contrast?: number;
  darknessFactor?: number;
  noiseReduction?: boolean;
  edgeSmoothing?: boolean;
  aggressiveMode?: boolean;
}

export class SignatureImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    this.ctx = context;
  }

  /**
   * Main processing function with advanced algorithms
   */
  async processImage(
    imageData: string,
    options: ProcessingOptions = {}
  ): Promise<string> {
    const {
      threshold = 160,
      contrast = 2.0,
      darknessFactor = 0.5,
      noiseReduction = true,
      edgeSmoothing = true,
      aggressiveMode = true,
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.ctx.drawImage(img, 0, 0);

          let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

          // Step 1: Adaptive background removal with high threshold
          this.advancedBackgroundRemoval(
            imgData.data, 
            threshold, 
            contrast, 
            darknessFactor,
            aggressiveMode
          );

          // Step 2: Aggressive noise reduction (multiple passes)
          if (noiseReduction) {
            imgData = this.aggressiveNoiseReduction(imgData, this.canvas.width, this.canvas.height);
          }

          // Step 3: Remove isolated pixels and small artifacts
          imgData = this.removeIsolatedPixels(imgData, this.canvas.width, this.canvas.height);

          // Step 4: Edge cleaning to remove paper texture
          imgData = this.cleanEdges(imgData, this.canvas.width, this.canvas.height);

          this.ctx.putImageData(imgData, 0, 0);

          // Step 5: Edge smoothing for professional look
          if (edgeSmoothing) {
            this.applyAdvancedSmoothing();
          }

          resolve(this.canvas.toDataURL('image/png'));
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageData;
    });
  }

  /**
   * Advanced background removal with adaptive thresholding
   */
  private advancedBackgroundRemoval(
    data: Uint8ClampedArray,
    threshold: number,
    contrast: number,
    darknessFactor: number,
    aggressive: boolean
  ): void {
    const adjustedThreshold = aggressive ? threshold - 20 : threshold;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to grayscale with optimized weights
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      // Enhanced contrast
      let enhanced = (gray - 128) * contrast + 128;
      enhanced = Math.max(0, Math.min(255, enhanced));

      if (enhanced > adjustedThreshold) {
        // Light pixels = completely transparent
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 0;
      } else {
        // Dark pixels = enhanced black signature
        const darkValue = Math.max(0, enhanced * darknessFactor);
        
        // Extra darkening for signature ink
        const finalDark = Math.max(0, darkValue * 0.8);
        
        data[i] = finalDark;
        data[i + 1] = finalDark;
        data[i + 2] = finalDark;
        data[i + 3] = 255;
      }
    }
  }

  /**
   * Aggressive noise reduction - multiple passes
   */
  private aggressiveNoiseReduction(
    imgData: ImageData,
    width: number,
    height: number
  ): ImageData {
    let data = imgData.data;
    
    // Pass 1: Remove isolated pixels
    for (let pass = 0; pass < 3; pass++) {
      const newData = new Uint8ClampedArray(data);

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;

          if (data[idx + 3] > 0) {
            let opaqueNeighbors = 0;
            let totalNeighbors = 0;

            // Check 8 surrounding pixels
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                totalNeighbors++;
                const nIdx = ((y + dy) * width + (x + dx)) * 4;
                if (data[nIdx + 3] > 0) opaqueNeighbors++;
              }
            }

            // If less than 30% neighbors are opaque, remove pixel
            if (opaqueNeighbors < totalNeighbors * 0.3) {
              newData[idx + 3] = 0;
            }
          }
        }
      }

      data = newData;
    }

    return new ImageData(data, width, height);
  }

  /**
   * Remove completely isolated pixels
   */
  private removeIsolatedPixels(
    imgData: ImageData,
    width: number,
    height: number
  ): ImageData {
    const data = imgData.data;
    const newData = new Uint8ClampedArray(data);

    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = (y * width + x) * 4;

        if (data[idx + 3] > 0) {
          let hasConnection = false;

          // Check in a 5x5 area for connected pixels
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (Math.abs(dx) + Math.abs(dy) < 2) continue;
              const nIdx = ((y + dy) * width + (x + dx)) * 4;
              if (data[nIdx + 3] > 0) {
                hasConnection = true;
                break;
              }
            }
            if (hasConnection) break;
          }

          if (!hasConnection) {
            newData[idx + 3] = 0;
          }
        }
      }
    }

    return new ImageData(newData, width, height);
  }

  /**
   * Clean edges to remove paper texture artifacts
   */
  private cleanEdges(
    imgData: ImageData,
    width: number,
    height: number
  ): ImageData {
    const data = imgData.data;
    const newData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        if (data[idx + 3] > 0) {
          // Calculate average darkness of neighboring pixels
          let darkNeighbors = 0;

          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nIdx = ((y + dy) * width + (x + dx)) * 4;
              if (data[nIdx + 3] > 0) {
                if (data[nIdx] < 100) darkNeighbors++;
              }
            }
          }

          // If pixel is light gray and surrounded by few dark pixels, remove it
          const currentBrightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          if (currentBrightness > 50 && darkNeighbors < 3) {
            newData[idx + 3] = 0;
          }
        }
      }
    }

    return new ImageData(newData, width, height);
  }

  /**
   * Advanced edge smoothing
   */
  private applyAdvancedSmoothing(): void {
    // First pass: subtle blur
    this.ctx.filter = 'blur(0.3px)';
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.drawImage(this.canvas, 0, 0);
      this.ctx.filter = 'none';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(tempCanvas, 0, 0);
    }
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  destroy(): void {
    this.canvas.width = 0;
    this.canvas.height = 0;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please upload a valid image file' };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  return { valid: true };
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Download processed image
 */
export function downloadImage(dataURL: string, filename: string = 'signature-transparent.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
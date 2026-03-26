// Image processing utilities for wallpaper colorization

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Calculate Euclidean distance between two colors in RGB space
function colorDistance(color1, color2) {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2)
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function seededNoise(x, y, seed) {
  const n = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function convertToMonochrome(imageData) {
  const data = imageData.data;
  const result = new ImageData(
    new Uint8ClampedArray(data),
    imageData.width,
    imageData.height
  );
  const resultData = result.data;

  for (let i = 0; i < data.length; i += 4) {
    // Perceptual grayscale conversion keeps luminance relationships stable.
    const gray = Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
    resultData[i] = gray;
    resultData[i + 1] = gray;
    resultData[i + 2] = gray;
    resultData[i + 3] = data[i + 3];
  }

  return result;
}

// K-means clustering for dominant color extraction
function extractDominantColors(imageData, colorCount = 8) {
  const data = imageData.data;
  const pixels = [];

  // Sample pixels (every nth pixel for performance)
  const sampleRate = Math.max(1, Math.floor(data.length / (colorCount * 500)));
  for (let i = 0; i < data.length; i += sampleRate * 4) {
    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2]
    });
  }

  // Initialize centroids randomly from pixel data
  const centroids = [];
  for (let i = 0; i < colorCount; i++) {
    centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
  }

  // K-means iterations
  const maxIterations = 10;
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign pixels to nearest centroid
    const clusters = Array(colorCount).fill(null).map(() => []);
    
    for (const pixel of pixels) {
      let nearestCentroid = 0;
      let minDistance = Infinity;

      for (let i = 0; i < centroids.length; i++) {
        const distance = colorDistance(pixel, centroids[i]);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCentroid = i;
        }
      }

      clusters[nearestCentroid].push(pixel);
    }

    // Update centroids
    let converged = true;
    for (let i = 0; i < centroids.length; i++) {
      if (clusters[i].length === 0) continue;

      const newCentroid = {
        r: Math.round(clusters[i].reduce((sum, p) => sum + p.r, 0) / clusters[i].length),
        g: Math.round(clusters[i].reduce((sum, p) => sum + p.g, 0) / clusters[i].length),
        b: Math.round(clusters[i].reduce((sum, p) => sum + p.b, 0) / clusters[i].length)
      };

      if (colorDistance(newCentroid, centroids[i]) > 1) {
        converged = false;
      }

      centroids[i] = newCentroid;
    }

    if (converged) break;
  }

  return centroids.filter(c => c);
}

// Find closest color in palette to a given color
function findClosestColor(color, palette) {
  let closestColor = palette[0];
  let minDistance = Infinity;

  for (const paletteColor of palette) {
    const distance = colorDistance(color, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  }

  return closestColor;
}

// Build a color mapping from source to target palette
function buildColorMap(sourceColors, targetPalette) {
  const colorMap = new Map();

  for (const sourceColor of sourceColors) {
    const key = rgbToHex(sourceColor.r, sourceColor.g, sourceColor.b);
    const closestTarget = findClosestColor(sourceColor, targetPalette);
    colorMap.set(key, closestTarget);
  }

  return colorMap;
}

// Apply color mapping to image with intensity control
function applyColorMapping(imageData, colorMap, targetPalette, intensity = 1.0) {
  const data = imageData.data;
  const result = new ImageData(
    new Uint8ClampedArray(data),
    imageData.width,
    imageData.height
  );
  const resultData = result.data;

  for (let i = 0; i < data.length; i += 4) {
    const originalColor = {
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
      a: data[i + 3]
    };

    // Find closest color from source palette
    const closestSourceKey = rgbToHex(originalColor.r, originalColor.g, originalColor.b);
    let targetColor = colorMap.get(closestSourceKey);

    // If not in map, find closest anyway
    if (!targetColor) {
      targetColor = findClosestColor(originalColor, targetPalette);
    }

    // Blend original with target based on intensity
    resultData[i] = Math.round(originalColor.r + (targetColor.r - originalColor.r) * intensity);
    resultData[i + 1] = Math.round(originalColor.g + (targetColor.g - originalColor.g) * intensity);
    resultData[i + 2] = Math.round(originalColor.b + (targetColor.b - originalColor.b) * intensity);
    resultData[i + 3] = originalColor.a;
  }

  return result;
}

// Main colorization function
export function colorizeImage(canvas, targetPaletteColors, intensity = 1.0) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const monochromeImageData = convertToMonochrome(imageData);

  // Extract dominant tones from the monochrome image before palette conversion.
  const sourceColors = extractDominantColors(monochromeImageData, Math.min(12, targetPaletteColors.length));

  // Convert hex palette to RGB
  const targetPaletteRgb = targetPaletteColors.map(hexToRgb);

  // Build color mapping
  const colorMap = buildColorMap(sourceColors, targetPaletteRgb);

  // Apply mapping with intensity
  const colorizedImageData = applyColorMapping(monochromeImageData, colorMap, targetPaletteRgb, intensity);

  // Put the colorized data back
  ctx.putImageData(colorizedImageData, 0, 0);
}

// Adds subtle paper grain similar to printed manga texture.
export function applyPaperNoise(canvas, intensity = 0.0) {
  if (intensity <= 0) return;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    const highGrain = seededNoise(x, y, 11) - 0.5;
    const softGrain = seededNoise(Math.floor(x / 3), Math.floor(y / 3), 23) - 0.5;
    const fiberLine = seededNoise(0, y, 31) - 0.5;

    const grain = highGrain * 0.65 + softGrain * 0.35 + fiberLine * 0.25;
    const dynamicStrength = (8 + ((255 - luma) / 255) * 10) * intensity;
    const delta = grain * dynamicStrength;

    const paperWarmth = (seededNoise(x, y, 47) - 0.5) * 4 * intensity;

    data[i] = clamp(Math.round(r + delta + paperWarmth), 0, 255);
    data[i + 1] = clamp(Math.round(g + delta + paperWarmth * 0.8), 0, 255);
    data[i + 2] = clamp(Math.round(b + delta - paperWarmth * 0.6), 0, 255);
  }

  ctx.putImageData(imageData, 0, 0);
}

// Export image as PNG
export function downloadCanvasAsPNG(canvas, filename = 'wallpaper.png') {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Create a copy of canvas state
export function copyCanvas(sourceCanvas) {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = sourceCanvas.width;
  newCanvas.height = sourceCanvas.height;
  const ctx = newCanvas.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0);
  return newCanvas;
}

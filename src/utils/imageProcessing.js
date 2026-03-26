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

function squaredDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Bayer 4x4 dithering matrix for ordered dithering
const BAYER_4x4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5]
];

const BAYER_SIZE = 4;
const BAYER_FACTOR = 256 / (BAYER_SIZE * BAYER_SIZE);

function computeCentroids(pixels, nClusters) {
  const centroids = [];
  centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);

  for (let c = 1; c < nClusters; c++) {
    const dists = new Float64Array(pixels.length);
    let distSum = 0;

    for (let i = 0; i < pixels.length; i++) {
      let minDist = Infinity;
      for (let j = 0; j < centroids.length; j++) {
        const dist = Math.sqrt(squaredDistance(pixels[i], centroids[j]));
        if (dist < minDist) minDist = dist;
      }
      dists[i] = minDist;
      distSum += minDist;
    }

    if (distSum <= 0) {
      centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);
      continue;
    }

    const threshold = Math.random() * distSum;
    let cumulative = 0;
    let chosenIndex = pixels.length - 1;

    for (let i = 0; i < dists.length; i++) {
      cumulative += dists[i];
      if (cumulative >= threshold) {
        chosenIndex = i;
        break;
      }
    }

    centroids.push([...pixels[chosenIndex]]);
  }

  return centroids;
}

function simpleKmeans(pixels, nClusters = 8, maxIter = 10) {
  const k = Math.max(1, Math.min(nClusters, pixels.length));
  const labels = new Uint16Array(pixels.length);
  let centroids = computeCentroids(pixels, k);

  for (let iter = 0; iter < maxIter; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const dist = squaredDistance(pixels[i], centroids[c]);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = c;
        }
      }
      labels[i] = bestIdx;
    }

    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const cluster = labels[i];
      sums[cluster][0] += pixels[i][0];
      sums[cluster][1] += pixels[i][1];
      sums[cluster][2] += pixels[i][2];
      sums[cluster][3] += 1;
    }

    const newCentroids = Array.from({ length: k }, (_, c) => {
      if (sums[c][3] === 0) return [...centroids[c]];
      return [
        sums[c][0] / sums[c][3],
        sums[c][1] / sums[c][3],
        sums[c][2] / sums[c][3]
      ];
    });

    let converged = true;
    for (let c = 0; c < k; c++) {
      if (
        Math.abs(newCentroids[c][0] - centroids[c][0]) > 1e-2 ||
        Math.abs(newCentroids[c][1] - centroids[c][1]) > 1e-2 ||
        Math.abs(newCentroids[c][2] - centroids[c][2]) > 1e-2
      ) {
        converged = false;
        break;
      }
    }

    centroids = newCentroids;
    if (converged) break;
  }

  return { labels, centroids };
}

// Main colorization function
export function colorizeImage(canvas, targetPaletteColors, intensity = 1.0) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const blend = clamp(intensity, 0, 1);

  const pixels = new Array(canvas.width * canvas.height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    pixels[p] = [data[i], data[i + 1], data[i + 2]];
  }

  const nColors = Math.max(1, Math.min(8, targetPaletteColors.length));
  const { labels, centroids } = simpleKmeans(pixels, nColors, 10);

  const targetPalette = targetPaletteColors.map(hexToRgb).filter(Boolean).map(c => [c.r, c.g, c.b]);
  if (targetPalette.length === 0) return;

  const mappedPalette = centroids.map((center) => {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < targetPalette.length; i++) {
      const dist = squaredDistance(center, targetPalette[i]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return targetPalette[bestIdx];
  });

  const blendedColors = mappedPalette.map((mapped, idx) => {
    const center = centroids[idx];
    return [
      clamp(Math.round(mapped[0] * blend + center[0] * (1 - blend)), 0, 255),
      clamp(Math.round(mapped[1] * blend + center[1] * (1 - blend)), 0, 255),
      clamp(Math.round(mapped[2] * blend + center[2] * (1 - blend)), 0, 255)
    ];
  });

  const recolored = new Uint8ClampedArray(data);
  for (let i = 0, p = 0; i < recolored.length; i += 4, p++) {
    const color = blendedColors[labels[p]];
    recolored[i] = color[0];
    recolored[i + 1] = color[1];
    recolored[i + 2] = color[2];
  }

  ctx.putImageData(new ImageData(recolored, imageData.width, imageData.height), 0, 0);
}

// Adds ordered dithering (Bayer 4x4 matrix) for paper-like texture
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

    // Convert to grayscale using luma formula
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Find position in the Bayer matrix (tiling it across the image)
    const matrixRow = y % BAYER_SIZE;
    const matrixCol = x % BAYER_SIZE;

    // Get threshold from Bayer matrix and scale to 0-255 range
    const threshold = BAYER_4x4[matrixRow][matrixCol] * BAYER_FACTOR;

    // Apply dithering: add noise based on intensity (scaled higher for more pronounced effect)
    const scaledIntensity = Math.pow(intensity / 100, 0.5) * 2.5;
    const ditherStrength = (threshold - 128) * scaledIntensity;
    const dynamicDither = ditherStrength * (1 + (Math.abs(luma - 128) / 128) * 0.5);

    data[i] = clamp(Math.round(r + dynamicDither), 0, 255);
    data[i + 1] = clamp(Math.round(g + dynamicDither), 0, 255);
    data[i + 2] = clamp(Math.round(b + dynamicDither), 0, 255);
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

# Colorizer Technical Notes

This document describes the current wallpaper colorization pipeline implemented in the app.

## Overview

The colorizer takes an uploaded image and a selected target palette, then performs these stages:

1. Read image pixels from a canvas.
2. Cluster image colors using k-means (with k-means++ centroid initialization).
3. Map each cluster centroid to the nearest color in the selected palette.
4. Blend mapped palette colors with original centroids using the colorization intensity slider.
5. Reconstruct the full image from cluster labels.
6. Optionally apply ordered dithering using a Bayer 4x4 matrix via the noise slider.
7. Render and allow PNG download.

Core implementation lives in [src/utils/imageProcessing.js](../src/utils/imageProcessing.js).

## Input and Data Flow

- Input image is drawn to a working canvas.
- Colorizer reads RGBA bytes via Canvas 2D API (`getImageData`).
- For clustering and recoloring, only RGB channels are used.
- Alpha is preserved from the original image during reconstruction.

## Colorization Algorithm

### 1. Pixel Extraction

Each pixel RGB triplet is extracted into an array:

- `pixels[i] = [r, g, b]`

This provides the sample set for k-means.

### 2. k-means++ Initialization

Centroids are initialized using a k-means++ style process:

1. Pick first centroid randomly from pixels.
2. For each next centroid:
   - Compute each pixel's distance to its nearest existing centroid.
   - Sample a new centroid with probability proportional to that distance.

This gives better starting points than pure random initialization and typically converges faster.

### 3. k-means Clustering

For up to `maxIter = 10` iterations:

1. Assign each pixel to the nearest centroid (Euclidean distance in RGB).
2. Recompute each centroid as the mean of assigned pixels.
3. Stop early when centroid movement is below tolerance (`1e-2`).

Outputs:

- `labels`: cluster index for each pixel
- `centroids`: final cluster center colors

### 4. Centroid to Palette Mapping

Each centroid is mapped to the nearest target palette color by Euclidean RGB distance.

- Target palette comes from the selected theme palette hex values.
- Hex values are converted to RGB triplets first.

### 5. Blend Formula (Intensity)

For each centroid, a blended output color is computed:

$$
\text{blended} = \text{mapped} \cdot \text{blend} + \text{centroid} \cdot (1 - \text{blend})
$$

Where:

- `mapped` = nearest color from selected palette
- `centroid` = original cluster center
- `blend` = colorization intensity in range `[0, 1]`

Interpretation:

- `blend = 0` keeps original cluster colors.
- `blend = 1` fully snaps clusters to palette colors.
- Intermediate values interpolate smoothly.

### 6. Reconstruction

Each pixel output color is looked up by its cluster label:

- `pixelColor = blendedColors[labels[pixelIndex]]`

Result is written back into a new `ImageData` buffer, preserving alpha.

## Paper Grain / Ordered Dithering Stage

After recoloring, optional ordered dithering is applied with `applyPaperNoise(...)` using a Bayer 4x4 matrix.

Key characteristics:

- **Bayer 4x4 Matrix**: A structured 4x4 dithering pattern that tiles across the image for predictable, geometric dot placement.
- **Luminance-aware scaling**: Dithering strength increases in darker regions and decreases in bright areas, creating natural-looking texture variation.
- **Normalized threshold calculation**: Each pixel's position in the matrix determines a threshold in the 0-255 range for dithering application.
- **Controlled by the noise slider**: Range `[0, 100]` with a power curve scaling for more pronounced effect at higher values.

This stage is intentionally post-colorization so dithering affects the final colored image, creating a refined printed/halftone aesthetic.

## UI Controls and Their Effect

Implemented in [src/components/SchemeSelector.jsx](../src/components/SchemeSelector.jsx) and consumed by [src/App.jsx](../src/App.jsx):

1. **Color Scheme**
   - Selects target palette array.
2. **Colorization Intensity**
   - Feeds `blend` in the remap equation.
3. **Paper Grain**
   - Feeds intensity into `applyPaperNoise(...)`.

## Performance Notes

- Complexity is dominated by k-means assignment step: approximately `O(N * K * I)`.
  - `N` = number of pixels
  - `K` = number of clusters (currently up to 8)
  - `I` = iterations (up to 10)
- Runs fully client-side in browser (no backend processing).
- Large images can increase processing time due to full-pixel clustering.

## Current Defaults and Constraints

- Clusters: up to 8 (`min(8, palette length)`).
- Iterations: max 10.
- Build uses Vite/React; processing uses Canvas + plain JS utilities.

## Potential Future Improvements

1. Add optional downsample-before-cluster mode for large wallpapers.
2. Add LAB/CIEDE2000 nearest-color mapping mode for perceptual matching.
3. Move heavy clustering to a Web Worker for smoother UI on big images.
4. Expose cluster count as an advanced control.

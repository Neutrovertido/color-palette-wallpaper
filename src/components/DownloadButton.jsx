import React from 'react';
import { downloadCanvasAsPNG } from '../utils/imageProcessing';
import '../styles/DownloadButton.css';

export default function DownloadButton({ 
  colorizedCanvas, 
  selectedScheme,
  isLoading 
}) {
  const handleDownload = () => {
    if (!colorizedCanvas) return;
    
    const filename = `wallpaper-${selectedScheme || 'colorized'}.png`;
    downloadCanvasAsPNG(colorizedCanvas, filename);
  };

  return (
    <button
      className="download-btn"
      onClick={handleDownload}
      disabled={!colorizedCanvas || isLoading}
    >
      {isLoading ? 'Processing...' : '⬇️ Download PNG'}
    </button>
  );
}

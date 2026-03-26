import React, { useEffect, useRef } from 'react';
import '../styles/PreviewPanel.css';

export default function PreviewPanel({ 
  originalImage, 
  colorizedCanvas,
  showColorized,
  onToggle 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (!showColorized && originalImage) {
      // Draw original image
      const maxWidth = canvasRef.current.width;
      const maxHeight = canvasRef.current.height;
      const ratio = Math.min(maxWidth / originalImage.width, maxHeight / originalImage.height);
      
      const x = (maxWidth - originalImage.width * ratio) / 2;
      const y = (maxHeight - originalImage.height * ratio) / 2;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(originalImage, x, y, originalImage.width * ratio, originalImage.height * ratio);
    } else if (colorizedCanvas) {
      // Draw colorized canvas
      const maxWidth = canvasRef.current.width;
      const maxHeight = canvasRef.current.height;
      const ratio = Math.min(maxWidth / colorizedCanvas.width, maxHeight / colorizedCanvas.height);
      
      const x = (maxWidth - colorizedCanvas.width * ratio) / 2;
      const y = (maxHeight - colorizedCanvas.height * ratio) / 2;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(colorizedCanvas, x, y, colorizedCanvas.width * ratio, colorizedCanvas.height * ratio);
    }
  }, [showColorized, originalImage, colorizedCanvas]);

  const originalDimensions = originalImage 
    ? `${originalImage.width} × ${originalImage.height}px`
    : 'No image';

  return (
    <div className="preview-panel">
      <div className="preview-container">
        <canvas
          ref={canvasRef}
          className="preview-canvas"
          width={800}
          height={600}
        />
      </div>
      
      <div className="preview-controls">
        <div className="preview-toggle">
          <button
            className={`toggle-btn ${!showColorized ? 'active' : ''}`}
            onClick={() => onToggle(false)}
            disabled={!originalImage}
          >
            Original
          </button>
          <button
            className={`toggle-btn ${showColorized ? 'active' : ''}`}
            onClick={() => onToggle(true)}
            disabled={!colorizedCanvas}
          >
            Colorized
          </button>
        </div>
        <p className="preview-info">{!showColorized ? 'Original' : 'Colorized'} · {originalDimensions}</p>
      </div>
    </div>
  );
}

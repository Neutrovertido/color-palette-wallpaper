import React, { useEffect, useRef, useState } from 'react';
import '../styles/PreviewPanel.css';

export default function PreviewPanel({ 
  originalImage, 
  colorizedCanvas,
  showColorized,
  onToggle 
}) {
  const canvasRef = useRef(null);
  const comparisonCanvasRef = useRef(null);
  const [isComparison, setIsComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    if (isComparison) {
      // Comparison view - show both images with slider
      if (!originalImage || !colorizedCanvas) return;
      
      const maxWidth = canvasRef.current.width;
      const maxHeight = canvasRef.current.height;
      const ratio = Math.min(maxWidth / originalImage.width, maxHeight / originalImage.height);
      
      const x = (maxWidth - originalImage.width * ratio) / 2;
      const y = (maxHeight - originalImage.height * ratio) / 2;
      const scaledWidth = originalImage.width * ratio;
      const scaledHeight = originalImage.height * ratio;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw original image
      ctx.drawImage(originalImage, x, y, scaledWidth, scaledHeight);
      
      // Draw colorized image on top, clipped by slider position
      const sliderX = x + (scaledWidth * sliderPosition) / 100;
      ctx.save();
      ctx.beginPath();
      ctx.rect(sliderX, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.clip();
      ctx.drawImage(colorizedCanvas, x, y, scaledWidth, scaledHeight);
      ctx.restore();
      
      // Draw slider line
      ctx.strokeStyle = '#ff79c6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sliderX, 0);
      ctx.lineTo(sliderX, canvasRef.current.height);
      ctx.stroke();
      
      // Draw slider handle
      ctx.fillStyle = '#ff79c6';
      ctx.beginPath();
      ctx.arc(sliderX, canvasRef.current.height / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (!showColorized && originalImage) {
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
  }, [showColorized, originalImage, colorizedCanvas, isComparison, sliderPosition]);

  const handleCanvasMouseMove = (e) => {
    if (!isComparison || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleCanvasTouchMove = (e) => {
    if (!isComparison || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const originalDimensions = originalImage 
    ? `${originalImage.width} × ${originalImage.height}px`
    : 'No image';

  return (
    <div className="preview-panel">
      <div className="preview-container">
        <canvas
          ref={canvasRef}
          className={`preview-canvas ${isComparison ? 'comparison-mode' : ''}`}
          width={800}
          height={600}
          onMouseMove={handleCanvasMouseMove}
          onTouchMove={handleCanvasTouchMove}
        />
      </div>
      
      <div className="preview-controls">
        <div className="preview-toggle">
          <button
            className={`toggle-btn ${!showColorized && !isComparison ? 'active' : ''}`}
            onClick={() => {
              setIsComparison(false);
              onToggle(false);
            }}
            disabled={!originalImage}
          >
            Original
          </button>
          <button
            className={`toggle-btn vs-btn ${isComparison ? 'active' : ''}`}
            onClick={() => setIsComparison(!isComparison)}
            disabled={!originalImage || !colorizedCanvas}
            title="Compare Original vs Colorized"
          >
            VS
          </button>
          <button
            className={`toggle-btn ${showColorized && !isComparison ? 'active' : ''}`}
            onClick={() => {
              setIsComparison(false);
              onToggle(true);
            }}
            disabled={!colorizedCanvas}
          >
            Colorized
          </button>
        </div>
        <p className="preview-info">
          {isComparison ? 'Comparison' : (!showColorized ? 'Original' : 'Colorized')} · {originalDimensions}
        </p>
      </div>
    </div>
  );
}

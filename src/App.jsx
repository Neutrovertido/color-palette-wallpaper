import React, { useState, useRef, useEffect } from 'react';
import UploadArea from './components/UploadArea';
import PreviewPanel from './components/PreviewPanel';
import SchemeSelector from './components/SchemeSelector';
import DownloadButton from './components/DownloadButton';
import LoadingModal from './components/LoadingModal';
import { colorPalettes } from './data/colorPalettes';
import { colorizeImage, copyCanvas, applyPaperNoise } from './utils/imageProcessing';
import './styles/App.css';

export default function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState('');
  const [intensity, setIntensity] = useState(1.0);
  const [noiseIntensity, setNoiseIntensity] = useState(0.2);
  const [colorizedCanvas, setColorizedCanvas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showColorized, setShowColorized] = useState(false);
  const workingCanvasRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (img) => {
    setOriginalImage(img);
    setSelectedScheme('');
    setIntensity(1.0);
    setNoiseIntensity(0.2);
    setColorizedCanvas(null);
    setShowColorized(false);
  };

  // Create working canvas from original image
  const getWorkingCanvas = () => {
    if (!workingCanvasRef.current) {
      workingCanvasRef.current = document.createElement('canvas');
    }
    
    const canvas = workingCanvasRef.current;
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(originalImage, 0, 0);
    
    return canvas;
  };

  // Colorize image when scheme or intensity changes
  useEffect(() => {
    if (!originalImage || !selectedScheme) {
      setColorizedCanvas(null);
      return;
    }

    const processColorization = async () => {
      setIsLoading(true);
      
      // Use a longer timeout to allow the loading modal to fully render before processing
      setTimeout(() => {
        try {
          const workingCanvas = getWorkingCanvas();
          const palette = colorPalettes[selectedScheme];
          
          if (palette) {
            colorizeImage(workingCanvas, palette.colors, intensity);
            applyPaperNoise(workingCanvas, noiseIntensity);
            
            // Create a copy for display
            const displayCanvas = copyCanvas(workingCanvas);
            setColorizedCanvas(displayCanvas);
          }
        } catch (error) {
          console.error('Colorization error:', error);
          alert('Error colorizing image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 300);
    };

    processColorization();
  }, [selectedScheme, intensity, noiseIntensity, originalImage]);

  // Auto-toggle to colorized view when colorization completes
  useEffect(() => {
    if (colorizedCanvas && !isLoading) {
      setShowColorized(true);
    }
  }, [colorizedCanvas, isLoading]);

  return (
    <div className="app">
      <LoadingModal isVisible={isLoading} />
      
      <header className="app-header">
        <h1>🧑‍🎨 Wallpaper Colorizer</h1>
        <p>Upload a wallpaper and explore it in different color schemes</p>
      </header>

      <main className="app-main">
        <div className="app-layout">
          {!originalImage ? (
            <div className="upload-section">
              <UploadArea onImageUpload={handleImageUpload} />
            </div>
          ) : (
            <>
              <div className="control-section">
                <SchemeSelector
                  selectedScheme={selectedScheme}
                  onSchemeChange={setSelectedScheme}
                  intensity={intensity}
                  onIntensityChange={setIntensity}
                  noiseIntensity={noiseIntensity}
                  onNoiseChange={setNoiseIntensity}
                  isLoading={isLoading}
                />
                <DownloadButton
                  colorizedCanvas={colorizedCanvas}
                  selectedScheme={selectedScheme}
                  isLoading={isLoading}
                />
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setOriginalImage(null);
                    setSelectedScheme('');
                    setIntensity(1.0);
                    setNoiseIntensity(0.2);
                    setColorizedCanvas(null);
                    setShowColorized(false);
                  }}
                >
                  Upload Different Image
                </button>
              </div>

              <div className="preview-section">
                <PreviewPanel
                  originalImage={originalImage}
                  colorizedCanvas={colorizedCanvas}
                  showColorized={showColorized}
                  onToggle={setShowColorized}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>All processing happens in your browser · No uploads to servers</p>
      </footer>
    </div>
  );
}

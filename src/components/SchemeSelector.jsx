import React from 'react';
import { colorPalettes, paletteNames } from '../data/colorPalettes';
import '../styles/SchemeSelector.css';

export default function SchemeSelector({ 
  selectedScheme, 
  onSchemeChange, 
  intensity, 
  onIntensityChange,
  noiseIntensity,
  onNoiseChange,
  isLoading 
}) {
  return (
    <div className="scheme-selector">
      <div className="selector-group">
        <span className="selector-label">Color Scheme</span>
        <div className="palette-grid" role="radiogroup" aria-label="Color scheme selection">
          {paletteNames.map((palette) => {
            const paletteColors = colorPalettes[palette.id]?.colors || [];
            const isSelected = selectedScheme === palette.id;

            return (
              <button
                key={palette.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={palette.label}
                disabled={isLoading}
                onClick={() => onSchemeChange(palette.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSchemeChange(palette.id);
                  }
                }}
                className={`palette-card ${isSelected ? 'selected' : ''}`}
              >
                <span className="palette-name">{palette.label}</span>
                <span className="palette-swatches" aria-hidden="true">
                  {paletteColors.slice(0, 8).map((color, index) => (
                    <span
                      key={`${palette.id}-${index}`}
                      className="swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="selector-group">
        <label htmlFor="intensity-slider">
          Colorization Intensity: {Math.round(intensity * 100)}%
        </label>
        <div className="intensity-container">
          <span className="intensity-label">Original</span>
          <input
            id="intensity-slider"
            type="range"
            min="0"
            max="100"
            value={Math.round(intensity * 100)}
            onChange={(e) => onIntensityChange(parseInt(e.target.value) / 100)}
            disabled={isLoading}
            className="intensity-slider"
          />
          <span className="intensity-label">Colorized</span>
        </div>
      </div>

      <div className="selector-group">
        <label htmlFor="noise-slider">
          Paper Grain: {Math.round(noiseIntensity * 100)}%
        </label>
        <div className="intensity-container">
          <span className="intensity-label">Smooth</span>
          <input
            id="noise-slider"
            type="range"
            min="0"
            max="100"
            value={Math.round(noiseIntensity * 100)}
            onChange={(e) => onNoiseChange(parseInt(e.target.value, 10) / 100)}
            disabled={isLoading}
            className="intensity-slider"
          />
          <span className="intensity-label">Noisy</span>
        </div>
      </div>
    </div>
  );
}

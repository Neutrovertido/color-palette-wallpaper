import React from 'react';
import { paletteNames } from '../data/colorPalettes';
import '../styles/SchemeSelector.css';

export default function SchemeSelector({ 
  selectedScheme, 
  onSchemeChange, 
  intensity, 
  onIntensityChange,
  isLoading 
}) {
  return (
    <div className="scheme-selector">
      <div className="selector-group">
        <label htmlFor="palette-select">Color Scheme</label>
        <select
          id="palette-select"
          value={selectedScheme}
          onChange={(e) => onSchemeChange(e.target.value)}
          disabled={isLoading}
          className="palette-dropdown"
        >
          <option value="">Choose a color scheme...</option>
          {paletteNames.map(palette => (
            <option key={palette.id} value={palette.id}>
              {palette.label}
            </option>
          ))}
        </select>
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
    </div>
  );
}

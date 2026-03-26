import React from 'react';
import '../styles/LoadingModal.css';

export default function LoadingModal({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal">
        <div className="spinner" />
        <p className="loading-text">Processing your wallpaper...</p>
      </div>
    </div>
  );
}

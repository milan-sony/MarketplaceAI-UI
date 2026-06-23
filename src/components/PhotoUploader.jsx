import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function PhotoUploader({ onAnalyze }) {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const processFiles = (newFileList) => {
    setError('');
    const newFiles = Array.from(newFileList);
    
    // Validate file types
    const validImageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (validImageFiles.length !== newFiles.length) {
      setError('Only image files are allowed.');
      return;
    }

    // Combine existing and new files
    const combinedFiles = [...files, ...validImageFiles];

    if (combinedFiles.length > 5) {
      setError('You can upload a maximum of 5 photos.');
      setFiles(combinedFiles.slice(0, 5));
    } else {
      setFiles(combinedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, idx) => idx !== indexToRemove));
    setError('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAnalyzeClick = () => {
    if (files.length === 0) {
      setError('Please upload at least 1 photo.');
      return;
    }
    onAnalyze(files);
  };

  return (
    <div className="uploader-container">
      <div 
        className={`drag-drop-zone ${isDragActive ? 'active-drag' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple 
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon-wrapper">
          <Upload size={32} />
        </div>
        
        <div className="upload-prompt">
          <h3>Drag & Drop your product photos</h3>
          <p>or click to browse your files (JPEG, PNG, WEBP)</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Upload 1 to 5 high-quality photos for better AI accuracy
          </p>
        </div>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--color-poor)',
          marginTop: '1rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div style={{ width: '100%', maxWidth: '700px', marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ImageIcon size={18} style={{ color: 'var(--secondary)' }} />
            <span>Uploaded Photos ({files.length}/5)</span>
          </h4>
          
          <div className="preview-gallery">
            {files.map((file, index) => {
              const previewUrl = URL.createObjectURL(file);
              return (
                <div key={index} className="preview-card">
                  <img src={previewUrl} alt={`Product thumbnail ${index + 1}`} />
                  <button 
                    type="button" 
                    className="remove-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    title="Remove Photo"
                  >
                    <X size={14} />
                  </button>
                  {index === 0 && (
                    <div className="badge-primary-image">Cover</div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleAnalyzeClick}
              disabled={files.length === 0}
            >
              Analyze Photos with Vision AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

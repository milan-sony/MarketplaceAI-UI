import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Plus, Film, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import PhotoUploader from './components/PhotoUploader';
import ListingForm from './components/ListingForm';
import ListingGallery from './components/ListingGallery';

export default function App() {
  const [view, setView] = useState('gallery'); // 'gallery' or 'create'
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState(0); // 0: Idle, 1: Uploading, 2: Analyzing, 3: Completed
  const [uploadedImages, setUploadedImages] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    fetchListings();
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      }
    } catch (err) {
      console.warn('Backend server seems offline or unreachable.', err);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings');
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (files) => {
    setAiLoading(true);
    setAiStep(1); // Uploading files
    
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    // Artificially wait slightly if in mock mode to make the transitions smooth
    setTimeout(() => {
      setAiStep(2); // Analyzing with AI
    }, 1200);

    try {
      const res = await fetch('/api/listings/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze photos');
      }

      const data = await res.json();
      setAiStep(3); // Completed
      
      // Delay transition to form for a brief moment so user sees the completed state
      setTimeout(() => {
        setUploadedImages(data.images);
        setAiAnalysis(data.analysis);
        setAiLoading(false);
        setAiStep(0);
      }, 800);

    } catch (err) {
      console.error('Analysis error:', err);
      alert(`Error: ${err.message}`);
      setAiLoading(false);
      setAiStep(0);
    }
  };

  const handlePublish = async (listingData) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to publish listing');
      }

      // Success
      setView('gallery');
      resetWizard();
      fetchListings();
    } catch (err) {
      console.error('Publish error:', err);
      alert(`Error publishing listing: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setListings(listings.filter((item) => item._id !== id));
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetWizard = () => {
    setUploadedImages([]);
    setAiAnalysis(null);
    setAiLoading(false);
    setAiStep(0);
  };

  const handleCancelCreate = () => {
    if (uploadedImages.length > 0 && !window.confirm('Discard current draft?')) {
      return;
    }
    resetWizard();
    setView('gallery');
  };

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo" onClick={() => { setView('gallery'); resetWizard(); }}>
            ✨ Marketplace <span>AI</span>
          </div>

          <div className="nav-buttons">
            <button 
              className={`btn ${view === 'gallery' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setView('gallery'); resetWizard(); }}
            >
              <ShoppingBag size={16} /> View Listings
            </button>
            <button 
              className={`btn ${view === 'create' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setView('create')}
            >
              <Plus size={16} /> Sell Item
            </button>
          </div>
        </div>
      </header>

      {/* Backend Status Notice */}
      {backendStatus && backendStatus.ai === 'mock-mode' && view === 'create' && (
        <div style={{
          backgroundColor: 'rgba(251, 191, 36, 0.08)',
          borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
          color: 'var(--color-fair)',
          padding: '0.6rem 2rem',
          fontSize: '0.85rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500
        }}>
          <AlertTriangle size={14} />
          <span>Gemini API key is not configured. Running in <strong>Mock AI Mode</strong>. You can upload any file to test.</span>
        </div>
      )}

      <main className="container">
        {view === 'gallery' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h1>Marketplace Feed</h1>
              <button 
                className="btn btn-secondary" 
                onClick={fetchListings} 
                style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', height: '40px' }}
                title="Refresh listings"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <p className="subtitle">Discover items analyzed and priced dynamically by Vision AI.</p>
            
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                <div className="glow-spinner"></div>
              </div>
            ) : (
              <ListingGallery 
                listings={listings} 
                onDelete={handleDelete}
                onCreateClick={() => setView('create')}
              />
            )}
          </div>
        ) : (
          <div>
            <h1>Create New Listing</h1>
            <p className="subtitle">Upload images and let our Vision model generate your product catalog.</p>

            <div className="wizard-card">
              {/* Steps Progress Header */}
              <div className="steps-container">
                <div className="step-line-progress" style={{ 
                  width: aiLoading ? `${(aiStep - 1) * 50}%` : aiAnalysis ? '100%' : '0%' 
                }} />
                
                <div className={`step-node ${!aiLoading && !aiAnalysis ? 'active' : 'completed'}`}>
                  1
                  <span className="step-label">Upload Photos</span>
                </div>
                
                <div className={`step-node ${aiLoading ? 'active' : aiAnalysis ? 'completed' : ''}`}>
                  2
                  <span className="step-label">AI Vision Analysis</span>
                </div>
                
                <div className={`step-node ${aiAnalysis ? 'active' : ''}`}>
                  3
                  <span className="step-label">Review & Publish</span>
                </div>
              </div>

              {/* Wizard Content Body */}
              {aiLoading ? (
                /* STEP 2: Loading State */
                <div className="loading-screen">
                  <div className="glow-spinner"></div>
                  <h2>Analyzing your product...</h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '400px' }}>
                    Our Vision Model is inspecting visual traits, estimating condition, and drafting listing copies.
                  </p>

                  <div className="loading-steps">
                    <div className={`loading-step-item ${aiStep === 1 ? 'active' : aiStep > 1 ? 'completed' : ''}`}>
                      <span className="step-indicator-icon">
                        {aiStep > 1 && '✓'}
                      </span>
                      <span>Uploading product photos ({backendStatus?.storage || 'local'} storage)...</span>
                    </div>
                    
                    <div className={`loading-step-item ${aiStep === 2 ? 'active' : aiStep > 2 ? 'completed' : ''}`}>
                      <span className="step-indicator-icon">
                        {aiStep > 2 && '✓'}
                      </span>
                      <span>Running Gemini 2.5 Flash Vision...</span>
                    </div>

                    <div className={`loading-step-item ${aiStep === 3 ? 'active' : ''}`}>
                      <span className="step-indicator-icon">
                        {aiStep === 3 && '✓'}
                      </span>
                      <span>Structuring marketplace metadata & titles...</span>
                    </div>
                  </div>
                </div>
              ) : !aiAnalysis ? (
                /* STEP 1: Photo Uploader */
                <PhotoUploader onAnalyze={handleAnalyze} />
              ) : (
                /* STEP 3: Review & Edit Form */
                <ListingForm 
                  images={uploadedImages} 
                  analysis={aiAnalysis} 
                  onSubmit={handlePublish} 
                  onCancel={handleCancelCreate}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

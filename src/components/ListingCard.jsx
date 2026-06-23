import React, { useState } from 'react';
import { Trash2, Calendar, MapPin, Tag } from 'lucide-react';

export default function ListingCard({ listing, onDelete }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const getConditionClass = (cond) => {
    switch (cond) {
      case 'New': return 'cond-new';
      case 'Like New': return 'cond-like-new';
      case 'Good': return 'cond-good';
      case 'Fair': return 'cond-fair';
      case 'Poor': return 'cond-poor';
      default: return 'cond-good';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev + 1) % listing.images.length);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setActiveImageIdx(index);
  };

  return (
    <div className="listing-card">
      <div className="card-image-wrapper">
        <img 
          src={listing.images[activeImageIdx]} 
          alt={listing.title} 
          className="fade-in"
          key={activeImageIdx}
        />
        
        {/* Badges overlay */}
        <span className="card-category-badge">{listing.category}</span>
        <span className={`card-condition-badge ${getConditionClass(listing.condition)}`}>
          {listing.condition}
        </span>
        
        {/* Price overlay */}
        <span className="card-price-overlay">
          ${listing.price.toLocaleString()}
        </span>

        {/* Multi-image Navigation dots */}
        {listing.images.length > 1 && (
          <div className="card-image-nav">
            {listing.images.map((_, idx) => (
              <span 
                key={idx}
                className={`card-image-nav-dot ${idx === activeImageIdx ? 'active' : ''}`}
                onClick={(e) => handleDotClick(e, idx)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-meta">
          <Calendar size={12} />
          <span>{formatDate(listing.createdAt)}</span>
          {listing.brand && (
            <>
              <span>•</span>
              <span>{listing.brand}</span>
            </>
          )}
        </div>

        <h4 className="card-title" title={listing.title}>
          {listing.title}
        </h4>

        <p className="card-description">
          {listing.description}
        </p>

        {listing.tags && listing.tags.length > 0 && (
          <div className="card-tags">
            {listing.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="card-tag">#{tag}</span>
            ))}
            {listing.tags.length > 4 && (
              <span className="card-tag">+{listing.tags.length - 4}</span>
            )}
          </div>
        )}

        <div className="card-actions">
          <button 
            className="card-delete-btn"
            onClick={() => onDelete(listing._id)}
            title="Delete Listing"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

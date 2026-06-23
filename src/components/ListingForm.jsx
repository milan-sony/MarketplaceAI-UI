import React, { useState } from 'react';
import { Tag, Sparkles, Folder, DollarSign, List, Layers, ShieldCheck, Palette, Info, ArrowLeft, Send } from 'lucide-react';

export default function ListingForm({ images, analysis, onSubmit, onCancel }) {
  // Initialize form state using AI recommendations
  const [title, setTitle] = useState(analysis.title || '');
  const [description, setDescription] = useState(analysis.description || '');
  const [category, setCategory] = useState(analysis.category || 'Other');
  const [brand, setBrand] = useState(analysis.brand || '');
  const [model, setModel] = useState(analysis.model || '');
  const [condition, setCondition] = useState(analysis.condition || 'Good');
  const [color, setColor] = useState(analysis.color || '');
  const [price, setPrice] = useState(analysis.price || 0);
  
  // Custom tag/attribute arrays
  const [attributes, setAttributes] = useState(analysis.attributes || []);
  const [tags, setTags] = useState(analysis.tags || []);
  
  // Tag/Attribute input fields state
  const [attributeInput, setAttributeInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Image sidebar state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const categories = [
    'Electronics',
    'Phones',
    'Furniture',
    'Cars',
    'Fashion',
    'Home Appliances',
    'Sports',
    'Toys',
    'Books',
    'Other'
  ];

  const handleAddAttribute = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = attributeInput.trim();
      if (val && !attributes.includes(val)) {
        setAttributes([...attributes, val]);
        setAttributeInput('');
      }
    }
  };

  const handleRemoveAttribute = (idxToRemove) => {
    setAttributes(attributes.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (idxToRemove) => {
    setTags(tags.filter((_, idx) => idx !== idxToRemove));
  };

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

  const wordCount = (text) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    if (title.length > 70) return alert('Title must be 70 characters or less');
    if (!description.trim()) return alert('Description is required');
    if (price < 0) return alert('Price must be greater than or equal to 0');

    onSubmit({
      images,
      title,
      description,
      category,
      brand,
      model,
      condition,
      color,
      price: Number(price),
      attributes,
      tags
    });
  };

  return (
    <form onSubmit={handleSubmit} className="listing-editor-layout">
      {/* LEFT PANEL: Media Sidebar */}
      <div className="form-media-sidebar">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Listing Media</h3>
        <div className="active-image-viewfinder">
          <img 
            src={images[activeImageIdx]} 
            alt="Active preview" 
            className="fade-in"
            key={activeImageIdx}
          />
          <div className={`condition-watermark ${getConditionClass(condition)}`}>
            {condition}
          </div>
        </div>

        {images.length > 1 && (
          <div className="sidebar-carousel-thumbnails">
            {images.map((img, idx) => (
              <div 
                key={idx}
                className={`sidebar-thumb ${idx === activeImageIdx ? 'active' : ''}`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginTop: '1rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <Sparkles size={20} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h5 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>AI Powered Suggestions</h5>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
              These fields are pre-populated using Vision AI. Verify, tweak, and edit anything before publishing.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Editable Fields */}
      <div className="editor-form-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Listing Details</h3>
        
        {/* Title Field (Max 70 Chars) */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="title">Listing Title</label>
            <span className={`char-counter ${title.length > 70 ? 'warning' : ''}`}>
              {title.length}/70 chars
            </span>
          </div>
          <input 
            id="title"
            type="text" 
            className="input-control" 
            placeholder="e.g. Apple iPhone 14 Pro 128GB - Space Black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        {/* Description Field (Under 150 Words recommended) */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="description">Listing Description</label>
            <span className={`char-counter ${wordCount(description) > 150 ? 'warning' : ''}`}>
              {wordCount(description)}/150 words (estimated)
            </span>
          </div>
          <textarea 
            id="description"
            className="input-control" 
            placeholder="Tell buyers about your item's condition, features, inclusion, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* 2-Column Fields */}
        <div className="form-grid-2col">
          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Folder size={14} /> Category
            </label>
            <select 
              id="category"
              className="input-control" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label htmlFor="price" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <DollarSign size={14} /> Price ($ USD)
            </label>
            <input 
              id="price"
              type="number" 
              className="input-control" 
              min="0"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-grid-2col">
          {/* Brand */}
          <div className="form-group">
            <label htmlFor="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={14} /> Brand
            </label>
            <input 
              id="brand"
              type="text" 
              className="input-control" 
              placeholder="e.g. Apple"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          {/* Model */}
          <div className="form-group">
            <label htmlFor="model" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <List size={14} /> Model
            </label>
            <input 
              id="model"
              type="text" 
              className="input-control" 
              placeholder="e.g. iPhone 14 Pro"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>

        <div className="form-grid-2col">
          {/* Condition Dropdown */}
          <div className="form-group">
            <label htmlFor="condition" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} /> Condition
            </label>
            <select 
              id="condition"
              className="input-control" 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

          {/* Color */}
          <div className="form-group">
            <label htmlFor="color" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Palette size={14} /> Color
            </label>
            <input 
              id="color"
              type="text" 
              className="input-control" 
              placeholder="e.g. Space Black"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        {/* Specifications / Attributes (Tag list) */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={14} /> Key Specifications & Attributes
          </label>
          <div className="chips-container">
            {attributes.map((attr, idx) => (
              <span key={idx} className="chip">
                {attr}
                <button type="button" className="chip-remove" onClick={() => handleRemoveAttribute(idx)}>&times;</button>
              </span>
            ))}
            <input 
              type="text" 
              className="chip-input" 
              placeholder="Type attribute & press Enter" 
              value={attributeInput}
              onChange={(e) => setAttributeInput(e.target.value)}
              onKeyDown={handleAddAttribute}
            />
          </div>
        </div>

        {/* Searchable Tags */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tag size={14} /> Search Tags
          </label>
          <div className="chips-container">
            {tags.map((tag, idx) => (
              <span key={idx} className="chip">
                {tag}
                <button type="button" className="chip-remove" onClick={() => handleRemoveTag(idx)}>&times;</button>
              </span>
            ))}
            <input 
              type="text" 
              className="chip-input" 
              placeholder="Type tag & press Enter" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-action-bar">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            style={{ minWidth: '100px' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
          >
            Publish Listing <Send size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}

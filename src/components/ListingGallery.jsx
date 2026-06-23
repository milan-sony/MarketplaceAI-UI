import React, { useState } from 'react';
import { Search, Plus, ShoppingBag, Info } from 'lucide-react';
import ListingCard from './ListingCard';

export default function ListingGallery({ listings, onDelete, onCreateClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Phones', 'Furniture', 'Cars', 'Fashion', 'Home Appliances', 'Other'];

  const filteredListings = listings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="gallery-controls">
        {/* Search bar */}
        <div className="search-box">
          <Search size={18} className="search-box-icon" />
          <input 
            type="text" 
            className="input-control" 
            placeholder="Search listings by title, brand, tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="filter-group">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="empty-state">
          <div className="upload-icon-wrapper empty-state-icon" style={{ width: '80px', height: '80px' }}>
            <ShoppingBag size={40} />
          </div>
          <div>
            <h3>No listings found</h3>
            <p>
              {listings.length === 0 
                ? "You haven't created any marketplace listings yet. Upload product photos to get started."
                : "No listings match your search criteria. Try removing filters or searching for something else."}
            </p>
          </div>
          <button className="btn btn-primary" onClick={onCreateClick}>
            <Plus size={16} /> Create A Listing
          </button>
        </div>
      ) : (
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <ListingCard 
              key={listing._id} 
              listing={listing} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

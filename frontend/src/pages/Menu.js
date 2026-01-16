import React, { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const categories = ['ALL', 'APPETIZERS', 'MAIN_COURSE', 'DESSERTS', 'BEVERAGES', 'SALADS'];

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedCategory === 'ALL') {
        response = await menuAPI.getAllItems();
      } else {
        response = await menuAPI.getByCategory(selectedCategory);
      }
      
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchMenuItems();
      return;
    }
    
    try {
      setLoading(true);
      const response = await menuAPI.search(searchTerm);
      setMenuItems(response.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (menuItemId) => {
    if (!isAuthenticated()) {
      toast.info('Please login to add items to cart');
      return;
    }

    const result = await addToCart(menuItemId, 1, '');
    if (result.success) {
      toast.success('Item added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  const placeholderImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900';
  const publicUrl = process.env.PUBLIC_URL || '';

  const buildFallbackImage = (name) => {
    if (!name) return placeholderImage;
    const slug = name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `${publicUrl}/images/${slug}.jpg`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="container">
          <h1>Our Menu</h1>
          <p>Explore our delicious selection of dishes</p>
        </div>
      </div>

      <div className="container">
        <div className="menu-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="form-control"
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => {
            const imageSrc = (item.imageUrl || '').trim()
              ? item.imageUrl
              : buildFallbackImage(item.name || item.description);

            return (
              <div key={item.id} className="menu-card">
                <div className="menu-card-image">
                  <img 
                    src={imageSrc} 
                    alt={item.name} 
                    onError={(event) => {
                      if (event.target.src !== placeholderImage) {
                        event.target.src = placeholderImage;
                      }
                    }}
                  />
                  {!item.available && (
                    <div className="unavailable-badge">Unavailable</div>
                  )}
                </div>
                
                <div className="menu-card-content">
                  <h3>{item.name}</h3>
                  <p className="menu-card-description">{item.description}</p>
                  
                  <div className="menu-card-footer">
                    <div className="menu-card-info">
                      <span className="price">${item.price.toFixed(2)}</span>
                      {item.averageRating > 0 && (
                        <span className="rating">
                          ⭐ {item.averageRating.toFixed(1)} ({item.totalReviews})
                        </span>
                      )}
                    </div>
                    
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(item.id)}
                      disabled={!item.available}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {menuItems.length === 0 && (
          <div className="empty-state">
            <p>No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;

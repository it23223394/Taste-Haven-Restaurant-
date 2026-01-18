import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const categories = [
  'APPETIZERS',
  'MAIN_COURSE',
  'DESSERTS',
  'BEVERAGES',
  'SALADS',
  'SOUPS',
  'PASTA',
  'SEAFOOD',
  'SPECIALS',
];

const initialMenuForm = {
  name: '',
  description: '',
  price: '',
  category: 'MAIN_COURSE',
  imageUrl: '',
  available: true,
  preparationTime: '',
};

const AdminMenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState(initialMenuForm);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const buildSearchResults = (items, query) => {
    if (!query) {
      return [];
    }
    const normalized = query.toLowerCase();
    return items.filter((item) => {
      const searchable = `${item.name || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase();
      return searchable.includes(normalized);
    });
  };

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllMenuItems();
      const items = Array.isArray(response.data) ? response.data : [];
      setMenuItems(items);
      if (searchTerm.trim()) {
        setSearchResults(buildSearchResults(items, searchTerm.trim()));
      }
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageProcessing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMenuForm((prev) => ({
        ...prev,
        imageUrl: reader.result || '',
      }));
      setImageProcessing(false);
    };
    reader.onerror = () => {
      toast.error('Unable to read the selected image');
      setImageProcessing(false);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: menuForm.name,
      description: menuForm.description,
      price: parseFloat(menuForm.price) || 0,
      category: menuForm.category,
      imageUrl: menuForm.imageUrl || '',
      available: menuForm.available,
      preparationTime: parseInt(menuForm.preparationTime, 10) || 0,
    };

    try {
      if (editingMenuId) {
        await adminAPI.updateMenuItem(editingMenuId, payload);
        toast.success('Menu item updated');
      } else {
        await adminAPI.createMenuItem(payload);
        toast.success('Menu item added');
      }
      setMenuForm(initialMenuForm);
      setEditingMenuId(null);
      loadMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Menu submission failed');
    }
  };

  const handleMenuEdit = (item) => {
    setEditingMenuId(item.id);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available,
      preparationTime: item.preparationTime,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuDelete = async (menuId) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await adminAPI.deleteMenuItem(menuId);
      toast.success('Menu item deleted');
      loadMenuItems();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      toast.info('Enter a search term to filter the menu');
      return;
    }

    setSearchResults(buildSearchResults(menuItems, trimmed));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const displayMenuItems = searchTerm.trim() ? searchResults : menuItems;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="section-heading">
        <h2>Menu Management</h2>
        <p>Build seasonal menus and keep availability accurate.</p>
      </div>
      <form className="menu-form" onSubmit={handleMenuSubmit}>
        <div className="form-grid">
          <input
            name="name"
            placeholder="Item name"
            value={menuForm.name}
            onChange={handleMenuInputChange}
            required
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            step="0.01"
            value={menuForm.price}
            onChange={handleMenuInputChange}
            required
          />
          <select name="category" value={menuForm.category} onChange={handleMenuInputChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replace('_', ' ')}
              </option>
            ))}
          </select>
          <input
            name="preparationTime"
            placeholder="Prep time (mins)"
            type="number"
            value={menuForm.preparationTime}
            onChange={handleMenuInputChange}
          />
          <input
            name="imageUrl"
            placeholder="Image URL (e.g. /images/your-dish.jpg)"
            value={menuForm.imageUrl}
            onChange={handleMenuInputChange}
          />
          <label className="file-field">
            <span>Upload an image from your device</span>
            <div className="file-field__trigger">
              <span>Choose file</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </label>
          <small className="image-help">
            Drop your asset under <code>public/images</code> and reference it via <code>/images/your-dish.jpg</code> (e.g. <code>/images/kottu.jpg</code>) so each card can show a unique photo.
          </small>
          {imageProcessing && <small className="image-help">Encoding the selected file...</small>}
          {menuForm.imageUrl && (
            <div className="image-preview">
              <img
                src={menuForm.imageUrl}
                alt="Dish preview"
                onError={(event) => {
                  event.target.style.display = 'none';
                }}
              />
              <p>Preview based on the current reference</p>
            </div>
          )}
          <label className="toggle-available">
            <input
              type="checkbox"
              name="available"
              checked={menuForm.available}
              onChange={handleMenuInputChange}
            />
            Available
          </label>
        </div>
        <textarea
          name="description"
          placeholder="Dish description"
          value={menuForm.description}
          onChange={handleMenuInputChange}
          rows={3}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingMenuId ? 'Update Dish' : 'Add Dish'}
          </button>
          {editingMenuId && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setEditingMenuId(null);
                setMenuForm(initialMenuForm);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search menu items by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <div className="admin-search-actions">
          <button type="button" className="btn btn-secondary" onClick={handleSearch}>
            Search Menu
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClearSearch}
            disabled={!searchTerm.trim() && searchResults.length === 0}
          >
            Clear
          </button>
        </div>
        {searchTerm.trim() && (
          <p className="search-status">
            Showing {displayMenuItems.length} result{displayMenuItems.length === 1 ? '' : 's'} for "{searchTerm}"
          </p>
        )}
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayMenuItems.length > 0 ? (
              displayMenuItems.map((menu) => (
              <tr key={`menu-${menu.id}`}>
                <td>{menu.name}</td>
                <td>${(menu.price || 0).toFixed(2)}</td>
                <td>{menu.category?.replace('_', ' ')}</td>
                <td>{menu.available ? 'Yes' : 'No'}</td>
                <td className="action-buttons">
                  <button className="btn btn-secondary" onClick={() => handleMenuEdit(menu)}>
                    Edit
                  </button>
                  <button className="btn btn-outline" onClick={() => handleMenuDelete(menu.id)}>
                    Delete
                  </button>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center" style={{ padding: '2rem 0' }}>
                  {searchTerm.trim()
                    ? 'No menu items match that search. Try another keyword.'
                    : 'No menu items found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMenuManagement;
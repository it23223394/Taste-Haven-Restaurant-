import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const [paymentCards, setPaymentCards] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    setAsDefault: false,
  });

  useEffect(() => {
    loadPaymentCards();
  }, []);

  const loadPaymentCards = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPaymentCards();
      setPaymentCards(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load payment cards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userAPI.addPaymentCard(formData);
      setSuccess('Payment card added successfully');
      setFormData({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        setAsDefault: false,
      });
      setShowAddForm(false);
      await loadPaymentCards();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment card');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userAPI.updatePaymentCard(editingCardId, formData);
      setSuccess('Payment card updated successfully');
      setFormData({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        setAsDefault: false,
      });
      setEditingCardId(null);
      await loadPaymentCards();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment card');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = (card) => {
    setFormData({
      cardholderName: card.cardholderName || '',
      cardNumber: '',
      expiryMonth: card.expiryMonth || '',
      expiryYear: card.expiryYear || '',
      cvv: '',
      setAsDefault: card.isDefault || false,
    });
    setEditingCardId(card.id);
    setShowAddForm(true);
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this payment card?')) {
      try {
        setLoading(true);
        await userAPI.deletePaymentCard(cardId);
        setSuccess('Payment card deleted successfully');
        await loadPaymentCards();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete payment card');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCardId(null);
    setFormData({
      cardholderName: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      setAsDefault: false,
    });
  };

  const getCardBrandIcon = (brand) => {
    const icons = {
      VISA: '💳',
      MASTERCARD: '💳',
      AMEX: '💳',
      DISCOVER: '💳',
    };
    return icons[brand] || '💳';
  };

  return (
    <div className="payment-methods-container">
      <div className="payment-methods-header">
        <h2>Payment Methods</h2>
        {!showAddForm && (
          <button 
            className="btn-add-card"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            + Add Payment Card
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showAddForm && (
        <div className="card-form-container">
          <h3>{editingCardId ? 'Edit Payment Card' : 'Add New Payment Card'}</h3>
          <form onSubmit={editingCardId ? handleUpdateCard : handleAddCard}>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            {!editingCardId && (
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  disabled={loading}
                />
                <small>13-19 digits</small>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month</label>
                <select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Expiry Year</label>
                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  disabled={loading}
                />
                <small>3-4 digits</small>
              </div>
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="setAsDefault"
                  checked={formData.setAsDefault}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                Set as default payment method
              </label>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingCardId ? 'Update Card' : 'Add Card'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="payment-cards-list">
        {loading && !paymentCards.length ? (
          <div className="loading">Loading payment cards...</div>
        ) : paymentCards.length === 0 ? (
          <div className="empty-state">
            <p>No payment cards saved yet</p>
            <p className="text-muted">Add a payment card to make faster checkouts</p>
          </div>
        ) : (
          paymentCards.map(card => (
            <div key={card.id} className={`payment-card ${card.isDefault ? 'default' : ''}`}>
              <div className="card-content">
                <div className="card-header">
                  <span className="card-brand">
                    {getCardBrandIcon(card.cardBrand)} {card.cardBrand}
                  </span>
                  {card.isDefault && <span className="badge-default">Default</span>}
                </div>
                <div className="card-number">
                  •••• •••• •••• {card.last4Digits}
                </div>
                <div className="card-footer">
                  <span>{card.cardholderName}</span>
                  <span>Expires {card.expiryMonth}/{card.expiryYear}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditCard(card)}
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteCard(card.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;

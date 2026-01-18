import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './PaymentSelectionModal.css';

const PaymentSelectionModal = ({ 
  isOpen, 
  onClose, 
  onPaymentSelect, 
  totalAmount,
  isProcessing 
}) => {
  const [paymentCards, setPaymentCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    setAsDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      loadPaymentCards();
    }
  }, [isOpen]);

  const loadPaymentCards = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getPaymentCards();
      setPaymentCards(response.data);
      
      // Auto-select default card
      const defaultCard = response.data.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      } else if (response.data.length > 0) {
        setSelectedCardId(response.data[0].id);
      }
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

  const handleAddNewCard = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newCard = await userAPI.addPaymentCard(formData);
      setPaymentCards([...paymentCards, newCard.data]);
      setSelectedCardId(newCard.data.id);
      setFormData({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        setAsDefault: false,
      });
      setShowAddCard(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment card');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = () => {
    if (!selectedCardId) {
      setError('Please select a payment card');
      return;
    }
    onPaymentSelect(selectedCardId);
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

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h2>Select Payment Method</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            disabled={isProcessing || loading}
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          {error && <div className="alert alert-error">{error}</div>}

          {loading && !paymentCards.length ? (
            <div className="loading">Loading payment cards...</div>
          ) : showAddCard ? (
            <div className="add-card-form">
              <h3>Add New Payment Card</h3>
              <form onSubmit={handleAddNewCard}>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    disabled={loading || isProcessing}
                  />
                </div>

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
                    disabled={loading || isProcessing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Month</label>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      required
                      disabled={loading || isProcessing}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {String(month).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Year</label>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      required
                      disabled={loading || isProcessing}
                    >
                      <option value="">YY</option>
                      {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>
                          {String(year).slice(-2)}
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
                      disabled={loading || isProcessing}
                    />
                  </div>
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="setAsDefault"
                      checked={formData.setAsDefault}
                      onChange={handleInputChange}
                      disabled={loading || isProcessing}
                    />
                    Save for future use
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || isProcessing}
                  >
                    {loading ? 'Adding...' : 'Add Card'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddCard(false)}
                    disabled={loading || isProcessing}
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {paymentCards.length === 0 ? (
                <div className="empty-state">
                  <p>No payment cards saved</p>
                  <p className="text-muted">Add a card to continue checkout</p>
                </div>
              ) : (
                <div className="payment-cards-select">
                  {paymentCards.map(card => (
                    <div
                      key={card.id}
                      className={`card-option ${selectedCardId === card.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <input
                        type="radio"
                        name="paymentCard"
                        value={card.id}
                        checked={selectedCardId === card.id}
                        onChange={() => setSelectedCardId(card.id)}
                        disabled={isProcessing}
                      />
                      <div className="card-details">
                        <div className="card-header">
                          <span className="card-brand">
                            {getCardBrandIcon(card.cardBrand)} {card.cardBrand}
                          </span>
                          {card.isDefault && <span className="badge">Default</span>}
                        </div>
                        <div className="card-number">
                          •••• •••• •••• {card.last4Digits}
                        </div>
                        <div className="card-footer">
                          <span>{card.cardholderName}</span>
                          <span>Expires {card.expiryMonth}/{card.expiryYear}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-summary">
                <div className="summary-item">
                  <span>Total Amount:</span>
                  <span className="amount">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {!showAddCard && paymentCards.length > 0 && (
            <button
              className="btn-add-new"
              onClick={() => setShowAddCard(true)}
              disabled={isProcessing || loading}
            >
              + Add New Card
            </button>
          )}
          
          {!showAddCard && paymentCards.length === 0 && (
            <button
              className="btn-add-new"
              onClick={() => setShowAddCard(true)}
              disabled={isProcessing || loading}
            >
              + Add Payment Card
            </button>
          )}

          {!showAddCard && (
            <>
              <button
                className="btn-secondary"
                onClick={onClose}
                disabled={isProcessing || loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handlePaymentConfirm}
                disabled={isProcessing || loading || !selectedCardId}
              >
                {isProcessing ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSelectionModal;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import './Payments.css';

const orderTypes = [
  { label: 'Dine In', value: 'DINE_IN' },
  { label: 'Takeaway', value: 'TAKEAWAY' },
  { label: 'Delivery', value: 'DELIVERY' },
];

const Payments = () => {
  const { cart, cartTotal, loading, clearCart } = useCart();
  const [orderType, setOrderType] = useState('DINE_IN');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const tax = (cartTotal || 0) * 0.1;
  const grandTotal = (cartTotal || 0) + tax;

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!cart || !cart.items?.length) {
      toast.info('Your cart is empty');
      return;
    }
    try {
      setProcessing(true);
      await orderAPI.createOrder({
        orderType,
        specialInstructions,
        deliveryAddress: deliveryAddress.trim() || null,
      });
      await clearCart();
      toast.success('Payment confirmed. Your order is on the way!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment could not be processed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-card">
        <h1>Secure Payment</h1>
        <p className="payments-subtitle">Finish your order with the details below.</p>
        <form onSubmit={handlePayment} className="payments-form">
          <div className="form-group">
            <label>Order type</label>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              {orderTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Special instructions</label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder="Allergies, preferred pickup window, etc."
            />
          </div>
          <div className="form-group">
            <label>Delivery address (optional)</label>
            <input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Street, city, ZIP"
            />
          </div>
          <div className="divider"></div>
          <div className="summary-block">
            <h2>Order Summary</h2>
            {cart?.items?.map((item) => (
              <div key={`payment-item-${item.id}`} className="summary-row">
                <div>
                  <strong>{item.menuItem.name}</strong>
                  <p className="item-meta">{item.quantity} × ${item.menuItem.price.toFixed(2)}</p>
                </div>
                <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${(cartTotal || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={processing}>
            {processing ? 'Processing…' : 'Pay & Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payments;

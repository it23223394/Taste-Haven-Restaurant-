import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';
import PaymentSelectionModal from '../components/PaymentSelectionModal';
import './Cart.css';

const Cart = () => {
  const { cart, cartTotal, loading, updateQuantity, removeItem, fetchCart } = useCart();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.info('Your cart is empty');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSelect = async (paymentCardId) => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        orderType: 'DINE_IN', // Default to dine-in, can be extended for user selection
        paymentCardId: paymentCardId,
        deliveryAddress: null,
        specialInstructions: null
      };

      const response = await orderAPI.placeOrder(orderData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Order placed successfully!');
        setShowPaymentModal(false);
        // Navigate to orders page or order details
        navigate(`/orders/${response.data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      console.error('Order placement error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeItem(itemId);
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.message);
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
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        {cart && cart.items && cart.items.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.menuItem.imageUrl || 'https://via.placeholder.com/100'} 
                      alt={item.menuItem.name} 
                    />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.menuItem.name}</h3>
                    {item.customizations && (
                      <p className="customizations">{item.customizations}</p>
                    )}
                    <p className="price">${item.menuItem.price.toFixed(2)}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <p className="item-total">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </p>

                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (10%):</span>
                <span>${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(cartTotal * 1.1).toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary btn-block"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay & Place Order'}
              </button>

              <button 
                onClick={() => navigate('/menu')}
                className="btn btn-outline btn-block"
                disabled={isProcessing}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some delicious items to get started!</p>
            <button 
              onClick={() => navigate('/menu')}
              className="btn btn-primary"
            >
              Browse Menu
            </button>
          </div>
        )}

        <PaymentSelectionModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSelect={handlePaymentSelect}
          totalAmount={cartTotal * 1.1}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

export default Cart;

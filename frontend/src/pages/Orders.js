import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffc107',
      CONFIRMED: '#17a2b8',
      PREPARING: '#fd7e14',
      READY: '#28a745',
      COMPLETED: '#6c757d',
      CANCELLED: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">
                      {new Date(order.orderedAt).toLocaleString()}
                    </p>
                  </div>
                  <span 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <span>{item.menuItem.name}</span>
                      <span>x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-type">Type: {order.type}</span>
                  <span className="order-total">
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No orders yet</p>
            <a href="/menu" className="btn btn-primary">Browse Menu</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

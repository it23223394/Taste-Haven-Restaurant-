import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const statusOptions = ['PENDING','CONFIRMED','PREPARING','READY','COMPLETED','CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Unable to update status');
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
    <div className="admin-panel">
      <div className="section-heading">
        <h2>Order Management</h2>
        <p>Update statuses and keep guests informed instantly.</p>
      </div>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Guest</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={`order-${order.id}`}>
                <td>#{order.id}</td>
                <td>{order.user?.firstName} {order.user?.lastName}</td>
                <td>${(order.totalAmount || 0).toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
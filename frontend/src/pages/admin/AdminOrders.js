import React, { useEffect, useState, useCallback, useRef } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminOrders.css';

const statusOptions = ['PENDING','CONFIRMED','PREPARING','READY','COMPLETED','CANCELLED'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const intervalRef = useRef(null);

  const applyFilters = (orderData, status, search) => {
    let filtered = orderData;
    
    if (status !== 'ALL') {
      filtered = filtered.filter(order => order.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id?.toString().includes(searchLower) ||
        order.user?.firstName?.toLowerCase().includes(searchLower) ||
        order.user?.lastName?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrders(filtered);
  };

  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const response = await adminAPI.getAllOrders();
      const orderData = Array.isArray(response.data) ? response.data : [];
      setOrders(orderData);
      applyFilters(orderData, statusFilter, searchTerm);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (showLoader) {
        toast.error('Failed to load orders');
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchOrders(true);
    intervalRef.current = setInterval(() => fetchOrders(), 15000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchOrders]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    applyFilters(orders, status, searchTerm);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    applyFilters(orders, statusFilter, search);
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Unable to update status');
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b',
      CONFIRMED: '#10b981',
      PREPARING: '#f97316',
      READY: '#06b6d4',
      COMPLETED: '#6b7280',
      CANCELLED: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const calculateOrderStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    ready: orders.filter(o => o.status === 'READY').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = calculateOrderStats();

  return (
    <div className="admin-panel">
      <div className="section-heading">
        <div>
          <h2>Order Management</h2>
          <p>Track and update order statuses in real-time</p>
        </div>
        <button className="btn btn-outline" onClick={() => fetchOrders(true)}>
          🔄 Refresh Data
        </button>
      </div>

      <div className="order-stats">
        <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{stats.total}</div></div>
        <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value" style={{color: '#f59e0b'}}>{stats.pending}</div></div>
        <div className="stat-card"><div className="stat-label">Preparing</div><div className="stat-value" style={{color: '#f97316'}}>{stats.preparing}</div></div>
        <div className="stat-card"><div className="stat-label">Ready</div><div className="stat-value" style={{color: '#06b6d4'}}>{stats.ready}</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value" style={{color: '#6b7280'}}>{stats.completed}</div></div>
        <div className="stat-card highlight"><div className="stat-label">Total Revenue</div><div className="stat-value">${stats.totalRevenue.toFixed(2)}</div></div>
      </div>

      <div className="order-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="status-filters">
          {['ALL', ...statusOptions].map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => handleStatusFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state"><p>No orders found matching your criteria</p></div>
        ) : (
          filteredOrders.map((order) => (
            <div key={`order-${order.id}`} className="order-card">
              <div className="order-header" onClick={() => toggleOrderExpand(order.id)}>
                <div className="order-id">
                  <strong>Order #{order.id}</strong>
                  <span className="order-time">{order.orderDateTime ? new Date(order.orderDateTime).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="order-customer">
                  <div className="customer-name">{order.user?.firstName} {order.user?.lastName}</div>
                  <div className="customer-email">{order.user?.email}</div>
                </div>
                <div className="order-amount">${(order.totalAmount || 0).toFixed(2)}</div>
                <div className="order-status-cell">
                  <span className="status-badge" style={{backgroundColor: getStatusColor(order.status)}}>{order.status}</span>
                </div>
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => { e.stopPropagation(); handleOrderStatusUpdate(order.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="status-select"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button className="expand-btn">{expandedOrder === order.id ? '▲' : '▼'}</button>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <h4>Order Items:</h4>
                  <div className="order-items">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.menuItem?.name || 'Unknown Item'}</span>
                            {item.customizations && <span className="item-customizations">({item.customizations})</span>}
                          </div>
                          <div className="item-quantity">×{item.quantity}</div>
                          <div className="item-price">${(item.price || 0).toFixed(2)}</div>
                        </div>
                      ))
                    ) : (
                      <p className="no-items">No items in this order</p>
                    )}
                  </div>
                  {order.specialInstructions && (
                    <div className="special-instructions">
                      <strong>Special Instructions:</strong>
                      <p>{order.specialInstructions}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
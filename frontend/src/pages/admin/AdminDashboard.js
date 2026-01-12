import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes, reservationsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllOrders(),
        adminAPI.getAllReservations(),
      ]);
      
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setReservations(reservationsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleReservationStatusUpdate = async (reservationId, status) => {
    try {
      await adminAPI.updateReservationStatus(reservationId, status);
      toast.success('Reservation status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
          <Link to="/admin/reservations" className="admin-nav-link">Reservations</Link>
          <Link to="/admin/menu" className="admin-nav-link">Menu Management</Link>
        </nav>
      </div>

      <div className="admin-content">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Dashboard Overview</h1>
              
              {stats && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Reservations</h3>
                    <p className="stat-number">{stats.totalReservations}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Menu Items</h3>
                    <p className="stat-number">{stats.totalMenuItems}</p>
                  </div>
                </div>
              )}

              <div className="admin-section">
                <h2>Recent Orders</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.user.firstName} {order.user.lastName}</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PREPARING">PREPARING</option>
                              <option value="READY">READY</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-section">
                <h2>Recent Reservations</h2>
                <div className="admin-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Date & Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.slice(0, 10).map((reservation) => (
                        <tr key={reservation.id}>
                          <td>#{reservation.id}</td>
                          <td>{reservation.user.firstName} {reservation.user.lastName}</td>
                          <td>{new Date(reservation.reservationDateTime).toLocaleString()}</td>
                          <td>{reservation.numberOfGuests}</td>
                          <td>
                            <span className={`badge ${reservation.status.toLowerCase()}`}>
                              {reservation.status}
                            </span>
                          </td>
                          <td>
                            <select
                              value={reservation.status}
                              onChange={(e) => handleReservationStatusUpdate(reservation.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SEATED">SEATED</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

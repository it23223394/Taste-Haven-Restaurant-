import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="admin-panel">
        <p>Unable to load statistics right now.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-hero">
        <h1>Administrator Overview</h1>
        <p>Real-time insights that keep Taste Haven running smoothly.</p>
      </header>
      <div className="stats-grid">
        <article>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders ?? 0}</p>
        </article>
        <article>
          <h3>Reservations</h3>
          <p>{stats.totalReservations ?? 0}</p>
        </article>
        <article>
          <h3>Active Users</h3>
          <p>{stats.totalUsers ?? 0}</p>
        </article>
        <article>
          <h3>Menu Items</h3>
          <p>{stats.totalMenuItems ?? 0}</p>
        </article>
      </div>
    </div>
  );
};

export default AdminDashboard;

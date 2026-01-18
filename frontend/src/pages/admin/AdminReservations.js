import React, { useEffect, useState, useCallback, useRef } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './AdminReservations.css';

const statusOptions = ['PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
const sortOptions = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'partySize', label: 'Party size (desc)' },
];

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [sortOption, setSortOption] = useState('latest');
  const intervalRef = useRef(null);

  const applyFilters = (data, status, search, sortBy) => {
    let filtered = data;

    if (status !== 'ALL') filtered = filtered.filter(res => res.status === status);

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(res =>
        res.customerName?.toLowerCase().includes(searchLower) ||
        res.customerEmail?.toLowerCase().includes(searchLower) ||
        res.id?.toString().includes(searchLower)
      );
    }

    if (sortBy === 'latest') {
      filtered = filtered.slice().sort((a, b) => new Date(b.reservationDateTime) - new Date(a.reservationDateTime));
    } else if (sortBy === 'oldest') {
      filtered = filtered.slice().sort((a, b) => new Date(a.reservationDateTime) - new Date(b.reservationDateTime));
    } else if (sortBy === 'partySize') {
      filtered = filtered.slice().sort((a, b) => (b.partySize || 0) - (a.partySize || 0));
    }

    setFilteredReservations(filtered);
  };

  const fetchReservations = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const response = await adminAPI.getAllReservations();
      const data = Array.isArray(response.data) ? response.data : [];
      setReservations(data);
      applyFilters(data, statusFilter, searchTerm, sortOption);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (showLoader) toast.error('Failed to load reservations');
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [statusFilter, searchTerm, sortOption]);

  useEffect(() => {
    fetchReservations(true);
    intervalRef.current = setInterval(() => fetchReservations(), 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchReservations]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    applyFilters(reservations, status, searchTerm, sortOption);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    applyFilters(reservations, statusFilter, search, sortOption);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    applyFilters(reservations, statusFilter, searchTerm, option);
  };

  const handleStatusUpdate = async (reservationId, status) => {
    try {
      await adminAPI.updateReservationStatus(reservationId, status);
      toast.success('Reservation status updated');
      fetchReservations();
    } catch (error) {
      toast.error('Unable to update status');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b',
      CONFIRMED: '#10b981',
      SEATED: '#06b6d4',
      COMPLETED: '#6b7280',
      CANCELLED: '#ef4444',
      NO_SHOW: '#9ca3af'
    };
    return colors[status] || '#6b7280';
  };

  const calculateReservationStats = () => ({
    total: reservations.length,
    upcoming: reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING').length,
    seated: reservations.filter(r => r.status === 'SEATED').length,
    completed: reservations.filter(r => r.status === 'COMPLETED').length,
    cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
    noShow: reservations.filter(r => r.status === 'NO_SHOW').length,
    avgPartySize: reservations.length > 0
      ? (reservations.reduce((sum, r) => sum + (r.partySize || 0), 0) / reservations.length).toFixed(1)
      : 0,
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const stats = calculateReservationStats();

  return (
    <div className="admin-panel">
      <div className="section-heading">
        <div>
          <h2>Reservations</h2>
          <p>Monitor and manage table bookings</p>
        </div>
        <button className="btn btn-outline" onClick={() => fetchReservations(true)}>
          🔄 Refresh Data
        </button>
      </div>

      <div className="reservation-stats">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{stats.total}</div></div>
        <div className="stat-card"><div className="stat-label">Upcoming</div><div className="stat-value" style={{color: '#f59e0b'}}>{stats.upcoming}</div></div>
        <div className="stat-card"><div className="stat-label">Seated</div><div className="stat-value" style={{color: '#06b6d4'}}>{stats.seated}</div></div>
        <div className="stat-card"><div className="stat-label">Completed</div><div className="stat-value" style={{color: '#6b7280'}}>{stats.completed}</div></div>
        <div className="stat-card"><div className="stat-label">Cancelled</div><div className="stat-value" style={{color: '#ef4444'}}>{stats.cancelled}</div></div>
        <div className="stat-card"><div className="stat-label">No-show</div><div className="stat-value" style={{color: '#9ca3af'}}>{stats.noShow}</div></div>
        <div className="stat-card highlight"><div className="stat-label">Avg Party Size</div><div className="stat-value">{stats.avgPartySize}</div></div>
      </div>

      <div className="reservation-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or ID..."
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
        <div className="sort-filters">
          {sortOptions.map(option => (
            <button
              key={option.value}
              className={`filter-btn ${sortOption === option.value ? 'active' : ''}`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="reservations-list">
        {filteredReservations.length === 0 ? (
          <div className="empty-state"><p>No reservations found</p></div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={`res-${reservation.id}`} className="reservation-card">
              <div className="reservation-header" onClick={() => toggleExpand(reservation.id)}>
                <div className="reservation-meta">
                  <div className="reservation-id">Reservation #{reservation.id}</div>
                  <div className="reservation-time">{reservation.reservationDateTime ? new Date(reservation.reservationDateTime).toLocaleString() : 'N/A'}</div>
                </div>
                <div className="reservation-customer">
                  <div className="customer-name">{reservation.customerName}</div>
                  <div className="customer-email">{reservation.customerEmail}</div>
                </div>
                <div className="reservation-party">Party of {reservation.partySize || 0}</div>
                <div className="reservation-status">
                  <span className="status-badge" style={{backgroundColor: getStatusColor(reservation.status)}}>{reservation.status}</span>
                </div>
                <div className="reservation-actions">
                  <select
                    value={reservation.status}
                    onChange={(e) => { e.stopPropagation(); handleStatusUpdate(reservation.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className="status-select"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button className="expand-btn">{expandedId === reservation.id ? '▲' : '▼'}</button>
                </div>
              </div>

              {expandedId === reservation.id && (
                <div className="reservation-details">
                  <div className="detail-row"><strong>Phone:</strong> {reservation.customerPhone || 'N/A'}</div>
                  <div className="detail-row"><strong>Table:</strong> {reservation.tableNumber || 'N/A'}</div>
                  {reservation.specialRequests && (
                    <div className="special-requests">
                      <strong>Special Requests:</strong>
                      <p>{reservation.specialRequests}</p>
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

export default AdminReservations;
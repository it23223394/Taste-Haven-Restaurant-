import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reservationDateTime: '',
    numberOfGuests: '',
    specialRequests: '',
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationAPI.getUserReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reservationAPI.createReservation(formData);
      toast.success('Reservation created successfully!');
      setShowForm(false);
      setFormData({ reservationDateTime: '', numberOfGuests: '', specialRequests: '' });
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationAPI.cancelReservation(id);
        toast.success('Reservation cancelled');
        fetchReservations();
      } catch (error) {
        toast.error('Failed to cancel reservation');
      }
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="page-header">
          <h1>My Reservations</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'New Reservation'}
          </button>
        </div>

        {showForm && (
          <div className="reservation-form card">
            <h3>Make a Reservation</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={formData.reservationDateTime}
                  onChange={(e) => setFormData({...formData, reservationDateTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="20"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({...formData, numberOfGuests: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Reservation
              </button>
            </form>
          </div>
        )}

        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="reservation-info">
                <h3>Reservation #{reservation.id}</h3>
                <p>📅 {new Date(reservation.reservationDateTime).toLocaleString()}</p>
                <p>👥 {reservation.numberOfGuests} guests</p>
                {reservation.specialRequests && (
                  <p>📝 {reservation.specialRequests}</p>
                )}
                <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                  {reservation.status}
                </span>
              </div>
              {reservation.status === 'PENDING' || reservation.status === 'CONFIRMED' && (
                <button 
                  onClick={() => handleCancel(reservation.id)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>

        {reservations.length === 0 && !showForm && (
          <div className="empty-state">
            <p>No reservations yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;

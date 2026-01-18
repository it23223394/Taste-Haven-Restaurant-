import React, { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Reservations.css';

const Reservations = () => {
  const TABLE_COUNT = 12;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reservedTables, setReservedTables] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [formData, setFormData] = useState({
    reservationDateTime: '',
    numberOfGuests: '',
    specialRequests: '',
    tableNumbers: [],
  });
  const tables = Array.from({ length: TABLE_COUNT }, (_, index) => index + 1);
  const selectedTables = formData.tableNumbers || [];

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
    if (!formData.tableNumbers || formData.tableNumbers.length === 0) {
      toast.error('Please select at least one table for your reservation');
      return;
    }
    try {
      await reservationAPI.createReservation({
        ...formData,
        tableNumbers: formData.tableNumbers,
      });
      toast.success('Reservation created successfully!');
      setShowForm(false);
      setFormData({ reservationDateTime: '', numberOfGuests: '', specialRequests: '', tableNumbers: [] });
      setReservedTables([]);
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    }
  };

  const fetchTableAvailability = async (dateTime) => {
    if (!dateTime) {
      setReservedTables([]);
      return;
    }

    try {
      setAvailabilityLoading(true);
      const response = await reservationAPI.getReservedTables(dateTime);
      setReservedTables(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load table availability');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleDateTimeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      reservationDateTime: value,
      tableNumbers: [],
    }));
    if (value) {
      fetchTableAvailability(value);
    } else {
      setReservedTables([]);
    }
  };

  const handleTableSelection = (tableNumber) => {
    if (reservedTables.includes(tableNumber)) return;
    
    setFormData((prev) => {
      const currentTables = prev.tableNumbers || [];
      const isSelected = currentTables.includes(tableNumber);
      
      return {
        ...prev,
        tableNumbers: isSelected
          ? currentTables.filter(t => t !== tableNumber)
          : [...currentTables, tableNumber],
      };
    });
  };

  useEffect(() => {
    if (selectedTables.length > 0) {
      const conflictingTables = selectedTables.filter(t => reservedTables.includes(t));
      if (conflictingTables.length > 0) {
        setFormData((prev) => ({
          ...prev,
          tableNumbers: selectedTables.filter(t => !reservedTables.includes(t)),
        }));
      }
    }
  }, [reservedTables, selectedTables]);

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
                  onChange={(e) => handleDateTimeChange(e.target.value)}
                  required
                />
              </div>

              <div className="table-availability-card">
                <p className="table-status-heading">
                  {availabilityLoading
                    ? 'Checking table availability...'
                    : formData.reservationDateTime
                      ? `Pick a table for ${new Date(formData.reservationDateTime).toLocaleString()}`
                      : 'Select a date and time above to view table availability'}
                </p>
                <div className={`table-grid ${availabilityLoading ? 'disabled' : ''}`}>
                  {tables.map((table) => {
                    const isReserved = reservedTables.includes(table);
                    const isSelected = selectedTables.includes(table);
                    const status = isReserved
                      ? 'reserved'
                      : isSelected
                        ? 'selected'
                        : 'available';
                    return (
                      <button
                        key={table}
                        type="button"
                        className={`table-cell ${status}`}
                        onClick={() => handleTableSelection(table)}
                        disabled={isReserved || availabilityLoading}
                      >
                        <span>Table {table}</span>
                        <span className="table-tag">
                          {isReserved ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedTables.length > 0 && (
                  <p className="reserved-summary" style={{color: '#28a745', fontWeight: 'bold'}}>
                    Selected tables: {selectedTables.join(', ')}
                  </p>
                )}
                {reservedTables.length > 0 && !availabilityLoading && (
                  <p className="reserved-summary">
                    Reserved tables: {reservedTables.join(', ')}
                  </p>
                )}
                <div className="table-legend">
                  <span><span className="legend-dot available"></span>Available</span>
                  <span><span className="legend-dot reserved"></span>Booked</span>
                  <span><span className="legend-dot selected"></span>Selected</span>
                </div>
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
                <h3>Reservation Details</h3>
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

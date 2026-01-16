import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const statusOptions = ['PENDING','CONFIRMED','SEATED','COMPLETED','CANCELLED','NO_SHOW'];

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllReservations();
      setReservations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleReservationStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateReservationStatus(id, status);
      toast.success('Reservation status updated');
      fetchReservations();
    } catch (error) {
      toast.error('Unable to update reservation');
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
        <h2>Reservation Management</h2>
        <p>See every table booking and keep guests on schedule.</p>
      </div>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Date</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={`res-${reservation.id}`}>
                <td>#{reservation.id}</td>
                <td>{reservation.user?.firstName} {reservation.user?.lastName}</td>
                <td>{new Date(reservation.reservationDateTime).toLocaleString()}</td>
                <td>{reservation.numberOfGuests}</td>
                <td>
                  <span className={`badge ${reservation.status?.toLowerCase()}`}>
                    {reservation.status}
                  </span>
                </td>
                <td>
                  <select
                    value={reservation.status}
                    onChange={(e) => handleReservationStatusUpdate(reservation.id, e.target.value)}
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

export default AdminReservations;
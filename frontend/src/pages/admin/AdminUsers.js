import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const initialNewUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  };
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(initialNewUser);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      const extracted = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.users)
          ? response.data.users
          : [];
      setUsers(extracted);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Remove this user permanently?')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Unable to delete user');
    }
  };

  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewUserSubmit = async (event) => {
    event.preventDefault();
    try {
      await adminAPI.createUser(newUser);
      toast.success('New user created');
      setNewUser(initialNewUser);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add user');
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
        <h2>User Management</h2>
        <p>Control who has admin access and remove stale accounts.</p>
      </div>
      <form className="admin-user-form" onSubmit={handleNewUserSubmit}>
        <h3>Add a new user</h3>
        <div className="form-grid">
          <input
            name="firstName"
            placeholder="First name"
            value={newUser.firstName}
            onChange={handleNewUserChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last name"
            value={newUser.lastName}
            onChange={handleNewUserChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password (min 6 chars)"
            value={newUser.password}
            onChange={handleNewUserChange}
            required
          />
          <input
            name="phoneNumber"
            placeholder="Phone (optional)"
            value={newUser.phoneNumber}
            onChange={handleNewUserChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add user
          </button>
        </div>
      </form>
      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={`user-${user.id}`}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="action-buttons">
                  <button className="btn btn-outline" onClick={() => handleUserDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
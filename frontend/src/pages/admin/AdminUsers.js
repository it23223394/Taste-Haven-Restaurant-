import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    try {
      await adminAPI.updateUserRole(userId, nextRole);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Role update failed');
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
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleRoleToggle(user.id, user.role)}
                  >
                    {user.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'}
                  </button>
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
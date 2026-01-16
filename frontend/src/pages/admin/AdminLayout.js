import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/admin', label: 'Admin Dashboard' },
  { to: '/admin/orders', label: 'Order Management' },
  { to: '/admin/reservations', label: 'Reservation Management' },
  { to: '/admin/menu', label: 'Menu Management' },
  { to: '/admin/users', label: 'User Management' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-subtitle">Taste Haven Control Center</p>
          <h1 className="admin-title">Admin Workspace</h1>
        </div>
        <div className="admin-header__actions">
          <nav className="admin-header__nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin'}
                className={({ isActive }) =>
                  isActive ? 'admin-header__link admin-header__link--active' : 'admin-header__link'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button className="admin-logout-button" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>
      <section className="admin-content-shell">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
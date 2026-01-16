import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo-image">
            <img src="/images/icon.jpg" alt="Taste Haven" />
          </span>
          Taste Haven
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          
          {isAuthenticated() ? (
            <>
              <Link to="/reservations" className="nav-link">Reservations</Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
              
              <div className="nav-dropdown">
                <button className="nav-link dropdown-toggle">
                  👤 {user?.firstName}
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn btn-primary nav-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

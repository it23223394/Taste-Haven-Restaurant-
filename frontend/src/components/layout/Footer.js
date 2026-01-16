import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Restaurant</h3>
            <p>Experience fine dining at its best</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/reservations">Reservations</a></li>
              <li><a href="/orders">Orders</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>📞 (+94) 740001191</p>
            <p>📧 info@restaurant.com</p>
          </div>
          
          <div className="footer-section">
            <h4>Hours</h4>
            <p>Monday - Friday: 11am - 10pm</p>
            <p>Saturday - Sunday: 10am - 11pm</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 Taste Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

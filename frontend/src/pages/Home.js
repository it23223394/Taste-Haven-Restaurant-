import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">Welcome to Our Restaurant</h1>
          <p className="hero-subtitle">
            Experience culinary excellence with our exquisite dishes and exceptional service
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary btn-lg">
              View Menu
            </Link>
            <Link to="/reservations" className="btn btn-outline btn-lg">
              Make a Reservation
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Delicious Food</h3>
              <p>Fresh ingredients, expertly prepared by our master chefs</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Service</h3>
              <p>Exceptional dining experience with attentive staff</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable food delivery to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Ordering</h3>
              <p>Order online with our user-friendly system</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience Amazing Food?</h2>
          <p>Join us today and discover why we're the city's favorite restaurant</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

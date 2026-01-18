import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
  {
    title: 'Delicious Food',
    description: 'Chef-driven menus crafted with seasonal, locally sourced ingredients.',
    icon: 'Delicious Food.png',
  },
  {
    title: 'Quality Service',
    description: 'Warm hospitality backed by intuitive concierge support at every touchpoint.',
    icon: 'Quality Service.png',
  },
  {
    title: 'Fast Delivery',
    description: 'Speedy, trackable delivery crafted for the moments you crave convenience.',
    icon: 'Fast Delivery.png',
  },
  {
    title: 'Easy Ordering',
    description: 'Browse, customize, and order with a polished, effortless experience.',
    icon: 'easy ordering.png',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

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
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <img 
                    src={`/images/${feature.icon}`} 
                    alt={feature.title}
                    className="feature-image"
                  />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated() && (
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Experience Amazing Food?</h2>
            <p>Join us today and discover why we're the city's favorite restaurant</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Sign Up Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

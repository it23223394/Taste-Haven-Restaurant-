import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
  {
    title: 'Delicious Food',
    description: 'Chef-driven menus crafted with seasonal, locally sourced ingredients.',
    icon: (
      <svg viewBox="0 0 64 64" role="presentation" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="#fef6ec" stroke="#f4a261" strokeWidth="3" />
        <circle cx="32" cy="32" r="16" fill="#1f3b4a" />
        <circle cx="32" cy="32" r="8" fill="#fef6ec" />
      </svg>
    ),
  },
  {
    title: 'Quality Service',
    description: 'Warm hospitality backed by intuitive concierge support at every touchpoint.',
    icon: (
      <svg viewBox="0 0 64 64" role="presentation" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="20" width="40" height="26" rx="6" fill="#ffffff" stroke="#2f3c54" strokeWidth="3" />
        <path d="M24 32h16M24 38h16" stroke="#2f3c54" strokeWidth="3" strokeLinecap="round" />
        <circle cx="47" cy="32" r="6" fill="#f4a261" />
      </svg>
    ),
  },
  {
    title: 'Fast Delivery',
    description: 'Speedy, trackable delivery crafted for the moments you crave convenience.',
    icon: (
      <svg viewBox="0 0 64 64" role="presentation" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 40h35l9-16h-12" stroke="#1f3b4a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="20" cy="46" r="6" fill="#f4a261" stroke="#1f3b4a" strokeWidth="3" />
        <circle cx="45" cy="46" r="6" fill="#f4a261" stroke="#1f3b4a" strokeWidth="3" />
        <path d="M16 24h10l4 6" stroke="#2f3c54" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Easy Ordering',
    description: 'Browse, customize, and order with a polished, effortless experience.',
    icon: (
      <svg viewBox="0 0 64 64" role="presentation" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="10" width="28" height="44" rx="8" fill="#1f3b4a" />
        <rect x="21" y="16" width="22" height="30" rx="4" fill="#fef6ec" />
        <circle cx="32" cy="44" r="3" fill="#1f3b4a" />
        <line x1="28" y1="24" x2="36" y2="24" stroke="#2f3c54" strokeWidth="3" strokeLinecap="round" />
        <line x1="28" y1="30" x2="36" y2="30" stroke="#2f3c54" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
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
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
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

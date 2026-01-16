import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      toast.success('If that email is on file, we sent reset instructions.');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send reset link right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Your Password</h2>
        <p className="auth-subtitle">Enter your email and we will send you recovery instructions.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              name="email"
              className="form-control"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-redirect">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

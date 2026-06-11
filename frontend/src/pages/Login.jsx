import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('shreya@finura.io');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 px-3" style={{ backgroundColor: 'var(--bg-primary)', background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1), transparent 40%)' }}>
      <div className="w-100" style={{ maxWidth: '420px' }}>
        
        {/* Logo/Branding */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-4 mb-3">
            <i className="bi bi-wallet2 text-primary fs-1"></i>
          </div>
          <h2 className="fw-bold m-0 gradient-text">Finura</h2>
          <p className="text-muted mt-1">Intelligent Wealth & Budget Management</p>
        </div>

        {/* Login Card */}
        <div className="card glass-card p-4 shadow-lg border-0">
          <h4 className="fw-bold mb-3 text-center">Sign In</h4>
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 border-color" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control border-start-0" 
                  id="emailInput" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="passwordInput" className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 border-color" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control border-start-0" 
                  id="passwordInput" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2.5 fw-semibold d-flex justify-content-center align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick Demo Info Alert */}
          <div className="mt-3 p-2 bg-light-primary text-center rounded bg-opacity-10" style={{ fontSize: '0.8rem', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
            <span className="text-secondary">Demo Login: </span>
            <strong className="text-primary">shreya@finura.io</strong>
            <span className="text-secondary"> / Password: </span>
            <strong className="text-primary">123456</strong>
          </div>
        </div>

        {/* Footer Redirect */}
        <p className="text-center mt-4 text-secondary" style={{ fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary fw-bold text-decoration-none">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

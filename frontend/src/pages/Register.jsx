import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(name, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <p className="text-muted mt-1">Get started on your financial journey</p>
        </div>

        {/* Register Card */}
        <div className="card glass-card p-4 shadow-lg border-0">
          <h4 className="fw-bold mb-3 text-center">Create Account</h4>
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 p-2" style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 border-color" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <i className="bi bi-person"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0" 
                  id="nameInput" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
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
                  placeholder="•••••••• (min 6 chars)"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPasswordInput" className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 border-color" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control border-start-0" 
                  id="confirmPasswordInput" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>

        {/* Footer Redirect */}
        <p className="text-center mt-4 text-secondary" style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-bold text-decoration-none">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;

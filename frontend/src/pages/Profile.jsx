import React, { useState, useEffect } from 'react';
import { profileService } from '../services/api';

const Profile = ({ user, onSyncProfile }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCurrency(user.currency);
      setTheme(user.theme);
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (!name) {
      setErrorMsg('Name cannot be empty');
      setIsSaving(false);
      return;
    }

    const payload = {
      ...user,
      name,
      currency,
      theme,
      profilePicture
    };

    try {
      const updated = await profileService.updateProfile(payload);
      // Trigger theme change on document
      document.documentElement.setAttribute('data-theme', theme);
      // Sync parent state
      onSyncProfile(updated);
      setSuccessMsg('Profile and preferences updated successfully!');
      
      // Dispatch storage change event to sync Navbar
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0 text-primary-gradient">User Settings</h2>
          <p className="text-muted m-0">Customize visual appearance, preferences, and personal details.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Avatar Card */}
        <div className="col-12 col-lg-4">
          <div className="card glass-card p-4 border-0 text-center">
            <h5 className="fw-bold mb-4">Profile Card</h5>
            
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img 
                src={profilePicture || 'https://via.placeholder.com/150'} 
                alt={name} 
                className="rounded-circle border border-4 border-primary" 
                style={{ width: '130px', height: '130px', objectFit: 'cover' }}
              />
            </div>

            <h4 className="fw-bold m-0">{name || 'Finura User'}</h4>
            <p className="text-muted mt-1">{email}</p>
            
            <div className="p-3 bg-secondary bg-opacity-5 rounded-3 text-start mt-4" style={{ fontSize: '0.85rem' }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Primary currency:</span>
                <span className="fw-bold">{currency}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Visual Theme:</span>
                <span className="fw-bold text-capitalize">{theme} mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Form */}
        <div className="col-12 col-lg-8">
          <div className="card glass-card p-4 border-0">
            <h5 className="fw-bold mb-4">Edit Profile & Preferences</h5>

            {successMsg && (
              <div className="alert alert-success d-flex align-items-center gap-2 p-2.5" style={{ fontSize: '0.88rem', borderRadius: '10px' }}>
                <i className="bi bi-check-circle-fill"></i>
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 p-2.5" style={{ fontSize: '0.88rem', borderRadius: '10px' }}>
                <i className="bi bi-exclamation-octagon-fill"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="row g-3">
                {/* Full name */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email (Readonly for now) */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Email Address (Account ID)</label>
                  <input 
                    type="email" 
                    className="form-control"
                    value={email}
                    readOnly
                    disabled
                    style={{ background: 'rgba(var(--accent-primary-rgb), 0.05)', cursor: 'not-allowed' }}
                  />
                </div>

                {/* Profile Picture URL */}
                <div className="col-12">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Avatar Image URL</label>
                  <input 
                    type="url" 
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                  />
                </div>

                <hr className="my-4 border-color" style={{ borderColor: 'var(--border-color)' }} />

                <h6 className="fw-bold m-0 text-primary">System Preferences</h6>

                {/* Currency Selection */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Currency Symbol Code</label>
                  <select 
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD ($ - United States Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="GBP">GBP (£ - British Pound Sterling)</option>
                  </select>
                </div>

                {/* Theme Mode Toggle */}
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>Visual Color Theme</label>
                  <select 
                    className="form-select"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <option value="dark">Dark Theme (Neon / Charcoal)</option>
                    <option value="light">Light Theme (Clean / Slate)</option>
                  </select>
                </div>

                {/* Submit button */}
                <div className="col-12 mt-4 text-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving Details...
                      </>
                    ) : (
                      'Save Configurations'
                    )}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [theme, setTheme] = useState(user?.theme || 'dark');
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Budget Warning: Food budget is at 60%', unread: true },
    { id: 2, text: 'Goal Achievement: Saved ₹60,000 towards iPad Pro!', unread: true },
    { id: 3, text: 'AI Tip: Automate savings to double efficiency', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Set theme on html tag
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    // Update local storage configuration if user exists
    if (user) {
      const updatedUser = { ...user, theme: nextTheme };
      localStorage.setItem('finura_user', JSON.stringify(updatedUser));
      // Trigger a storage sync or local notification
      window.dispatchEvent(new Event('storage'));
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-custom px-4 py-2">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Mobile menu toggle */}
        <button 
          className="btn btn-link d-lg-none p-0 text-decoration-none me-3" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#sidebarCollapse"
          style={{ color: 'var(--text-primary)' }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Branding (for mobile view primarily, as sidebar has it on desktop) */}
        <div className="d-flex align-items-center d-lg-none">
          <i className="bi bi-wallet2 text-primary fs-3 me-2"></i>
          <span className="h4 m-0 fw-bold gradient-text">Finura</span>
        </div>

        {/* Dashboard Title / Greeting (Desktop) */}
        <div className="d-none d-lg-block">
          <h5 className="m-0 text-muted fs-6">Welcome Back,</h5>
          <h3 className="m-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
            {user?.name || 'User'}
          </h3>
        </div>

        {/* Top Navbar Right Items */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            className="btn btn-outline-secondary border-0 p-2 d-flex align-items-center justify-content-center rounded-circle"
            onClick={toggleTheme}
            style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <i className={`bi bi-${theme === 'light' ? 'moon-fill' : 'sun-fill'} fs-5`}></i>
          </button>

          {/* Notifications Dropdown */}
          <div className="position-relative">
            <button 
              className="btn btn-outline-secondary border-0 p-2 d-flex align-items-center justify-content-center rounded-circle position-relative"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <i className="bi bi-bell-fill fs-5"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white" style={{ fontSize: '0.65rem' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div 
                className="position-absolute end-0 mt-2 glass-card p-3 shadow-lg"
                style={{ width: '300px', zIndex: 1000, right: 0 }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <h6 className="m-0 fw-bold">Notifications</h6>
                  {unreadCount > 0 && (
                    <button className="btn btn-link p-0 text-decoration-none text-primary fs-7" style={{ fontSize: '0.8rem' }} onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p className="text-muted text-center m-0 py-3" style={{ fontSize: '0.85rem' }}>No new notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-2 mb-1 rounded`}
                        style={{ 
                          fontSize: '0.82rem', 
                          borderLeft: n.unread ? '3px solid var(--accent-secondary)' : 'none',
                          backgroundColor: n.unread ? 'rgba(14, 165, 233, 0.08)' : 'transparent',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <p className={`m-0 ${n.unread ? 'fw-semibold' : ''}`} style={{ color: 'var(--text-primary)' }}>{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-center mt-2 pt-2 border-top">
                  <button className="btn btn-sm btn-link text-decoration-none text-muted p-0 w-100" style={{ fontSize: '0.75rem' }} onClick={() => setShowNotifications(false)}>
                    Close Drawer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Logout */}
          <div className="dropdown">
            <button 
              className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 dropdown-toggle" 
              type="button" 
              id="profileDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ color: 'var(--text-primary)' }}
            >
              <img 
                src={user?.profilePicture || 'https://via.placeholder.com/40'} 
                alt={user?.name || 'User'} 
                className="rounded-circle border border-2 border-primary" 
                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
              />
              <span className="d-none d-sm-inline fw-semibold" style={{ fontSize: '0.9rem' }}>{user?.name || 'Profile'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end glass-card p-2 border-0 shadow-lg" aria-labelledby="profileDropdown" style={{ minWidth: '180px' }}>
              <li>
                <Link className="dropdown-item py-2 px-3 rounded sidebar-link m-0 text-start w-100" to="/profile" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-person-fill me-2 text-primary"></i> My Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item py-2 px-3 rounded sidebar-link m-0 text-start w-100" to="/ai-advisor" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-cpu-fill me-2 text-info"></i> AI Advisor
                </Link>
              </li>
              <li><hr className="dropdown-divider my-1 border-color" style={{ borderColor: 'var(--border-color)' }} /></li>
              <li>
                <button 
                  className="dropdown-item py-2 px-3 rounded text-danger border-0 bg-transparent text-start w-100" 
                  onClick={onLogout}
                  style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <i className="bi bi-box-arrow-right text-danger"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { path: '/income', label: 'Income Log', icon: 'bi-cash-coin' },
    { path: '/expenses', label: 'Expenses Log', icon: 'bi-credit-card-fill' },
    { path: '/budgets', label: 'Budgets', icon: 'bi-pie-chart-fill' },
    { path: '/goals', label: 'Savings Goals', icon: 'bi-trophy-fill' },
    { path: '/reports', label: 'Analytics & Reports', icon: 'bi-bar-chart-line-fill' },
    { path: '/ai-advisor', label: 'AI Advisor', icon: 'bi-cpu-fill', badge: 'New' },
    { path: '/profile', label: 'My Profile', icon: 'bi-person-gear' }
  ];

  return (
    <div 
      className="sidebar-wrapper collapse d-lg-flex" 
      id="sidebarCollapse"
    >
      {/* Sidebar Branding Header */}
      <div className="sidebar-brand p-4 d-flex align-items-center gap-3">
        <div className="brand-icon-wrapper bg-primary bg-opacity-10 p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <i className="bi bi-wallet2 text-primary fs-4"></i>
        </div>
        <div>
          <h3 className="h4 m-0 fw-bold gradient-text">Finura</h3>
          <small className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>INTELLIGENT WEALTH</small>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-grow-1 px-2 py-3 overflow-y-auto">
        <ul className="nav flex-column gap-1">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                // Mobile-friendly collapse on click if menu is collapsed
                onClick={() => {
                  const bsCollapse = window.bootstrap?.Collapse?.getInstance(document.getElementById('sidebarCollapse'));
                  if (bsCollapse) {
                    bsCollapse.hide();
                  }
                }}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="badge rounded-pill bg-info text-dark ms-auto" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Branding Info */}
      <div className="p-4 border-top mt-auto" style={{ borderColor: 'var(--border-color)' }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="badge bg-success-subtle text-success border border-success border-opacity-25" style={{ fontSize: '0.65rem' }}>Local Demo v1.0</span>
        </div>
        <p className="m-0 text-muted" style={{ fontSize: '0.75rem' }}>
          Future API: Ready
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

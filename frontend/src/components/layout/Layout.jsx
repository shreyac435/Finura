import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ user, onLogout }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
        {/* Top Navbar */}
        <Navbar user={user} onLogout={onLogout} />

        {/* Scrollable Sub-pages Content */}
        <main className="flex-grow-1 p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

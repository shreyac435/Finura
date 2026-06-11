import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { authService } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check login session on mount
  useEffect(() => {
    const checkSession = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        // Apply user's selected theme (light/dark)
        document.documentElement.setAttribute('data-theme', currentUser.theme || 'dark');
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    };

    checkSession();

    // Listen to storage events to keep theme/user sync across tabs/components
    const syncSession = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  const handleLogin = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    setIsLoggedIn(true);
    document.documentElement.setAttribute('data-theme', loggedInUser.theme || 'dark');
  };

  const handleRegister = async (name, email, password) => {
    const registeredUser = await authService.register(name, email, password);
    setUser(registeredUser);
    setIsLoggedIn(true);
    document.documentElement.setAttribute('data-theme', registeredUser.theme || 'dark');
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const handleSyncProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading Finura...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes 
        isLoggedIn={isLoggedIn} 
        user={user} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        onLogout={handleLogout}
        onSyncProfile={handleSyncProfile}
      />
    </BrowserRouter>
  );
}

export default App;

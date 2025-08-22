import React, { useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import TranslatorPage from './pages/TranslatorPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import './App.css';
import AuthContext from './context/AuthContext.jsx';
import { useToast } from './context/ToastContext.jsx';

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
  toast.info('Logged out successfully.');
    navigate('/login', { replace: true });
  };
  return (
    <>
      <header className="main-header">
        <Link to="/" className="logo">Smart Translator</Link>
        <nav>
          {user ? (
            <>
              <Link to="/app" className="nav-link">Translator</Link>
              <Link to="/history" className="nav-link">History</Link>
              <button onClick={handleLogout} className="btn subtle" style={{ marginLeft: '1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/app" element={<RequireAuth><TranslatorPage /></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default App;

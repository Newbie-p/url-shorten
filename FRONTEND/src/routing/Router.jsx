import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App.jsx';
import Navbar from '../components/Navbar.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';

function Protected({ children, authed }){
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

export default function Router(){
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const authed = useMemo(() => Boolean(token), [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const handleAuth = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={authed} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<App authed={authed} />} />
        <Route path="/login" element={<Login onAuth={handleAuth} />} />
        <Route path="/register" element={<Register onAuth={handleAuth} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}



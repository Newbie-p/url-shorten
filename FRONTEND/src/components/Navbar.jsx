import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated, onLogout }){
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="w-full px-3 sm:px-4 py-2 sm:py-0 min-h-14 flex flex-wrap items-center justify-between gap-y-2">
        <Link to="/" className="font-semibold text-xl sm:text-2xl">URL Shortener</Link>
        
        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-4 sm:gap-5">
          <Link to="/" className="text-base sm:text-lg text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/dashboard" className="text-base sm:text-lg text-gray-700 hover:text-gray-900">Dashboard</Link>
          {isAuthenticated ? (
            <button onClick={onLogout} className="text-base sm:text-lg text-gray-700 hover:text-gray-900">Logout</button>
          ) : (
            <>
              <Link to="/register" className="text-base sm:text-lg text-gray-700 hover:text-gray-900">Register</Link>
              <Link to="/login" className="text-base sm:text-lg text-gray-700 hover:text-gray-900">Login</Link>
            </>
          )}
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="w-full sm:hidden mt-2 py-2 bg-white border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAuthenticated ? (
                <button 
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="text-base text-gray-700 hover:text-gray-900 px-3 py-2 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}



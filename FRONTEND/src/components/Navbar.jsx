import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Link2 } from 'lucide-react';

export default function Navbar({ isAuthenticated, onLogout }){
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLink = "text-sm font-medium text-muted hover:text-paper transition-colors";

  return (
    <nav className="w-full border-b border-line bg-ink/95 backdrop-blur sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg sm:text-xl text-paper">
          <span className="w-7 h-7 rounded-md bg-rust/15 flex items-center justify-center">
            <Link2 size={15} className="text-rust" strokeWidth={2.5} />
          </span>
          sniplink
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 rounded-md text-paper hover:bg-ink-light"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className={navLink}>Home</Link>
          <Link to="/dashboard" className={navLink}>Dashboard</Link>
          {isAuthenticated ? (
            <button onClick={onLogout} className={navLink}>Logout</button>
          ) : (
            <>
              <Link to="/register" className={navLink}>Register</Link>
              <Link
                to="/login"
                className="text-sm font-medium bg-rust text-ink px-4 py-2 rounded-lg hover:bg-rust-dim transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="w-full sm:hidden border-t border-line bg-ink">
          <div className="flex flex-col px-4 py-3 gap-1">
            <Link to="/" className="text-sm text-muted hover:text-paper px-2 py-2.5 rounded-md hover:bg-ink-light" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/dashboard" className="text-sm text-muted hover:text-paper px-2 py-2.5 rounded-md hover:bg-ink-light" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            {isAuthenticated ? (
              <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-sm text-muted hover:text-paper px-2 py-2.5 rounded-md hover:bg-ink-light text-left">Logout</button>
            ) : (
              <>
                <Link to="/register" className="text-sm text-muted hover:text-paper px-2 py-2.5 rounded-md hover:bg-ink-light" onClick={() => setIsMenuOpen(false)}>Register</Link>
                <Link to="/login" className="text-sm text-ink bg-rust px-2 py-2.5 rounded-md text-center mt-1 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
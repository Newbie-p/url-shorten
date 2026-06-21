import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/base.js';
import { Link2, ArrowRight } from 'lucide-react';

export default function Register({ onAuth }){
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Registration failed');
      onAuth(data.token);
      navigate('/');
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-ink-light border border-line rounded-lg px-3.5 py-2.5 text-paper placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-rust text-sm";

  return (
    <div className="min-h-dvh bg-ink text-paper flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-10 h-10 rounded-lg bg-rust/15 flex items-center justify-center mx-auto mb-4">
            <Link2 size={18} className="text-rust" strokeWidth={2.5} />
          </span>
          <h1 className="font-display text-2xl font-semibold">Create account</h1>
          <p className="text-muted text-sm mt-1.5">Start shortening and tracking your links.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input className={inputClass} type="text" placeholder="Name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className={inputClass} type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className={inputClass} type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-sm text-rust font-medium">{error}</p>}
          <button disabled={loading} className="w-full flex items-center justify-center gap-2 bg-rust text-ink rounded-lg px-3 py-2.5 font-semibold hover:bg-rust-dim transition-colors disabled:opacity-60">
            {loading ? 'Creating…' : (<>Create account <ArrowRight size={16} /></>)}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted text-center">
          Already registered? <Link to="/login" className="text-rust font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
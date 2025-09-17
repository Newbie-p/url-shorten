import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/base.js';

export default function Login({ onAuth }){
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Login failed');
      onAuth(data.token);
      navigate('/');
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border rounded-md px-3 py-2 sm:py-2.5" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-md px-3 py-2 sm:py-2.5" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md px-3 py-2 sm:py-2.5">{loading? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm text-gray-700">
        New here? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}



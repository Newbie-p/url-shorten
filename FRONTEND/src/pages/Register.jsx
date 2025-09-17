import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const res = await fetch('/api/auth/register', {
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

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border rounded-md px-3 py-2 sm:py-2.5" type="text" placeholder="Name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded-md px-3 py-2 sm:py-2.5" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full border rounded-md px-3 py-2 sm:py-2.5" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md px-3 py-2 sm:py-2.5">{loading? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="mt-4 text-sm text-gray-700">
        Already registered? <a href="/login" className="text-blue-600 hover:underline">Login</a>
      </p>
    </div>
  );
}



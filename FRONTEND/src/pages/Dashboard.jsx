import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE, APP_BASE } from '../api/base.js';
import { BarChart3, Trash2, Copy, Check, Lock } from 'lucide-react';

export default function Dashboard(){
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    (async () => {
      try{
        const res = await fetch(`${API_BASE}/api/create/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message || 'Failed to load');
        setItems(data.data || []);
      }catch(err){
        setError(err.message);
      }finally{
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (urlId) => {
    if (!window.confirm('Delete this URL? This action cannot be undone.')) return;

    setDeleting(urlId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/create/${urlId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      setItems(items.filter(item => item._id !== urlId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = async (shortUrl, id) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-ink text-paper flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-ink-light border border-line rounded-2xl p-8">
          <span className="w-10 h-10 rounded-lg bg-rust/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={18} className="text-rust" />
          </span>
          <h2 className="font-display text-xl font-semibold mb-2">Login required</h2>
          <p className="text-muted text-sm mb-5">Login to view your shortened URLs and click analytics.</p>
          <Link to="/login" className="inline-block bg-rust text-ink px-5 py-2.5 rounded-lg font-semibold hover:bg-rust-dim transition-colors">
            Login to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if(loading) {
    return (
      <div className="min-h-dvh bg-ink text-paper flex items-center justify-center">
        <p className="text-muted text-sm font-mono">loading your links…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <div className="flex items-end justify-between mb-8 pb-6 border-b border-line">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold">Your URLs</h1>
          </div>
          <p className="font-mono text-sm text-muted">{items.length} tracked</p>
        </div>

        {error && <p className="text-rust text-sm mb-4 font-medium">{error}</p>}

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted">No URLs yet.</p>
            <Link to="/" className="inline-block mt-3 text-rust font-medium hover:underline text-sm">
              Shorten a link →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {items.map((it) => {
              const shortFull = `${APP_BASE}/${it.short_url}`;
              return (
                <div
                  key={it._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rust live-dot shrink-0" />
                      <a href={shortFull} target="_blank" rel="noreferrer" className="text-rust font-mono text-sm truncate hover:underline">
                        {it.short_url}
                      </a>
                    </div>
                    <a href={it.full_url} target="_blank" rel="noreferrer" className="text-muted text-xs mt-1 block truncate hover:text-paper transition-colors">
                      {it.full_url}
                    </a>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <p className="font-display text-2xl font-semibold w-8 text-center">{it.clicks}</p>

                    <Link to={`/analytics/${it.short_url}`} className="flex items-center gap-1.5 text-xs font-medium border border-line px-3 py-2 rounded-lg hover:bg-ink-light transition-colors">
                      <BarChart3 size={14} /> Analytics
                    </Link>

                    <button onClick={() => handleCopy(shortFull, it._id)} className="p-2 rounded-lg border border-line hover:bg-ink-light transition-colors" aria-label="Copy link">
                      {copiedId === it._id ? <Check size={14} className="text-rust" /> : <Copy size={14} />}
                    </button>

                    <button onClick={() => handleDelete(it._id)} disabled={deleting === it._id} className="p-2 rounded-lg border border-line text-muted hover:text-rust hover:border-rust/40 transition-colors disabled:opacity-50" aria-label="Delete link">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
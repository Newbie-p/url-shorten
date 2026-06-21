import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createShortUrl } from './api/client.js';
import { ArrowRight, Copy, Check, ExternalLink, Lock, ChevronDown, ChevronUp } from 'lucide-react';

function App({ authed }) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!authed) {
      setError('Please login to shorten URLs.');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    try {
      setLoading(true);
      const result = await createShortUrl(url.trim(), customAlias, expiresAt);
      setShortUrl(result);
      setUrl('');
      setCustomAlias('');
      setExpiresAt('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rust mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-rust live-dot" />
            redis-cached, rate-limited
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">
            Long links,<br />
            <span className="text-rust">short routes.</span>
          </h1>
          <p className="text-muted mt-4 text-base sm:text-lg max-w-md mx-auto">
            Paste a link below. Get a short, trackable one back — with real click analytics.
          </p>
        </header>

        {!authed && (
          <div className="flex items-center gap-2.5 bg-rust/10 border border-rust/25 rounded-xl px-4 py-3 mb-5 text-sm">
            <Lock size={15} className="text-rust shrink-0" />
            <span className="text-paper">
              <Link to="/login" className="text-rust font-medium hover:underline">Login</Link> to shorten links, set custom aliases, and view analytics.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-ink-light rounded-2xl p-4 sm:p-6 border border-line">
          <label htmlFor="url" className="block text-sm font-medium text-muted mb-2">
            Long URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/link/that/needs/shortening"
              className="flex-1 rounded-lg bg-ink border border-line px-3.5 py-2.5 text-paper placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-rust font-mono text-sm disabled:opacity-50"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={!authed}
              required
            />
            <button
              type="submit"
              disabled={loading || !authed}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rust text-ink px-5 py-2.5 font-semibold hover:bg-rust-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Shortening…' : (<>Shorten <ArrowRight size={16} /></>)}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            disabled={!authed}
            className="flex items-center gap-1 text-xs text-muted hover:text-paper mt-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {showOptions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Custom alias &amp; expiry
          </button>

          {showOptions && authed && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label htmlFor="alias" className="block text-xs font-medium text-muted mb-1.5">
                  Custom alias <span className="text-muted/60">(optional)</span>
                </label>
                <div className="flex items-center bg-ink border border-line rounded-lg px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-rust">
                  <span className="text-muted/60 text-sm font-mono mr-1">/</span>
                  <input
                    id="alias"
                    type="text"
                    placeholder="my-link"
                    className="flex-1 bg-transparent text-paper placeholder:text-muted/60 focus:outline-none font-mono text-sm"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/\s/g, '-'))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="expiry" className="block text-xs font-medium text-muted mb-1.5">
                  Expires on <span className="text-muted/60">(optional)</span>
                </label>
                <input
                  id="expiry"
                  type="date"
                  min={today}
                  className="w-full bg-ink border border-line rounded-lg px-3.5 py-2.5 text-paper focus:outline-none focus:ring-2 focus:ring-rust text-sm [color-scheme:dark]"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && <p className="text-rust text-sm mt-3 font-medium" role="alert">{error}</p>}
        </form>

        {shortUrl && (
          <div className="mt-5 bg-ink-light border border-rust/25 rounded-2xl p-4 sm:p-6">
            <h2 className="text-sm font-medium text-muted mb-3">Your short link is live</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-ink rounded-lg px-3.5 py-2.5 border border-line">
                <span className="w-1.5 h-1.5 rounded-full bg-rust live-dot shrink-0" />
                <a href={shortUrl} target="_blank" rel="noreferrer" className="text-rust font-mono text-sm break-all hover:underline">
                  {shortUrl}
                </a>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg border border-line px-3.5 py-2.5 text-sm text-paper hover:bg-ink transition-colors">
                  {copied ? <Check size={15} className="text-rust" /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a href={shortUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg bg-paper text-ink px-3.5 py-2.5 text-sm font-medium hover:bg-paper/90 transition-colors">
                  Open <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-muted/70 mt-16 font-mono">
          built by Praful Suryawanshi
        </footer>
      </div>
    </div>
  );
}

export default App;
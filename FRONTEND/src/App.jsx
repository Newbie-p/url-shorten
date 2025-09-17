import React, { useState } from 'react';
import { createShortUrl } from './api/client.js';

function App({ authed }) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }
    try {
      setLoading(true);
      const result = await createShortUrl(url.trim());
      setShortUrl(result);
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
    } catch {}
  };

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold">URL Shortener</h1>
          <p className="text-gray-600 mt-2">Paste a long link to get a short one.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl p-3 sm:p-6 border border-gray-200">
          <label htmlFor="url" className="block text-sm sm:text-base font-medium mb-2">Long URL</label>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/link"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 sm:py-2.5 font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Shortening…' : 'Shorten URL'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-3" role="alert">{error}</p>}
          {!authed && (
            <p className="text-xs text-gray-500 mt-3">Tip: Login to save links to your dashboard.</p>
          )}
        </form>

        {shortUrl && (
          <div className="mt-5 sm:mt-6 bg-white border border-gray-200 rounded-xl p-3 sm:p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Your short link</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-600 break-all">
                {shortUrl}
              </a>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">Copy</button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-gray-900 text-white px-3 py-2 hover:bg-gray-800 text-center"
                >
                  Open
                </a>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-gray-500 mt-10">
          Made By Praful Suryawanshi
        </footer>
      </div>
    </div>
  );
}

export default App;
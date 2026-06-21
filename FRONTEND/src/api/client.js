import { API_BASE, APP_BASE } from './base.js';

export async function createShortUrl(longUrl, customAlias = '', expiresAt = '') {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please login to shorten URLs.');
  }

  const body = { url: longUrl };
  if (customAlias.trim()) body.customAlias = customAlias.trim();
  if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();

  const response = await fetch(`${API_BASE}/api/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create short URL');
  }

  // ALWAYS return the vercel domain short URL
  return `${APP_BASE}/${data.shortId}`;
}

export async function getUrlAnalytics(shortCode) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please login to view analytics.');

  const response = await fetch(`${API_BASE}/api/create/analytics/${shortCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load analytics');
  }

  return data.data;
}
import { API_BASE } from './base.js'
export async function createShortUrl(longUrl) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}/api/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url: longUrl }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || 'Failed to create short URL');
  }
  return text;
}



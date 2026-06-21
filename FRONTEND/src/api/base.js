export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const APP_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_URL)
  ? import.meta.env.VITE_APP_URL.replace(/\/$/, '')
  : API_BASE;

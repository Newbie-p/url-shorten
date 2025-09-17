import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleting, setDeleting] = useState(null);

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
        const res = await fetch('/api/create/me', {
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
    if (!window.confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(urlId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/create/${urlId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      
      // Remove from local state
      setItems(items.filter(item => item._id !== urlId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-lg font-medium text-blue-900 mb-2">Login to view your URL statistics</h2>
          <p className="text-blue-700 mb-4">Track clicks, manage your shortened URLs, and see detailed analytics.</p>
          <Link to="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Login to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if(loading) return <div className="max-w-4xl mx-auto p-3 sm:p-4">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4">
      <h1 className="text-2xl font-semibold mb-3 sm:mb-4">Your URLs</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {items.length === 0 ? (
        <p className="text-gray-600">No URLs yet. Create one from the home page.</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2.5 sm:p-3">Short</th>
                <th className="p-2.5 sm:p-3">Original</th>
                <th className="p-2.5 sm:p-3">Clicks</th>
                <th className="p-2.5 sm:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id} className="border-t">
                  <td className="p-2.5 sm:p-3">
                    <a className="text-blue-600" href={`${window.location.origin}/${it.short_url}`} target="_blank" rel="noreferrer">
                      {`${window.location.origin}/${it.short_url}`}
                    </a>
                  </td>
                  <td className="p-2.5 sm:p-3 max-w-[280px] sm:max-w-[320px] truncate">
                    <a className="text-gray-800" href={it.full_url} target="_blank" rel="noreferrer">{it.full_url}</a>
                  </td>
                  <td className="p-2.5 sm:p-3">{it.clicks}</td>
                  <td className="p-2.5 sm:p-3">
                    <button
                      onClick={() => handleDelete(it._id)}
                      disabled={deleting === it._id}
                      className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting === it._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



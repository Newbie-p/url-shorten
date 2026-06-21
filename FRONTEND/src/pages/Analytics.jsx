import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getUrlAnalytics } from '../api/client.js';
import { ArrowLeft, Globe2 } from 'lucide-react';

const COLORS = ['#E8743B', '#C45F2C', '#A8512A', '#8C4222', '#70341A'];

export default function Analytics() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUrlAnalytics(shortCode);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-ink text-paper flex items-center justify-center">
        <p className="text-muted text-sm font-mono">loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-ink text-paper flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-rust font-medium mb-3">{error}</p>
          <Link to="/dashboard" className="text-rust text-sm hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const deviceData = Object.entries(data.deviceBreakdown || {}).map(([name, value]) => ({ name, value }));
  const countryData = Object.entries(data.countryBreakdown || {}).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browserBreakdown || {}).map(([name, value]) => ({ name, value }));
  const maxCountry = countryData.length ? Math.max(...countryData.map(d => d.value)) : 1;

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-muted hover:text-paper text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> dashboard
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-2 text-muted text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rust live-dot" />
            tracking since {data.recentClicks?.length ? new Date(data.recentClicks[data.recentClicks.length - 1].createdAt).toLocaleDateString() : 'just now'}
          </div>
          <h1 className="font-mono text-2xl sm:text-3xl text-rust break-all">/{shortCode}</h1>
        </div>

        <div className="flex items-end gap-10 sm:gap-16 mb-12 pb-8 border-b border-line">
          <div>
            <p className="font-display text-5xl sm:text-6xl font-semibold leading-none">{data.totalClicks}</p>
            <p className="text-muted text-sm mt-2">total clicks</p>
          </div>
          <div className="pb-1">
            <p className="font-display text-2xl font-semibold leading-none">{data.clicksLast7Days}</p>
            <p className="text-muted/70 text-xs mt-1.5">in the last 7 days</p>
          </div>
          {deviceData[0] && (
            <div className="pb-1 hidden sm:block">
              <p className="font-display text-2xl font-semibold leading-none capitalize">{deviceData[0].name}</p>
              <p className="text-muted/70 text-xs mt-1.5">most common device</p>
            </div>
          )}
        </div>

        {data.totalClicks === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted text-sm">No clicks yet. Share the link to start seeing data here.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-5 gap-8 mb-10">
              <div className="sm:col-span-2">
                <h3 className="text-xs uppercase tracking-wide text-muted/80 mb-4">By device</h3>
                <div className="flex items-center gap-5">
                  <ResponsiveContainer width={110} height={110}>
                    <PieChart>
                      <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={32} outerRadius={50} paddingAngle={2}>
                        {deviceData.map((entry, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1E1A14', border: '1px solid #2A2419', borderRadius: 6, fontSize: 11 }} itemStyle={{ color: '#EDE6D6' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5">
                    {deviceData.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-paper capitalize">{d.name}</span>
                        <span className="text-muted font-mono">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <h3 className="text-xs uppercase tracking-wide text-muted/80 mb-4">By browser</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={browserData} layout="vertical" margin={{ left: 0, top: 0, right: 16, bottom: 0 }}>
                    <XAxis type="number" hide allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#5A5246', fontSize: 12 }} axisLine={false} tickLine={false} width={64} />
                    <Tooltip contentStyle={{ background: '#1E1A14', border: '1px solid #2A2419', borderRadius: 6, fontSize: 11 }} itemStyle={{ color: '#EDE6D6' }} cursor={{ fill: '#ffffff06' }} />
                    <Bar dataKey="value" fill="#E8743B" radius={[0, 3, 3, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-wide text-muted/80 mb-4">By country</h3>
              <div className="space-y-2.5">
                {countryData.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Globe2 size={13} className="text-muted shrink-0" />
                    <span className="text-paper w-24 truncate">{c.name}</span>
                    <div className="flex-1 bg-ink-light rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-rust/70 rounded-full" style={{ width: `${(c.value / maxCountry) * 100}%` }} />
                    </div>
                    <span className="text-muted font-mono text-xs w-6 text-right">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted/80 mb-4">Recent activity</h3>
              <table className="w-full text-left text-xs">
                <tbody>
                  {data.recentClicks?.map((c) => (
                    <tr key={c._id} className="border-t border-line">
                      <td className="py-2.5 text-muted">{new Date(c.createdAt).toLocaleString()}</td>
                      <td className="py-2.5 text-paper capitalize">{c.deviceType}</td>
                      <td className="py-2.5 text-muted">{c.browser}</td>
                      <td className="py-2.5 text-muted/70">{c.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
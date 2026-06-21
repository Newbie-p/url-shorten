import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Link2, Clock, SearchX } from 'lucide-react';

export default function Expired() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'expired';

  const isNotFound = reason === 'notfound';

  return (
    <div className="min-h-dvh bg-ink text-paper flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <span className="w-12 h-12 rounded-full bg-rust/10 flex items-center justify-center mx-auto mb-5">
          {isNotFound ? (
            <SearchX size={20} className="text-rust" />
          ) : (
            <Clock size={20} className="text-rust" />
          )}
        </span>

        <h1 className="font-display text-2xl font-semibold mb-2">
          {isNotFound ? 'Link not found' : 'This link has expired'}
        </h1>
        <p className="text-muted text-sm mb-7">
          {isNotFound
            ? "The short link you followed doesn't exist or may have been deleted."
            : 'The person who created this link set it to expire, and that date has passed.'}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-rust text-ink px-5 py-2.5 rounded-lg font-semibold hover:bg-rust-dim transition-colors"
        >
          <Link2 size={15} /> Create your own short link
        </Link>
      </div>
    </div>
  );
}
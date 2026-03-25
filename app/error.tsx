'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">
            An unexpected error occurred. You can try again, or go back home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go to home
            </Link>
          </div>
          {error?.digest ? (
            <p className="mt-6 text-xs text-gray-400">Error ID: {error.digest}</p>
          ) : null}
        </div>
      </body>
    </html>
  );
}


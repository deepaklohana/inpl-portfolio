import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-medium text-gray-500">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View blog
          </Link>
        </div>
      </div>
    </div>
  );
}


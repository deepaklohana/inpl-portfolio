export default function BlogListLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="h-9 w-40 bg-gray-200 rounded-md animate-pulse" />
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-gray-100 bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-44 bg-gray-200 animate-pulse" />
            <div className="p-5">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="mt-3 h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="mt-2 h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
              <div className="mt-5 h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


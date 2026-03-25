export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="mt-3 h-3 w-full bg-gray-100 rounded animate-pulse" />
            <div className="mt-2 h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
            <div className="mt-5 flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


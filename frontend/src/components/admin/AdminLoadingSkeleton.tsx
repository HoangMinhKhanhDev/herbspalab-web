import React from 'react';

interface SkeletonProps {
  type?: 'table' | 'grid' | 'list';
  count?: number;
}

const AdminLoadingSkeleton: React.FC<SkeletonProps> = ({ type = 'table', count = 5 }) => {
  const items = Array.from({ length: count });

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/5 h-48 space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-100 rounded-lg w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded-lg w-8"></div>
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-6 bg-gray-100 rounded-full w-16"></div>
              <div className="h-6 bg-gray-100 rounded-full w-16"></div>
              <div className="h-6 bg-gray-100 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 animate-pulse py-4">
        {items.map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              <div className="h-3 bg-gray-50 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default is 'table'
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-black/5">
              <th className="px-5 py-6 w-1/4"><div className="h-3 bg-gray-200 rounded w-1/2"></div></th>
              <th className="px-5 py-6 w-1/4"><div className="h-3 bg-gray-200 rounded w-1/3"></div></th>
              <th className="px-5 py-6 w-1/4"><div className="h-3 bg-gray-200 rounded w-1/2"></div></th>
              <th className="px-5 py-6 w-1/4"><div className="h-3 bg-gray-200 rounded w-1/4 ml-auto"></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((_, i) => (
              <tr key={i}>
                <td className="px-5 py-6"><div className="h-4 bg-gray-100 rounded w-3/4"></div></td>
                <td className="px-5 py-6"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
                <td className="px-5 py-6"><div className="h-4 bg-gray-100 rounded w-2/3"></div></td>
                <td className="px-5 py-6"><div className="h-4 bg-gray-100 rounded w-1/3 ml-auto"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLoadingSkeleton;

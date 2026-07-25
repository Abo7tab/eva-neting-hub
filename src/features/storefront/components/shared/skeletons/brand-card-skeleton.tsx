'use client';

export const BrandCardSkeleton = () => (
  <div className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 aspect-[3/2] overflow-hidden">
    <div className="w-full h-full rounded shimmer" />
  </div>
);

export const BrandGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <BrandCardSkeleton key={i} />
    ))}
  </div>
);

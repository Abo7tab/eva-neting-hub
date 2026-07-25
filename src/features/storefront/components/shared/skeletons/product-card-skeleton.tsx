'use client';

export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
    <div className="w-full aspect-square shimmer" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 rounded-lg shimmer w-3/4" />
      <div className="h-3 rounded-lg shimmer w-1/3" />
      <div className="h-6 rounded-lg shimmer w-1/2 mt-2" />
    </div>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

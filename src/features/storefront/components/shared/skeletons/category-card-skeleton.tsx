'use client';

export const CategoryCardSkeleton = () => (
  <div className="flex flex-col items-center gap-3">
    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full shimmer" />
    <div className="w-20 h-4 rounded shimmer" />
  </div>
);

export const CategoryGridSkeleton = () => (
  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <CategoryCardSkeleton key={i} />
    ))}
  </div>
);

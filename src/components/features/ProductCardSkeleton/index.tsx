interface ProductCardSkeletonProps {
  count?: number;
}

const ProductCardSkeleton = ({ count = 10 }: ProductCardSkeletonProps) => {
  const items = Array.from({ length: Math.max(1, count) });

  return (
    <div className="grid w-full grid-cols-1 gap-6 py-6 xs:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 2xl:gap-12">
      {items.map((_, idx) => (
        <div
          key={idx}
          className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white"
        >
          <figure className="relative aspect-square w-full p-4 pb-0">
            <div className="size-full skeleton rounded-full"></div>
          </figure>
          <div className="space-y-2 p-4 pt-3">
            <div className="h-4 w-3/4 skeleton"></div>
            <div className="flex gap-1">
              <div className="h-5 w-14 skeleton rounded-full"></div>
              <div className="h-5 w-12 skeleton rounded-full"></div>
            </div>
            <div className="ml-auto h-6 w-2/5 skeleton"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCardSkeleton;

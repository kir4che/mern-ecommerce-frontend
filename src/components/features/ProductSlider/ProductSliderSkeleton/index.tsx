interface ProductSliderSkeletonProps {
  count?: number;
}

const ProductSliderSkeleton = ({ count = 4 }: ProductSliderSkeletonProps) => {
  const items = Array.from({ length: Math.max(3, count) });

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex min-h-72 gap-8">
        {items.map((_, idx) => (
          <div
            key={idx}
            className="w-[80%] shrink-0 overflow-hidden rounded-2xl border border-gray-200/60 bg-white xs:w-[calc(66.666%-0.667rem)] tablet:w-[calc(50%-1rem)] md:w-[calc(40%-1.2rem)] lg:w-[calc(30.769%-1.385rem)] xl:w-[calc(25%-1.5rem)] 2xl:w-[calc(20%-1.6rem)]"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <div className="size-full skeleton"></div>
            </div>
            <div className="space-y-2.5 p-4">
              <div className="h-6 w-3/4 skeleton"></div>
              <div className="flex gap-1">
                <div className="h-5 w-14 skeleton rounded-full"></div>
                <div className="h-5 w-12 skeleton rounded-full"></div>
              </div>
              <div className="h-20 w-full skeleton"></div>
              <div className="flex-between pt-1">
                <div className="h-6 w-20 skeleton"></div>
                <div className="size-9 skeleton rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSliderSkeleton;

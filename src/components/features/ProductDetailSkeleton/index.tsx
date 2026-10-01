const ProductDetailSkeleton = () => (
  <div className="space-y-12 p-8 max-md:p-5 md:space-y-16">
    <div className="mx-auto flex max-w-screen-2xl justify-between gap-x-12 gap-y-4 max-lg:flex-col lg:gap-y-8">
      <div className="flex-1">
        <div className="aspect-square w-full skeleton max-lg:max-h-100"></div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="h-5 w-1/3 skeleton"></div>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="h-10 w-2/3 skeleton"></div>
          <div className="flex gap-1.5">
            <div className="h-7 w-16 skeleton rounded-full"></div>
            <div className="h-7 w-16 skeleton rounded-full"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full skeleton"></div>
          <div className="h-4 w-11/12 skeleton"></div>
          <div className="h-4 w-4/5 skeleton"></div>
        </div>
        <div className="mt-8 mb-5 flex-between flex-wrap gap-4">
          <div className="h-10 w-36 skeleton"></div>
          <div className="h-10 w-36 skeleton"></div>
        </div>
        <div className="mb-8 ml-auto h-12 w-52 skeleton rounded-full"></div>
        <div className="space-y-3 border-b border-slate-400 py-8">
          <div className="h-6 w-full skeleton"></div>
          <div className="h-6 w-full skeleton"></div>
          <div className="h-6 w-full skeleton"></div>
        </div>
      </div>
    </div>
    <div className="space-y-10">
      <div className="h-20 w-full skeleton"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-80 skeleton"></div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;

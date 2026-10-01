interface CartSkeletonProps {
  itemCount?: number;
}

const CartSkeleton = ({ itemCount = 3 }: CartSkeletonProps) => {
  const items = Array.from({ length: Math.min(itemCount, 4) });

  return (
    <div className="relative mx-auto flex w-full max-w-7xl gap-8 px-5 py-8 max-md:flex-col lg:gap-12 xl:px-0">
      <section className="min-w-0 flex-1 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">購物車 (0)</h2>
          <div className="h-10 w-20 skeleton"></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <ul className="divide-y divide-gray-200 px-4 tablet:px-6">
            {items.map((_, idx) => (
              <li key={idx} className="flex gap-4 py-6 tablet:gap-6">
                <div className="aspect-square w-24 shrink-0 skeleton tablet:w-32"></div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 skeleton"></div>
                    <div className="h-4 w-1/2 skeleton"></div>
                  </div>
                  <div className="h-4 w-1/4 skeleton"></div>
                  <div className="mt-auto flex items-end justify-between gap-4">
                    <div className="h-9 w-24 skeleton"></div>
                    <div className="h-6 w-20 skeleton"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="h-5 w-3/4 skeleton"></div>
            <div className="h-2 w-full skeleton"></div>
          </div>
        </div>
      </section>
      <aside className="w-full shrink-0 md:w-80 lg:w-96">
        <div className="sticky top-24 space-y-4 rounded-xl border border-gray-200 p-6 shadow-md">
          <div className="h-6 w-1/2 skeleton"></div>
          <div className="space-y-4 border-y border-gray-200 py-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-1/4 skeleton"></div>
                <div className="h-4 w-1/4 skeleton"></div>
              </div>
            ))}
          </div>
          <div className="flex-between py-2">
            <div className="h-4 w-1/4 skeleton"></div>
            <div className="h-8 w-1/3 skeleton"></div>
          </div>
          <div className="h-12 w-full skeleton rounded-full"></div>
        </div>
      </aside>
    </div>
  );
};

export default CartSkeleton;

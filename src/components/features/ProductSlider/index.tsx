import { Link } from "react-router";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useProductCollections } from "@/hooks/useProductCollections";
import { useGetProductsQuery } from "@/store/api/apiProducts";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";

import Button from "@/components/ui/Button";
import ProductImg from "@/components/ui/ProductImg";
import ProductSliderSkeleton from "./ProductSliderSkeleton";
import ProductActionForm from "@/components/shared/ProductActionForm";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

import "swiper/css/navigation";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1 },
  520: { slidesPerView: 1.5 },
  640: { slidesPerView: 2 },
  800: { slidesPerView: 2.5 },
  1024: { slidesPerView: 3.25 },
  1280: { slidesPerView: 3.6 },
  1440: { slidesPerView: 4 },
  1720: { slidesPerView: 5 },
};

const ProductCard = ({
  product,
  linkToCategory,
  catNameMap,
}: {
  product: Product;
  linkToCategory: Record<string, string>;
  catNameMap: Record<string, string>;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
    <Link
      to={`/products/${product._id}`}
      className="absolute inset-0 z-10"
      aria-label={`查看商品：${product.title}`}
    />
    <ProductImg
      product={product}
      className="relative aspect-square w-full overflow-hidden"
    />
    <div className="relative z-20 space-y-2.5 p-4">
      <h3 className="line-clamp-1 h-6 text-base leading-snug font-semibold transition-colors duration-300 group-hover:text-primary">
        {product.title}
      </h3>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <div className="flex flex-wrap gap-1">
          {product.categories.map((category) => (
            <Link
              key={category}
              to={`/collections/${linkToCategory[category] ?? category}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-primary hover:text-white"
            >
              {catNameMap[category] ?? category}
            </Link>
          ))}
        </div>
        <p className="shrink-0 text-xl font-bold text-primary">
          NT$ {addComma(product.price)}
        </p>
      </div>
      <p className="line-clamp-3 h-20 text-sm text-gray-600">
        {product.description}
      </p>
      <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
        <ProductActionForm product={product} variant="card" />
      </div>
    </div>
  </div>
);

const ProductSlider = () => {
  const { linkToCategory, catNameMap } = useProductCollections();
  const { data, isLoading, error, refetch, isFetching } = useGetProductsQuery({
    tag: "recommend",
  });

  if (isLoading) return <ProductSliderSkeleton />;

  if (error)
    return (
      <div className="flex-center min-h-72 flex-col">
        <p className="text-xl font-semibold">抱歉，暫時無法取得商品資訊。</p>
        <p className="text-gray-700">請檢查網路連線後重試</p>
        <Button
          icon={RefreshIcon}
          onClick={refetch}
          disabled={isFetching}
          className="mt-4 py-2 text-sm"
        >
          {isFetching ? "載入中" : "重新載入"}
        </Button>
      </div>
    );

  if (!data || data.products.length === 0)
    return (
      <div className="flex-center min-h-72">
        <p className="text-xl font-semibold">目前沒有任何推薦的商品</p>
      </div>
    );

  const availableProducts = data.products.filter(
    (product) => product.countInStock >= 1
  );

  return (
    <div className="group relative w-full">
      <Swiper
        spaceBetween={32}
        modules={[Autoplay, Navigation]}
        speed={600}
        grabCursor
        watchSlidesProgress
        navigation={{
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={availableProducts.length > 5}
        breakpoints={SWIPER_BREAKPOINTS}
      >
        {availableProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              product={product}
              linkToCategory={linkToCategory}
              catNameMap={catNameMap}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        variant="icon"
        icon={ArrowLeftIcon}
        className="swiper-prev absolute top-1/2 -left-3 z-20 size-10 -translate-y-1/2 rounded-full bg-white/90 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
        aria-label="上一個"
      />
      <Button
        variant="icon"
        icon={ArrowRightIcon}
        className="swiper-next absolute top-1/2 -right-3 z-20 size-10 -translate-y-1/2 rounded-full bg-white/90 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
        aria-label="下一個"
      />
    </div>
  );
};

export default ProductSlider;

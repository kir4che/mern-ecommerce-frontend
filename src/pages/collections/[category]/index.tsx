import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate, useParams } from "react-router";

import Button from "@/components/ui/Button";
import ProductCardSkeleton from "@/components/features/ProductCardSkeleton";
import ProductImg from "@/components/ui/ProductImg";
import PageHeader from "@/components/shared/PageHeader";
import { useProductCollections } from "@/hooks/useProductCollections";
import NotFound from "@/pages/notFound";
import { useGetProductsPagedInfiniteQuery } from "@/store/api/apiProducts";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

const ITEMS_PER_PAGE = 10;

const ProductCard = ({
  product,
  linkToCategory,
  catNameMap,
}: {
  product: Product;
  linkToCategory: Record<string, string>;
  catNameMap: Record<string, string>;
}) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const navigate = useNavigate();

  return (
    <Link
      to={`/products/${product._id}`}
      className="group card block overflow-hidden rounded-2xl border border-gray-200/60 bg-white transition-all duration-400 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl"
    >
      <figure className="relative w-full p-4 pb-0">
        <div className="relative aspect-square size-full overflow-hidden rounded-full border-2 border-gray-100 bg-gray-100 duration-500">
          <ProductImg
            product={product}
            className={cn(
              "size-full object-cover transition-opacity duration-700 ease-in-out",
              isImgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImgLoaded(true)}
          />
          {!isImgLoaded && (
            <div className="absolute inset-0 skeleton rounded-full" />
          )}
        </div>
      </figure>
      <div className="space-y-2 p-4 pt-3">
        <h3 className="line-clamp-1 text-base leading-snug font-semibold transition-colors duration-300 group-hover:text-primary">
          {product.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {product.categories.map((cat, index) => (
            <Button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/collections/${linkToCategory[cat] ?? cat}`);
              }}
              className="h-auto min-h-0 rounded-full border-0 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 hover:bg-primary hover:text-white"
            >
              # {catNameMap[cat] ?? cat}
            </Button>
          ))}
        </div>
        <p className="text-right text-xl font-bold text-primary">
          NT$ {addComma(product.price)}
        </p>
      </div>
    </Link>
  );
};

const CollectionsContent = ({
  category,
  collections,
  linkToCategory,
  catNameMap,
}: {
  category: string;
  collections: ReturnType<typeof useProductCollections>["collections"];
  linkToCategory: Record<string, string>;
  catNameMap: Record<string, string>;
}) => {
  const currentTab = collections.find((c) => c.value === category);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useGetProductsPagedInfiniteQuery({
    category: currentTab?.type === "category" ? currentTab.value : undefined,
    tag: currentTab?.type === "tag" ? currentTab.value : undefined,
  });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  // 監測 Scroll 觸底事件
  const { ref } = useInView({
    rootMargin: "300px", // 提前 300px 觸發
    onChange: (inView) => {
      if (inView && !isFetchingNextPage && hasNextPage) fetchNextPage();
    },
  });

  if (isLoading) return <ProductCardSkeleton count={ITEMS_PER_PAGE} />;

  if (error)
    return (
      <div className="flex-center min-h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-medium">
          {getErrorMessage(error, "商品載入失敗")}
        </h3>
        <p className="text-gray-600">請嘗試選擇其他分類，或稍後再試。</p>
        <Button variant="secondary" onClick={() => refetch()} className="mt-2">
          重新嘗試
        </Button>
      </div>
    );

  if (!products.length)
    return (
      <div className="flex-center min-h-[50vh] flex-col gap-4 text-center">
        <h3 className="text-xl font-medium">此分類目前沒有商品</h3>
        <p className="text-gray-600">請嘗試選擇其他分類</p>
      </div>
    );

  return (
    <>
      <div className="mx-auto grid w-full grid-cols-1 gap-6 py-6 xs:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8 2xl:gap-12">
        {products.map((product: Product) => (
          <ProductCard
            key={product._id}
            product={product}
            linkToCategory={linkToCategory}
            catNameMap={catNameMap}
          />
        ))}
      </div>
      {hasNextPage && (
        <div ref={ref} className="flex-center py-8">
          {isFetchingNextPage ? (
            <span className="loading loading-lg loading-spinner text-primary" />
          ) : (
            <span className="text-sm text-gray-600">向下滑動載入更多...</span>
          )}
        </div>
      )}
    </>
  );
};

const Collections = () => {
  const { category = "all" } = useParams();
  const { collections, linkToCategory, catNameMap, isValidCategory } =
    useProductCollections();

  if (!isValidCategory(category))
    return <NotFound message="找不到此商品分類" />;

  return (
    <div className="flex min-h-full w-full flex-col bg-gray-50">
      <PageHeader
        breadcrumbText="商品"
        titleEn="Collections"
        titleCh="商品一覽"
      />
      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap gap-2.5">
          {collections.map(({ value, label }) => (
            <Link
              key={value}
              to={`/collections/${value}`}
              className={cn(
                "btn rounded-full transition-all duration-300 btn-md",
                category === value
                  ? "btn-primary"
                  : "border-dashed border-black bg-white not-hover:opacity-50"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex flex-1 flex-col">
          <CollectionsContent
            key={category}
            category={category}
            collections={collections}
            linkToCategory={linkToCategory}
            catNameMap={catNameMap}
          />
        </div>
      </div>
    </div>
  );
};

export default Collections;

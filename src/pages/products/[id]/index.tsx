import { Link, useParams } from "react-router";

import { useProductCollections } from "@/hooks/useProductCollections";
import { useGetProductByIdQuery } from "@/store/api/apiProducts";
import { addComma } from "@/utils/addComma";
import { getErrorMessage } from "@/utils/getErrorMessage";

import BlurImage from "@/components/ui/BlurImage";
import ProductDetailSkeleton from "@/components/features/ProductDetailSkeleton";
import Accordion from "@/components/shared/Accordion";
import ProductActionForm from "@/components/shared/ProductActionForm";
import ProductSlider from "@/components/features/ProductSlider";
import NotFound from "@/pages/notFound";

const ProductInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) =>
  value &&
  value !== "" &&
  value.length !== 0 && (
    <li className="list-none text-sm/7">
      <span className="mr-3 inline-block min-w-20 rounded bg-slate-200 py-1 text-center text-xs">
        {label}
      </span>
      {Array.isArray(value) ? value.join("、") : value}
    </li>
  );

const ProductPage = () => {
  const { id } = useParams();
  const { linkToCategory, catNameMap } = useProductCollections();
  const { data, isLoading, error } = useGetProductByIdQuery(id!, {
    skip: !id,
  });
  const product = data?.product;

  if (isLoading) return <ProductDetailSkeleton />;

  if (error || !product) {
    const status = (error as { status?: number })?.status;
    const errorType =
      !product && !error
        ? "not-found"
        : status === 404
          ? "not-found"
          : "network-error";

    return (
      <NotFound
        type={errorType}
        message={getErrorMessage(error, "無法載入商品資訊")}
      />
    );
  }

  return (
    <div className="space-y-12 p-8 max-md:p-5 md:space-y-16">
      <div className="mx-auto flex max-w-screen-2xl justify-between gap-x-12 gap-y-4 max-lg:flex-col lg:gap-y-8">
        <div className="flex-1">
          <BlurImage
            src={product.imageUrl}
            alt={product.title}
            className="rounded max-lg:max-h-100"
          />
        </div>
        <div className="flex-1">
          <p className="mb-2">{product.tagline}</p>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-3xl font-medium">{product.title}</h1>
            <ul className="flex items-center gap-1.5">
              {product.categories.map((category, index) => (
                <li
                  key={index}
                  className="badge h-7 badge-outline transition-colors hover:bg-primary hover:text-white"
                >
                  <Link
                    to={`/collections/${linkToCategory[category] ?? category}`}
                  >
                    # {catNameMap[category] ?? category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-base whitespace-pre-line">{product.description}</p>
          <div className="mt-8 mb-5 flex-between flex-wrap">
            <p className="text-3xl font-semibold text-nowrap">
              NT$ {addComma(product.price)}
            </p>
          </div>
          <ProductActionForm product={product} variant="detail" />
          {product.ingredients && (
            <Accordion title="製作材料">{product.ingredients}</Accordion>
          )}
          {product.nutrition && (
            <Accordion title="營養成分表示">{product.nutrition}</Accordion>
          )}
          <ul className="space-y-2 border-b border-slate-400 py-8">
            <ProductInfo label="內容" value={product.content} />
            <ProductInfo label="過敏原" value={product.allergens} />
            <ProductInfo label="配送方法" value={product.delivery} />
            <ProductInfo label="保存期限" value={product.expiryDate} />
            <ProductInfo label="保存方法" value={product.storage} />
          </ul>
        </div>
      </div>
      <div className="space-y-10">
        <h2 className="flex flex-col border-y-3 border-primary py-6 text-center">
          您可能也會喜歡<span>Recommend</span>
        </h2>
        <ProductSlider />
      </div>
    </div>
  );
};

export default ProductPage;

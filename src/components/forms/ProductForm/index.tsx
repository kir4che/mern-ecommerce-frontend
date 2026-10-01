import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";
import { useAlert } from "@/context/AlertContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/api/apiProducts";
import { useGetCategoriesQuery } from "@/store/api/apiCategories";
import { useGetTagsQuery } from "@/store/api/apiTags";
import { useUploadImageMutation } from "@/store/api/apiUpload";
import type { Product } from "@/types";
import AllergenPicker from "@/components/shared/AllergenPicker";
import { getErrorMessage } from "@/utils/getErrorMessage";

import PlusIcon from "@/assets/icons/plus.inline.svg?react";

interface ProductFormProps {
  product?: Product;
}

const productSchema = z.object({
  title: z.string().min(1, { message: "商品名稱為必填" }),
  tagline: z.string().optional().default(""),
  price: z.coerce.number().min(0.01, { message: "請輸入有效的售價" }),
  imageUrl: z.string().optional().default(""),
  description: z.string().optional().default(""),
  categories: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  countInStock: z.coerce.number().min(0).optional().default(0),
  content: z.string().optional().default(""),
  expiryDate: z.string().optional().default(""),
  allergens: z.array(z.string()).optional().default([]),
  delivery: z.string().optional().default("常溫宅配"),
  storage: z.string().optional().default(""),
  ingredients: z.string().optional().default(""),
  nutrition: z.string().optional().default(""),
});

const ProductForm = ({ product }: ProductFormProps) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { data: catData } = useGetCategoriesQuery();
  const { data: tagData } = useGetTagsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImage] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title ?? "",
      tagline: product?.tagline ?? "",
      price: product?.price ?? 0,
      imageUrl: product?.imageUrl ?? "",
      description: product?.description ?? "",
      categories: product?.categories ?? [],
      tags: product?.tags ?? [],
      countInStock: product?.countInStock ?? 0,
      content: product?.content ?? "",
      expiryDate: product?.expiryDate ?? "",
      allergens: product?.allergens ?? [],
      delivery: product?.delivery ?? "常溫宅配",
      storage: product?.storage ?? "",
      ingredients: product?.ingredients ?? "",
      nutrition: product?.nutrition ?? "",
    },
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const pendingFileRef = useRef<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = catData?.categories ?? [];
  const tags = tagData?.tags ?? [];

  const { markSaved } = useUnsavedChanges(isDirty);

  const watched = watch(); // 監聽整個表單的值
  const imageUrl = watched.imageUrl ?? "";
  const displayUrl = previewUrl ?? imageUrl;
  const selectedCategories = watched.categories ?? [];
  const selectedTags = watched.tags ?? [];
  const allergens = watched.allergens ?? [];

  const toggleCategory = (slug: string) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setValue("categories", next, { shouldValidate: true });
  };

  const toggleTag = (name: string) => {
    const next = selectedTags.includes(name)
      ? selectedTags.filter((t) => t !== name)
      : [...selectedTags, name];
    setValue("tags", next, { shouldValidate: true });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    pendingFileRef.current = file;
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    try {
      let finalImageUrl = data.imageUrl;

      // 若有新上傳的檔案，先上傳圖片並取得新的 imageUrl。
      if (pendingFileRef.current) {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", pendingFileRef.current);
        const res = await uploadImage(formData).unwrap();
        finalImageUrl = res.imageUrl;
      }

      if (!finalImageUrl) {
        showAlert({ variant: "error", message: "請上傳商品圖片" });
        return;
      }

      const submitData = { ...data, imageUrl: finalImageUrl };

      if (product)
        await updateProduct({ id: product._id, data: submitData }).unwrap();
      else await createProduct(submitData).unwrap();

      reset(submitData);
      markSaved();
      showAlert({
        variant: "success",
        message: product ? "商品已更新" : "商品已新增",
      });
      navigate("/admin/products");
    } catch (err: unknown) {
      const errData = (err as { data?: { errors?: Record<string, string> } })
        ?.data;
      if (errData?.errors) {
        for (const [field, msg] of Object.entries(errData.errors)) {
          try {
            setError(field as never, { message: msg });
          } catch {
            // 略過無法對應的欄位
          }
        }
      }

      showAlert({
        variant: "error",
        message: getErrorMessage(err, "儲存失敗"),
      });
    } finally {
      setUploading(false);
    }
  };

  const isSubmitting = isCreating || isUpdating || uploading;

  const fillTestData = () =>
    reset({
      title: "經典紅豆麵包",
      tagline: "嚴選屏東紅豆，日式工法",
      price: 55,
      imageUrl: "",
      description:
        "使用日本進口麵粉與屏東特產紅豆，每日現烤出爐。外皮酥脆，內餡飽滿，是我們最受歡迎的經典商品。",
      categories: ["bread"],
      tags: ["recommend"],
      countInStock: 50,
      content: "紅豆餡、麵粉、奶油、糖、鹽",
      expiryDate: new Date(Date.now() + 3 * 86400000)
        .toISOString()
        .slice(0, 10),
      allergens: ["牛奶", "麩質"],
      delivery: "常溫宅配",
      storage: "請保存於陰涼處，避免高溫或陽光照射，建議三日內食用完畢。",
      ingredients: "日本麵粉、屏東紅豆、法國奶油、糖、鹽",
      nutrition:
        "每100公克：熱量 280 大卡、蛋白質 8 公克、脂肪 9 公克、碳水化合物 42 公克",
    });

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {product ? `編輯：${product.title}` : "新增商品"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            form="product-form"
            disabled={isSubmitting || uploading}
          >
            {isSubmitting ? "儲存中..." : product ? "更新" : "新增"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/products")}
          >
            取消
          </Button>
        </div>
      </div>
      <div className="-mb-4 flex justify-end">
        <Button variant="link" onClick={fillTestData} className="text-sm">
          貼上測試資料
        </Button>
      </div>
      <form
        id="product-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <section className="space-y-4">
          <Input
            label="商品名稱"
            {...register("title")}
            error={errors.title?.message}
            invalid={!!errors.title}
            required
          />
          <Input label="副標 / 簡短描述" {...register("tagline")} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              商品圖片
            </label>
            <div className="flex items-start gap-4">
              {displayUrl ? (
                <div className="relative">
                  <img
                    src={displayUrl}
                    alt=""
                    className="size-28 rounded-lg border object-cover"
                  />
                  <Button
                    variant="icon"
                    onClick={() => {
                      setValue("imageUrl", "");
                      // 清除預覽 URL 避免記憶體洩漏
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                        pendingFileRef.current = null;
                      }
                    }}
                    className="absolute -top-2 -right-2 size-5 rounded-full bg-red-500 pb-0.5 text-sm text-white"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex-center size-28 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary"
                >
                  {uploading ? <Loading /> : <PlusIcon className="size-8" />}
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
            {errors.imageUrl?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.imageUrl.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              商品描述
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="border-b pb-2 text-lg font-bold text-gray-900">
            銷售資訊
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="售價"
              type="number"
              {...register("price")}
              error={errors.price?.message}
              invalid={!!errors.price}
              required
            />
            <Input
              label="庫存數量"
              type="number"
              {...register("countInStock")}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              分類
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat._id}
                  onClick={() => toggleCategory(cat.slug)}
                  className={cn(
                    "h-auto min-h-0 rounded-full px-3 py-1.5 text-sm font-normal",
                    selectedCategories.includes(cat.slug)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:border-primary"
                  )}
                >
                  {cat.slug}
                </Button>
              ))}
            </div>
          </div>
          {tags.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                標籤
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag._id}
                    onClick={() => toggleTag(tag.name)}
                    className={cn(
                      "h-auto min-h-0 rounded-full px-3 py-1.5 text-sm font-normal",
                      selectedTags.includes(tag.name)
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-primary"
                    )}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="border-b pb-2 text-lg font-bold text-gray-900">
            商品詳細
          </h2>
          <Input label="內容物" {...register("content")} />
          <Input label="有效期限" {...register("expiryDate")} />
          <Input label="配送方式" {...register("delivery")} />
          <Input label="保存方式" {...register("storage")} />
          <Input label="成分" {...register("ingredients")} />
          <Input label="營養標示" {...register("nutrition")} />
          <AllergenPicker
            value={allergens}
            onChange={(v) => setValue("allergens", v)}
          />
        </section>
      </form>
    </div>
  );
};

export default ProductForm;

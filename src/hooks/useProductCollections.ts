import { useMemo } from "react";

import { useGetCategoriesQuery } from "@/store/api/apiCategories";
import { useGetTagsQuery } from "@/store/api/apiTags";
import { buildCatNameMap } from "@/utils/category";

interface CollectionItem {
  label: string;
  value: string;
  type: "all" | "tag" | "category";
}

const STATIC_ITEMS: CollectionItem[] = [
  { label: "所有商品", value: "all", type: "all" },
];

export const useProductCollections = () => {
  const { data: catData } = useGetCategoriesQuery();
  const { data: tagData } = useGetTagsQuery();

  const categoryItems = useMemo<CollectionItem[]>(() => {
    if (!catData?.categories) return [];
    return catData.categories
      .filter((cat) => cat.isActive && (cat.productCount ?? 0) > 0)
      .map((cat) => ({
        label: cat.name,
        value: cat.slug,
        type: "category" as const,
      }));
  }, [catData]);

  const tagItems = useMemo<CollectionItem[]>(() => {
    if (!tagData?.tags) return [];
    return tagData.tags
      .filter((t) => t.isActive)
      .map((t) => ({
        label: t.name,
        value: t.slug,
        type: "tag" as const,
      }));
  }, [tagData]);

  const collections = useMemo(
    () => [...STATIC_ITEMS, ...tagItems, ...categoryItems],
    [tagItems, categoryItems]
  );

  const linkToCategory = Object.fromEntries(
    categoryItems.map((c) => [c.label, c.value])
  ) as Record<string, string>;

  // slug → 中文名稱（UI 顯示用）
  const catNameMap = useMemo(
    () => buildCatNameMap(catData?.categories ?? []),
    [catData]
  );

  const isValidCategory = (value: string) =>
    collections.some((c) => c.value === value);

  const findCollection = (value: string) =>
    collections.find((c) => c.value === value);

  return {
    collections,
    linkToCategory,
    catNameMap,
    isValidCategory,
    findCollection,
  };
};

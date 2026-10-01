import type { Category } from "@/types";

export const buildCatNameMap = (categories: Category[]) => {
  const map: Record<string, string> = {};
  for (const c of categories) {
    map[c.slug] = c.name;
  }
  return map;
};

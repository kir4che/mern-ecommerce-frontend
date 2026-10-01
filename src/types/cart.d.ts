import type { BaseResponse } from "./common";
import type { Product } from "./product";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export type CartProduct = Pick<
  Product,
  "_id" | "title" | "price" | "imageUrl" | "countInStock"
>;

export interface CartItem extends CartItemInput {
  product: CartProduct;
}

export interface SyncCartData {
  localCart: CartItemInput[];
}

export interface AddCartItemParams {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemQuantityParams {
  productId: string;
  quantity: number;
}

export interface CartResponse extends BaseResponse {
  cart: CartItem[];
  removedInvalidCount?: number;
  overLimitAdjustedCount?: number;
}

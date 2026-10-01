export interface BuyerFormData {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

export interface CheckoutOrderItem {
  imageUrl?: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface CheckoutCouponState {
  code: string;
  discountAmount: number;
  message: string | null;
  input: string;
}

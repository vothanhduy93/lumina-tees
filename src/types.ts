export type Size = "S" | "M" | "L" | "XL" | "XXL";
export type ProductStatus = "published" | "draft";
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock?: number;
  category?: string;
  status?: ProductStatus;
  image: string;
  description: string;
  sizes: Size[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  id: string;          // Maps to product ID
  cartItemId: string;  // Unique ID for the cart (to handle same product, diff size)
  name: string;
  price: number;
  image: string;
  size: Size;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    email?: string;
    address?: string;
  };
  date: string;
  total: number;
  status: OrderStatus;
}

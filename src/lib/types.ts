export type Role = "customer" | "seller" | "admin";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type ProductQuery = {
  q?: string;
  category?: string;
  seller?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  limit?: number;
};

export type UserRole = "customer" | "seller" | "admin";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface SellerProfile {
  storeName?: string;
  bio?: string;
  rating?: number;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isSuspended: boolean;
  sellerProfile?: SellerProfile;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  seller: string | UserDTO;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemDTO {
  product: ProductDTO;
  quantity: number;
  priceSnapshot: number;
}

export interface CartDTO {
  id: string;
  user: string;
  items: CartItemDTO[];
  subtotal: number;
}

export interface WishlistDTO {
  id: string;
  user: string;
  products: ProductDTO[];
}

export interface OrderItemDTO {
  product: string | ProductDTO;
  seller: string | UserDTO;
  title: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface OrderDTO {
  id: string;
  customer: string | UserDTO;
  customerInfo: { name: string; email: string; address: string };
  items: OrderItemDTO[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

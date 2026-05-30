import type { AuthResponse, CartDTO, OrderDTO, PaginatedResponse, ProductDTO, UserDTO, WishlistDTO } from "@marketplace/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiClientError extends Error { constructor(message: string, public status: number, public details?: unknown) { super(message); } }

export async function apiFetch<T>(path: string, options: RequestInit & { token?: string } = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include", cache: options.cache ?? "no-store" });
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiClientError(payload.message ?? "Request failed", response.status, payload.details);
  return payload as T;
}

export const marketplaceApi = {
  products: (query = "") => apiFetch<PaginatedResponse<ProductDTO>>(`/products${query}`),
  product: (id: string) => apiFetch<ProductDTO>(`/products/${id}`),
  login: (body: { email: string; password: string }) => apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: Record<string, unknown>) => apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  cart: (token: string) => apiFetch<CartDTO>("/cart", { token }),
  addCart: (token: string, productId: string, quantity = 1) => apiFetch<CartDTO>("/cart", { method: "POST", token, body: JSON.stringify({ productId, quantity }) }),
  wishlist: (token: string) => apiFetch<WishlistDTO>("/wishlist", { token }),
  addWishlist: (token: string, productId: string) => apiFetch<WishlistDTO>("/wishlist", { method: "POST", token, body: JSON.stringify({ productId }) }),
  orders: (token: string) => apiFetch<OrderDTO[]>("/orders", { token }),
  checkout: (token: string, address: string) => apiFetch<OrderDTO>("/orders", { method: "POST", token, body: JSON.stringify({ address }) }),
  sellerProducts: (token: string) => apiFetch<ProductDTO[]>("/seller/products", { token }),
  createProduct: (token: string, body: Record<string, unknown>) => apiFetch<ProductDTO>("/seller/products", { method: "POST", token, body: JSON.stringify(body) }),
  adminStats: (token: string) => apiFetch<Record<string, number>>("/admin/stats", { token }),
  adminUsers: (token: string) => apiFetch<UserDTO[]>("/admin/users", { token })
};

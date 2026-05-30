export type Role = 'ADMIN' | 'CUSTOMER';
export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type User = { id: string; email: string; name: string; role: Role; createdAt: string };
export type Category = { id: string; name: string; slug: string; description?: string | null };
export type Product = { id: string; name: string; slug: string; description: string; price: number; images: string[]; inventory: number; isActive: boolean; category: Category; categoryId: string };
export type CartItem = { id: string; productId: string; quantity: number; product: Product };
export type Cart = { id: string; items: CartItem[] };
export type OrderItem = { id: string; productId: string; name: string; price: number; quantity: number; product: Product };
export type Order = { id: string; status: OrderStatus; total: number; shippingAddress: Record<string, string>; items: OrderItem[]; createdAt: string };
export type Paginated<T> = { items: T[]; meta: { page: number; limit: number; total: number; pages: number } };
export type ApiEnvelope<T> = { success: boolean; data: T; message?: string; error?: { code: string; details?: unknown } };

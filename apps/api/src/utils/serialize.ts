import type { ProductDTO, UserDTO } from "@marketplace/types";

export function idOf(value: unknown) {
  return String((value as { _id?: unknown; id?: unknown })?._id ?? (value as { id?: unknown })?.id ?? value);
}

export function serializeUser(user: any): UserDTO {
  return {
    id: idOf(user),
    name: user.name,
    email: user.email,
    role: user.role,
    isSuspended: Boolean(user.isSuspended),
    sellerProfile: user.sellerProfile,
    address: user.address,
    createdAt: user.createdAt?.toISOString?.(),
    updatedAt: user.updatedAt?.toISOString?.()
  };
}

export function serializeProduct(product: any): ProductDTO {
  const seller = typeof product.seller === "object" && product.seller?.email ? serializeUser(product.seller) : idOf(product.seller);
  return {
    id: idOf(product),
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    images: product.images ?? [],
    stock: product.stock,
    rating: product.rating ?? 0,
    seller,
    isActive: product.isActive,
    createdAt: product.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: product.updatedAt?.toISOString?.() ?? new Date().toISOString()
  };
}

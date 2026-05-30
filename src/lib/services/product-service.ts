import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { AppError, assertFound } from "@/lib/errors";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import type { ProductQuery } from "@/lib/types";

export async function listProducts(query: ProductQuery) {
  await connectToDatabase();
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;
  const filter: Record<string, unknown> = { isActive: true };
  if (query.q) filter.$text = { $search: query.q };
  if (query.category) filter.category = query.category;
  if (query.seller) filter.seller = new Types.ObjectId(query.seller);
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = { ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}), ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}) };
  }
  const sort = query.sort === "price_asc" ? { price: 1 } : query.sort === "price_desc" ? { price: -1 } : query.sort === "rating" ? { rating: -1 } : { createdAt: -1 };
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate("seller", "name sellerProfile.storeName").lean(),
    Product.countDocuments(filter)
  ]);
  return { items, total, page, pages: Math.ceil(total / limit), limit };
}

export async function getProduct(id: string) {
  await connectToDatabase();
  return assertFound(await Product.findById(id).populate("seller", "name sellerProfile.storeName sellerProfile.rating").lean(), "Product");
}

export async function createProduct(sellerId: string, data: Record<string, unknown>) {
  await connectToDatabase();
  const seller = await User.findOne({ _id: sellerId, role: "seller", isSuspended: false });
  if (!seller) throw new AppError(403, "Only active sellers can create products", "SELLER_REQUIRED");
  return Product.create({ ...data, seller: sellerId });
}

export async function updateProduct(sellerId: string, productId: string, data: Record<string, unknown>) {
  await connectToDatabase();
  return assertFound(await Product.findOneAndUpdate({ _id: productId, seller: sellerId }, data, { new: true }), "Product");
}

export async function deleteProduct(sellerId: string, productId: string) {
  await connectToDatabase();
  return assertFound(await Product.findOneAndUpdate({ _id: productId, seller: sellerId }, { isActive: false }, { new: true }), "Product");
}

export async function listSellerProducts(sellerId: string) {
  await connectToDatabase();
  return Product.find({ seller: sellerId }).sort({ createdAt: -1 }).lean();
}

import { Product } from "../models/Product.js";
import { HttpError } from "../utils/http-error.js";
import { serializeProduct } from "../utils/serialize.js";

export async function listProducts(query: any) {
  const filter: Record<string, unknown> = { isActive: true };
  if (query.category) filter.category = query.category;
  if (query.q) filter.$text = { $search: query.q };
  if (query.minPrice !== undefined || query.maxPrice !== undefined) filter.price = { ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}), ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}) };
  const sort = query.sort === "price_asc" ? { price: 1 } : query.sort === "price_desc" ? { price: -1 } : query.sort === "rating" ? { rating: -1 } : { createdAt: -1 };
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort as any).skip((query.page - 1) * query.limit).limit(query.limit).populate("seller", "name email role sellerProfile isSuspended").lean(),
    Product.countDocuments(filter)
  ]);
  return { data: products.map(serializeProduct), page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) };
}

export async function getProduct(id: string) {
  const product = await Product.findOne({ _id: id, isActive: true }).populate("seller", "name email role sellerProfile isSuspended").lean();
  if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
  return serializeProduct(product);
}

export async function listSellerProducts(sellerId: string) {
  return (await Product.find({ seller: sellerId }).sort({ createdAt: -1 }).lean()).map(serializeProduct);
}

export async function createProduct(sellerId: string, input: any) {
  return serializeProduct(await Product.create({ ...input, seller: sellerId }));
}

export async function updateProduct(sellerId: string, productId: string, input: any) {
  const product = await Product.findOneAndUpdate({ _id: productId, seller: sellerId }, input, { new: true });
  if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
  return serializeProduct(product);
}

export async function deleteProduct(sellerId: string, productId: string) {
  const product = await Product.findOneAndUpdate({ _id: productId, seller: sellerId }, { isActive: false }, { new: true });
  if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
}

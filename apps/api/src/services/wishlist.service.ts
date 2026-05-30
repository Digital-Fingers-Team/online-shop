import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import { HttpError } from "../utils/http-error.js";
import { serializeProduct } from "../utils/serialize.js";

export async function getWishlist(userId: string) {
  const wishlist = await Wishlist.findOne({ user: userId }).populate("products").lean();
  return { id: String(wishlist?._id ?? ""), user: userId, products: (wishlist?.products ?? []).map(serializeProduct) };
}

export async function addWishlist(userId: string, productId: string) {
  const exists = await Product.exists({ _id: productId, isActive: true });
  if (!exists) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
  await Wishlist.updateOne({ user: userId }, { $setOnInsert: { user: userId }, $addToSet: { products: productId } }, { upsert: true });
  return getWishlist(userId);
}

export async function removeWishlist(userId: string, productId: string) {
  await Wishlist.updateOne({ user: userId }, { $pull: { products: productId } });
  return getWishlist(userId);
}

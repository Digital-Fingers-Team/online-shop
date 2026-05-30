import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { HttpError } from "../utils/http-error.js";
import { serializeProduct } from "../utils/serialize.js";

export async function getCart(userId: string) {
  const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
  const items = cart?.items ?? [];
  return { id: String(cart?._id ?? ""), user: userId, items: items.map((item: any) => ({ product: serializeProduct(item.product), quantity: item.quantity, priceSnapshot: item.priceSnapshot })), subtotal: items.reduce((sum: number, item: any) => sum + item.quantity * item.priceSnapshot, 0) };
}

export async function upsertCartItem(userId: string, productId: string, quantity: number) {
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new HttpError(404, "Product not found", "PRODUCT_NOT_FOUND");
  if (product.stock < quantity) throw new HttpError(409, "Insufficient inventory", "OUT_OF_STOCK");
  const cart = await Cart.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true });
  const item = cart.items.find((entry: any) => String(entry.product) === productId);
  if (item) { item.quantity = quantity; item.priceSnapshot = product.price; } else cart.items.push({ product: product._id, quantity, priceSnapshot: product.price });
  await cart.save();
  return getCart(userId);
}

export async function removeCartItem(userId: string, productId: string) {
  await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
  return getCart(userId);
}

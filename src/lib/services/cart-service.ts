import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Cart } from "@/lib/models/Cart";
import { Product } from "@/lib/models/Product";

export async function getCart(userId: string) {
  await connectToDatabase();
  const cart = await Cart.findOne({ user: userId }).populate("items.product").lean();
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
  return { items, subtotal };
}

export async function addCartItem(userId: string, productId: string, quantity: number) {
  await connectToDatabase();
  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new AppError(404, "Product not found", "PRODUCT_NOT_FOUND");
  if (product.stock < quantity) throw new AppError(409, "Insufficient stock", "INSUFFICIENT_STOCK");
  const cart = await Cart.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true });
  const item = cart.items.find((entry) => String(entry.product) === productId);
  if (item) item.quantity = Math.min(99, item.quantity + quantity);
  else cart.items.push({ product: product._id, quantity, priceSnapshot: product.price });
  await cart.save();
  return getCart(userId);
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  await connectToDatabase();
  await Cart.updateOne({ user: userId, "items.product": productId }, { $set: { "items.$.quantity": quantity } });
  return getCart(userId);
}

export async function removeCartItem(userId: string, productId: string) {
  await connectToDatabase();
  await Cart.updateOne({ user: userId }, { $pull: { items: { product: productId } } });
  return getCart(userId);
}

export async function clearCart(userId: string) {
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
}

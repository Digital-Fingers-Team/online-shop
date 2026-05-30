import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/http-error.js";
import { serializeProduct, serializeUser } from "../utils/serialize.js";

export async function getStats() {
  const [users, sellers, products, orders, revenue] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$subtotal" } } }])
  ]);
  return { users, sellers, products, orders, revenue: revenue[0]?.total ?? 0 };
}

export async function listUsers(role?: string) {
  return (await User.find(role ? { role } : {}).sort({ createdAt: -1 }).limit(100).lean()).map(serializeUser);
}

export async function suspendUser(id: string, isSuspended: boolean) {
  const user = await User.findByIdAndUpdate(id, { isSuspended }, { new: true });
  if (!user) throw new HttpError(404, "User not found", "USER_NOT_FOUND");
  return serializeUser(user);
}

export async function listProductsAdmin() {
  return (await Product.find().sort({ createdAt: -1 }).limit(100).populate("seller", "name email role sellerProfile isSuspended").lean()).map(serializeProduct);
}

export async function removeProductAdmin(id: string) {
  await Product.findByIdAndUpdate(id, { isActive: false });
}

export async function listOrdersAdmin() {
  return Order.find().sort({ createdAt: -1 }).limit(100).populate("customer", "name email").lean();
}

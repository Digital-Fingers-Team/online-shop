import { connectToDatabase } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";

export async function getMarketplaceStats() {
  await connectToDatabase();
  const [users, sellers, products, orders, revenue] = await Promise.all([
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$subtotal" } } }])
  ]);
  return { users, sellers, products, orders, revenue: revenue[0]?.total ?? 0 };
}

export async function listUsers() {
  await connectToDatabase();
  return User.find().select("name email role isSuspended sellerProfile createdAt").sort({ createdAt: -1 }).limit(100).lean();
}

export async function suspendUser(id: string, isSuspended: boolean) {
  await connectToDatabase();
  return User.findByIdAndUpdate(id, { isSuspended }, { new: true }).select("name email role isSuspended");
}

export async function adminRemoveProduct(id: string) {
  await connectToDatabase();
  return Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
}

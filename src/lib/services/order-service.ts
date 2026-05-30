import { connectToDatabase } from "@/lib/db";
import { AppError, assertFound } from "@/lib/errors";
import { Cart } from "@/lib/models/Cart";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import type { OrderStatus } from "@/lib/types";

export async function placeOrder(userId: string, address: string) {
  await connectToDatabase();
  const [user, cart] = await Promise.all([
    User.findById(userId).lean(),
    Cart.findOne({ user: userId }).populate("items.product").lean()
  ]);
  if (!user) throw new AppError(404, "Customer not found", "CUSTOMER_NOT_FOUND");
  if (!cart?.items.length) throw new AppError(400, "Cart is empty", "EMPTY_CART");

  const items = cart.items.map((item) => {
    const product = item.product as unknown as { _id: string; title: string; images: string[]; price: number; seller: string; stock: number };
    if (product.stock < item.quantity) throw new AppError(409, `${product.title} has insufficient stock`, "INSUFFICIENT_STOCK");
    return { product: product._id, seller: product.seller, title: product.title, image: product.images[0], price: product.price, quantity: item.quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ customer: userId, customerInfo: { name: user.name, email: user.email, address }, items, subtotal });
  await Promise.all(items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })));
  await Cart.updateOne({ user: userId }, { $set: { items: [] } });
  return order;
}

export async function listCustomerOrders(userId: string) {
  await connectToDatabase();
  return Order.find({ customer: userId }).sort({ createdAt: -1 }).lean();
}

export async function listSellerOrders(sellerId: string) {
  await connectToDatabase();
  return Order.find({ "items.seller": sellerId }).sort({ createdAt: -1 }).lean();
}

export async function updateSellerOrderStatus(sellerId: string, orderId: string, status: OrderStatus) {
  await connectToDatabase();
  const order = await Order.findOne({ _id: orderId, "items.seller": sellerId });
  assertFound(order, "Order");
  order.status = status;
  await order.save();
  return order;
}

export async function listAllOrders() {
  await connectToDatabase();
  return Order.find().sort({ createdAt: -1 }).limit(100).lean();
}

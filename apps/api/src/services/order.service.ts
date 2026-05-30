import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { HttpError } from "../utils/http-error.js";

export async function createOrder(userId: string, address: string) {
  const [user, cart] = await Promise.all([User.findById(userId), Cart.findOne({ user: userId }).populate("items.product")]);
  if (!user || !cart?.items.length) throw new HttpError(400, "Cart is empty", "EMPTY_CART");
  for (const item of cart.items as any[]) {
    if (!item.product?.isActive || item.product.stock < item.quantity) throw new HttpError(409, `Insufficient stock for ${item.product?.title ?? "product"}`, "OUT_OF_STOCK");
  }
  const items = (cart.items as any[]).map((item) => ({ product: item.product._id, seller: item.product.seller, title: item.product.title, image: item.product.images?.[0], price: item.product.price, quantity: item.quantity }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({ customer: userId, customerInfo: { name: user.name, email: user.email, address }, items, subtotal });
  await Promise.all(items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })));
  cart.items = [] as any;
  await cart.save();
  return order;
}

export async function listCustomerOrders(userId: string) {
  return Order.find({ customer: userId }).sort({ createdAt: -1 }).populate("items.product").lean();
}

export async function listSellerOrders(sellerId: string) {
  return Order.find({ "items.seller": sellerId }).sort({ createdAt: -1 }).populate("customer", "name email").lean();
}

export async function updateSellerOrderStatus(sellerId: string, orderId: string, status: string) {
  const order = await Order.findOneAndUpdate({ _id: orderId, "items.seller": sellerId }, { status }, { new: true });
  if (!order) throw new HttpError(404, "Order not found", "ORDER_NOT_FOUND");
  return order;
}

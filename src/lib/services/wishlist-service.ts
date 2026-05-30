import { connectToDatabase } from "@/lib/db";
import { Wishlist } from "@/lib/models/Wishlist";

export async function getWishlist(userId: string) {
  await connectToDatabase();
  return Wishlist.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true })
    .populate("products")
    .lean();
}

export async function toggleWishlist(userId: string, productId: string) {
  await connectToDatabase();
  const wishlist = await Wishlist.findOneAndUpdate({ user: userId }, { $setOnInsert: { user: userId } }, { upsert: true, new: true });
  const exists = wishlist.products.some((id) => String(id) === productId);
  await Wishlist.updateOne({ user: userId }, exists ? { $pull: { products: productId } } : { $addToSet: { products: productId } });
  return getWishlist(userId);
}

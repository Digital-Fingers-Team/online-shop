import { ProductCard } from "@/components/product/ProductCard";
import { getCurrentUser } from "@/lib/auth";
import { getWishlist } from "@/lib/services/wishlist-service";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const user = await getCurrentUser();
  const wishlist: any = user ? await getWishlist(user.id).catch(() => ({ products: [] })) : { products: [] };
  return <div className="container-page py-10"><h1 className="text-4xl font-black">Wishlist</h1><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{wishlist.products?.map((product: any) => <ProductCard key={String(product._id)} product={product} />)}</div></div>;
}

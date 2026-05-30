import { ProductForm } from "@/components/seller/ProductForm";

export default function NewProductPage() {
  return <div className="container-page py-10"><div className="card mx-auto max-w-2xl p-8"><p className="font-bold text-brand-600">Seller tools</p><h1 className="text-3xl font-black">Create product</h1><p className="mt-2 text-sm text-slate-600">Images use URL uploads for MVP; swap the service layer with S3/Cloudinary signed uploads when ready.</p><ProductForm /></div></div>;
}

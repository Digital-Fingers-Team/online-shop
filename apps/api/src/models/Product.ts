import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 180, index: true },
  description: { type: String, required: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0, index: true },
  category: { type: String, required: true, trim: true, index: true },
  images: [{ type: String, required: true }],
  stock: { type: Number, required: true, min: 0, default: 0, index: true },
  rating: { type: Number, default: 0, min: 0, max: 5, index: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", category: "text" });
productSchema.index({ category: 1, price: 1, rating: -1 });
productSchema.index({ seller: 1, createdAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & { _id: Types.ObjectId };
export const Product = (models.Product as Model<ProductDocument>) || model<ProductDocument>("Product", productSchema);

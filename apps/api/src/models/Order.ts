import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  image: String,
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  customerInfo: { name: { type: String, required: true }, email: { type: String, required: true }, address: { type: String, required: true } },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending", index: true }
}, { timestamps: true });

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1, status: 1, createdAt: -1 });
export type OrderDocument = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };
export const Order = (models.Order as Model<OrderDocument>) || model<OrderDocument>("Order", orderSchema);

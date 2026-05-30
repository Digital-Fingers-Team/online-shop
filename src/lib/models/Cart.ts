import { Schema, model, models, type InferSchemaType, type Model, Types } from "mongoose";

const cartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    priceSnapshot: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

cartSchema.index({ updatedAt: -1 });

export type CartDocument = InferSchemaType<typeof cartSchema> & { _id: Types.ObjectId };
export const Cart = (models.Cart as Model<CartDocument>) || model<CartDocument>("Cart", cartSchema);

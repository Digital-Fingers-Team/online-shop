import { Schema, model, models, type InferSchemaType, type Model, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: true }
);

export type WishlistDocument = InferSchemaType<typeof wishlistSchema> & { _id: Types.ObjectId };
export const Wishlist =
  (models.Wishlist as Model<WishlistDocument>) || model<WishlistDocument>("Wishlist", wishlistSchema);

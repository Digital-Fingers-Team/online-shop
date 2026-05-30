import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const addressSchema = new Schema({ line1: String, line2: String, city: String, state: String, postalCode: String, country: { type: String, default: "US" } }, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "seller", "admin"], default: "customer", index: true },
  isSuspended: { type: Boolean, default: false, index: true },
  refreshTokenHash: { type: String, select: false },
  sellerProfile: { storeName: { type: String, trim: true, maxlength: 120 }, bio: { type: String, maxlength: 500 }, rating: { type: Number, default: 0, min: 0, max: 5 } },
  address: addressSchema
}, { timestamps: true });

userSchema.index({ role: 1, isSuspended: 1 });
userSchema.index({ "sellerProfile.storeName": "text", name: "text", email: "text" });

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export const User = (models.User as Model<UserDocument>) || model<UserDocument>("User", userSchema);

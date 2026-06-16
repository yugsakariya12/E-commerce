import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String },
  price: { type: Number },
  photo: { type: String },
  size: { type: String },
  cartId: { type: String },
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
id:{type:mongoose.Schema.Types.ObjectId},
    totalAmount: { type: Number, required: true }, // in paise or rupees as per your logic
products: [mongoose.Schema.Types.ObjectId],
  deliveryBoyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "deliverypartners", // EXACTLY this
},


    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;

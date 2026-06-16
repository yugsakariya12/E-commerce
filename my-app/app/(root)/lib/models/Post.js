import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  creatorId: { type: String, required: true },
  Name: { type: String, required: true, trim: true },
  Description: { type: String, required: true },
  category: { type: String, enum: ["Men", "Women", "Children"], required: true },
  subCategory: { type: String, enum: ["Topwear", "Bottomwear", "Casualwear"], required: true },
  adminid:{type:mongoose.Schema.Types.ObjectId},
  Price: { type: Number, required: true },
  company:{type:String},
  profileImage:{type:String},
  Size: {
    type: [String],
    required: true,
    enum: ["S", "M", "L", "XL", "XXL"]
  },
  postPhotos: {
    type: [String],
    validate: arr => Array.isArray(arr) && arr.length > 0 && arr.length <= 4
  },
  sells: { type: Number, default: 0 },
  review: { type: [Number], default: [] },
  reviewMessage: { type: [String], default: [] }
}, {
  timestamps: true
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);

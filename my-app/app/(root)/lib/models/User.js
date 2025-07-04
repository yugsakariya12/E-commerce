// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   clerkId: {
//     type: String,
//     required: true,
//     uinque: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   profilePhoto: {
//     type: String,
//     required: true,
//   },
  
// });

// const User = mongoose.models.User || mongoose.model("User", UserSchema);

// export default User;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true, // ✅ fixed typo: "uinque" → "unique"
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // 🕒 adds createdAt and updatedAt
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

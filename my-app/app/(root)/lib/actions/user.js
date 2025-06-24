// import User from "../models/User";
// import { connectToDB } from "../mongodb/mongoose";
// export const createOrUpdateUser = async (
//   id,
//   first_name,
//   last_name,
//   image_url,
//   email_addresses,
//   username
// ) => {
//   try {
//     await connectToDB();

//     const user = await User.findOneAndUpdate(
//       { clerkId: id },
//       {
//         $set: {
//           firstName: first_name,
//           lastName: last_name,
//           profilePhoto: image_url,
//           email: email_addresses[0].email_address,
//           username: username,
//         },
//       },
//       { upsert: true, new: true } // if user doesn't exist, create a new one
//     );

//     await user.save();
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const deleteUser = async (id) => {
//   try {
//     await connectToDB();
//     await User.findOneAndDelete({ clerkId: id });
//   } catch (error) {
//     console.error(error);
//   }
// };



import User from "../models/User";
import { connectToDB } from "../mongodb/mongoose";

// Create or update user in MongoDB from Clerk webhook
export const createOrUpdateUser = async ({
  id,
  first_name,
  last_name,
  image_url,
  email_addresses,
  username,
}) => {
  try {
    await connectToDB();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePhoto: image_url,
          email: email_addresses[0]?.email_address || "",
          username,
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ User created or updated:", user);
    return user;
  } catch (error) {
    console.error("❌ Error in createOrUpdateUser:", error);
  }
};

export const deleteUser = async (id) => {
  try {
    await connectToDB();
    const deletedUser = await User.findOneAndDelete({ clerkId: id });
    console.log("🗑️ Deleted user:", deletedUser);
  } catch (error) {
    console.error("❌ Error in deleteUser:", error);
  }
};

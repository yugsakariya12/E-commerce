// import { Webhook } from "svix";
// import { headers } from "next/headers";
// import { createOrUpdateUser,deleteUser } from "@/app/(root)/lib/actions/user";

// export async function POST(req) {
//   // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
//   const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

//   if (!WEBHOOK_SECRET) {
//     throw new Error(
//       "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
//     );
//   }

//   // Get the headers
//   const headerPayload = headers();
//   const svix_id = headerPayload.get("svix-id");
//   const svix_timestamp = headerPayload.get("svix-timestamp");
//   const svix_signature = headerPayload.get("svix-signature");

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response("Error occured -- no svix headers", {
//       status: 400,
//     });
//   }

//   // Get the body
//   const payload = await req.json();
//   const body = JSON.stringify(payload);

//   // Create a new Svix instance with your secret.
//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt;

//   // Verify the payload with the headers
//   try {
//     evt = wh.verify(body, {
//       "svix-id": svix_id,
//       "svix-timestamp": svix_timestamp,
//       "svix-signature": svix_signature,
//     });
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error occured", {
//       status: 400,
//     });
//   }

//   // Handle the event
//   const eventType = evt?.type;

//   if (eventType === "user.created" || eventType === "user.updated") {
//     const { id, first_name, last_name, image_url, email_addresses, username } =
//       evt?.data;

//     try {
//       await createOrUpdateUser(
//         id,
//         first_name,
//         last_name,
//         image_url,
//         email_addresses,
//         username
//       );

//       return new Response("User is created or updated", {
//         status: 200,
//       });
//     } catch (err) {
//       console.error("Error creating or updating user:", err);
//       return new Response("Error occured", {
//         status: 500,
//       });
//     }
//   }

//   if (eventType === "user.deleted") {
//     try {
//       const { id } = evt?.data;
//       await deleteUser(id);

//       return new Response("User is deleted", {
//         status: 200,
//       });
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       return new Response("Error occured", {
//         status: 500,
//       });
//     }
//   }
// }

import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser, deleteUser } from "@/app/(root)/lib/actions/user";

export async function GET() {
  console.log("✅ Webhook GET route hit");
  return new Response("Webhook GET OK", { status: 200 });
}


export async function POST(req) {
console.log("📦 Incoming POST to webhook");

  
  
  console.log("hitting")
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  console.log("🧾 Payload:", payload);
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt?.type;

  // Handle user created or updated
  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      first_name,
      last_name,
      image_url,
      email_addresses,
      username,
    } = evt.data;

    try {
      await createOrUpdateUser({
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username,
      });

      return new Response("✅ User created or updated", { status: 200 });
    } catch (err) {
      console.error("❌ Failed to create/update user:", err);
      return new Response("Server error", { status: 500 });
    }
  }

  // Handle user deletion
  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      await deleteUser(id);

      return new Response("🗑️ User deleted", { status: 200 });
    } catch (err) {
      console.error("❌ Failed to delete user:", err);
      return new Response("Server error", { status: 500 });
    }
  }

  return new Response("Event type not handled", { status: 200 });
}

// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// // 1. Explicitly name your database (replace "proprent" with your chosen database name)
// const client = new MongoClient(process.env.PropRentClient_URL);
// const db = client.db("PropRentClient");

// export const auth = betterAuth({
//   emailAndPassword: { 
//     enabled: true, 
//   },
//   database: mongodbAdapter(db, {
//     client,
//   }),
//   // 2. Register custom registration fields so Better Auth accepts them on signup
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: true,
//         defaultValue: "tenant", // Fallback state if nothing is selected
//         input: true // Allows client-side submission values to register
//       }
//     }
//   }
// });

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// 1. Ensure the client initialization fallback exists to avoid undefined errors during build
const url = process.env.PropRentClient_URL || "mongodb://localhost:27017/PropRentClient";
const client = new MongoClient(url);
const db = client.db("PropRentClient");

export const auth = betterAuth({
  emailAndPassword: { 
    enabled: true, 
  },
  database: mongodbAdapter(db, {
    client,
  }),socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET 
        }, 
    },
  // 2. Map the custom fields correctly inside advanced configuration
  advanced: {
    generateAndSaveSchema: true, // Auto-creates required collections & unique indexes
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "tenant", 
        input: true 
      }
    }
  }
});
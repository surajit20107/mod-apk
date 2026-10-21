import mongoose from "mongoose";
import dns from "dns";


if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]); // resolve mongodb connection refuse error
  mongoose.set("debug", true);
}

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionString as string).then((mongoose) => {
      return mongoose;
    })
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

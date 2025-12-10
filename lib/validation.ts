import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const userSchema = z.object({
  username: z.string().trim().min(3).max(50),
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  password: z.string().trim().min(6).max(20),
})

export const appSchema = z.object({
  name: z.string().trim().min(3).max(100),
  image: z.string(),
  packageName: z.string().trim().min(3).max(100),
  publisher: z.string().trim().min(3).max(100),
  category: z.string().trim().min(3).max(100),
  size: z.string().trim(),
  rating: z.number().min(0).max(5),
  version: z.string().trim().min(3).max(100),
  platform: z.string().trim().min(3).max(100),
  price: z.string().trim().min(3).max(100),
  description: z.string().trim().min(3).max(100),
  downloadUrl: z.string().trim().min(5).max(250),
  requirements: z.string().trim().min(5).max(10),
  modInfo: z.string().trim().min(10).max(255),
  screenshots: z.array(z.string()),
  tags: z.array(z.string()),
})

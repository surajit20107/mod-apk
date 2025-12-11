import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const userSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  password: z.string().trim().min(6).max(50),
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
  requirements: z.string().trim().min(5).max(50),
  modInfo: z.string().trim().min(10).max(255),
  screenshots: z.array(z.string()),
  tags: z.array(z.string()),
})

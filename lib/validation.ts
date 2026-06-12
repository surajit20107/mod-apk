import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export const userSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().trim().regex(emailRegex, "Invalid email address"),
  password: z.string().trim().min(6).max(50),
})

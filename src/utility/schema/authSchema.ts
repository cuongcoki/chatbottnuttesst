import { z } from "zod";

import { emailRegex, passwordRegex } from "../lib/regex";


export const loginSchema = z.object({
  email: z.string().regex(emailRegex, "Invalid Email"),
  password: z.string().regex(
    passwordRegex,
    "Password: 8+ chars, A, a, 1, $."
  ),
});

export const registerSchema = z.object({
  email: z.string().regex(emailRegex, "Email không hợp lệ"),
  password: z.string().regex(
    passwordRegex,
    "Password: 8+ chars, A, a, 1, $."
  ),
  role: z.enum(["admin", "user"]).optional(),
});

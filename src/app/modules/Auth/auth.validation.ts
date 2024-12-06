import { z } from "zod";

export const AuthValidationSchema = {
  loginSchema: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
  changePasswordSchema: z.object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(6, { message: "New password must be at least 6 characters" }),
  }),
  forgotPasswordSchema: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
  resetPasswordSchema: z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  }),
};

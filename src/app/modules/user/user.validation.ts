import { z } from "zod";

const UserSchemaCreate = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be less than 50 characters" })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" }),
  role: z.enum(["Admin", "Vendor", "Customer"], { message: "Invalid role" }),
  profileImage: z
    .string()
    .url({ message: "Invalid profile image URL" })
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]\d{1,14}$/, { message: "Invalid phone number" })
    .optional(),
  addressBook: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

const UserSchemaUpdate = z.object({
  name: z
    .string()
    .min(1, { message: "Name must not be empty" })
    .max(100, { message: "Name must be less than 100 characters" })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be less than 50 characters" })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .optional(),
  role: z
    .enum(["admin", "vendor", "customer"], { message: "Invalid role" })
    .optional(),
  profileImage: z
    .string()
    .url({ message: "Invalid profile image URL" })
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" })
    .optional(),
  addressBook: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  isSuspended: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const UserValidationSchema = {
  UserSchemaCreate,
  UserSchemaUpdate,
};

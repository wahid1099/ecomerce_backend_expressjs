import { z } from "zod";

export const ShopValidationSchema = {
  createShopSchema: z.object({
    name: z.string().min(1, { message: "Shop name is required" }),
    logo: z.string().url().optional(),
    description: z.string().optional(),
  }),
  updateShopSchema: z.object({
    name: z.string().optional(),
    logo: z.string().url().optional(),
    description: z.string().optional(),
  }),
};

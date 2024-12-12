import { z } from "zod";

export const ProductValidationSchema = {
  createProductSchema: z.object({
    name: z.string().nonempty("Product name is required"),
    price: z.number().positive("Price must be greater than zero"),
    category: z.string().nonempty("Category is required"),
    inventoryCount: z
      .number()
      .int()
      .min(0, "Inventory count cannot be negative"),
    images: z
      .array(z.string().url())
      .nonempty("At least one image is required"),
    description: z.string().optional(),
    discount: z.number().min(0).max(100).optional(),
  }),

  updateProductSchema: z.object({
    name: z.string().optional(),
    price: z.number().positive().optional(),
    category: z.string().optional(),
    inventoryCount: z.number().int().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    description: z.string().optional(),
    discount: z.number().min(0).max(100).optional(),
  }),
};

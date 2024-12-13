import { z } from "zod";
export const ProductValidationSchema = {
  createProductSchema: z.object({
    name: z.string().nonempty("Product name is required"),
    slug: z.string().nonempty("Product slug is required"),
    price: z.number().positive("Price must be greater than zero"),
    category: z.string().nonempty("Category is required"),
    inventory: z.number().int().min(0, "Inventory count cannot be negative"),
    images: z
      .array(z.string().url())
      .nonempty("At least one image is required"),
    description: z.string().optional(),
    discount: z.number().min(0).max(100).optional(),
    variants: z
      .array(
        z.object({
          name: z.string().nonempty("Variant name is required"),
          options: z
            .array(z.string())
            .min(1, "At least one option is required"),
          stock: z.record(z.string(), z.number().min(0)), // Stock as a map of option -> quantity
          price: z.number().positive().optional(),
          images: z.array(z.string().url()).optional(),
        })
      )
      .optional(),
  }),

  updateProductSchema: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    price: z.number().positive().optional(),
    category: z.string().optional(),
    inventoryCount: z.number().int().min(0).optional(),
    images: z.array(z.string().url()).optional(),
    description: z.string().optional(),
    discount: z.number().min(0).max(100).optional(),
    variants: z
      .array(
        z.object({
          name: z.string().optional(),
          options: z.array(z.string()).optional(),
          stock: z.record(z.string(), z.number().min(0)).optional(),
          price: z.number().positive().optional(),
          images: z.array(z.string().url()).optional(),
        })
      )
      .optional(),
  }),
};

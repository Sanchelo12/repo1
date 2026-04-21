import { z } from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  current_stock: z.number().int().nonnegative(),
  min_stock: z.number().int().nonnegative(),
  createdAt: z.string().transform((value) => new Date(value)),
  updatedAt: z.string().transform((value) => new Date(value)),
});

export const productCreateSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const validateCreateProduct = (data) =>
  productCreateSchema.safeParse(data);

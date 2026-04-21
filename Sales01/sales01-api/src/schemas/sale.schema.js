import { z } from "zod";

export const saleItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const saleCreateSchema = z.object({
  items: z.array(saleItemSchema).min(1),
});

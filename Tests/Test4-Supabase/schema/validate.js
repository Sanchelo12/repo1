import { z } from "zod";

const ItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  price: z.number().min(1).optional(),
  stock: z.number().int().min(0).optional(),
});

export const validateItem = (data) => {
  return ItemSchema.safeParse(data);
};

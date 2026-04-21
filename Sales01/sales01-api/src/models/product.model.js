import { prisma } from "../config/db.js";

export const productModel = {
  async findAll() {
    return await prisma.product.findMany();
  },

  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
    });
  },

  async create(data) {
    return await prisma.product.create({
      data,
    });
  },

  async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return await prisma.product.delete({
      where: { id },
    });
  },

  async decreaseStock(id, quantity, client = prisma) {
    const product = await client.product.update({
      where: { id },
      data: {
        current_stock: {
          decrement: quantity,
        },
      },
    });
    return product;
  },

  async increaseStock(id, quantity) {
    return await prisma.product.update({
      where: { id },
      data: {
        current_stock: {
          increment: quantity,
        },
      },
    });
  },
};

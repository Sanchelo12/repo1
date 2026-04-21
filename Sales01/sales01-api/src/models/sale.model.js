import { productModel } from "./product.model.js";
import { prisma } from "../config/db.js";

export const saleModel = {
  async findAll() {
    return await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  },

  async findById(id) {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  },

  async create(data) {
    const { userId, items } = data;

    // Usamos una transacción para asegurar integridad total
    return await prisma.$transaction(async (tx) => {
      let total = 0;
      const lowStockAlerts = []; // Para guardar qué productos quedaron bajos

      const saleItemsToCreate = [];

      for (const item of items) {
        // 1. Buscamos el producto DENTRO de la transacción
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) throw new Error(`Product ${item.productId} not found`);

        // 2. Validación de disponibilidad (Bloqueo de compra)
        if (product.current_stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // 3. Calculamos totales
        total += product.price * item.quantity;

        // 4. RESTAR STOCK (Usamos el modelo de producto pasando 'tx')
        const updatedProduct = await productModel.decreaseStock(
          item.productId,
          item.quantity,
          tx,
        );

        // 5. Verificar si quedó bajo el mínimo (Alerta)
        if (updatedProduct.current_stock <= updatedProduct.min_stock) {
          lowStockAlerts.push({
            name: updatedProduct.name,
            current: updatedProduct.current_stock,
            min: updatedProduct.min_stock,
          });
        }

        saleItemsToCreate.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      // 6. Crear la venta y los items
      const sale = await tx.sale.create({
        data: {
          userId,
          total,
          items: { create: saleItemsToCreate },
        },
        include: { items: true },
      });

      // Retornamos la venta Y las alertas para que el controller las use
      return { sale, lowStockAlerts };
    });
  },
};

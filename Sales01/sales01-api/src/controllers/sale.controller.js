import { saleModel } from "../models/sale.model.js";
import { saleCreateSchema } from "../schemas/sale.schema.js";

export const saleController = {
  async getAll(req, res) {
    try {
      const sales = await saleModel.findAll();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const sale = await saleModel.findById(id);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const userId = req.user.id;
      const { items } = saleCreateSchema.parse(req.body);

      const { sale, lowStockAlerts } = await saleModel.create({
        userId,
        items,
      });

      if (lowStockAlerts.length > 0) {
        lowStockAlerts.forEach((alert) => {
          console.warn(
            `⚠️ [STOCK ALERT] ${alert.name} is low: ${alert.current}/${alert.min}`,
          );
          // socketService.notify(alert)
        });
      }
      res.status(201).json(sale);
    } catch (error) {
      console.error("❌ ERROR EN SALE:", error);
      res.status(400).json({
        message: error.message || "Ocurrió un error inesperado",
        details: error.errors || null,
      });
    }
  },
};

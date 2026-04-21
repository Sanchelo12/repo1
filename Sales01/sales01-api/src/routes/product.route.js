import express from "express";
import { productController } from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateCreateProduct } from "../schemas/product.schema.js";

const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post(
  "/",
  verifyToken,
  validate(validateCreateProduct),
  productController.create,
);
router.put("/:id", verifyToken, productController.update);
router.delete("/:id", verifyToken, productController.delete);

export default router;

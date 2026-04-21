import express from "express";
import { saleController } from "../controllers/sale.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

router.get("/", verifyToken, checkRole(ROLES.ADMIN), saleController.getAll);
router.get("/:id", verifyToken, checkRole(ROLES.ADMIN), saleController.getById);
router.post("/", verifyToken, checkRole(ROLES.CUSTOMER), saleController.create);

export default router;

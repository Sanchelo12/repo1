import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// POST http://localhost:3000/api/auth/register
router.post("/register", register);

// POST http://localhost:3000/api/auth/login
router.post("/login", login);

// Ruta que CUALQUIER usuario logueado puede ver
router.post("/logout", verifyToken, logout);

export default router;

//En el Create User, podrías querer asignar roles específicos (Admin, Editor, Viewer) que un usuario normal no podría asignarse a sí mismo al registrarse.

//Lo ideal es que en auth.controller.js el método register sea independiente (o llame a createUser, pero que antes modifique ciertas cosas, como dar un rol predeterminado). ¿Por qué? Porque si mañana decides que los administradores que usan createUser pueden asignar un "Rol" (ej: 'admin' o 'editor'), no querrías que alguien que se registra solito en la web (register) pueda enviarse a sí mismo el campo role: 'admin' en el body y hackearte la app.

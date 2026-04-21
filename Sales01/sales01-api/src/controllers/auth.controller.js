import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  saveUserSession,
  deleteUserSession,
} from "../services/session.service.js";
import { ROLES } from "../utils/constants.js";
import { authenticateUser, generateToken } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: "Credenciales inválidas" });

    const token = generateToken(user);

    const sessionData = await saveUserSession(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.json({
      message: "Login exitoso",
      user: sessionData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const register = async (req, res) => {
  const { username, email, password, first_name, last_name } = req.body;

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      first_name,
      last_name,
      role: ROLES.USER,
    });

    res.status(201).json({
      message: "¡Bienvenido! Cuenta creada. Inicia sesión.",
      user: { username: newUser.username },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrarse." });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  const expiredData = jwt.decode(req.cookies.token);
  deleteUserSession(expiredData.id);
  res.json({ message: "Sesión cerrada correctamente" });
};

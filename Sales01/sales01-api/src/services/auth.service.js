import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authenticateUser = async (username, password) => {
  const user = await UserModel.findByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  return user;
};

export const generateToken = (user) => {
  const expiresIn = process.env.NODE_ENV === "development" ? "6h" : "15m";

  // NUNCA dejes la clave secreta en el código, usa variables de entorno
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn },
  );
};

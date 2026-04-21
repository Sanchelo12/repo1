import express from "express";
import morgan from "morgan";
import https from "https"; // 1. Importar módulo HTTPS
import fs from "fs"; // 2. Importar módulo para leer archivos
import path from "path";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de los certificados (asegúrate de que los nombres coincidan)
const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

//Si tu Backend es https://..., el navegador bloquea por defecto cualquier intento de comunicación que venga desde un sitio que no sea seguro (http://). Aunque tú en el código pongas res.header("Access-Control-Allow-Origin", "http://localhost:5173"), el navegador detiene la petición antes de que llegue al servidor.
app.use((req, res, next) => {
  // 1. El origen debe ser el del FRONTEND (Vite)
  res.header("Access-Control-Allow-Origin", "https://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Si vas a usar cookies HttpOnly, añade esta línea. Si intentas usar JWT en cookies sin esa línea: El navegador recibirá la respuesta, verá que falta el permiso de Credentials y borrará la cookie inmediatamente. Nunca se guardará.
  res.header("Access-Control-Allow-Credentials", "true");

  // 2. IMPORTANTE: Responder inmediatamente a las peticiones OPTIONS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middlewares (Software intermedio)
app.use(morgan("dev")); // Para ver las peticiones en la consola
// MORGAN CONECTADO A WINSTON: Usamos el formato 'combined' que es el estándar de servidores
/*app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);*/
app.use(express.json()); // Para que Express entienda los JSON que enviamos
// cookieParser: Debe ir antes de cualquier ruta o middleware que intente leer req.cookies
app.use(cookieParser());

// Rutas de la API
// Todas las rutas de usuario empezarán con /api/users
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);

// Ruta de prueba para saber si el servidor está vivo
app.get("/health", (req, res) => {
  res.json({ status: "Servidor funcionando correctamente" });
});

// --- ERROR HANDLER (DEBE SER EL ÚLTIMO) --- Aquí es donde el error muere y se loguea
app.use(errorHandler);

// CAMBIO CLAVE: Usamos https.createServer en lugar de app.listen. Express por sí solo no sabe manejar certificados SSL. Por eso usamos el módulo nativo de Node https para "envolver" tu app de Express.
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ Servidor SEGURO corriendo en https://localhost:${PORT}`);
});
/*app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});*/

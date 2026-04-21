import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // "Oye Node, busca el archivo .env y lee lo que tiene".

const { Pool } = pg; // Saca la herramienta 'Pool' de la librería.

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Máximo de conexiones simultáneas permitidas. Cada conexión en PostgreSQL consume aproximadamente 10MB de RAM en el servidor. Si lanzas 1,000 usuarios de golpe y no tienes un pool, intentarás usar 10GB de RAM solo en conexiones. Tu PC se congelará. Postgres tiene un límite interno (normalmente 100). Si llegas al 101, el backend lanzará un error y tu app dejará de funcionar para todos los nuevos usuarios.
  idleTimeoutMillis: 30000, // Sirve para "matar" las conexiones que no se están usando. Si no lo pones, las conexiones se quedan abiertas "por si acaso", gastando recursos de tu PC innecesariamente.
});

export default pool;

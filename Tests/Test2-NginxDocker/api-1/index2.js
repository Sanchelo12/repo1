/*const express = require("express");
const { Pool } = require("pg");
const app = express();

// Configuración de conexión a la DB
const pool = new Pool({
  user: "usuario",
  host: "localhost", // Desde Windows, la DB está en localhost
  database: "mi_base_de_datos",
  password: "password",
  port: 5432,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW(), origen FROM mensajes");
  res.json({
    api: "uno",
    db_status: "conectada",
    data: result.rows,
  });
});

app.listen(5001, "0.0.0.0", () => {
  console.log("API Uno escuchando en http://localhost:5001");
});
*/

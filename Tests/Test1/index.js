import express from "express";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Endpoint con Retraso Artificial (Prueba de Concurrencia)
app.get("/espera", (req, res) => {
  setTimeout(() => {
    res.send("Respondido después de 5 segundos");
  }, 5000);
});

// 2. Endpoint de Base de Datos (Prueba de Carga Real)
app.get("/usuarios", async (req, res) => {
  try {
    // Simulamos una búsqueda pesada por email
    const emailBuscado = `user${Math.floor(Math.random() * 1000)}@ejemplo.com`;

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [emailBuscado],
    );

    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en la base de datos");
  }
});

// 3. OBTENER TODOS LOS REGISTROS (Prueba de Carga de Datos)
app.get("/todos", async (req, res) => {
  try {
    // Traemos todo de la tabla
    const resultado = await pool.query("SELECT * FROM usuarios");

    // Mandamos cuántos registros hay en el Header para verlo en k6
    res.set("X-Total-Count", resultado.rowCount);
    res.json(resultado.rows);
  } catch (err) {
    console.error("Detalle del error:", err.message);
    res
      .status(500)
      .json({ error: "No se pudo obtener la lista", detalle: err.message });
  }
});

// 4. Obtener usuarios con número PAR en el nombre
app.get("/usuarios/pares", async (req, res) => {
  try {
    const query = `
      SELECT * FROM usuarios 
      WHERE CAST(SUBSTRING(nombre FROM '[0-9]+') AS INTEGER) % 2 = 0
    `;

    const resultado = await pool.query(query);
    res.json({
      total_pares: resultado.rowCount,
      data: resultado.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error procesando números pares");
  }
});

app.get("/usuarios/pares/count", async (req, res) => {
  try {
    const inicio = Date.now();

    // Esta consulta obliga a la CPU a calcular pero solo devuelve un número
    const query = `
      SELECT COUNT(*) FROM usuarios 
      WHERE CAST(SUBSTRING(nombre FROM '[0-9]+') AS INTEGER) % 2 = 0
    `;

    const resultado = await pool.query(query);
    const fin = Date.now();

    res.json({
      total_pares: resultado.rows[0].count,
      tiempo_db_ms: fin - inicio,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

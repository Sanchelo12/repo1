import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";
import { seed } from "../services/seedService.js";

//SEED TARDA VARIOS MINUTOS: 5 O 6 aprox.
// Truco para obtener la ruta de la carpeta actual en ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const client = await pool.connect();

  try {
    console.log("Iniciando transacción...");
    await client.query("BEGIN");

    // A. LEER Y EJECUTAR EL SQL DE INICIALIZACIÓN
    console.log("Leyendo initDb.sql...");
    const sqlPath = path.join(__dirname, "../config/initDb.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Asegurando estructura de tablas...");
    await client.query(sql);

    console.log("Iniciando carga de datos...");
    await seed(client);

    // CONFIRMAR CAMBIOS
    console.log("Guardando cambios en la base de datos (COMMIT)...");
    await client.query("COMMIT");

    console.log("Proceso completado con éxito.");
  } catch (err) {
    console.error("Error en el proceso:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();

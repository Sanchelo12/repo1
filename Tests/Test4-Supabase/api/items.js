import * as itemsController from "../controllers/itemsController.js";

export default async function handler(req, res) {
  console.log("hello from items.js in API.");
  console.log(process.env.ADMIN_USER);
  console.log(process.env.ADMIN_PASS);

  const { method } = req;
  const { id } = req.query; // Extraemos el ID si existe

  // --- MÉTODOS GET ---
  if (method === "GET") {
    if (id) {
      return itemsController.getById(req, res); // GET /api/items?id=123
    }
    return itemsController.getAll(req, res); // GET /api/items
  }

  // --- MÉTODOS POST ---
  if (method === "POST") {
    return itemsController.create(req, res); // POST /api/items
  }

  // --- MÉTODOS DELETE ---
  if (method === "DELETE") {
    if (id) {
      return itemsController.deleteById(req, res); // DELETE /api/items?id=123
    }
    return itemsController.deleteAll(req, res); // DELETE /api/items
  }

  // --- ERROR: MÉTODO NO SOPORTADO ---
  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}

import { getWeightedItem, getRealisticDate } from "../utils/probabilities.js";

export async function seed(client) {
  try {
    console.log("Iniciando Seed...");

    console.log("Vaciando tablas...");
    await client.query(`
      TRUNCATE TABLE sale_items, sales, products, users 
      RESTART IDENTITY CASCADE
    `);

    // 1. Fetch de los usuarios
    const userResponse = await fetch("https://dummyjson.com/users?limit=20");
    const userData = await userResponse.json();
    const userList = userData.users;

    console.log(`Cargando ${userList.length} usuarios...`);

    // 2. Bucle de inserción
    for (let user of userList) {
      await client.query(
        `INSERT INTO users (
      first_name, 
      last_name, 
      maiden_name, 
      age, 
      gender, 
      email, 
      phone, 
      username, 
      password,
      role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          user.firstName,
          user.lastName,
          user.maidenName,
          user.age,
          user.gender,
          user.email,
          user.phone,
          user.username,
          user.password,
          "user", // Asignamos el rol por defecto
        ],
      );
    }

    console.log("Usuarios cargados desde API.");

    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();
    const products = data.products;

    // Insertar productos en tu tabla
    for (let prod of products) {
      await client.query(
        `INSERT INTO products (
      title, 
      description, 
      category, 
      price, 
      discount_percentage, 
      rating, 
      stock
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          prod.title,
          prod.description,
          prod.category,
          prod.price,
          prod.discountPercentage,
          prod.rating,
          prod.stock,
        ],
      );
    }
    console.log("Productos cargados desde API");

    // GENERAR 1000 VENTAS ALEATORIAS
    // Primero obtenemos los IDs de los usuarios y productos que ya existen
    const usersRes = await client.query(
      "SELECT id FROM users WHERE role = 'user'",
    );
    const prodsRes = await client.query("SELECT id, price FROM products");

    // Verificación de seguridad
    if (usersRes.rows.length === 0 || prodsRes.rows.length === 0) {
      throw new Error(
        "No hay usuarios o productos en la base de datos para generar ventas.",
      );
    }

    const dbUsers = usersRes.rows;
    const dbProds = prodsRes.rows;

    console.log(`📦 Generando 1000 ventas para ${dbUsers.length} usuarios...`);

    for (let i = 0; i < 1000; i++) {
      // Pasamos el array de filas directamente
      const selectedUser = getWeightedItem(dbUsers);

      // Validamos que realmente obtuvimos un usuario
      if (!selectedUser) continue;

      const numItems = Math.floor(Math.random() * 5) + 1;
      let totalVenta = 0;
      let itemsEnVenta = [];

      for (let j = 0; j < numItems; j++) {
        const p = getWeightedItem(dbProds);
        if (p) {
          itemsEnVenta.push(p);
          totalVenta += parseFloat(p.price);
        }
      }

      const fechaAleatoria = getRealisticDate();

      // Inserción de la cabecera
      const vRes = await client.query(
        "INSERT INTO sales (user_id, total, created_at) VALUES ($1, $2, $3) RETURNING id",
        [selectedUser.id, totalVenta, fechaAleatoria],
      );

      const saleId = vRes.rows[0].id;

      // Inserción de los detalles
      for (let item of itemsEnVenta) {
        await client.query(
          "INSERT INTO sale_items (sale_id, product_id, price) VALUES ($1, $2, $3)",
          [saleId, item.id, item.price],
        );
      }
    }

    console.log("1000 Ventas generadas aleatoriamente");
  } catch (error) {
    console.error("Error durante el seeding:", error);
  }
}

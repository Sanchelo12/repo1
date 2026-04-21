const express = require("express");
const app = express();

app.set("trust proxy", 1); //esa línea no sirve para "permitir" la conexión, sino para "confiar" en la información que Nginx le pasa a Express sobre el origen de la petición.

app.use((req, res, next) => {
  const secret = req.headers["x-custom-secret"];
  const forward = req.headers["x-forwarded-for"];
  console.log("IP de origen según Nginx:", forward);
  console.log("IP de cliente: ", req.ip);
  console.log("Headers recibidos:", req.headers);
  console.log("Secreto recibido:", secret);
  if (secret === "mi-llave-super-secreta") {
    next();
  } else {
    res
      .status(403)
      .send("Acceso denegado: Solo se permiten peticiones vía Nginx");
  }
});

app.get("/", async (req, res) => {
  console.log("Recibida petición en API Uno");
  res.json({
    api: "uno",
    data: "Hola desde la API Uno",
  });
});

app.listen(5001, "0.0.0.0", () => {
  console.log("API Uno escuchando en http://localhost:5001");
});

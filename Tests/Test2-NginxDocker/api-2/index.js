const express = require("express");
const app = express();

//app.set("trust proxy", 1);

app.get("/", async (req, res) => {
  console.log("Recibida petición en API Dos");
  res.json({
    api: "dos",
    data: "Hola desde la API Dos",
  });
});

app.listen(5002, "0.0.0.0", () => {
  console.log("API Dos escuchando en http://localhost:5002");
});

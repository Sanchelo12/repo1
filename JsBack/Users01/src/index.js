import https from "https";
import fs from "fs";
import app from "./app.js"; // Importamos la lógica

const PORT = process.env.PORT || 3000;

const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

// Aquí es donde realmente se ocupa el puerto
https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`✅ Servidor SEGURO corriendo en https://localhost:${PORT}`);
});

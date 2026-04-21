import "dotenv/config";
//import https from "https";
//import fs from "fs";
import app from "./app.js";

const PORT = 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server corriendo en http://${HOST}:${PORT}`);
});
/*const httpsOptions = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};*/

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import productRoute from "./routes/product.route.js";
import saleRoute from "./routes/sale.route.js";

const app = express();

/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");

  let allowedHeaders = "Content-Type, Authorization";

  if (process.env.NODE_ENV === "development") {
    allowedHeaders += ", x-user-id, x-user-role";
  }

  res.header("Access-Control-Allow-Headers", allowedHeaders);

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});*/

const whitelist = [
  "https://localhost",
  "https://sales01.test",
  "https://api.sales01.test",
];

const corsOptions = {
  origin: function (origin, callback) {
    // 1. Si el origen está en la lista blanca, SIEMPRE se permite.
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    // 2. Es una herramienta (sin origin) y estamos en Desarrollo.
    if (!origin && process.env.NODE_ENV === "development") {
      return callback(null, true);
    }
    return callback(new Error("No permitido por CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    ...(process.env.NODE_ENV === "development"
      ? ["x-user-id", "x-user-role"]
      : []),
  ],
};

app.set("trust proxy", 1);

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productRoute);
app.use("/api/sales", saleRoute);

export default app;

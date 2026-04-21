import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import { UsersRoutes } from "./routes/UsersRoutes";
import { AuthRoutes } from "./routes/AuthRoutes";
import { ProductRoutes } from "./routes/ProductRoutes";
import { SalesRoutes } from "./routes/SalesRoutes";

function App() {
  return (
    <div className="App">
      <Navbar />

      <main className="main-content">
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route
            path="/unauthorized"
            element={<h1>No tienes permiso para estar aquí 🛑</h1>}
          />
          <Route path="/users/*" element={<UsersRoutes />} />
          <Route path="/products/*" element={<ProductRoutes />} />
          <Route path="/sales/*" element={<SalesRoutes />} />
          <Route path="/*" element={<AuthRoutes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

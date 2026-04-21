import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/auth/Profile";
import ProtectedRoute from "../components/ProtectedRoute";

export const AuthRoutes = () => (
  <Routes>
    {/* Rutas de acceso público */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/me" element={<Profile />} />
    </Route>
    {/* Ruta del perfil del usuario logueado */}
  </Routes>
);
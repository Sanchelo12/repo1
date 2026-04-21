import { Routes, Route } from "react-router-dom";
import ProductList from "../pages/products/ProductList";
import ProductCreate from "../pages/products/ProductCreate";
import ProductEdit from "../pages/products/ProductEdit";
import ProtectedRoute from "../components/ProtectedRoute";

export const ProductRoutes = () => (
  <Routes>
    {/* Ruta pública para ver productos */}
    <Route path="/" element={<ProductList />} />
    <Route element={<ProtectedRoute allowedRoles="admin" />}>
      <Route path="/create" element={<ProductCreate />} />
      <Route path="/:id/edit" element={<ProductEdit />} />
    </Route>
  </Routes>
);
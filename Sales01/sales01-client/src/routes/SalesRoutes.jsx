import { Routes, Route } from "react-router-dom";
import SaleList from "../pages/sales/SaleList";
import SaleCreate from "../pages/sales/SaleCreate";
import SaleDetail from "../pages/sales/SaleDetail";
import ProtectedRoute from "../components/ProtectedRoute";

export const SalesRoutes = () => (
  <Routes>
    <Route element={<ProtectedRoute allowedRoles="customer" />}>
      <Route path="/create" element={<SaleCreate />} />
    </Route>
    <Route element={<ProtectedRoute allowedRoles="admin" />}>
      <Route path="/" element={<SaleList />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="/:id" element={<SaleDetail />} />
    </Route>
  </Routes>
);
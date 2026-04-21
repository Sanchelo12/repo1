import authService from "../../services/auth.js";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export function DevUserSwitcher() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  // Solo renderizar si estamos en modo desarrollo
  if (import.meta.env.VITE_DEV_MODE !== "true") return null;

  const handleFastLogin = async (role) => {
    const credentials = {
      admin: {
        email: import.meta.env.VITE_TEST_ADMIN_USER,
        pass: import.meta.env.VITE_TEST_ADMIN_PASS,
      },
      customer: {
        email: import.meta.env.VITE_TEST_CUSTOMER_USER,
        pass: import.meta.env.VITE_TEST_CUSTOMER_PASS,
      },
    };

    const { email, pass } = credentials[role];

    try {
      // 1. Llamada real al backend
      const userData = await authService.login(email, pass);
      // 2. Guardar en Zustand
      setSession(userData);
      // 3. Redirigir al home o dashboard
      navigate("/");
    } catch (error) {
      console.error("Error en Fast Login:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 border border-yellow-500 rounded-lg my-4">
      <h4 className="text-yellow-500 font-bold mb-2">Dev Quick Login</h4>
      <div className="flex gap-2">
        <button
          onClick={() => handleFastLogin("admin")}
          className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          🔑 Admin
        </button>
        <button
          onClick={() => handleFastLogin("customer")}
          className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          👤 Cliente
        </button>
      </div>
    </div>
  );
}

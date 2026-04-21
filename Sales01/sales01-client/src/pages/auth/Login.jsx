import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth.js";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { DevUserSwitcher } from "../../components/Dev/DevUserSwitcher.jsx";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentials = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
      const response = await authService.login(credentials);
      login(response.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error al iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref={passwordRef} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <hr className="my-6 border-gray-700" />
      <DevUserSwitcher />
    </div>
  );
};

export default Login;

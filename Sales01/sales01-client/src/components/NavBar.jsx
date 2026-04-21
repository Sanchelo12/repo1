import { NavLink } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { NAV_LINKS } from "../routes/routesConfig";
import ProtectedLink from "./ProtectedLink";
//import ThemeToggle from "./ThemeToggle";
//import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav style={{ display: "flex", gap: "10px" }}>
      {NAV_LINKS.map((link) => (
        <ProtectedLink key={link.to} link={link} />
      ))}

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* <LanguageSelector />
        <ThemeToggle /> */}

        <div
          style={{
            borderLeft: "1px solid #ccc",
            height: "20px",
            margin: "0 5px",
          }}
        />

        {isAuthenticated ? (
          <>
            <span style={{ fontWeight: "bold", color: "#333" }}>
              Hola, {user?.username || "Usuario"} 👤
            </span>
            <button onClick={logout}>Cerrar Sesión</button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "0.8rem", color: "gray" }}>
              Estado: Offline
            </span>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

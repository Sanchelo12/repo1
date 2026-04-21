import { NavLink } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const ProtectedLink = ({ link }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (link.roles.includes("public")) {
    return <NavLink to={link.to}>{link.label}</NavLink>;
  }

  if (!isAuthenticated || !user) return null;

  if (link.roles.includes(user.role)) {
    return <NavLink to={link.to}>{link.label}</NavLink>;
  }

  return null;
};

export default ProtectedLink;

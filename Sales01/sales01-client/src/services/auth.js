import api from "./api.js";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
} //AGREGAR LO DE CATCH ERRORES, Y FIJARSE SINO HACE FALTA EL RESPONDE.DATA.JSON() O SIMILAR.

export async function register(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data;
}

const authService = {
  login,
  register,
  logout,
};

export default authService;

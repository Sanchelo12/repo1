import api from "./api.js";

export async function getAllSales() {
  const response = await api.get("/sales");
  return response.data;
}

export async function getSaleById(id) {
  const response = await api.get(`/sales/${id}`);
  return response.data;
}

export async function createSale(saleData) {
  const response = await api.post("/sales", saleData);
  return response.data;
}

const saleService = {
  getAllSales,
  getSaleById,
  createSale,
};

export default saleService;

import { useEffect, useState } from "react";
import saleService from "../../services/sales.js";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const data = await saleService.getAllSales();
        setSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div>Cargando ventas...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista de Ventas</h1>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            Venta #{sale.id} - Total: ${sale.total} - Fecha:{" "}
            {new Date(sale.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SaleList;

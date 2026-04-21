import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import saleService from '../../services/sales.js';

const SaleDetail = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const data = await saleService.getSaleById(id);
        setSale(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSale();
  }, [id]);

  if (loading) return <div>Cargando venta...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Detalle de Venta #{sale.id}</h1>
      <p>Total: ${sale.total}</p>
      <p>Fecha: {new Date(sale.createdAt).toLocaleDateString()}</p>
      <h2>Items:</h2>
      <ul>
        {sale.items.map((item, index) => (
          <li key={index}>
            Producto ID: {item.productId} - Cantidad: {item.quantity} - Precio:
            ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SaleDetail;

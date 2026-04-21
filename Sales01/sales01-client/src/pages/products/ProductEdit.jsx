import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/product.js";

const ProductEdit = () => {
  const { id } = useParams();
  const priceRef = useRef();
  const currentStockRef = useRef();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        priceRef.current.value = data.price;
        currentStockRef.current.value = data.current_stock;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      price: parseFloat(priceRef.current.value),
      current_stock: parseInt(currentStockRef.current.value),
    };
    try {
      await productService.updateProduct(id, productData);
      alert("Producto actualizado exitosamente");
    } catch (err) {
      alert("Error al actualizar producto: " + err.message);
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Editar Producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={product?.name || ""} readOnly />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" step="0.01" ref={priceRef} required />
        </div>
        <div>
          <label>Stock Actual:</label>
          <input type="number" ref={currentStockRef} required />
        </div>
        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default ProductEdit;

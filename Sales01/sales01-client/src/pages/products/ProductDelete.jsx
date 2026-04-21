import { useState } from "react";
import productService from "../../services/product.js";

const ProductDelete = ({ productId, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await productService.deleteProduct(productId);
      onDelete(productId);
    } catch (err) {
      alert("Error al eliminar producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Eliminar Producto</h1>
      <p>¿Estás seguro de que quieres eliminar este producto?</p>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Eliminando..." : "Eliminar"}
      </button>
    </div>
  );
};

export default ProductDelete;

import { useRef } from "react";
import productService from "../../services/product.js";

const ProductCreate = () => {
  const nameRef = useRef();
  const priceRef = useRef();
  const currentStockRef = useRef();
  const minStockRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      current_stock: parseInt(currentStockRef.current.value),
      min_stock: parseInt(minStockRef.current.value),
    };
    try {
      await productService.createProduct(productData);
      alert("Producto creado exitosamente");
      // Reset form
      nameRef.current.value = "";
      priceRef.current.value = "";
      currentStockRef.current.value = "";
      minStockRef.current.value = "";
    } catch (err) {
      alert("Error al crear producto: " + err.message);
    }
  };

  return (
    <div>
      <h1>Crear Producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" ref={nameRef} required />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" step="0.01" ref={priceRef} required />
        </div>
        <div>
          <label>Stock Actual:</label>
          <input type="number" ref={currentStockRef} required />
        </div>
        <div>
          <label>Stock Mínimo:</label>
          <input type="number" ref={minStockRef} required />
        </div>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default ProductCreate;

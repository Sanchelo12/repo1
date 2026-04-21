import { useState } from 'react';
import saleService from "../../services/sales.js";

const SaleCreate = () => {
  const [items, setItems] = useState([{ productId: "", quantity: "" }]);

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: "" }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const saleData = {
      items: items.map((item) => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
      })),
    };
    try {
      await saleService.createSale(saleData);
      alert("Venta creada exitosamente");
      setItems([{ productId: "", quantity: "" }]);
    } catch (err) {
      alert("Error al crear venta: " + err.message);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div>
      <h1>Crear Venta</h1>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="number"
              placeholder="Product ID"
              value={item.productId}
              onChange={(e) => updateItem(index, "productId", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveItem(index)}>
              Remover
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>
          Agregar Item
        </button>
        <br />
        <button type="submit">Crear Venta</button>
      </form>
    </div>
  );
};

export default SaleCreate;

// Función que aplica la lógica 70/25/5
export const getWeightedItem = (list) => {
  if (!list || list.length === 0) return null; // Protección
  const chance = Math.random();
  const total = list.length;

  if (chance < 0.7) {
    // 70% de probabilidad: Elige de los primeros 5 (o menos si la lista es corta)
    const limit = Math.min(total, 5);
    return list[Math.floor(Math.random() * limit)];
  }

  if (chance < 0.95) {
    // 25% de probabilidad: Elige de los siguientes 15
    const start = Math.min(total, 5);
    const end = Math.min(total, 20);
    return list[Math.floor(Math.random() * (end - start)) + start];
  }

  // 5% de probabilidad: Elige del resto de la lista
  const offset = Math.min(total, 20);
  return list[Math.floor(Math.random() * (total - offset)) + offset];
};

export const getRealisticDate = () => {
  // Rango total: 2023 a 2025
  const start = new Date("2023-01-01").getTime();
  const end = new Date("2025-12-31").getTime();

  const chance = Math.random();
  let selectedTimestamp;

  if (chance < 0.75) {
    // TEMPORADA ALTA (75% de las ventas)
    const highSeasonMonths = [2, 6, 11]; // Marzo, Julio, Diciembre
    const randomMonth =
      highSeasonMonths[Math.floor(Math.random() * highSeasonMonths.length)];

    const years = [2023, 2024, 2025];
    const randomYear = years[Math.floor(Math.random() * years.length)];

    const randomDay = Math.floor(Math.random() * 28) + 1;
    selectedTimestamp = new Date(randomYear, randomMonth, randomDay).getTime();
  } else {
    // TEMPORADA NORMAL Y BAJA (El resto de las ventas se reparten)
    selectedTimestamp = start + Math.random() * (end - start);
  }

  return new Date(selectedTimestamp);
};

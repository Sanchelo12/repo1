-- 1. Tablas Maestras
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    maiden_name VARCHAR(100),
    age INT,
    gender VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    rating DECIMAL(3, 2),
    stock INT
);

-- 2. Tablas Transaccionales
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    total DECIMAL(12, 2),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales (id) ON DELETE CASCADE,
    product_id INT REFERENCES products (id),
    price DECIMAL(10, 2)
);
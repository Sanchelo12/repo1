# 1. ¿Qué sistema operativo base usamos? (Node versión 20)
FROM node:20-alpine

# Instalamos pnpm globalmente dentro del contenedor
RUN npm install -g pnpm nodemon

# 2. ¿En qué carpeta de la "caja" vamos a trabajar?
WORKDIR /app

# 3. Copiamos los archivos de configuración de dependencias
COPY package.json ./

# 4. Instalamos las librerías (esto ocurre dentro de la caja)
RUN pnpm install

# 5. Copiamos TODO el código de nuestro proyecto a la caja
COPY . .

# 6. ¿Qué comando debe ejecutar Docker para iniciar la app?
CMD ["pnpm", "dev", "--host"]
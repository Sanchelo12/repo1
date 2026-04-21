# 1. ¿Qué sistema operativo base usamos? (Node versión 20)
FROM node:20-alpine

# Instalamos pnpm globalmente dentro del contenedor
RUN npm install -g pnpm

# 2. ¿En qué carpeta de la "caja" vamos a trabajar?
WORKDIR /app

# 3. Copiamos los archivos de configuración de dependencias
COPY package.json ./

# 4. Instalamos las librerías (esto ocurre dentro de la caja)
RUN pnpm install

# 5. Copiamos TODO el código de nuestro proyecto a la caja
COPY . .

# GENERAMOS EL CLIENTE DE PRISMA (Muy importante)
# Esto crea el código necesario para hablar con la base de datos
RUN pnpm prisma generate

# El comando de inicio ahora debe preparar la DB y luego arrancar
CMD pnpm prisma migrate deploy && pnpm seed && pnpm dev
# ==================================
# ETAPA BASE
# ==================================
FROM node:20.18.1-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json package-lock.json* ./

# ==================================
# ETAPA DE DESARROLLO
# ==================================
FROM base AS development

# Instalar TODAS las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto de desarrollo de Vite
EXPOSE 5173

# Comando para desarrollo con hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==================================
# ETAPA DE BUILD
# ==================================
FROM base AS builder

# Instalar TODAS las dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Ejecutar el build de producción
RUN npm run build

# ==================================
# ETAPA DE PRODUCCIÓN
# ==================================
FROM nginx:stable-alpine AS production

# Copiar archivos build desde la etapa builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear configuración de nginx personalizada
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

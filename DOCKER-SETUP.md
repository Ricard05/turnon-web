# Configuración Docker - TurnOn Front

Este proyecto está completamente dockerizado con soporte para desarrollo y producción.

## Tecnologías Instaladas

El proyecto incluye las siguientes tecnologías y librerías instaladas automáticamente por Docker:

### Core (Versiones LTS)
- **Node.js 20.18.1 LTS** - Runtime JavaScript
- **React 18.3.1 LTS** - Framework principal
- **React DOM 18.3.1** - Renderizado React
- **Vite 6.0.11** - Build tool y dev server
- **TypeScript 5.7.3** - Tipado estático

### Styling
- **Tailwind CSS 3.4.17** - Framework de utilidades CSS
- **Shadcn/ui** - Componentes UI (con Radix UI)
- **PostCSS 8.4.49** - Procesamiento CSS
- **Autoprefixer 10.4.20** - Prefijos CSS automáticos

### Librerías de Animación y Utilidades
- **@react-spring/web 9.7.5** - Animaciones basadas en física
- **framer-motion 11.15.0** - Animaciones y transiciones
- **driver.js 1.3.1** - Tours guiados y onboarding
- **@uidotdev/usehooks 2.4.1** - Colección de hooks útiles
- **lucide-react 0.468.0** - Iconos

### UI Components (Radix UI)
- Dialog, Dropdown Menu, Label, Select, Separator, Tabs, Toast
- class-variance-authority 0.7.1 - Variantes de componentes
- clsx 2.1.1 - Utilidad para clases
- tailwind-merge 2.6.0 - Merge de clases Tailwind

## Estructura de Archivos Docker

```
.
├── Dockerfile              # Multi-stage build (development + production)
├── docker-compose.yml      # Orquestación de servicios
├── .dockerignore          # Archivos excluidos del build
├── tailwind.config.js     # Configuración de Tailwind
├── postcss.config.js      # Configuración de PostCSS
└── components.json        # Configuración de shadcn/ui
```

## Uso

### Modo Desarrollo (con hot reload)

```bash
# Iniciar contenedor de desarrollo
docker-compose --profile dev up

# O en modo detached
docker-compose --profile dev up -d

# Ver logs
docker-compose logs -f turnon-dev

# Detener
docker-compose --profile dev down
```

La aplicación estará disponible en: **http://localhost:5173**

**Características del modo desarrollo:**
- Hot reload automático
- Código fuente montado como volumen
- Cambios reflejados instantáneamente
- `node_modules` gestionado por el contenedor

### Modo Producción

```bash
# Build y ejecutar en producción
docker-compose --profile prod up

# O en modo detached
docker-compose --profile prod up -d

# Ver logs
docker-compose logs -f turnon-prod

# Detener
docker-compose --profile prod down
```

La aplicación estará disponible en: **http://localhost:3000**

**Características del modo producción:**
- Build optimizado con Vite
- Servido por Nginx
- Imagen final ligera (Alpine Linux)
- Configuración SPA con fallback a index.html

### Reconstruir después de cambios en dependencias

Si modificas `package.json`, necesitas reconstruir la imagen:

```bash
# Para desarrollo
docker-compose --profile dev up --build

# Para producción
docker-compose --profile prod up --build
```

## Comandos Útiles

### Ejecutar comandos dentro del contenedor

```bash
# Desarrollo
docker exec -it turnon-front-dev sh

# Producción
docker exec -it turnon-front-prod sh
```

### Limpiar todo (imágenes, contenedores, volúmenes)

```bash
docker-compose down -v
docker system prune -a
```

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

### Reinstalar dependencias

```bash
# Elimina el contenedor y reconstruye
docker-compose --profile dev down
docker-compose --profile dev up --build
```

## Configuración de Shadcn/ui

El proyecto está pre-configurado para usar shadcn/ui. Para agregar componentes:

```bash
# Desde dentro del contenedor de desarrollo
docker exec -it turnon-front-dev sh

# Instalar un componente (ejemplo: button)
npx shadcn@latest add button
```

O manualmente, copia los componentes a `src/components/ui/`

## Variables de Entorno

Puedes agregar variables de entorno creando un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=TurnOn
```

Luego actualiza `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
env_file:
  - .env
```

## Troubleshooting

### El hot reload no funciona
- Asegúrate de que los volúmenes estén correctamente montados
- Verifica que no haya conflictos de puertos

### Problemas con permisos de archivos
```bash
# En Linux, si hay problemas con permisos
sudo chown -R $USER:$USER .
```

### Limpiar caché de Docker
```bash
docker builder prune
```

### Puerto ya en uso
Cambia los puertos en `docker-compose.yml`:
```yaml
ports:
  - "8080:5173"  # Cambia 8080 por el puerto que prefieras
```

## Arquitectura del Dockerfile

El `Dockerfile` usa **multi-stage build** con 4 etapas:

1. **base**: Configuración base con Node.js 22 Alpine
2. **development**: Incluye todas las dependencias para desarrollo
3. **builder**: Ejecuta el build de producción
4. **production**: Imagen final con Nginx sirviendo archivos estáticos

Esto permite:
- Reutilización de capas (más rápido)
- Imágenes más pequeñas en producción
- Separación clara entre dev y prod

## Próximos Pasos

1. Desarrolla tu aplicación normalmente en `src/`
2. Los cambios se reflejarán automáticamente en modo dev
3. Usa las librerías instaladas:
   ```tsx
   // Animaciones con react-spring
   import { useSpring, animated } from '@react-spring/web'

   // Animaciones con framer-motion
   import { motion } from 'framer-motion'

   // Tours guiados
   import { driver } from 'driver.js'
   import 'driver.js/dist/driver.css'

   // Hooks personalizados
   import { useLocalStorage, useDebounce } from '@uidotdev/usehooks'

   // Iconos
   import { User, Settings, Menu } from 'lucide-react'
   ```

4. Para componentes shadcn/ui, usa la utilidad `cn`:
   ```tsx
   import { cn } from '@/lib/utils'

   // Ejemplo de uso
   <div className={cn("base-class", condition && "conditional-class")}>
     Contenido
   </div>
   ```

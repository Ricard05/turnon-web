# TurnOn Front

Proyecto React completamente dockerizado con Tailwind CSS, shadcn/ui y librerías de animación.

## Inicio Rápido

### Desarrollo (recomendado)
```bash
docker-compose --profile dev up
```
Accede en: **http://localhost:5173**

### Producción
```bash
docker-compose --profile prod up
```
Accede en: **http://localhost:3000**

### Rebuild con nuevas dependencias
```bash
docker-compose --profile dev up --build
```

## Stack Tecnológico

### Core (Versiones LTS)
- Node.js 20.18.1 LTS
- React 18.3.1 LTS
- TypeScript 5.7.3
- Vite 6.0.11

### Styling
- Tailwind CSS 3.4.17
- Shadcn/ui (Radix UI components)
- PostCSS + Autoprefixer

### Librerías
- **Animaciones**: framer-motion, @react-spring/web
- **UI**: lucide-react (iconos)
- **Utilidades**: @uidotdev/usehooks
- **Tours**: driver.js

## Estructura del Proyecto

```
turnon-front/
├── src/
│   ├── components/     # Componentes React
│   ├── lib/           # Utilidades (utils.ts)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css      # Tailwind CSS
├── Dockerfile         # Multi-stage build
├── docker-compose.yml # Orquestación Docker
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Comandos Docker

```bash
# Iniciar en modo desarrollo
docker-compose --profile dev up

# Iniciar en modo desarrollo (detached)
docker-compose --profile dev up -d

# Ver logs
docker-compose logs -f turnon-dev

# Detener
docker-compose --profile dev down

# Ejecutar comandos dentro del contenedor
docker exec -it turnon-front-dev sh

# Limpiar todo
docker-compose down -v
docker system prune -a
```

## Desarrollo

El contenedor de desarrollo incluye:
- Hot reload automático con Vite
- Código fuente montado como volumen
- node_modules gestionado por Docker
- TypeScript con validación en tiempo real

### Agregar componentes shadcn/ui

```bash
# Desde dentro del contenedor
docker exec -it turnon-front-dev sh
npx shadcn@latest add button
```

### Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=TurnOn
```

## Ejemplos de Uso

### Animaciones con Framer Motion
```tsx
import { motion } from 'framer-motion'

function Component() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Contenido animado
    </motion.div>
  )
}
```

### Hooks personalizados
```tsx
import { useLocalStorage, useDebounce } from '@uidotdev/usehooks'

function Component() {
  const [value, setValue] = useLocalStorage('key', 'default')
  const debouncedValue = useDebounce(value, 300)

  return <div>{debouncedValue}</div>
}
```

### Tours guiados con Driver.js
```tsx
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const driverObj = driver({
  steps: [
    { element: '#step1', popover: { title: 'Título', description: 'Descripción' } }
  ]
})

driverObj.drive()
```

### Iconos con Lucide React
```tsx
import { User, Settings, Menu } from 'lucide-react'

function Component() {
  return (
    <div>
      <User size={24} />
      <Settings className="text-blue-500" />
    </div>
  )
}
```

### Utilidad cn para clases CSS
```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "base-class",
  isActive && "active-class",
  "another-class"
)}>
  Contenido
</div>
```

## Documentación Completa

Ver [DOCKER-SETUP.md](./DOCKER-SETUP.md) para documentación detallada sobre:
- Configuración de Docker
- Troubleshooting
- Arquitectura del Dockerfile
- Comandos avanzados

## Licencia

MIT

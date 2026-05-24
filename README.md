# The Gordo - Sistema de Reservas de Mesas

**Aplicación web moderna para gestión de reservas de mesas en tiempo real**

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://the-gordo-reservas-eliz.vercel.app)
[![GitHub](https://img.shields.io/badge/Repository-GitHub-181717?logo=github)](https://github.com/ADEP-123/the-gordo-reservas-eliz)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## Acceso a la Plataforma

**URL de despliegue:** [https://the-gordo-reservas-eliz.vercel.app](https://the-gordo-reservas-eliz.vercel.app)

---

## Descripción del Proyecto

**The Gordo** es una solución integral de reservas de mesas diseñada para restaurantes de comida rápida. La plataforma permite que los clientes:

- Visualizar el salón en tiempo real con disponibilidad de mesas
- Reservar mesas seleccionando fecha, hora y número de personas
- Verificar disponibilidad instantáneamente
- Confirmar reservas con sus datos de contacto

Y que los administradores:

- Gestionar todas las mesas del restaurante
- Configurar horarios operacionales
- Ver y administrar todas las reservas
- Acceso seguro mediante autenticación

---

## Características Principales

### Módulo Cliente

- **Vista interactiva del salón** con representación gráfica de mesas
- **Sistema de reserva intuitivo** en menos de 3 minutos
- **Validación en tiempo real** de disponibilidad
- **Prevención de dobles reservas** automática
- **Interfaz responsiva** (desktop, tablet, mobile)

### Módulo Administrador

- **Panel de control centralizado** para gestión completa
- **Gestión de mesas** (crear, editar, bloquear)
- **Configuración de horarios** operacionales
- **Historial de reservas** con filtros avanzados
- **Autenticación segura** con recuperación de contraseña

---

## Arquitectura Técnica

### Stack Tecnológico

```
Frontend          Backend           Database          Hosting
├─ React 19       ├─ Supabase      ├─ PostgreSQL     ├─ Vercel
├─ Vite 8         ├─ API REST      └─ Row Level      └─ GitHub
├─ React Router   └─ Auth JWT        Security
└─ CSS3
```

### Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
│   └── panel-admin/  # Componentes del panel administrativo
├── pages/            # Páginas principales
│   └── panel-admin/  # Páginas del administrador
├── services/         # Servicios de comunicación con Supabase
├── hooks/            # Custom hooks de React
├── context/          # Estado global (autenticación)
├── styles/           # Archivos CSS organizados
├── utils/            # Funciones auxiliares
└── data/             # Datos estáticos
```

---

## Modelo de Datos

### Tabla: `mesas`

Almacena información de cada mesa del restaurante

```sql
id (UUID)          -- Identificador único
numero (INTEGER)   -- Número visible de la mesa
capacidad (INT)    -- Máxima cantidad de personas
ubicacion (TEXT)   -- Zona del salón (ventana, central, terraza)
estado (TEXT)      -- disponible | ocupada | bloqueada
created_at (TS)    -- Fecha de creación
```

### Tabla: `reservas`

Registro de todas las reservas realizadas

```sql
id (UUID)              -- Identificador único
mesa_id (UUID FK)      -- Referencia a la mesa
cliente_nombre (TEXT)  -- Nombre completo
cliente_tel (TEXT)     -- Teléfono de contacto
cliente_email (TEXT)   -- Email del cliente
fecha (DATE)           -- Fecha de la reserva
hora (TIME)            -- Hora de inicio
num_personas (INT)     -- Cantidad de personas
estado (TEXT)          -- activa | cancelada | completada
created_at (TS)        -- Fecha de creación de la reserva
```

### Tabla: `horarios`

Define disponibilidad operacional del restaurante

```sql
id (UUID)           -- Identificador único
dia_semana (TEXT)   -- lunes, martes, ... domingo
hora_inicio (TIME)  -- Apertura del turno
hora_fin (TIME)     -- Cierre del turno
activo (BOOLEAN)    -- Si el día está habilitado
```

---

## Instalación y Uso Local

### Requisitos Previos

- Node.js 18+
- Git
- Cuenta Supabase (gratuita)
- Cuenta Vercel (gratuita)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ADEP-123/the-gordo-reservas-eliz.git
cd the-gordo-reservas-eliz
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
# Crear archivo .env.local
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

5. **Abrir en navegador**

```
http://localhost:5173
```

### Build para producción

```bash
npm run build
npm run preview
```

---

## Seguridad

- ✅ **Autenticación JWT** via Supabase
- ✅ **Row Level Security (RLS)** en PostgreSQL
- ✅ **Variables de entorno seguras** en Vercel
- ✅ **HTTPS** obligatorio en todas las conexiones
- ✅ **API REST** con validación en backend

---

## Flujos Principales

### Flujo de Reserva (Cliente)

1. Cliente accede a la aplicación
2. Visualiza el salón con mesas disponibles
3. Selecciona una mesa verde (disponible)
4. Elige fecha, hora y número de personas
5. Ingresa nombre, teléfono y email
6. Confirma la reserva
7. Recibe confirmación visual inmediata

### Flujo de Administrador

1. Admin accede a `/admin/login`
2. Ingresa credenciales autenticadas en Supabase
3. Accede al dashboard administrativo
4. Puede:
   - Ver/crear/editar/eliminar mesas
   - Configurar horarios operacionales
   - Gestionar todas las reservas (ver, cancelar)
   - Ver historial completo
5. Cierra sesión de forma segura

---

## Validaciones Implementadas

✅ **Cliente:**

- Número de personas no excede capacidad de mesa
- Fecha no puede ser anterior a hoy
- Horarios permitidos según configuración
- Prevención automática de dobles reservas
- Email con formato válido

✅ **Administrador:**

- Solo acceso autenticado al panel
- Validación de datos en cada operación
- Confirmaciones antes de eliminar
- Restricciones según estado actual

---

## Responsividad

La aplicación es **100% responsiva**:

- **Mobile** (360px - 768px): Optimizado para teléfonos
- **Tablet** (768px - 1024px): Layouts ajustados
- **Desktop** (1024px+): Experiencia completa

---

## Integración Continua

El proyecto utiliza **Git Flow** simplificado:

1. Cada feature se desarrolla en rama independiente
2. Al completarse, se hace Pull Request a `main`
3. Una vez aprobado, se hace merge a `main`
4. **Vercel detecta automáticamente** cambios en `main`
5. Se redeploy automáticamente la aplicación
6. URL siempre refleja la última versión

---

## Consideraciones Futuras

Posibles mejoras y expansiones del sistema:

### Mejoras Técnicas

- Crear excepciones de horario por fecha específica (día festivo)
- Alertar si se desactiva un día con reservas activas
- Búsqueda avanzada de reservas por nombre o teléfono

### Funcionalidades

- **Dashboard con métricas** (ocupación, ingresos, horarios pico)
- **Confirmación automática por correo** al cliente
- **Cancelación de reserva desde enlace público** (sin requerir login)
- **Edición avanzada de reservas** por parte del admin
- **Historial de cambios administrativos** (auditoría completa)
- **Notificaciones por SMS** para recordatorios

### Expansión

- **Procesamiento de pagos** (integración Stripe/Mercado Pago)
- **Sistema de fidelización** con puntos/descuentos
- **Programa de referidos** para clientes

### Escalabilidad

- **Aplicación móvil nativa** (React Native)
- **Multi-local** para cadenas de restaurantes
- **API pública** para integraciones de terceros

---

## Licencia

Este proyecto fue desarrollado como trabajo académico de la asignatura configuracion y mantenimiento de software del programa Ingeniería de Software de ls universidad de santander UDES.

---

## Desarrollado por

**Andres David Elizalde Peralta**

- GitHub: [@ADEP-123](https://github.com/ADEP-123)
- Proyecto: Sistema de Reservas The Gordo
- Fecha: 2026

---

## Enlaces Importantes

| Recurso           | Link                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| **Aplicación**    | [Vercel Deployment](https://the-gordo-reservas-eliz.vercel.app)          |
| **Código**        | [GitHub Repository](https://github.com/ADEP-123/the-gordo-reservas-eliz) |
| **Documentación** | [Documento de Requisitos](./database/schema.sql)                         |
| **Panel Admin**   | [/admin/login](https://the-gordo-reservas-eliz.vercel.app/admin/login)   |

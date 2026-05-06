# RAQUELPONS_ESTETICA — Plataforma Web Premium

Plataforma web profesional para consultorio de estética y dermocosmética. Incluye sitio público premium + panel de administración completo.

## Stack

- **Frontend/Backend:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS + Framer Motion
- **Base de datos:** PostgreSQL via Supabase + Prisma ORM
- **Auth:** JWT con jose + bcryptjs
- **Storage:** Supabase Storage
- **Validaciones:** Zod

---

## Instalación y setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiá el archivo de ejemplo y completá con tus datos:

```bash
cp .env.example .env.local
```

Completá en `.env.local`:
- `DATABASE_URL` — URL de conexión a PostgreSQL (Supabase)
- `NEXTAUTH_SECRET` — string aleatorio seguro (mínimo 32 caracteres)
- `SUPABASE_URL` — URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY` — clave anon de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — clave service role de Supabase (para uploads)
- `SUPABASE_STORAGE_BUCKET` — nombre del bucket (por defecto: `raquelpons-estetica`)

### 3. Inicializar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma migrate dev --name init

# Cargar datos iniciales
npx prisma db seed
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para ver el sitio.

### 5. Build para producción

```bash
npm run build
npm start
```

---

## Panel de administración

### Acceso

- **URL:** `/admin/login`
- **Email inicial:** `admin@raquelponsestetica.com`
- **Contraseña inicial:** `admin123456`

> ⚠️ **Importante:** Cambiá la contraseña antes de publicar en producción. Podés hacerlo directamente en la base de datos o agregando un formulario de cambio de contraseña en el admin.

---

## Guía de uso del admin

### ¿Cómo cambiar el número de WhatsApp?

1. Ingresá al panel → **Configuración** → pestaña **Contacto y ubicación**
2. Completá el campo "Número WhatsApp" en formato internacional: `5493512345678`
   - Para Argentina: `549` + código de área sin 0 + número sin 15
   - Ejemplo Córdoba: `5493512345678`
3. Guardá los cambios

### ¿Cómo cargar servicios?

1. Panel → **Servicios** → "Nuevo servicio"
2. Completá nombre, categoría, descripción, precio (0 = "Consultar")
3. Activá el servicio para que sea visible en el sitio

### ¿Cómo cargar productos?

1. Panel → **Productos** → "Nuevo producto"
2. Completá nombre, marca, laboratorio, categoría, preocupación de piel
3. Si el precio es 0 o vacío, se mostrará "Consultar"
4. Podés cargar la URL de imagen o subirla desde Supabase Storage

### ¿Cómo cambiar los precios?

- Para servicios: Panel → **Servicios** → editar → campo "Precio"
- Para productos: Panel → **Productos** → editar → campo "Precio"
- Precio 0 o vacío muestra "Consultar" automáticamente

### ¿Cómo cargar imágenes?

Las imágenes se cargan copiando la URL pública de Supabase Storage en el campo correspondiente. 

Para subir imágenes:
1. Subí la imagen desde el panel admin (endpoint `/api/upload`)
2. O subí directamente desde el dashboard de Supabase → Storage → bucket `raquelpons-estetica`
3. Copiá la URL pública y pegala en el campo "URL de imagen"

### ¿Cómo ver y gestionar turnos?

Panel → **Reservas de Diagnóstico**
- Ves todas las solicitudes con nombre, servicio, WhatsApp, día y horario preferido
- Podés cambiar el estado: Nueva → Contactada → Confirmada → Finalizada
- El botón de teléfono abre WhatsApp directo al cliente

### ¿Cómo ver y gestionar consultas de productos?

Panel → **Consultas de Productos**
- Ves todas las consultas con cliente, productos, cantidades y total estimado
- Podés expandir el detalle para ver cada ítem
- Podés cambiar el estado: Nueva → Contactada → Pago pendiente → Entregada

### ¿Cómo editar los textos del sitio?

Panel → **Configuración** → pestaña **Textos profesionales**
- "Sobre RAQUELPONS_ESTETICA"
- "Formación profesional"
- "Experiencia"
- "Texto legal"

### ¿Cómo cambiar el mapa?

1. Andá a [Google Maps](https://maps.google.com)
2. Buscá la dirección del consultorio
3. Click en "Compartir" → "Insertar mapa"
4. Copiá el código `<iframe ...>`
5. Panel → **Configuración** → **Contacto y ubicación** → pegar en "Código embed de Google Maps"

### ¿Cómo activar/desactivar secciones?

Panel → **Configuración** → pestaña **Secciones activas**
- Antes y Después (on/off)
- Testimonios (on/off)
- Boutique de Productos (on/off)
- Reservas de Diagnóstico (on/off)

---

## Conectar a Supabase

### Crear proyecto en Supabase

1. Andá a [supabase.com](https://supabase.com) y creá un proyecto
2. En **Settings → Database**, copiá la connection string y pegala en `DATABASE_URL`
3. En **Settings → API**, copiá `Project URL`, `anon key` y `service_role key`
4. En **Storage**, creá un bucket llamado `raquelpons-estetica` (público)

### Correr migraciones

```bash
npx prisma migrate deploy
npx prisma db seed
```

---

## Deploy en Vercel (recomendado)

1. Subí el proyecto a GitHub
2. Importá el repositorio en [Vercel](https://vercel.com)
3. Agregá todas las variables de entorno en el dashboard de Vercel
4. Vercel detecta Next.js automáticamente y hace el build

```bash
# El build de producción no necesita comandos especiales
# Vercel corre npm run build automáticamente
```

> Nota: Las migraciones de Prisma deben correrse manualmente antes del primer deploy, o configurar un script de deploy.

---

## Estructura de archivos

```
app/
  layout.tsx              # Layout raíz con SEO
  page.tsx                # Página principal pública
  globals.css             # Estilos globales y clases utilitarias
  admin/
    login/               # Login del panel
    dashboard/           # Dashboard con stats
    servicios/           # CRUD servicios
    productos/           # CRUD productos
    categorias/          # CRUD categorías y preocupaciones de piel
    turnos/              # Gestión de reservas
    consultas-productos/ # Gestión de consultas
    testimonios/         # CRUD testimonios
    antes-despues/       # CRUD antes/después
    configuracion/       # BusinessSettings completo
  api/
    appointments/        # Reservas (público)
    product-inquiries/   # Consultas de productos (público)
    upload/              # Upload de imágenes a Supabase
    auth/login           # Login admin
    auth/logout          # Logout admin
    admin/               # APIs CRUD protegidas

components/
  public/               # Componentes de la web pública
  admin/                # Sidebar y componentes del admin

lib/
  prisma.ts             # Singleton PrismaClient
  auth.ts               # JWT con jose
  validations.ts        # Schemas Zod
  whatsapp.ts           # Builders de mensajes WhatsApp
  utils.ts              # formatCurrencyARS, animaciones, etc.

prisma/
  schema.prisma         # Schema completo de la DB
  seed.ts               # Datos iniciales

types/
  index.ts              # Tipos TypeScript

middleware.ts           # Protección de rutas /admin
```

---

## Licencia y uso

Plataforma desarrollada a medida para RAQUELPONS_ESTETICA. Uso privado.

---

## Seguridad en producción

- [ ] Cambiar la contraseña admin por defecto (`admin123456`)
- [ ] Usar un `NEXTAUTH_SECRET` aleatorio y fuerte
- [ ] No compartir las claves de Supabase
- [ ] Configurar CORS en Supabase si es necesario
- [ ] Activar HTTPS en el dominio de producción
- [ ] Revisar los permisos del bucket de Storage (solo imágenes públicas de lectura)

# Auditoría Transparencia — CLAUDE.md

## Descripción del proyecto
Sistema de gestión de auditoría de transparencia municipal chilena. Permite rastrear el cumplimiento de ítems de transparencia activa, organizados en categorías y subcategorías, con asignación de áreas responsables y notificaciones por correo.

## Stack tecnológico
- **Backend:** Node.js + Express 5.x
- **Bases de datos:** MongoDB (contenido) + PostgreSQL (usuarios/auth)
- **Frontend:** Vanilla JavaScript + CSS moderno (sin frameworks)
- **Auth:** JWT (8h de expiración), bcryptjs para passwords
- **Puerto:** 3000 (configurado en .env)

## Estructura del proyecto
```
/
├── server.js              # Entry point Express
├── .env                   # Variables de entorno (PG_HOST, MONGO_URI, JWT_SECRET, PORT)
├── db/
│   ├── mongo.js           # Modelos Mongoose: Area, Category, Subcategory, Item, Config
│   └── postgres.js        # Tabla users + usuario admin inicial
├── middleware/
│   └── auth.js            # Validación JWT + roles
├── routes/
│   ├── auth.js            # POST /api/auth/login, GET /api/auth/me
│   ├── items.js           # CRUD /api/items
│   ├── categories.js      # CRUD /api/categories + subcategorías
│   ├── areas.js           # CRUD /api/areas
│   ├── users.js           # CRUD /api/users
│   └── config.js          # GET/POST /api/config/:key (SMTP, etc.)
└── public/
    ├── admin.html         # Panel admin completo (SPA vanilla JS)
    ├── panel.html         # Panel auditor
    ├── login.html         # Autenticación
    └── index.html         # Vista pública
```

## Modelos MongoDB clave

### Item
Campo principal del sistema. Almacena cada ítem de transparencia.
```js
{
  name: String,                  // Nombre del ítem
  category: ObjectId → Category,
  subcategory: ObjectId → Subcategory,
  status: 'Completo'|'Incompleto'|'Faltante'|'No disponible',
  tag: String,                   // Etiqueta libre
  detail: String,                // Detalle descriptivo
  prev_observation: String,      // Observación previa de auditoría
  deadline: String,              // Fecha límite (YYYY-MM-DD)
  areas: [ObjectId → Area],      // Áreas responsables (multi-select)
  area_emails: Mixed,            // Emails por área: { areaId: "email1,email2" }
  responsible_emails: String,    // Emails combinados (union de area_emails, compat.)
  cc_emails: String,             // Personas con copia (CC), separados por coma
  timestamps: true
}
```

### Area
```js
{ name: String }
```

### Category
```js
{ name, code, order, areas: [ObjectId], responsible_emails: String }
```

### Subcategory
```js
{
  name, code, order,
  category: ObjectId,
  status,
  areas: [ObjectId],
  area_emails: Mixed,       // { areaId: "email1,email2" }
  responsible_emails: String, // union de area_emails (compat.)
  cc_emails: String
}
```

### Config
Clave-valor genérico. Claves usadas: `smtp`, `global_deadline`, `global_cc`.
```js
{ key: String, value: Mixed }
```

## Autenticación
- Login: `POST /api/auth/login` → devuelve `{ token, role, username }`
- El token se guarda en `localStorage` del cliente
- Roles: `admin` (acceso total), `auditor` (solo crear/editar ítems)
- Admin inicial: `admin` / `admin123` / `admin@municipio.cl` (creado en pg init)

## API Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | /api/items | público | Lista todos los ítems (populados) |
| POST | /api/items | admin,auditor | Crear ítem |
| PUT | /api/items/:id | admin,auditor | Editar ítem |
| DELETE | /api/items/:id | admin | Eliminar ítem |
| GET | /api/areas | público | Lista áreas |
| POST | /api/areas | admin | Crear área |
| GET | /api/categories | público | Lista categorías |
| GET/POST/PUT/DELETE | /api/categories/... | admin/auditor | CRUD categorías y subcategorías |
| GET/POST | /api/config/:key | admin | Configuración global (SMTP, etc.) |

## Formulario "Editar ítem" (admin.html)

El modal de edición de ítems incluye:
1. **Nombre** — obligatorio
2. **Categoría / Subcategoría** — selects encadenados
3. **Estado** — botones toggle (Completo / Incompleto / Faltante / No disp.)
4. **Áreas** — pills clicables que activan/desactivan áreas
5. **Emails por Área** — al seleccionar un área, aparece un input de email para esa área específica (guardado en `area_emails`)
6. **Fecha Límite** — date picker (guardado en `deadline`)
7. **Con Copia (CC)** — emails separados por coma (guardado en `cc_emails`)
8. **Etiqueta, Detalle, Observación previa**

### Comportamiento de area_emails
- Cuando el usuario hace click en un pill de área, se muestra/oculta dinámicamente un input de email para esa área.
- Los valores se preservan al togglear otras áreas.
- Al guardar, `responsible_emails` se auto-calcula como la unión de todos los emails de áreas (compatibilidad con sistema de notificaciones).

## Notificaciones
- Sistema simulado (console.log + alert). Preparado para integración SMTP real vía `/api/config/smtp`.
- `sendNotification(id, type)` usa:
  - `target.responsible_emails` — destinatarios principales
  - `target.cc_emails` — copia
  - `target.deadline` — fecha límite del ítem (o fallback a `globalCorrectionDeadline` de localStorage)

## Variables globales JS (admin.html)
```js
categories, subcategories, areas  // Arrays cargados al inicio
selectedAreas                       // IDs de áreas seleccionadas en el modal activo
editingId                           // _id del ítem en edición (null si nuevo)
modalType                           // 'item'|'cat'|'sub'|'area'|'user'
```

## Comandos
```bash
npm start          # Inicia el servidor (node server.js)
npm run dev        # Con nodemon si está configurado
```

## Variables de entorno (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/Sw_auditoria
PG_HOST=localhost
PG_PORT=5432
PG_DB=auditoria
PG_USER=postgres
PG_PASS=...
JWT_SECRET=sw_auditoria_2026_secret
```

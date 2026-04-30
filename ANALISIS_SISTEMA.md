# Análisis Técnico: Sistema de Auditoría - Transparencia Activa Municipal

Este documento proporciona una visión profunda de la arquitectura, funcionalidades y estructura de datos del proyecto **"aud"**, un sistema diseñado para la gestión y seguimiento del cumplimiento de Transparencia Activa en organismos municipales.

---

## 1. Visión General del Proyecto

El sistema es una aplicación web full-stack (MEVN/PEVN simplificado) que permite a los auditores y administradores municipales monitorear el estado de carga de información en el portal de transparencia. Visualiza el cumplimiento mediante métricas en tiempo real y permite la gestión detallada de cada ítem fiscalizado.

### Objetivos Clave
- **Monitoreo de Cumplimiento**: Seguimiento visual (OK, Pendiente, Crítico) de los ítems de transparencia.
- **Gestión Multi-Área**: Clasificación por departamentos (Municipal, Salud, Educación).
- **Control de Acceso**: Roles diferenciados para la gestión de datos.
- **Historial de Observaciones**: Registro de infracciones previas para seguimiento continuo.

---

## 2. Arquitectura Tecnológica

### Backend (Node.js + Express)
El servidor actúa como un API RESTful que comunica el frontend con múltiples motores de base de datos.
- **Framework**: Express.js (v5.2.1).
- **Autenticación**: JWT (JSON Web Tokens) con almacenamiento de contraseñas mediante `bcryptjs`.
- **Middleware**: Manejo de CORS, parsing de JSON y cookies.

### Estrategia de Persistencia (Híbrida)
El proyecto utiliza un enfoque de base de datos políglota:
1. **PostgreSQL**: Gestión de usuarios y sesiones. Garantiza integridad referencial para el control de acceso.
2. **MongoDB**: Almacenamiento de ítems de auditoría, categorías y áreas. Su esquema flexible permite manejar detalles variables y metadatos de auditoría.
3. **SQLite**: Utilizado principalmente para la fase de prototipado o como referencia de semillas (`db/init.js`).

### Frontend (Vanilla JS / CSS Moderno)
Una interfaz orientada al rendimiento y la estética "premium":
- **Estilo**: CSS puro con variables de diseño, tipografía avanzada (Syne y DM Mono) y un sistema de diseño oscuro (Dark Mode) con micro-animaciones.
- **Visualización**: Tablas dinámicas, barras de progreso de cumplimiento y filtros instantáneos.

---

## 3. Estructura de Datos (MongoDB)

### Colección: `Item`
Es el núcleo del sistema. Representa cada obligación de transparencia.
```javascript
{
  name: String,             // Título del ítem (ej: "Organigrama")
  category: ObjectId,       // Referencia a la sección (ej: "03 - Estructura")
  subcategory: ObjectId,    // Sub-nivel de clasificación
  status: 'ok'|'warn'|'bad',// Estado actual
  tag: String,              // Etiqueta corta (ej: "Incompleto")
  detail: String,           // Hallazgo detallado de la revisión
  prev_observation: String, // Referencia a incumplimientos anteriores
  deadline: String,         // Fecha límite para subsanar
  areas: [ObjectId]         // Departamentos afectados
}
```

---

## 4. Mapa del Proyecto (Estructura de Archivos)

```text
/aud
├── server.js               # Punto de entrada (Configuración Express y Conexiones)
├── package.json            # Dependencias y Scripts (npm run dev)
├── .env                    # Variables de entorno (Credenciales DB)
├── /db
│   ├── mongo.js            # Esquemas de Mongoose
│   ├── postgres.js         # Inicialización de usuarios en PG
│   └── init.js             # Semillas y estructura legacy (SQLite)
├── /routes
│   ├── auth.js             # Login y verificación
│   ├── items.js            # CRUD de ítems de auditoría
│   └── users.js            # Gestión de usuarios
├── /public                 # Frontend Cliente
│   ├── index.html          # Dashboard Público
│   ├── login.html          # Acceso al sistema
│   ├── admin.html          # Gestión de ítems (CRUD)
│   └── panel.html          # Vista detallada de control
└── /middleware
    └── auth.js             # Validación de tokens y roles
```

---

## 5. Seguridad y Control de Acceso

El sistema implementa una protección por capas:
- **Roles**:
    - `admin`: Control total sobre usuarios e ítems.
    - `auditor`: Capacidad de actualizar el estado y detalles de los ítems, pero sin control sobre usuarios.
- **Protección de API**: Rutas protegidas que requieren un Bearer Token válido en las cabeceras HTTP.

---

## 6. Proceso de Despliegue (Docker)

El proyecto incluye soporte para contenedores, facilitando su despliegue en entornos de producción o staging:
- **Dockerfile**: Construye la imagen de la aplicación Node.js.
- **docker-compose.yml**: Orquestra la aplicación junto con sus bases de datos (Postgres y MongoDB).

---

## 7. Conclusiones y Próximos Pasos Recomendados

El sistema es robusto y está bien segmentado. Para escalar el proyecto, se sugiere:
1. **Unificar Persistencia**: Evaluar si es estrictamente necesario mantener Postgres y Mongo simultáneamente para reducir complejidad.
2. **Historial de Auditoría**: Implementar una tabla de logs para rastrear quién cambió el estado de un ítem y cuándo.
3. **Generación de Reportes**: Agregar exportación a PDF/Excel de los hallazgos directamente desde el dashboard.

---
*Documento generado por Antigravity - 2026*

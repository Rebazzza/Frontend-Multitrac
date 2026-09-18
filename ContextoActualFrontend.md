# CONTEXTO ACTUAL DEL FRONTEND - PROYECTO MULTITRAC

Este documento resume el estado de implementacion del nuevo frontend (React + TypeScript + Vite) en comparacion con la matriz de trasabilidad de requerimientos del sistema antiguo (`MATRIZ_REQUERIMIENTOS_TRASBALIDAD.md`).

---

## 1. RESUMEN TECNICO DEL PROYECTO

| Elemento | Valor |
|---|---|
| **Stack** | React 19.2.8 + TypeScript ~6.0.2 + Vite 8.2.2 |
| **Dependencias** | `react-router-dom` ^7.18.3, `axios` ^1.20.0 |
| **DevDeps** | `@vitejs/plugin-react`, `oxlint`, `@types/*` |
| **Scripts** | `dev`, `build`, `lint`, `preview` |
| **Proxy API** | `/api` → `http://localhost:53927` (`vite.config.ts`) |

---

## 2. MODULOS YA IMPLEMENTADOS

### Modulo 1: SEGURIDAD Y AUTENTICACION (SF-001 a SF-006)

| Requerimiento | Estado | Detalle |
|---------------|--------|---------|
| SF-001 Autenticacion de usuario (login) | **Completo** | Login con JWT + opcion "Mantuéname Conectado" |
| SF-002 Cambio de contrasena | **Completo** | Pagina propia de cambio de contrasena |
| SF-003 Registro de usuarios | **Completo** | Pagina de registro con validacion por campo |
| SF-005 Actualizacion de contrasena | **Completo** | Cubierto por la pagina de cambio de contrasena |
| SF-006 Redireccion de paginas segun rol | **Parcial** | `AuthGuard` protege rutas por JWT, pero el login redirige fijo a `/catalogos/monedas`; no hay redireccion por rol |

### Modulo 2: PERSONAL (PE-001 a PE-024)

| Requerimiento | Estado | Detalle |
|---------------|--------|---------|
| PE-001 Registro/lista de personal | **Parcial** | Solo listado (`PersonalPage`): tabla paginada, busqueda, orden, badge "Al dia/Vencido" por DNI/pasaporte + licencia. Sin crear/editar |
| PE-002 Personal por cargo | **Parcial** | Resuelve el cargo activo del personal via `PersonalCargo`. Sin CRUD |
| PE-014 Nivel educativo | **Completo** | Catalogos CRUD (`/catalogos/niveles-educativos`) |
| PE-015 AFP/SCTR | **Completo** | Catalogos CRUD (`/catalogos/afps`) |

### Catalogos CRUD genericos (componente reutilizable `catalog-page.tsx`)

Cubren requerimientos de soporte de varios modulos de la matriz:

| Catalogo | Endpoint | Modulo origen (matriz) |
|----------|----------|------------------------|
| Monedas | `/moneda` | FC-004 |
| Bancos | `/banco` | FC-006 |
| Cargos | `/cargo` | PE-002 |
| Niveles educativos | `/niveleducativo` | PE-014 |
| AFPs | `/afp` | PE-015 |
| Flotas | `/flota` | FL-008 |
| Actividades | `/actividad` | - |
| Turnos | `/turno` | OP-007 |
| Tipos de pago | `/tipopago` | FC-005 |
| Tipos de ocurrencia | `/tipoocurrencia` | - |

Todos con listado paginado, busqueda, orden, crear, editar y eliminar (CRUD completo).

---

## 3. FUNCIONALIDAD PROPIA (no existe en la matriz antigua)

| Funcionalidad | Detalle |
|---------------|---------|
| **Modulo Sueño** | CRUD completo de `PersonalSueno`: tabla paginada (fecha, conductor, operacion, horas), busqueda, crear/editar/eliminar con confirmacion y selector de conductor |
| **Dashboard** | Resumen del dia con metricas: `documentosExpirados`, `checklistsRegistrados`, `suenosHoy` + grid de acciones rapidas |

---

## 4. INFRAESTRUCTURA Y COMPONENTES REUTILIZABLES

### Core (`src/app/core/`)

| Pieza | Funcionalidad |
|-------|---------------|
| `auth.service.ts` | `login`, `register`, `changePassword`, `getMe`, gestion de token/roles en localStorage, `isAuthenticated()`, `logout()` |
| `catalog.service.ts` | Factory generica `createCatalogService<T>(resource)` → getAll, getPaged, getById, create, update, remove |
| `personal.service.ts` | `getPaged`, `getAll`, `getCargosPersonal`, `getCargos` |
| `sueno.service.ts` | CRUD sobre `/PersonalSueno` |
| `dashboard.service.ts` | `getResumen()` → GET `/dashboard/resumen` |
| `jwt.interceptor.ts` | Inyecta `Authorization: Bearer <token>` |
| `error.interceptor.ts` | Parsea errores a `ApiError`, maneja 401 (logout + redirect a `/login`) |
| `auth.guard.tsx` | `AuthGuard` — redirige a `/login` si no hay sesion valida |

### Componentes compartidos (`src/app/shared/components/`)

| Componente | Funcionalidad |
|------------|---------------|
| `data-table.tsx` | Tabla generica `DataTable<T>` con columnas configurables, acciones, estado vacio y sort |
| `search-bar.tsx` | Busqueda con debounce de 300ms |
| `pagination.tsx` | Paginacion con selector de tamano de pagina (10/25/50/100) |
| `modal.tsx` | Modal con overlay, boton × y cierre con Escape |
| `confirm-dialog.tsx` | Dialogo de confirmacion (variantes danger/primary) |
| `alert.tsx` | Alertas success/error/warning/info |
| `form-field.tsx` | Wrapper de campo con label, required y error |
| `main-layout.tsx` | Layout con sidebar colapsable, nav de modulos, seccion "Catalogos", logout, header con usuario |

---

## 5. ENDPOINTS CONSUMIDOS

| Metodo | Endpoint | Servicio |
|--------|----------|----------|
| POST | `/auth/login`, `/auth/register`, `/auth/change-password` | auth.service |
| GET | `/auth/me` | auth.service |
| GET | `/PersonalSueno`, `/PersonalSueno/paged` | sueno.service |
| GET | `/Personal`, `/Personal/paged`, `/PersonalCargo`, `/Cargo` | personal.service |
| GET | `/dashboard/resumen` | dashboard.service |
| GET/POST/PUT/DELETE | `/{recurso}`, `/{recurso}/paged` (10 catalogos) | catalog.service |

---

## 6. MODULOS PENDIENTES (a desarrollar)

Los siguientes modulos de la matriz estan **sin implementar** en el frontend nuevo. Solo existen como enlaces "Proximamente" deshabilitados en el sidebar:

| Modulo | Alcance |
|--------|---------|
| 4. Operaciones de Transporte (OP-001 a OP-015) | Registro y gestion de operaciones, equipos, ubicaciones, horarios, carga, flote, convoy, etc. |
| 5. Flota y Equipos (FL-001 a FL-010) | Equipos, combustible, documentos, mantenimiento, llantas, areas |
| 6. Llantas (LL-001 a LL-003) | Registro de llantas, marcas, historial de rotacion |
| 7. Combustible (CB-001 a CB-005) | Combustible, precios, BC, valles de combustible |
| 8. Guia de Remision (GR-001 a GR-004) | Guias, control, detalle, policial |
| 9. Facturacion y Liquidacion (FC-001 a FC-008) | Factura socio, liquidacion, baucher de caja, descuentos |
| 10. Almacen (AL-001 a AL-005) | Almacen, ingresos/egresos, control, impresion |
| 11. Caja Chica (CH-001 a CH-004) | Caja chica y detalle |
| 12. Requerimientos (RR-001 a RR-006) | Requerimientos, control, viaticos |
| 13. Incidentes y Acciones Correctivas (IN-001 a IN-010) | Incidentes, causas, clasificacion, reportes |
| 14. Checklist (CK-001 a CK-002) | Checklist y reporte |
| 15. Capacitacion y Seguridad (CP-001 a CP-007) | Capacitaciones, cursos, COVID, EPP |
| 16. Auditoria - SAC (AU-001 a AU-008) | Programas, auditores, areas, procesos, criterios |
| 17. Documentos (DC-001 a DC-004) | Gestion de documentos, versiones, parametros |
| 18. Reportes (RP-001 a RP-012) | Reportes de viajes, incidentes, mantenimiento, liquidacion, etc. |
| Personal (PE-003 a PE-016 restante) | CRUD de personal, equipos, EPP, correos, licencias, viaticos, contratistas, clientes, etc. |

### Huecos detectados

- `src/app/models/operacion.model.ts` → archivo vacio (placeholder).
- Modulo "DOC. EQUIPOS" → solo existe como boton en el sidebar sin ruta ni pagina.
- `auth.routes.tsx` → definido pero no usado (las rutas auth estan inline en `app.routes`).
- Restos de la plantilla Vite (`src/App.css`, `assets/vite.svg`, `react.svg`) → no usados por la app.
- No existen hooks personalizados, contextos ni stores globales: todo el estado es local.

---

## 7. PROXIMOS PASOS SUGERIDOS

1. Migrar **Modulo 4: Operaciones de Transporte** (OP-001 registro de operaciones) siguiendo el patron del CRUD generico ya existente.
2. Completar **Modulo 2: Personal** con crear/editar/eliminar (actualmente solo listado).
3. Implementar redireccion por rol (SF-006) en el login.
4. Crear el modulo "DOC. EQUIPOS" pendiente en el sidebar.
5. Definir ruta de `auth.routes.tsx` o eliminarla.
6. Completar o eliminar `operacion.model.ts`.

---

*Documento generado el 18/09/2026 a partir del inventario del codigo fuente del frontend-multitrac (React + Vite).*
*Referencia base de requerimientos: `MATRIZ_REQUERIMIENTOS_TRASBALIDAD.md`.*
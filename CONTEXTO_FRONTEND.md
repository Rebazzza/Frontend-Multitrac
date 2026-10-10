# CONTEXTO FRONTEND MULTITRAC — ESTADO ACTUAL

> Documento de contexto del frontend (React + TypeScript + Vite) de ATENTO MULTITRAC.
> Describe **lo que existe y funciona hoy en el código**: stack, estructura, rutas, módulos
> (completos / a medias), capa de core, componentes reutilizables, modelos, endpoints consumidos
> y el contrato con la API.

**Fecha de actualización:** 28/09/2026
**Rama:** `main` · **Último commit:** `45c48eb Nuevas vistass` · **Working tree:** limpio

---

## 1. Estado de verificación

| Comprobación | Resultado |
|---|---|
| `npm run build` (`tsc -b && vite build`) | **OK** — 135 módulos transformados, 0 errores de tipos |
| Bundle generado | `index.js` 359.69 kB (gzip 108.87 kB) · `index.css` 26.12 kB (gzip 4.78 kB) · `logo.png` 202.03 kB |
| `npm run lint` (oxlint) | **1 warning** en `src/app/modules/personal/PersonalFichaPage.tsx:77` (`react/set-state-in-effect`), 0 errores |
| Historial | 4 commits: base de sueño + layout + dashboard → CRUD de catálogos → "Nuevas vistas" |

---

## 2. Stack y tooling

| Elemento | Valor |
|---|---|
| Framework | React 19.2.8 |
| Lenguaje | TypeScript ~6.0.2 |
| Bundler / dev server | Vite 8.2.2 (`@vitejs/plugin-react` 6.1.0) |
| Router | react-router-dom 7.18.3 |
| HTTP | axios 1.20.0 |
| Linter | oxlint 1.79.0 (`.oxlintrc.json`: plugins `react`, `typescript`, `oxc`) |
| Estilos | CSS plano por componente (sin CSS Modules, sin Tailwind) |
| Tests | No hay runner de tests configurado en el proyecto |
| Scripts | `dev`, `build`, `lint`, `preview` |
| Puerto dev | 5173 (Vite por defecto) |
| `baseURL` HTTP | `/api` con proxy a `http://localhost:53927` |

### Proxy (vite.config.ts)

```ts
server: { proxy: { '/api': { target: 'http://localhost:53927', changeOrigin: true, secure: false } } }
```

---

## 3. Estructura de carpetas

```
src/
├── main.tsx                  BrowserRouter + StrictMode + import de estilos globales
├── App.tsx                   Wrapper de AppRoutes
├── App.css / index.css       Restos de la plantilla Vite
├── assets/                   logo.png, hero.png, react.svg, vite.svg
└── app/
    ├── app.routes.tsx        Tabla de rutas raíz
    ├── core/
    │   ├── guards/           auth.guard.tsx
    │   ├── hooks/            use-lookup-maps.ts
    │   ├── interceptors/     jwt.interceptor.ts, error.interceptor.ts
    │   └── services/         http, auth, catalog, personal, personal-documento, sueno, dashboard, equipo-checklist
    ├── models/               27 interfaces de DTO
    ├── modules/
    │   ├── auth/             login, register, change-password (+ login.css)
    │   ├── catalogs/         catalog-config.ts, catalog-page.tsx, catalog-form.tsx, catalog.routes.tsx
    │   ├── checklist/        EquipoChecklistPage + ChecklistFormModal
    │   ├── dashboard/        dashboard.page.tsx
    │   ├── documentos/       PersonalDocumentoPage + PersonalDocumentoFormModal
    │   ├── personal/         PersonalPage + PersonalFichaPage
    │   └── sueno/            SuenoPage + SuenoFormModal
    ├── shared/
    │   ├── components/       data-table, pagination, search-bar, modal, confirm-dialog, alert, form-field
    │   └── layouts/          main-layout.tsx (+ main-layout.css, main-layout-icons.css)
    └── styles/               tokens.css, globals.css
```

---

## 4. Mapa de rutas actual (`app.routes.tsx`)

| Ruta | Vista | Protección |
|---|---|---|
| `/login` | `LoginPage` | pública |
| `/register` | `RegisterPage` | pública |
| `/` (index) | `DashboardPage` | `AuthGuard` + `MainLayout` |
| `/change-password` | `ChangePasswordPage` | `AuthGuard` + `MainLayout` |
| `/sueno` | `SuenoPage` | `AuthGuard` + `MainLayout` |
| `/equipos/checklist` | `EquipoChecklistPage` | `AuthGuard` + `MainLayout` |
| `/personal` | `PersonalPage` | `AuthGuard` + `MainLayout` |
| `/personal/nuevo` | `PersonalFichaPage` (modo alta) | `AuthGuard` + `MainLayout` |
| `/personal/:id` | `PersonalFichaPage` (modo edición) | `AuthGuard` + `MainLayout` |
| `/personal-documentos` | `PersonalDocumentoPage` | `AuthGuard` + `MainLayout` |
| `/catalogos/monedas` | `CatalogPage` (config `monedas`) | `AuthGuard` + `MainLayout` |
| `/catalogos/bancos` | `CatalogPage` (config `bancos`) | `AuthGuard` + `MainLayout` |
| `/catalogos/cargos` | `CatalogPage` (config `cargos`) | `AuthGuard` + `MainLayout` |
| `/catalogos/niveles-educativos` | `CatalogPage` (config `nivelesEducativos`) | `AuthGuard` + `MainLayout` |
| `/catalogos/afps` | `CatalogPage` (config `afps`) | `AuthGuard` + `MainLayout` |
| `/catalogos/flotas` | `CatalogPage` (config `flotas`) | `AuthGuard` + `MainLayout` |
| `/catalogos/actividades` | `CatalogPage` (config `actividades`) | `AuthGuard` + `MainLayout` |
| `/catalogos/turnos` | `CatalogPage` (config `turnos`) | `AuthGuard` + `MainLayout` |
| `/catalogos/tipos-pago` | `CatalogPage` (config `tiposPago`) | `AuthGuard` + `MainLayout` |
| `/catalogos/tipos-ocurrencia` | `CatalogPage` (config `tiposOcurrencia`) | `AuthGuard` + `MainLayout` |

`AuthGuard` envuelve `MainLayout`; `MainLayout` renderiza el `<Outlet />` donde caen las rutas hijas.

---

## 5. Layout y navegación (`MainLayout`)

- **Sidebar colapsable** (botón `<<`), con gradiente propio y logo `logo.png` + título "ATENTO MULTITRAC".
- **Iconos SVG inline** definidos en un diccionario `ICONS` (sin librería de iconos).
- **Menú de módulos** (`MODULE_ITEMS`):
  | Etiqueta | Destino | Tipo |
  |---|---|---|
  | INICIO | `/` | link |
  | SUEÑO | `/sueno` | link |
  | DOC. EQUIPOS | — | botón |
  | PERSONAL | `/personal` | link |
  | DOC. PERSONAL | `/personal-documentos` | link |
  | CAMBIO DE CLAVE | `/change-password` | link |
- **Separador "Catálogos"** + 10 enlaces a los CRUD de catálogos.
- **Header**: avatar con iniciales (2 letras del nombre completo), nombre, y línea `username · rol` (primer rol de `auth_roles`, o "Usuario").
- **"Cerrar Sesión"**: `authService.logout()` + navegación a `/login`.
- Estados activos con clase `sidebar__link--active` vía `NavLink`.

---

## 6. Módulos — estado global

| Módulo | Ruta | Estado | Qué hace |
|---|---|---|---|
| Seguridad / Autenticación | `/login`, `/register`, `/change-password` | **Completo** | Login JWT, registro, cambio de clave, guard, interceptores, logout automático |
| Dashboard | `/` | **Completo** | Resumen del día con 3 métricas + 4 acciones rápidas |
| Sueño | `/sueno` | **Completo** | CRUD paginado de `PersonalSueno` con lookups de empresa/operación |
| Documentos de personal | `/personal-documentos` | **Completo** | CRUD + filtros + detalle + nivel de alerta + paginación cliente |
| Catálogos (10) | `/catalogos/*` | **Completo** | CRUD genérico config-driven con lookups |
| Personal | `/personal`, `/personal/:id` | **A medias** | Lista + ficha de datos generales completos; pestañas Cargo y Equipo con alta y eliminación |

---

### 6.1 Seguridad y Autenticación — **Completo**

**`LoginPage`** (`src/app/modules/auth/login.page.tsx`)
- Campos usuario / contraseña, `autoComplete` nativos, botón "INICIAR SESION" con estado de carga.
- Checkbox "Recordarme la Próxima Vez" → si está activo, prellena el usuario al volver a la página.
- Revisa `response.success` (el backend devuelve HTTP 200 con `success: false` en credenciales inválidas).
- Si `mustChangePassword` viene `true` → navega a `/change-password` con `state: { forced: true, username }`.
- En caso contrario navega a `authService.getPostLoginRoute()`.
- Banner verde de "Usuario registrado correctamente" cuando llega desde `/register` (`location.state.registered`).

**`RegisterPage`** (`register.page.tsx`)
- Usuario, contraseña, nombre completo y correo electrónico.
- Muestra errores por campo leyendo `apiError.validationErrors` (mapeados por nombre de campo: `username`, `password`).
- Éxito → `navigate('/login', { state: { registered: true } })`.

**`ChangePasswordPage`** (`change-password.page.tsx`)
- Contraseña actual / nueva / confirmar, con validación local previa: campos obligatorios, mínimo 6 caracteres y coincidencia de la confirmación.
- Modo `forced`: banner de aviso de política de ciberseguridad (caducidad a 90 días).
- Si la API devuelve token, lo persiste junto con `fullName`, `roles` y `username`; muestra `alert('Su Password ha sido Cambiado!')` y redirige.

**`AuthService`** (`src/app/core/services/auth.service.ts`)
- Operaciones: `login`, `register`, `changePassword`, `getMe`.
- Persistencia: token en `sessionStorage` (sesión normal) o `localStorage` (recordado); claves `auth_token`, `auth_fullname`, `auth_roles`, `auth_username`, `auth_remember`.
- `isAuthenticated()` decodifica el payload del JWT y compara `exp * 1000` contra `Date.now()`.
- `getPostLoginRoute()` resuelve la ruta post-login a partir de los roles almacenados (actualmente ambos caminos devuelven `/`).
- `logout()` limpia las 5 claves.

**Seguridad de ruta**
- `AuthGuard`: si no hay token válido → `Navigate to="/login" replace`.
- `error.interceptor`: ante `401` en cualquier endpoint distinto de `/auth/login` y `/auth/register`, ejecuta `logout()` y `window.location.href = '/login'`.

---

### 6.2 Dashboard — **Completo**

`src/app/modules/dashboard/dashboard.page.tsx`

- Saludo dinámico según la hora ("Buenos días" / "Buenas tardes" / "Buenas noches") + primer nombre del usuario autenticado.
- Fecha del día en locale `es-PE` (día de la semana, día, mes, año).
- `GET /dashboard/resumen` → `DashboardResumen`; tarjetas:
  | Tarjeta | Dato | Acento |
  |---|---|---|
  | Documentos expirados | `documentosExpirados` | danger |
  | Checklists registrados | `checklistsRegistrados` | success |
  | Ingresos de sueño de hoy | `suenosHoy` | warning |
  - Muestra `—` mientras el valor es `null`.
- Acciones rápidas: **Registrar sueño** (→ `/sueno`), **Checklist de equipos** (→ `/equipos/checklist`), **Documentos de equipos** (botón deshabilitado con etiqueta "Próximamente"), **Catálogos** (→ `/catalogos/monedas`).
- `Alert` de error con el mensaje de `ApiError` si el resumen no carga.

---

### 6.3 Módulo Sueño — **Completo**

`src/app/modules/sueno/SuenoPage.tsx` + `SuenoFormModal.tsx`

**Listado**
- Paginación y búsqueda en el servidor (`GET /PersonalSueno/paged`, 25 por página, orden por defecto `fecha desc`).
- Columnas: ID, **Conductor** (nombre completo resuelto contra `GET /Personal`), **Empresa** (lookup `/Empresa`), **Operación** (lookup en cascada: `/OperacionGeneral` → su `idOperacion` → `/Operacion`), Fecha (`dd/mm/aaaa` es-PE), Horas, Observaciones.
- Acciones por fila: **Editar** y **Eliminar**.
- Estados de carga, tabla vacía con mensaje y recarga mediante `reloadKey`.

**Alta / edición**
- Modal con Conductor (select de todo el personal), Fecha (date), Horas de descanso (`type="time"`, recortado a `HH:MM`), Observaciones.
- Validación en el modal: conductor, fecha y horas obligatorias; el error de la API se muestra con `Alert`.
- En edición se envía `{ ...registro, ...valores }` para preservar el resto de campos.

**Eliminación**: `ConfirmDialog` con mensaje de irreversibilidad; al confirmar, `DELETE` + recarga.

---

### 6.4 Documentos de Personal — **Completo**

`src/app/modules/documentos/PersonalDocumentoPage.tsx` + `PersonalDocumentoFormModal.tsx`

**Listado**
- Obtiene la lista completa (`GET /PersonalDocumento`) y trabaja con **paginación en el cliente**.
- Filtros: tipo de documento (desde `/PersonalDocumento/catalogos/documentos`), estado (A/I) y búsqueda de texto sobre conductor, nombre de documento, nro. e ID.
- Columnas: ID, Conductor, Documento, Nro. Documento, Fecha Expedida, **Vencimiento** (badge con nivel) y Estado (badge Activo/Inactivo).

**Nivel de alerta** (función `getNivelAlerta`, a partir de `diasParaVencer`):

| Condición | Nivel | Etiqueta |
|---|---|---|
| `diasParaVencer < 0` o `<= 5` | rojo | Vencido |
| `<= 10` | naranja | Por vencer |
| `<= 30` | amarillo | Próximo |
| `> 30` | verde | Al día |
| Sin vencimiento | gris | Sin vencimiento |

**CRUD**
- Alta/edición con modal: Personal (select del catálogo, filtrando `idPersonal > 0`), Documento (select), Nro. Documento, Fecha expedida, Fecha vencimiento, Estado, Observación. Las fechas se envían como `YYYY-MM-DDT00:00:00`.
- Eliminación con `ConfirmDialog`.
- **Modal de detalle**: `GET /PersonalDocumento/{id}` y muestra Nro. Documento, Archivo (`nombreArchivo`), URL/ruta, Observación y Estado.
- **"Abrir documento"**: `window.open` en pestaña nueva; si la URL no es absoluta (`http/https`) la normaliza (quita `\\` iniciales ybackslash) y la abre como ruta del sitio.

---

### 6.5 Checklist de Equipos — **Completo**

`src/app/modules/checklist/EquipoChecklistPage.tsx` + `ChecklistFormModal.tsx` · ruta `/equipos/checklist`

**Listado**
- Paginación y búsqueda en el servidor (`GET /EquipoChecklist/estado`, 25 por página, orden por defecto `fecha desc`).
- **Es el estado, no la bitácora**: el endpoint lee la vista `EQUIPO_CHECKLIST_V` (pivote sobre `OPERACION_GENERAL_EQUIPO`) y devuelve una fila por (fila de operación, tipo de checklist) que tenga fecha informada. Sin duplicados y con el mismo criterio de conteo que el dashboard. El `/paged` queda como bitácora histórica para reportes.
- Columnas: **Operación** (`#id · descOperacion`), **Tipo** (Mantenimiento / PdP), Equipo (tracto y carreta separados por `/`), **Personal** (nombre completo contra `GET /Personal`), Fecha (`dd/mm/aaaa` es-PE), Hora, Resultado (Conforme / No conforme / —) y Observaciones.
- Sin acción de eliminar: una fila de estado no es eliminable (eliminar la fila de auditoría no borraría el estado, lo que sería engañoso). Para revertir un checklist haría falta una operación explícita de "invalidar", que a la fecha no existe.

**Alta (`ChecklistFormModal`)**
- Campos: Operación (select de `GET /OperacionGeneral`, etiquetado `#id · descOperacion · fecha`), Tipo de checklist (`mantto` = Mantenimiento, `pdp` = Puesta en ruta), Código de equipo, Fecha, Hora, Resultado (Conforme/No conforme/Sin definir), Personal responsable, **Kilometraje**, **Horometro**, Observaciones.
- Kilometraje (`step=0.01`) y Horometro (`step=0.1`) son opcionales; se validan como número antes de enviar y viajan como `null` si están vacíos.
- **Búsqueda de filas**: el botón "Buscar en la operacion" llama `GET /EquipoChecklist/filas?idOperacionGeneral=&codEquipo=`, que devuelve las filas de `OPERACION_GENERAL_EQUIPO` donde el equipo aparece como tracto o carreta (`rolEquipo`).
  - 0 filas → mensaje "El equipo no participa de la operacion seleccionada".
  - 1 fila → se preselecciona.
  - N filas → aparece un select adicional `idOperacionGeneralEquipo` para elegir la fila.
- Al cambiar operación o código de equipo se invalidan las filas ya buscadas.
- Éxito: `Alert` tipo `success` con equipo, rol y operación; la tabla se recarga.
- Errores: el `ApiError` del interceptor se muestra con `Alert` dentro del modal.

**Alcance del registro**
- `POST /EquipoChecklist/registrar` actualiza las columnas del grupo elegido en `OPERACION_GENERAL_EQUIPO` (`CheckListMantto`/`Fecha`/`Hora`/`EqOpe`/`IdPersonal`/`Obs` o su equivalente `PdP`) **e** inserta una fila de auditoría en `EQUIPO_CHECKLIST` con `Id = MAX + 1`, incluyendo Kilometraje y Horometro.
- Si el equipo aparece en más de una fila y no se indica `idOperacionGeneralEquipo`, la API responde `409 Conflict`; el modal evita llegar a ese caso seleccionando la fila.

---

### 6.6 Módulo Personal — **A medias**

`src/app/modules/personal/PersonalPage.tsx` + `PersonalFichaPage.tsx`

**Listado (`PersonalPage`) — completo**
- Paginación, búsqueda y orden en el servidor (`GET /Personal/paged`, 25 por página, orden inicial `apPersonal asc`).
- Filtro Activos / Inactivos / Todos aplicado sobre `statusOp` (`0` = Activo, `1` = Inactivo).
- Columnas: Código (`idPersonal`), Personal (AP + AM + nombres), DNI, Contratista (razón social o AP+AM+nombres del catálogo `/Contratista`), Cargo y Estado con badge.
- El cargo mostrado se deriva de `PersonalCargo`, priorizando el registro vigente (`fechaFinCargo` vacío o ausente).
- Acciones **Ver** y **Editar** (ambas abren la ficha) y botón **Registrar Personal** → `/personal/nuevo`.

**Ficha (`PersonalFichaPage`, ruta compartida alta/edición) — datos generales completo, pestañas a medias**
- Modo determinado por el parámetro: `nuevo` o ausente → alta; `:id` numérico → edición.
- **Pestaña DATOS GENERALES** (31 campos, todos editables y guardados en una sola operación):
  Código, DNI, Apellido Paterno, Apellido Materno, Nombres, Sexo (M/F), Estado Civil (Soltero/Casado/Divorciado/Viudo/Conviviente), Fecha Nacimiento, Fecha Ingreso, Fecha Baja, Estado Personal (0 Activo / 1 Inactivo), Contratista/Empresa (select), Nivel Educativo (select), AFP (select), Fecha Ingreso AFP, Brevete/Licencia, Pasaporte, Celular, Teléfono Fijo, RPC, RPM, Email, Lugar Nacimiento, Lugar Residencia, Dirección, CUSSP, ESSALUD, SCTR, Usuario, Sueldo Bruto.
  - Fechas normalizadas a `YYYY-MM-DD` para el `input[type=date]`.
  - Tras crear, redirige a `/personal/{idPersonal}` del registro devuelto.
- **Pestaña CARGO**: tabla de asignaciones con cargo resuelto, fecha inicio, fecha fin y estado. Botón **Asignar Cargo** → modal (Cargo, Fecha Inicio, Fecha Fin, Estado A/I). Botón **Eliminar** por fila con `ConfirmDialog`.
- **Pestaña EQUIPO**: tabla de asignaciones con código de equipo, fechas y estado. Botón **Asignar Equipo** → modal (Código Equipo, Fecha Inicio, Fecha Fin, ID Reemplazo, Estado A/I). Botón **Eliminar** por fila con `ConfirmDialog`.
- Ambas pestañas muestran estado vacío ("No tiene cargos/equipos asignados") y filtran en cliente por `idPersonal`.
- Estados de carga, `Alert` de error y de éxito, botonera "Volver a la lista" y "Guardar" (visible en la pestaña de datos).
- Catálogos auxiliares cargados en paralelo al montar: `/Contratista`, `/Afp`, `/NivelEducativo`, `/Cargo`, `/PersonalCargo`, `/PersonalEquipo`.

---

### 6.7 Catálogos (10 CRUD) — **Completo**

Motor genérico en `src/app/modules/catalogs/`:

- **`catalog-config.ts`** — fuente única de verdad por recurso: `resource`, `title`, `defaultSort`, `columns`, `fields`, `lookups`, `service`.
- **`catalog.routes.tsx`** — mapea las 10 claves a sus rutas y deriva el `idKey` (`id` + `Resource` capitalizado, ej. `moneda` → `idMoneda`).
- **`catalog-page.tsx`** — vista genérica: búsqueda con debounce (servidor), orden por columna, paginación, `Alert` de error, modal de alta/edición y `ConfirmDialog` de borrado.
- **`catalog-form.tsx`** — formulario generado desde `FieldConfig` (`text` | `number` | `date` | `select`): convierte numéricos con `Number()` y vacíos a `null`, y pinta los errores de validación FluentValidation bajo el campo correspondiente.

| Clave | Ruta | Recurso | Orden por defecto | Columnas | Formulario |
|---|---|---|---|---|---|
| `monedas` | `/catalogos/monedas` | `moneda` | `nombreMoneda` | ID, Nombre, Abreviatura | 2 campos de texto |
| `bancos` | `/catalogos/bancos` | `banco` | `bancoNombre` | ID, Nombre, Observaciones | 2 campos de texto |
| `cargos` | `/catalogos/cargos` | `cargo` | `tituloCargo` | ID, Título, Descripción, Código, Área, Nombre, CER, ADC, Experiencia, Periodo, Observaciones, Control Asistencia | 11 campos (2 numéricos) |
| `nivelesEducativos` | `/catalogos/niveles-educativos` | `niveleducativo` | `descripcionNivelEducativo` | ID, Código Interno, Descripción, Grado Instrucción | Código Interno (número), Descripción, **select** de Grado Instrucción |
| `afps` | `/catalogos/afps` | `afp` | `nomAfp` | ID, Código Excel, Nombre, Comisión, Estado, Observación | 5 campos |
| `flotas` | `/catalogos/flotas` | `flota` | `descFlota` | ID, Descripción, Nivel, Budget, Tipo, Pers/Eq | 5 campos de texto |
| `actividades` | `/catalogos/actividades` | `actividad` | `descripcion` | ID, Descripción | 1 campo |
| `turnos` | `/catalogos/turnos` | `turno` | `posicionTurno` | ID, Contratista, Operación, Posición, Fecha Inicio, Fecha Fin, Estado | **select** Contratista, **select** Operación, Posición, Fechas, Estado |
| `tiposPago` | `/catalogos/tipos-pago` | `tipopago` | `descTipoPago` | ID, Descripción, Observaciones | 2 campos |
| `tiposOcurrencia` | `/catalogos/tipos-ocurrencia` | `tipoocurrencia` | `tipoOcurrenciaNombre` | ID, Nombre, Observaciones | 2 campos |

**Lookups declarados** (resuelven la FK a texto en la tabla y convierten el campo del formulario en `select`):

| Catálogo | Columna FK | Origen | Campos de nombre |
|---|---|---|---|
| `nivelesEducativos` | `idGradoInstruccion` | `/GradoInstruccion` | `descripcionGradoInstruccion`, `gradoInstruccion` |
| `turnos` | `idContratista` | `/Contratista` | `razonSocialContratista`, `nomContratista`, `socio` |
| `turnos` | `idOperacion` | `/Operacion` | `descOperacion` |

---

## 7. Capa core

### Servicios (`src/app/core/services/`)

| Servicio | Endpoints | Métodos |
|---|---|---|
| `http.service.ts` | — | Instancia axios (`baseURL: '/api'`, JSON) con los interceptores aplicados |
| `auth.service.ts` | `/auth/*` | `login`, `register`, `changePassword`, `getMe` + persistencia de sesión y `logout` |
| `catalog.service.ts` | `/{recurso}` | Factory `createCatalogService<T>(resource)` → `getAll`, `getPaged`, `getById`, `create`, `update`, `remove` |
| `personal.service.ts` | `/Personal`, `/PersonalCargo`, `/PersonalEquipo`, `/Contratista`, `/Cargo`, `/Afp`, `/NivelEducativo` | `getPaged`, `getAll`, `getById`, `create`, `update`, `remove`, `getCargosPersonal`, `getCargos`, `getContratistas`, `getAfps`, `getNivelesEducativos`, `getPersonalEquipos`, `create/update/removePersonalCargo`, `create/update/removePersonalEquipo` |
| `personal-documento.service.ts` | `/PersonalDocumento` | `getAll(filtro)`, `getById`, `create`, `update`, `remove`, `getCatalogoDocumentos(tipo?)`, `getCatalogoPersonales`, `getCatalogoEstados` |
| `sueno.service.ts` | `/PersonalSueno` | `getPaged`, `create`, `update`, `remove` |
| `dashboard.service.ts` | `/dashboard/resumen` | `getResumen` |

### Interceptores

- **`jwt.interceptor.ts`** — añade `Authorization: Bearer <token>` a cada petición usando `authService.getToken()`. Exporta la constante `TOKEN_KEY = 'auth_token'`.
- **`error.interceptor.ts`** — normaliza cualquier fallo al tipo `ApiError { status, message, timestamp, validationErrors? }`:
  - Sin respuesta del servidor → `status: 0` y mensaje "Error de conexión. Verifique su red.".
  - `400` con `message` que es JSON → `JSON.parse` a `validationErrors` (`Record<string, string[]>`) y mensaje "Error de validación".
  - `401` (salvo `/auth/login` y `/auth/register`) → `logout()` + redirect duro a `/login`.

### Guard

- **`auth.guard.tsx`** — componente de ruta que valida `authService.isAuthenticated()` y redirige a `/login`.

### Hook

- **`use-lookup-maps.ts`**
  - `useLookupMaps(specs: LookupSpec[])` → `{ maps, loading }`. Recibe `{ key, resource, idField }[]`, descarga los recursos **en paralelo** con `Promise.all` y devuelve un `Map<number, registro>` por clave. Tolera respuestas envueltas en `{ value: [...] }` y limpia el mapa si un recurso falla.
  - `pickName(record, nameFields[])` → primer valor no vacío entre los campos indicados, descartando guiones y textos tipo "Seleccione...".
  - Re-descarga solo cuando cambia la firma de los specs.

---

## 8. Componentes compartidos

| Componente | Props / API | Comportamiento |
|---|---|---|
| `data-table.tsx` | `columns: Column<T>[]`, `data`, `onView?`, `onEdit?`, `onDelete?`, `onSort?`, `sortBy?`, `sortDirection?`, `emptyMessage?` | Tabla genérica; `Column<T>` acepta `render?` y `sortable?`; columna de acciones condicional; fila de mensaje vacío con `colSpan` correcto |
| `pagination.tsx` | `page`, `totalPages`, `hasPrevious`, `hasNext`, `pageSize?`, `onPageSizeChange?`, `onPageChange` | Flechas SVG, indicador "X de Y" y selector de tamaño (10/25/50/100) |
| `search-bar.tsx` | `onSearch`, `placeholder?`, `debounceMs?` (300 por defecto) | Debounce con `useRef` para no re-disparar el efecto en cada render; no dispara en el primer render |
| `modal.tsx` | `isOpen`, `title`, `onClose`, `children` | Overlay, cierra con `Escape` y con clic fuera; no renderiza cuando `isOpen` es `false` |
| `confirm-dialog.tsx` | `isOpen`, `title`, `message`, `confirmLabel?`, `cancelLabel?`, `variant?` (`danger` \| `primary`) | Encapsulado sobre `Modal` |
| `alert.tsx` | `type` (`success`\|`error`\|`warning`\|`info`), `message`, `onClose?` | Variantes por clase `alert--*` |
| `form-field.tsx` | `label`, `name`, `error?`, `required?`, `children` | Wrapper con `htmlFor`, asterisco de requerido y mensaje de error |

Cada componente importa su propio `.css` (mismo nombre, en la misma carpeta).

---

## 9. Modelos (`src/app/models/`)

| Archivo | Contenido |
|---|---|
| `auth-response.model.ts` | `AuthResponse` (`success`, `token`, `expiration`, `username`, `fullName`, `email`, `roles`, `mustChangePassword?`, `message`) |
| `credentials.model.ts` | `Credentials`, `RegisterCredentials`, `ChangePasswordCredentials` |
| `usuario.model.ts` | `UsuarioDto` (`id`, `username`, `fullName`, `email`, `roles`, `isActive`) |
| `paged-params.model.ts` | `PagedParams` (`page`, `pageSize`, `search`, `sortBy`, `sortDirection`) |
| `paged-response.model.ts` | `PagedResponse<T>` (`items`, `totalCount`, `page`, `pageSize`, `totalPages`, `hasPrevious`, `hasNext`) |
| `error-response.model.ts` | `ErrorResponse` (`status`, `message`, `timestamp`) |
| `validation-error.model.ts` | `ValidationError = Record<string, string[]>` |
| `dashboard.model.ts` | `DashboardResumen` |
| `personal.model.ts` | `Personal` (~40 campos de la tabla PERSONAL) |
| `personal-cargo.model.ts` | `PersonalCargo` |
| `personal-equipo.model.ts` | `PersonalEquipo` |
| `personal-sueno.model.ts` | `PersonalSueno` |
| `personal-documento.model.ts` | `PersonalDocumentoDto`, `PersonalDocumentoListadoDto`, `PersonalDocumentoFiltro`, `CatalogoPersonalDocumento`, `CatalogoPersonalPersonal`, `CatalogoEstadoDocumento` |
| `contratista.model.ts` | `Contratista` |
| `equipo-checklist.model.ts` | `EquipoChecklist` (bitácora), `EquipoChecklistEstado` (estado actual, desde la vista), `ChecklistOperacionEquipoRow`, `ChecklistTipo`, `ChecklistRegistroPayload`, `ChecklistRegistroResponse` |
| `operacion.model.ts` | `Operacion`, `OperacionGeneral`, `OperacionGeneralEquipo` |
| `moneda`, `banco`, `cargo`, `nivel-educativo`, `afp`, `flota`, `actividad`, `turno`, `tipo-pago`, `tipo-ocurrencia` | Interfaces de los 10 catálogos |

---

## 10. Endpoints consumidos por el frontend

| Método | Endpoint | Consumido por |
|---|---|---|
| POST | `/api/auth/login` | `auth.service.login` |
| POST | `/api/auth/register` | `auth.service.register` |
| POST | `/api/auth/change-password` | `auth.service.changePassword` |
| GET | `/api/auth/me` | `auth.service.getMe` |
| GET | `/api/dashboard/resumen` | `dashboard.service` |
| GET | `/api/Personal`, `/api/Personal/paged`, `/api/Personal/{id}` | `personal.service` |
| POST/PUT/DELETE | `/api/Personal`, `/api/Personal/{id}` | `personal.service` |
| GET | `/api/PersonalCargo` (+ POST/PUT/DELETE `/{id}`) | `personal.service` |
| GET | `/api/PersonalEquipo` (+ POST/PUT/DELETE `/{id}`) | `personal.service` |
| GET | `/api/Contratista`, `/api/Cargo`, `/api/Afp`, `/api/NivelEducativo` | `personal.service`, lookups |
| GET | `/api/PersonalSueno/paged` | `sueno.service.getPaged` |
| POST/PUT/DELETE | `/api/PersonalSueno`, `/api/PersonalSueno/{id}` | `sueno.service` |
| GET | `/api/PersonalDocumento`, `/api/PersonalDocumento/{id}` | `personal-documento.service` |
| POST/PUT/DELETE | `/api/PersonalDocumento`, `/api/PersonalDocumento/{id}` | `personal-documento.service` |
| GET | `/api/PersonalDocumento/catalogos/documentos` | `personal-documento.service` |
| GET | `/api/PersonalDocumento/catalogos/personales` | `personal-documento.service` |
| GET | `/api/PersonalDocumento/catalogos/estados` | `personal-documento.service` |
| GET | `/api/Empresa`, `/api/Operacion`, `/api/OperacionGeneral` | `useLookupMaps` (módulo Sueño), Checklist |
| GET | `/api/EquipoChecklist/estado` (paged) | `equipo-checklist.service.getEstadoPaged` |
| GET | `/api/EquipoChecklist/paged` | bitácora de auditoría (no la usa la pantalla) |
| GET | `/api/EquipoChecklist/filas?idOperacionGeneral=&codEquipo=` | `equipo-checklist.service.getFilas` |
| POST | `/api/EquipoChecklist/registrar` | `equipo-checklist.service.registrar` |
| GET | `/api/GradoInstruccion` | `useLookupMaps` (niveles educativos) |
| GET/POST/PUT/DELETE | `/api/{moneda,banco,cargo,niveleducativo,afp,flota,actividad,turno,tipopago,tipoocurrencia}` y `/paged` | `catalog.service` |

---

## 11. Contrato con la API

### Autenticación

Todos los endpoints requieren token; sin él la API responde `401`. El token viaja como `Authorization: Bearer <token>`.

| Endpoint | Método | Body | Respuesta |
|---|---|---|---|
| `/api/auth/login` | POST | `{ username, password }` | `AuthResponse` |
| `/api/auth/register` | POST | `{ username, password, fullName?, email? }` | `AuthResponse` |
| `/api/auth/change-password` | POST | `{ currentPassword, newPassword }` | `AuthResponse` |
| `/api/auth/me` | GET | — | `UsuarioDto` |

**Comportamiento ya contemplado por el frontend**: el login devuelve **HTTP 200 con `success: false`** cuando las credenciales son inválidas o el usuario está desactivado; por eso `login.page.tsx` valida `response.success` antes de navegar.

### Formato de error

```jsonc
{ "status": 404, "message": "...", "timestamp": "2026-..." }
```

Códigos manejados: `400` (validación FluentValidation — `message` es un **string JSON** `{ "campo": ["mensaje"] }`), `401`, `403`, `404`, `409` (conflicto por dependencias al borrar), `500`.

El `error.interceptor` ya traduce ese `message` JSON a `ApiError.validationErrors`, que los formularios consumen para pintar el error bajo cada campo.

### Paginación

- Request: `page` (1), `pageSize` (50 en backend / 25 por defecto en el frontend), `search`, `sortBy`, `sortDirection` (`asc`/`desc`).
- Response:

```jsonc
{
  "items": [ ... ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 50,
  "totalPages": 3,
  "hasPrevious": false,
  "hasNext": true
}
```

### Catálogos CRUD (patrón uniforme, PK `int`)

| Método | Ruta |
|---|---|
| GET | `/api/{recurso}` |
| GET | `/api/{recurso}/paged?page=&pageSize=&search=&sortBy=&sortDirection=` |
| GET | `/api/{recurso}/{id}` |
| POST | `/api/{recurso}` |
| PUT | `/api/{recurso}/{id}` |
| DELETE | `/api/{recurso}/{id}` |

Campos por recurso (los mismos que usa `catalog-config.ts`):

1. `moneda` → `{ idMoneda, nombreMoneda?, abreviaturaMoneda? }`
2. `banco` → `{ idBanco, bancoNombre?, observaciones? }`
3. `cargo` → `{ idCargo, tituloCargo?, descripcionCargo?, crgCod?, areCod?, crgNom?, crgCer?, crgAdc?, crgExp?, crgPer?, crgObs?, ctrlAsist? }`
4. `niveleducativo` → `{ idNivelEducativo, codInterno?, descripcionNivelEducativo?, idGradoInstruccion? }`
5. `afp` → `{ idAfp, codigoExcel?, nomAfp?, comision?, estado?, observacion? }`
6. `flota` → `{ idFlota, descFlota?, nivel?, budget?, tipo?, persEq? }`
7. `actividad` → `{ idActividad, descripcion? }`
8. `turno` → `{ idTurno, idContratista, idOperacion, posicionTurno?, fechInicTurno?, fechFinTurno?, estado? }`
9. `tipopago` → `{ idTipoPago, descTipoPago?, observaciones? }`
10. `tipoocurrencia` → `{ idTipoOcurrencia, tipoOcurrenciaNombre?, observaciones? }`

Swagger está disponible solo si la API se levanta con `Environment=Development`.

---

## 12. Sistema de estilos

- **Tema oscuro** definido por completo en `src/app/styles/tokens.css`: paleta navy (`#0b131f` fondo, `#172739` tarjetas, `#1662a7` primario, `#f3b312` warning), degradados de sidebar/header/avatar, tipografías, radios, sombras y escala de espaciado.
- `src/app/styles/globals.css` importa los tokens y define el `outline` de foco, el tratamiento de `select` nativo con `color-scheme: dark` y las clases globales de botones (`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--danger`, `.btn--sm`).
- CSS plano importado desde cada componente: `data-table.css`, `pagination.css`, `search-bar.css`, `modal.css`, `confirm-dialog.css`, `alert.css`, `form-field.css`, `main-layout.css`, `main-layout-icons.css`, `login.css`, `dashboard.css`, `catalog-page.css`, `catalog-form.css`, `PersonalPage.css`, `PersonalFichaPage.css`, `SuenoPage.css`, `PersonalDocumentoPage.css`.
- Tipografías cargadas por CDN en `index.html`: *Inclusive Sans* (display) e *Instrument Sans* (body).
- `index.html`: `lang="es"`, título **ATENTO MULTITRAC**, favicon `/favicon.png`.

---

## 13. Patrones establecidos para extender el frontend

1. **Un CRUD nuevo = una entrada en `catalogConfigs`.** Se declara `resource`, `title`, `defaultSort`, `columns`, `fields`, `lookups` y `service`; la ruta se agrega en `ROUTE_PATHS` y el enlace en `CATALOG_ITEMS`. `CatalogPage` + `CatalogForm` hacen el resto (listado, búsqueda, orden, paginación, alta, edición, borrado, errores de validación por campo).
2. **FK a texto = `lookups`.** Con `column`, `resource`, `idField`, `nameFields`, `header` y `fieldLabel`; el mismo dato sirve para pintar la columna de la tabla y para generar el `select` del formulario.
3. **Listas paginadas**: el patrón es `PagedParams` en estado → `useEffect` con bandera `cancelled` → `DataTable` + `Pagination` + `SearchBar`, con `reloadKey` para forzar la recarga tras un alta/edición/borrado.
4. **Errores**: siempre se captura como `ApiError` (`err as ApiError`) y se muestra en un `Alert` con `onClose`.
5. **Eliminaciones**: siempre con `ConfirmDialog` y recarga posterior.
6. **Nombres legibles de FK**: `pickName()` + `useLookupMaps` cuando el recurso externo no tiene vista; `Map<number, registro>` memoizado cuando el dato viene con la página.
7. **Estado**: 100% local por página (`useState`). No hay contexto global, store ni librería de estado.

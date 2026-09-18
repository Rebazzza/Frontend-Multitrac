# BACKEND MULTITRAC — GUÍA PARA EL DESARROLLO DEL FRONTEND

> Documento de contexto para que el chat/equipo de frontend pueda iniciar el desarrollo sin tener que investigar el backend desde cero.
> Solo para lectura: cómo arrancar, autenticación, formatos de respuesta/error y el alcance inicial de catálogos.

---

## 1. Estado y arranque

**El backend está TERMINADO y verificado**: compila con 0 errores, 11/11 tests pasan (5 unit + 6 integration), y la API queda corriendo en `http://localhost:53927`.

### Cómo arrancarlo (importante)

```powershell
Start-Process dotnet -ArgumentList `
  "C:\Users\ASUS\Documents\Multitrac\Multitrac\MultiTrac.Api\src\Multitrac.Api\bin\Release\net10.0\Multitrac.Api.dll", "--urls", "http://localhost:53927" `
  -WorkingDirectory "C:\Users\ASUS\Documents\Multitrac\Multitrac\MultiTrac.Api\src\Multitrac.Api" `
  -WindowStyle Hidden
```

> ⚠️ **CRÍTICO**: el `-WorkingDirectory` debe ser `src\Multitrac.Api`. Si se lanza desde otra carpeta, ASP.NET no encuentra `appsettings.json`, la ConnectionString queda vacía y la API falla con "No se ha inicializado la propiedad ConnectionString".

> ⚠️ La BD `BDMultitrac` está en **modo SINGLE_USER**: solo admite una conexión a la vez. Mientras la API corre, otras conexiones (sqlcmd, etc.) fallan. Para tareas directas de BD hay que detener la API primero.

### Arranque del frontend
El `vite.config.ts` ya tiene el proxy `/api` → `http://localhost:53927`.

### CORS
La API tiene habilitado CORS para `http://localhost:5173` y `http://localhost:3000`.

---

## 2. Autenticación (JWT)

**TODOS los endpoints requieren token** (auth global). Sin token → `401`.

| Endpoint | Método | Body | Respuesta |
|---|---|---|---|
| `/api/auth/login` | POST | `{ "username", "password" }` | `AuthResponse` |
| `/api/auth/register` | POST | `{ "username", "password", "fullName?, email? }` | `AuthResponse` |
| `/api/auth/change-password` | POST | `{ "currentPassword", "newPassword" }` (requiere token) | `AuthResponse` |
| `/api/auth/me` | GET | — | `UsuarioDto` |

**Datos de prueba**: `testuser` / `Test@123`

### ⚠️ DETALLE CRÍTICO — login no devuelve 401 en credenciales inválidas
`AuthService.LoginAsync` devuelve **HTTP 200** con `AuthResponse` y `success: false` cuando las credenciales son incorrectas o el usuario está desactivado. El frontend **debe revisar `data.success`** (y que exista `data.token`) antes de considerar el login exitoso. **No asumir que HTTP 200 = autenticado.**

### Formato de `AuthResponse` (backend)
```jsonc
{
  "success": true,          // bool — <-- REVISAR ESTO SIEMPRE
  "token": "eyJ...",
  "expiration": "2026-09-04T...Z",  // DateTime (UTC, +8h)
  "username": "testuser",
  "fullName": "...",
  "roles": ["User"],
  "message": "Login exitoso"
}
```

El `auth.service.ts` existente del frontend usa el modelo `{ token, expiration, username }` — compatible (subconjunto del real).

### Envío del token
`Authorization: Bearer <token>`

El frontend ya tiene un `jwt.interceptor.ts` que inyecta el token automáticamente en los requests de axios.

---

## 3. Formato de errores (middleware)

Todos los errores controlados devuelven **JSON con camelCase**:
```jsonc
{
  "status": 404,          // código HTTP
  "message": "...",
  "timestamp": "2026-..."
}
```

Códigos que puede devolver:
- `400 BadRequest` — bad request o **validación FluentValidation** (en este caso `message` contiene un JSON de errores: key → array de mensajes)
- `401 Unauthorized` — sin token / sesión inválida
- `403 Forbidden`
- `404 NotFound` — recurso no existe
- `409 Conflict` — violación de integridad / conflicto (p. ej. DELETE de registro con dependencias)
- `500 InternalServerError` — error inesperado (`message: "An unexpected error occurred."`)

> Para validación (`400`), `message` es un **string JSON** del estilo `{"campo":["mensaje 1","mensaje 2"],...}`. Habrá que `JSON.parse(message)` para mostrarlos en el formulario.

---

## 4. Catálogos simples (el alcance inicial del frontend) — 10 recursos CRUD

Todos siguen el **mismo patrón de endpoints** con PK tipo `int`:

| Método | Ruta | Uso |
|---|---|---|
| GET | `/api/{recurso}` | Listar todos |
| GET | `/api/{recurso}/paged?page=&pageSize=&search=&sortBy=&sortDirection=` | Paginado + búsqueda + orden |
| GET | `/api/{recurso}/{id}` | Obtener uno por id |
| POST | `/api/{recurso}` | Crear (body = DTO sin id) |
| PUT | `/api/{recurso}/{id}` | Actualizar (body = DTO completo) |
| DELETE | `/api/{recurso}/{id}` | Borrar |

### Paginación — request
`page` (default 1), `pageSize` (default 50), `search` (filtra columnas string), `sortBy` (nombre de propiedad), `sortDirection` (`asc` / `desc`).

### Paginación — response
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

### Recursos y sus campos

1. **`/api/moneda`** — `{ idMoneda: int, nombreMoneda?, abreviaturaMoneda? }`
2. **`/api/banco`** — `{ idBanco: int, bancoNombre?, observaciones? }`
3. **`/api/cargo`** — `{ idCargo: int, tituloCargo?, descripcionCargo?, crgCod?, areCod?, crgNom?, crgCer?, crgAdc?, crgExp?, crgPer?, crgObs?, ctrlAsist? }`
4. **`/api/niveleducativo`** — `{ idNivelEducativo: int, codInterno?, descripcionNivelEducativo?, idGradoInstruccion? }`
5. **`/api/afp`** — `{ idAfp: int, codigoExcel?, nomAfp?, comision?, estado?, observacion? }`
6. **`/api/flota`** — `{ idFlota: int, descFlota?, nivel?, budget?, tipo?, persEq? }`
7. **`/api/actividad`** — `{ idActividad: int, descripcion? }`
8. **`/api/turno`** — `{ idTurno: int, idContratista: int, idOperacion: int, posicionTurno?, fechInicTurno?, fechFinTurno?, estado? }`
9. **`/api/tipopago`** — `{ idTipoPago: int, descTipoPago?, observaciones? }`
10. **`/api/tipoocurrencia`** — `{ idTipoOcurrencia: int, tipoOcurrenciaNombre?, observaciones? }`

> **Nota sobre `{id}`**: los `id` se envían como `int`. En POST el id lo genera la BD (identity); no hace falta mandarlo (o va en `0`).

---

## 5. Recursos con PK especiales (para fases futuras, NO para catálogos)

Se verificó contra la BD real que `PROVEEDOR`, `AREA` y `TIPO_DOCUMENTO` tienen PK **`int`** (`PRV_COD`, `ARE_COD`, `TIP_COD`), por lo que sus controllers con `int id` **funcionan correctamente**. No hay endpoints con PK de texto rotos.

- **`/api/equipo`** → PK **compuesta de texto**: `GET/PUT/DELETE /api/equipo/{tipoEquipo}/{codEquipo}` (ej. `/api/equipo/T/MOT101`). Usa rutas compuestas (interfaz propia `IEquipoService`).
- El resto de recursos de negocio (personal, operaciones, equipo-related, contabilidad, cliente/proveedor) siguen el patrón CRUD `int` estándar.

---

## 6. Endpoints adicionales útiles

- **Swagger**: solo disponible si la API se arranca con `Environment=Development`. Hoy corre en `Production` → sin Swagger. Para explorar los JSON de los demás módulos, hacer GET autenticados a sus endpoints (ej. `/api/operacion`, `/api/personal`, `/api/equipo`).

---

## 7. Recomendaciones de arquitectura para el frontend

El frontend ya tiene la base en `src/app/core/`:
- `http.service.ts` (axios, baseURL `/api`)
- `jwt.interceptor.ts` (inyecta token automáticamente)
- `auth.service.ts` (login/logout, token en localStorage)
- `auth.guard.tsx` (protección de rutas)

**Sugerencia**: crear un **servicio de catálogo genérico** en TS que reciba el nombre del recurso y exponga `getAll`, `getPaged`, `getById`, `create`, `update`, `delete` — los 10 catálogos son idénticos en forma y así se evita duplicar 10 servicios.

Tipar los DTOs como `interface` en `src/app/models/` (ej. `Moneda { idMoneda: number, ... }`).

> Nota: `src/app/models/operacion.model.ts` está vacío (placeholder) — completarlo o borrarlo en la fase de operaciones.

---

## 8. Rutas de archivos relevantes del backend

| Qué es | Ruta (relativa a `MultiTrac.Api\`) |
|---|---|
| Programa principal (DI, JWT, CORS, middleware) | `src\Multitrac.Api\Program.cs` |
| DTOs de catálogos | `src\Multitrac.Application\DTOs\CatalogDtos.cs` |
| DTOs de auth | `src\Multitrac.Application\DTOs\AuthDtos.cs` |
| DTOs de paginación | `src\Multitrac.Application\DTOs\PaginationDtos.cs` |
| Servicio base (paginación, búsqueda, ids) | `src\Multitrac.Application\Services\ServiceBase.cs` |
| Middleware de errores | `src\Multitrac.Api\Middleware\ExceptionHandlingMiddleware.cs` |
| Servicio de auth (login/JWT) | `src\Multitrac.Api\Services\AuthService.cs` |
| Controller de ejemplo (patrón catálogo) | `src\Multitrac.Api\Controllers\MonedaController.cs` |
| Configuración de la API | `src\Multitrac.Api\appsettings.json` |

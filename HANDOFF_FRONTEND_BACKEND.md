# Multitrac — Contexto obligatorio para Frontend y Backend

> Documento de traspaso. **Léelo antes de tocar cualquier cosa.**
> Todo lo de aquí está verificado contra las bases de datos reales en fecha 2026-09-30.
> Si un dato de este documento contradice lo que ves, es probable que estés leyendo un archivo obsoleto: confirma con las consultas de la §9.

---

## 1. Qué es este proyecto y qué estamos haciendo

- **Multitrac** es una aplicación web ASP.NET clásica (Web Forms, .NET Framework, SQL Server) para gestión de operaciones de transporte.
- Estamos trabajando sobre una **copia local**. El sistema original está desplegado en un **servidor en otra máquina**.
- El flujo es: **modificamos aquí → probamos aquí → desplegamos en el servidor original.**
- **No hay base de datos desplegada en el servidor original en este workspace.** Solo tenemos copias locales.

### Consecuencia práctica

Cualquier cosa que agregues debe ser **reversible y desplegable sin romper el servidor original**. Si creas una tabla, un SP o un archivo nuevo, alguien tiene que saber que tiene que subirlo también.

---

## 2. Estado real de las bases de datos

### 2.1 Las 2 que tenemos (adjuntas a `.\SQLEXPRESS`)

| Base | Tablas | Vistas | SPs | Funciones | Triggers | Recovery |
|---|---|---|---|---|---|---|
| `BDMultitrac` | 423 | 121 | 3 190 | 465 | 13 | SIMPLE |
| `BDAlertasMultitrac` | 27 | 13 | 104 | 0 | 0 | FULL |

Instancia: `REBAZA\SQLEXPRESS` — SQL Server 2016 SP1 Express 64-bit (16.0.1000.6). Creadas el 2026-09-01.

### 2.2 Las 4 que NO tenemos

| Base | Alias | Criticidad |
|---|---|---|
| `BdNava00` | `cnxNavaSoft`, `cnxNS` | **Crítica** — contabilidad NavaSoft |
| `NOI` | `cnxpp` | **Crítica** — entidad `NOI` + script `NOI.sql` |
| `E2045369382209.mdb` | `cnxCont` | **Crítica** — Access, ruta inexistente |
| `BDPresupuesto` | `ppnativo` | **Sin uso real** — 0 referencias en código, ignórala |

**Consecuencia:** todo el código que use `cnxNavaSoft`, `cnxNS`, `cnxpp` o `cnxCont` **no se puede probar localmente**. Fallará con error de conexión. No es un bug tuyo.

### 2.3 Las dos bases que tenemos están acopladas

- **55 módulos de `BDMultitrac` referencian a `BDAlertasMultitrac`** (37 SP, 7 funciones, 5 triggers, 4 vistas, 2 TVF).
- **13 módulos de `BDAlertasMultitrac` referencian a `BDMultitrac`** (9 SP, 3 vistas, 1 función).
- `BdNava00`, `NOI` y el Access: **0 referencias desde el lado BD**. Se acceden solo desde código.

> **REGLA:** nunca restaures ni despliegues una de las dos bases sin la otra. Se rompen mutuamente.

---

## 3. Reglas de oro (aplican a ambos equipos)

1. **El repositorio NO tiene el esquema de la base.** Cero `CREATE TABLE`, cero `CREATE VIEW`. Los 32 archivos `.sql` del repo cubren solo 289 de los 3 190 procedimientos desplegados (9 %).
2. **Para agregar una tabla o un SP, tienes que crearlos a mano en la base.** No hay script que los genere.
3. **No confíes en los nombres de archivo.** 6 de los 32 `.sql` del proyecto de identidad (`NOI.sql`, `procedure.sql`) **pertenecen a otras bases** y nunca se ejecutaron contra `BDMultitrac`.
4. **`BdNava00` y `NOI` no se pueden probar localmente.** Si tu cambio las toca, documéntalo para que se valide en el servidor original.
5. **Nada de cambios destructivos sin copia.** Ni `DROP`, ni `TRUNCATE`, ni `ALTER` sobre columnas existentes. El servidor original es la única fuente de datos reales.

---

# PARTE BACKEND

## 4. Cómo se resuelve la base de datos

**Dato clave: los 227 repositorios usan el constructor por defecto.**

```csharp
public class ALMACENRepository : Repository<ALMACEN>, IALMACENRepository
{
    // Sin base(databaseName) -> usa la base por defecto de Enterprise Library
}
```

Verifiqué que **cero** repositorios pasan un nombre de base. Todos van a `cnx` → `BDMultitrac`.

> **REGLA:** si creas un repositorio nuevo, **no le pases nombre de base**. Se resolverá a `BDMultitrac` automáticamente, que es lo correcto. Si le pasas un nombre distinto, romperás la resolución.

`OperacionesDAL\App.config` declara `ppnativo` → `BDPresupuesto`, pero **cero archivos `.cs` la usan**. Es configuración muerta. No la toques, no la borres (podría usarse desde un componente nativo que no tenemos).

## 5. Convenciones de nombres que debes respetar

El proyecto usa **Microsoft Patterns & Practices Repository Factory**. Los nombres no son decorativos: los genera automáticamente.

| Operación | Patrón | Ejemplo |
|---|---|---|
| Obtener uno | `Get<TABLA>By<Criterio>` | `GetALMACENByIdAlmacen` |
| Obtener todos | `GetAllFrom<TABLA>` | `GetAllFromALMACEN` |
| Crear | `Insert<TABLA>` | `InsertALMACEN` |
| Actualizar | `Update<TABLA>` | `UpdateALMACEN` |
| Borrar | `Delete<TABLA>` | `DeleteALMACEN` |
| Personalizado | `SP_<TABLA>_<Acción>` | `SP_ALMACEN_EGRESOS_List` |
| Vista | `GetVIEW_<NOMBRE>...` | `GetVIEW_OPERACIONByIdOperacionGeneral` |

> **REGLA:** el nombre del SP **debe** derivar del nombre de la tabla. Si te inventas un nombre, el generador de entidades y el DAL dejan de entenderse.

## 6. Los 2 módulos rotos (tabla inexistente)

Estos módulos tienen código que las invoca, pero **la tabla no existe en ninguna base**:

### `OPERACION_UBICACION_OP` — 7 SPs

`GetAllFromOPERACION_UBICACION_OP`, `InsertOPERACION_UBICACION_OP`, `UpdateOPERACION_UBICACION_OP`, `DeleteOPERACION_UBICACION_OP`, `GetOPERACIONIdOperacionByIdOperacionGeneralEquipo`, `GetUBICACION_OPById_Ubicacion`, y los 2 `GetAllFrom..._Order` de CONTACTO.

### `cgm01022011` — 4 SPs

`GetAllFromcgm01022011`, `Insertcgm01022011`, `Updatecgm01022011`, `Deletecgm01022011`

Junto con `CGM0102` y `SP_CGM0102_NextComproByOrigenAndByAnioAndByMes`, es un **módulo de comprobantes de 2011 nunca desplegado**.

> Si tu trabajo toca estos módulos, primero confirma si el código es alcanzable desde alguna pantalla. Si es código muerto, bórralo en vez de crear la tabla.

## 7. Los 47 procedimientos ausentes de la base

A diferencia de los 1 646 que sí están, estos 47 **no existen ni en el repo ni en la base**. Agrupados:

| Módulo | SPs | ¿Tabla existe? |
|---|---|---|
| `OPERACION_UBICACION_OP` | 7 | **No** |
| `cgm01022011` | 4 | **No** |
| COVID | 4 | **Sí** — migración a medias |
| Berlingas / descuentos (`BC_DESCUENTO_COMISION`, `BC_EXAMEN_MEDICO`) | 7 | **Sí** |
| Almacén (`SP_ALMACEN_*_List`) | 3 | **Sí** |
| Baucher (Costo, IdMoneda) | 4 | **Sí** |
| Catálogos y lookups (`CAUSA*`, `EMPRESA*`, `Tr`, `mst01cli`) | 13 | Parcial |
| Requerimientos / Viáticos | 3 | **Sí** |
| Guías / Contratistas | 2 | **Sí** |

**Las correcciones más baratas son COVID, Almacén y Berlingas:** las tablas ya existen, solo faltan los SPs de consulta. Lista completa: `%TEMP%\opencode\sp_ausentes_de_bd.txt`

## 8. Trampas de nomenclatura en el modelo

### 8.1 El sufijo `_01` es basura de autogeneración

`LOCAL_01` aparece en los scripts como si fuera una tabla. **No existe en la base.** Es el rastro de Repository Factory cuando no sabe qué tabla usar. No la crees.

### 8.2 Hay entidades que en realidad son vistas

| Entidad | Realidad |
|---|---|
| `VIEW_DISPATCH_MANTTO` | Es una **vista** (existe en `BDMultitrac`) |
| `VIEW_PERSONAL_List` | Es una **vista** (existe en `BDMultitrac`) |

Funcionan porque la vista existe, pero **no puedes hacer `INSERT` ni `UPDATE` sobre ellas.** Si un módulo necesita escribir, necesita una tabla.

### 8.3 Una interfaz de repositorio está en el proyecto equivocado

`IEQUIPO_MANTTO_LLANTARepository` está en **`OperacionesIdentity`** (proyecto de entidades), cuando debería estar en `OperacionesDAL`. No es una entidad. Si agregas un `DROP` o reorganization, cuidado con esto.

### 8.4 Tablas del repo que pertenecen a `NOI`

`SITE_TRABAJO`, `PERSONA`, `LOCAL`, `LOCAL_01`, `COMPAÑIA`, `GRUPO`, `SUB_AREA`, `CENTRO_COSTOS`, `WBS`, `GL`, `NOI`, `NOI_CENTRO_COSTOS`, `OPORTUNIDAD_LABORAL_DETALLE`

**Cero módulos de `BDMultitrac` las mencionan.** Son de la base `NOI`, que no tenemos. No las busques en `BDMultitrac`.

---

# PARTE FRONTEND

## 9. El sitio está PRECOMPILADO — esto cambia todo

| Tipo | Cantidad |
|---|---|
| `.aspx` (páginas) | 379 |
| `.master` (plantillas) | 5 |
| `.ascx` (controles) | 5 |
| `.asmx` (servicios web) | 3 |
| `.cs` (código fuente) | **0** |
| `.dll` compilados | 27 |
| `App_Web_*.dll` (lotes de código-behind) | 7 |

**No hay archivos `.cs`.** El code-behind de las 379 páginas está compilado en 7 DLLs por lotes.

### Qué puedes y qué no puedes hacer

| Acción | ¿Se puede? | Comentario |
|---|---|---|
| Editar **markup** dentro de un `.aspx` | **Sí** | El HTML/ASPX se lee en runtime |
| Agregar controles ASP.NET al markup | **Sí** | |
| Editar `.master` / `.ascx` | **Sí** | Markup sí |
| **Agregar o modificar code-behind** | **No sin recompilar** | Está dentro de los `App_Web_*.dll` |
| Agregar una página nueva con lógica | **No sin recompilar** | Necesita su lote nuevo |
| Modificar lógica de negocio de una página | **No sin recompilar** | |

> **Consecuencia:** si un cambio de frontend necesita lógica (eventos, `code-behind`, validación de servidor), hay que **recompilar el proyecto web**. Eso es trabajo de backend/build, no solo de frontend. **Avísalo antes de prometer algo que requiera lógica.**

## 10. El sitio NO tiene autenticación efectiva

Esto es lo más importante que debe saber frontend. **No es una observación teórica: verifiqué las 379 páginas.**

### Configuración actual

```xml
<authentication mode="Forms"/>          <!-- activo -->
<authorization>
    <!-- <deny users="?" /> -->        <!-- COMENTADO -->
    <allow users="?"/>
</authorization>
```

| Verificación | Resultado |
|---|---|
| `<location>` con reglas de autorización | **0** |
| Páginas `.aspx` con su propio `<authorization>` | **0 de 379** |
| Reglas que protegen algo | **ninguna** |

### Qué significa

- `mode="Forms"` está configurado, pero **nunca se exige iniciar sesión**.
- `<allow users="?"/>` = permitir usuarios anónimos.
- El `<deny users="?"/>` que lo bloquearía está comentado.
- **Las 379 páginas y los 23 reportes son accesibles sin autenticación** para quien alcance el servidor web.

### Qué hacer

1. **Si tu trabajo es un módulo nuevo, no repitas el patrón.** Si agregas páginas, quedan públicas sin login. Decide explícitamente si eso es aceptable.
2. **Si te piden "arreglar el login", el trabajo real no es el login.** Hay que:
   - Descomentar `<deny users="?"/>` o cambiarlo por `<allow users="*"/>` dentro de `<allow>`.
   - Agregar `<location path="Login.aspx"><allow users="?"/></location>` para dejar entrar solo al login.
   - Verificar que los 3 `.asmx` también queden protegidos (los servicios web pueden saltarse la autorización de páginas).
3. **`compilation debug="true"` está activo** y **no hay `customErrors`**, así que los errores detallados (con rutas y stack traces) se muestran al usuario final. Ambos deben ser `false` en producción.
4. Existen dos tablas de usuario en `BDMultitrac`:
   - `aspnet_Users` / `aspnet_Membership` / `aspnet_Roles` — el sistema de Forms auth de ASP.NET.
   - `Usuarios` (Id, Username, PasswordHash, FullName, Email) — tabla propia de la aplicación.
   
   **Determina cuál usa `Login.aspx` antes de tocar nada.** Si cambias la autenticación, tienes que confirmar cuál de las dos sigue siendo la fuente de verdad, o los usuarios existentes dejarán de poder entrar.

## 11. Estructura de la UI

### 5 plantillas master

`Blanco.master`, `covid.master`, `Operaciones.master`, `Principal.master`, `SIGAM.master`

> **Ojo:** hay 5 sistemas de estilos conviviendo (`css`, `HojasEstilo`, `assets`, más 2 `.css` en raíz). Antes de agregar estilos, identifica en qué master vive la página que estás tocando y qué hoja usa ese master. No hay un único punto de entrada de estilos.

### Carpetas del sitio

`ARCHIVOS`, `assets`, `bin`, `css`, `fonts`, `HojasEstilo`, `Iconos`, `Image`, `imagenes`, `images`, `js`, `ObjetosUsuario`, `Upload_SGC`

> Nota: `Image`, `imagenes` e `images` coexisten. Lo mismo con `css` y `HojasEstilo`. **Usa la carpeta que ya usa el master de tu página**, no una nueva.

### Páginas de acceso

`Default.aspx`, `Default2.aspx`, `Login.aspx`, `LoginAnt.aspx`

`LoginAnt` sugiere una versión anterior del login que sigue desplegada. **No la borres sin confirmar** que nada la enlaza.

## 12. Los 23 reportes SSRS

### Regla fundamental

**Los `.rdlc` no tienen SQL escrito a mano.** Cada dataset invoca un procedimiento:

```xml
<CommandText>dbo.GetINCIDENT_ReporteRAC</CommandText>
```

> **Consecuencia:** si quieres cambiar qué datos muestra un reporte, **tienes que crear/modificar el SP en la base**, no editar el `.rdlc`. Editar el `.rdlc` solo cambia el layout, nunca la consulta.
>
> Y al revés: **no renombres un SP de reporte sin actualizar el `.rdlc` que lo invoca**, o el reporte deja de funcionar.

### Los 24 SPs de reporte (no renombrar)

`GetINCIDENT_ReporteRAC`, `GetRepInforme`, `GetRepPlan`, `GetRepPrograma`, `GetRepSac`, `GetRepSeguimientoSac`, `GetREQUERIMIENTO_DETALLEById_Requerimiento`, `GetTiempoLavado`, `GetVIEW_OPERACIONByIdOperacionGeneral`, `SP_EQUIPO_COMBUSTIBLE_TOTAL_CANTIDAD_CONDUCTOR_ByIdGrifoAndByIdOperacionAndByIdContratistaAndByIdPersonalAndByCod_Equipo`, `SP_EQUIPO_COMBUSTIBLE_TOTAL_CANTIDAD_RAZONSOCIAL_ByIdGrifoAndByIdOperacionAndByIdContratistaAndByIdPersonalAndByCod_Equipo`, `SP_EQUIPO_COMBUSTIBLEByIdGrifoAndByIdOperacionAndByIdContratistaAndByIdPersonalAndByCod_Equipo`, `SP_GUIA_REMISION_REPORTE_CPSAA_ByFechas`, `SP_GUIA_REMISON_EQUIPO_COMBUSTIBLEByIdGrifoAndByIdOperacionAndByIdContratistaAndByIdPersonalAndByCod_Equipo`, `SP_OPERACION_CONTACTO_ByIdOperacionGeneral`, `SP_OPERACION_GENERAL_UBICACION_OPFechaSalPlanByIdOperacionGeneralAndByConvoy`, `SP_OPERACION_GENERAL_UBICACION_OPHoraSalPlanByIdOperacionGeneralAndByConvoy`, `SP_REPORTE_NRO_VIAJES_X_SOCIO_ByIdOperacion`, `SP_REPORTE_NRO_VIAJES_X_TRACTO_ByIdOperacion`, `SP_REPORTE_NRO_VIAJESByIdOperacion`, `SP_REQUERIMIENTOById_Requerimiento`, `SP_REQUERIMIENTOByIdOperacionGeneral`, `SP_VIEW_GUIA_REMISION_VALE_COMBUSTIBLEByIdOperacionAndByCod_Equipo`, `SP_VIEW_GUIA_REMISSION_VALE_COMBUSTIBLEByIdOperacionAndByIdContratista`

**Los 24 existen en `BDMultitrac`. Los reportes están funcionando.** No hay que reconstruir nada ahí.

### Data sources de los reportes

Los 23 reportes usan solo 3 data sources, **los 3 apuntan a `BDMultitrac`**: `cnx`, `BDMultitracConnectionString`, `DBSistGCConnectionString`.

**Ningún reporte depende de `BdNava00`, `BDAlertasMultitrac`, `NOI` ni el Access.** No te preocupes por esas bases para tocar reportes.

## 13. El módulo de Sueños está incompleto

Si te piden la pantalla de Sueños, sabrás por qué no existe.

`PERSONAL_SUEÑO` tiene:
- ✅ La tabla en `BDMultitrac`
- ✅ Los 4 SPs CRUD (`Insert`, `Update`, `Delete`, `GetAllFrom`)
- ✅ La clase de entidad `PERSONAL_SUEÑO`
- ❌ **No está** en el `OperacionesIdentity.dll` desplegado
- ❌ **No tiene** DAL, repositorio ni interfaz de usuario
- ❌ Solo existe como reporte SSRS

Detalle completo en `SUEÑOS.md`.

---

## 14. Checklist antes de tocar algo

### Si eres BACKEND

- [ ] ¿Creaste la tabla en la base a mano? (el repo no lo hace)
- [ ] ¿El nombre del SP sigue la convención de Repository Factory?
- [ ] ¿Tu SP es solo de lectura sobre `BDAlertasMultitrac`? Si sí, verifica que no rompe la dependencia cruzada
- [ ] ¿Creaste el SP en **ambas** bases si toca las dos?
- [ ] ¿Documentaste que tu módulo depende de `BdNava00` o `NOI` (no testeable localmente)?
- [ ] ¿La tabla que vas a tocar existe de verdad? (ver §6, §8)
- [ ] ¿Revisaste si el SP que invocas ya existe? (47 no existen)

### Si eres FRONTEND

- [ ] ¿Tu cambio es solo markup? Si necesita lógica → **requiere recompilar**, avisa
- [ ] ¿Sabes en qué `.master` vive tu página?
- [ ] ¿Reutilizaste las carpetas de recursos existentes en vez de crear nuevas?
- [ ] ¿Tu página queda **pública sin login**? (ver §10) — decide si es aceptable
- [ ] ¿El reporte que tocas sigue invocando el mismo nombre de SP?
- [ ] ¿Verificaste que no dejaste `debug="true"` ni faltaría `customErrors`?

### Antes de desplegar en el servidor original

- [ ] `BdNava00`, `NOI` y el Access existen en el servidor destino
- [ ] `BDMultitrac` y `BDAlertasMultitrac` se despliegan **juntas**
- [ ] Los `Data Source` de las 10 connection strings apuntan al servidor correcto (hoy apuntan a otro, no a `.\SQLEXPRESS`)
- [ ] `cnxCont` (Access) — decidir si se arregla o se documenta como rota
- [ ] Copia de seguridad antes de cualquier cambio de esquema
- [ ] Los nuevos SPs y tablas se incluyen en el paquete de despliegue

---

## 15. Cómo verificar cualquier cosa antes de afirmarla

```powershell
$sqlcmd = "C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\SQLCMD.EXE"
$inst   = ".\SQLEXPRESS"

# ¿Qué bases hay?
& $sqlcmd -S $inst -E -h -1 -W -Q "SET NOCOUNT ON; SELECT name FROM sys.databases WHERE database_id > 4;"

# ¿Existe un objeto?
& $sqlcmd -S $inst -E -d BDMultitrac -h -1 -W -Q "SET NOCOUNT ON;
SELECT CASE WHEN OBJECT_ID('dbo.NOMBRE_SP','P') IS NULL THEN 'FALTA' ELSE 'EXISTE' END;"

# ¿Existe una tabla?
& $sqlcmd -S $inst -E -d BDMultitrac -h -1 -W -Q "SET NOCOUNT ON;
SELECT name FROM sys.tables WHERE name LIKE 'PREFIJO%';"

# ¿Un SP usa una tabla de otra base?
& $sqlcmd -S $inst -E -d BDMultitrac -h -1 -W -Q "SET NOCOUNT ON;
SELECT o.name FROM sys.objects o JOIN sys.sql_modules m ON m.object_id=o.object_id
WHERE o.type='P' AND m.definition LIKE '%TABLA_OTRA_BASE.%';"
```

> **Advertencia técnica que ya nos costó un error:** en T-SQL, `LIKE '%[BDAlertasMultitrac]%'` trata los corchetes como **clase de caracteres**, así que devuelve positivo en todos los módulos. Para filtrar por base usa el patrón con punto: `LIKE '%BDAlertasMultitrac.%'`. Si necesitas corchetes literales, usa `CHAR(91)`.

---

## 16. Resumen en 10 líneas

1. Tenemos 2 bases: `BDMultitrac` (423 tablas, 3 190 SPs) y `BDAlertasMultitrac` (27 tablas, 104 SPs).
2. Nos faltan 4 bases críticas: `BdNava00`, `NOI`, el Access, y `BDPresupuesto` (esta última sin uso).
3. Las 2 bases que tenemos están acopladas: nunca despliegues una sin la otra.
4. **El repo no tiene el esquema.** Cero `CREATE TABLE`. Si agregas una tabla, la creas a mano.
5. 1 646 de 1 693 SPs que el programa usa sí existen. Solo **47 faltan de verdad**.
6. Hay 2 módulos con código pero **sin tabla**: `OPERACION_UBICACION_OP` y `cgm01022011`.
7. El sitio tiene **379 páginas y ninguna exige login**. La autenticación está configurada pero desactivada.
8. El sitio está **precompilado**: puedes editar markup, pero la lógica requiere recompilar.
9. Los **23 reportes SSRS funcionan** y solo dependen de `BDMultitrac`. Cambiar sus datos = cambiar el SP, no el `.rdlc`.
10. `BdNava00` y `NOI` **no se pueden probar localmente**. Lo que toques ahí, se valida en el servidor original.

---

**Documentos relacionados:** `SUEÑOS.md` (módulo de Sueños) · `ANALISIS_BASES_DATOS.md` (análisis completo con las 58 tablas y los 1 693 SPs)

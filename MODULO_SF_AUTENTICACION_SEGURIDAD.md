# MODULO SF: SEGURIDAD Y AUTENTICACION
## Matriz de Trazabilidad de Requerimientos - MULTITRAC S.A.

---

## Informacion General del Modulo

| Campo | Valor |
|-------|-------|
| **ID Modulo** | SF-001 a SF-006 |
| **Nombre** | Seguridad y Autenticacion |
| **Descripcion** | Gestion del login, registro de usuarios, cambio de contrasena y asignacion de roles |
| **Patron** | ASP.NET Forms Authentication con SqlMembershipProvider y SqlRoleProvider |
| **Lenguaje Frontend** | VB.NET (ASP.NET WebForms) |
| **Proveedor Autenticacion** | System.Web.Security.SqlMembershipProvider |
| **Proveedor Roles** | System.Web.Security.SqlRoleProvider |
| **Formato Contrasena** | Hashed (SHA1) |
| **Session Timeout** | 120 minutos |
| **Rotacion Contrasena** | 90 dias (politica de ciberseguridad) |

---

## ESTRUCTURA DE ARCHIVOS

### Paginas ASP.NET

| Pagina | Funcion | Master Page | Tipo Control |
|--------|---------|-------------|--------------|
| Login.aspx | Login principal | Ninguno (standalone) | `<asp:Login>` |
| LoginAnt.aspx | Login alternativo | `~/Operaciones.master` | `<asp:Login>` |
| CambiarClave.aspx | Cambio de contrasena | `~/Principal.master` | `<asp:ChangePassword>` |
| WFrmUsuarioCreacion.aspx | Creacion de usuario | `~/Operaciones.master` | `<asp:CreateUserWizard>` |
| WFrmUsuarios_Lista.aspx | Lista de usuarios | `~/Operaciones.master` | GridView + Boton |
| WFrmUsuarioCrearRol.aspx | Asignacion de rol | `~/Operaciones.master` | ListBox + DropDownList |
| WFrmUsuarioContraseña.aspx | Cambio contrasena usuario | `~/Operaciones.master` | `<asp:ChangePassword>` |
| WFrmUsuarioContraseñaActualizar.aspx | Cambio forzado (politica 90 dias) | `~/Blanco.master` | `<asp:ChangePassword>` |
| Redirect.aspx | Redireccion post-autenticacion | Ninguno | Pagina vacia |

### Master Pages Relacionados

| Master Page | Uso | Contiene LoginStatus |
|-------------|-----|----------------------|
| Operaciones.master | Principal de la aplicacion | Si (`lgsOperaciones`) |
| Principal.master | Gestion y administracion | Si (navegacion) |
| Blanco.master | Pantalla simplificada | No visible |
| SIGAM.master | Seccion SIGAM | Si |

### Configuracion

| Archivo | Contenido Relacionado |
|---------|----------------------|
| web.config | `<authentication>`, `<membership>`, `<roleManager>`, `<sessionState>` |
| App.config (OperacionesIdentity) | `repositoryFactory` con mapeo de repositorios |
| Connection String | `Data Source=SERVER_M; Initial Catalog=BDMultitrac; User ID=sa; Password=Multitr@c2009` |

---

## SF-001: AUTENTICACION DE USUARIO CON LOGIN

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-001 |
| **Descripcion** | Autenticacion de usuario mediante login |
| **Entidad BE** | PERSONAL (Usuario_Personal) |
| **Proveedor BD** | SqlMembershipProvider |
| **Tablas BD** | `[dbo].[aspnet_Users]`, `[dbo].[aspnet_Membership]` |
| **Paginas** | Login.aspx, LoginAnt.aspx |
| **Prioridad** | Alta |

### Login.aspx

- **Tipo**: Pagina standalone sin master page
- **Control**: `<asp:Login ID="lgOperaciones">`
- **Propiedades**:
  - `UserNameLabelText="NOMBRE USUARIO :"`
  - `PasswordLabelText="CONTRASEÑA :"`
  - `LoginButtonText="INICIAR SESION"`
  - `RememberMeText="Recordarme la Proxima Vez."`
  - `FailureText="Su intento de acceso no tuvo éxito..."`
- **Elementos visuales**:
  - Fondo con imagenes `Image/multi.gif` y `Image/carretera2-735763.png`
  - `<asp:LoginStatus>` para login/logout
- **Validacion**: SqlMembershipProvider valida contra `[dbo].[aspnet_Membership]`

### LoginAnt.aspx

- **Tipo**: Pagina con master page `~/Operaciones.master`
- **Control**: `<asp:Login ID="lgOperaciones">`
- **Propiedades visuales**:
  - `BackColor="White"`, `BorderWidth="2px"`, `BorderStyle="Solid"`, `BorderColor="Black"`
  - `Height="150px"`, `Width="400px"`, `BorderPadding="5"`
- **Misma funcionalidad** que Login.aspx, solo con estilo diferente
- **Clase compilada**: `App_Web_3lbhlb5a`

### Flujo de Autenticacion

```
Usuario abre Login.aspx o LoginAnt.aspx
  → Ingresa Nombre de Usuario y Contrasena
  → Clic en "INICIAR SESION"
  → <asp:Login> control invoca SqlMembershipProvider
  → SqlMembershipProvider valida contra:
       - [dbo].[aspnet_Users] (usuario)
       - [dbo].[aspnet_Membership] (contrasena hasheada)
  → Si valido:
       → Crea cookie de autenticacion (Forms Authentication)
       → Redirige a Default.aspx o WFrmBienvenido.aspx
  → Si invalido:
       → Muestra: "Su intento de acceso no tuvo éxito..."
  → Recordarme: Si checked, persiste cookie
```

### Tablas de Autenticacion ASP.NET

```
[dbo].[aspnet_Applications]
  ├── ApplicationName = "/"
  └── ApplicationId

[dbo].[aspnet_Users]
  ├── UserId (PK)
  ├── UserName ← Usuario_Personal
  ├── LoweredUserName
  ├── Email
  └── IsAnonymous

[dbo].[aspnet_Membership]
  ├── UserId (PK, FK)
  ├── Password ← Hashed
  ├── PasswordFormat = "Hashed"
  ├── PasswordSalt
  ├── MobilePasswordHash
  ├── PasswordQuestion ← Seguridad
  ├── PasswordAnswer ← Seguridad
  ├── IsApproved
  ├── IsLockedOut
  ├── LastLoginDate
  ├── LastPasswordChangedDate
  ├── LastLockoutDate
  ├── CreationDate
  ├── FailedPasswordAttemptCount
  ├── FailedPasswordAttemptWindowStart
  ├── FailedPasswordAnswerAttemptCount
  └── FailedPasswordAnswerAttemptWindowStart
```

---

## SF-002: CAMBIO DE CONTRASENA DE USUARIO

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-002 |
| **Descripcion** | Cambio de contrasena de usuario autenticado |
| **Entidad BE** | PERSONAL / SqlMembershipProvider |
| **Proveedor BD** | SqlMembershipProvider |
| **Paginas** | CambiarClave.aspx |
| **Prioridad** | Alta |

### CambiarClave.aspx

- **Master Page**: `~/Principal.master`
- **Control**: `<asp:ChangePassword ID="ChangePassword1">`
- **Propiedades**:
  - `UserNameLabelText="Usuario:"`
  - `NewPasswordLabelText="Nuevo Password:"`
  - `ConfirmNewPasswordLabelText="Confirmar Nuevo Password:"`
  - `SuccessText="Su Password ha sido Cambiado !"`
  - `ContinueDestinationPageUrl="~/Default.aspx"`
- **Validacion**:
  - Longitud minima de contraseña
  - Contraseña nueva debe coincidir con confirmacion
  - Debe conocer contrasena actual
- **Mensaje de error**: `ChangePasswordFailureText` incluye info de validacion
- **Redireccion exito**: `~/Default.aspx`

### Flujo

```
Usuario accede desde Principal.master → Control de Accesos → Cambiar Clave de Acceso
  → CambiarClave.aspx se carga
  → Usuario ingresa: Usuario, Contrasena Actual, Nueva Password, Confirmar
  → <asp:ChangePassword> valida:
       1. Contrasena actual correcta (SqlMembershipProvider)
       2. Nueva password cumple longitud minima
       3. Nueva = Confirmar nueva
  → Si valido:
       → SqlMembershipProvider actualiza [dbo].[aspnet_Membership].[Password]
       → Muestra: "Su Password ha sido Cambiado !"
       → Redirige a ~/Default.aspx
  → Si invalido:
       → Muestra ChangePasswordFailureText con errores de validacion
```

---

## SF-003: GESTION DE USUARIOS (CREAR Y LISTAR)

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-003 |
| **Descripcion** | Gestion de usuarios (crear, listar, actualizar) |
| **Entidades BE** | PERSONAL, SqlMembershipProvider |
| **Proveedor BD** | SqlMembershipProvider + IPERSONALRepository |
| **Paginas** | WFrmUsuarioCreacion.aspx, WFrmUsuarios_Lista.aspx |
| **Prioridad** | Alta |

### WFrmUsuarioCreacion.aspx (Creacion de Usuario)

- **Master Page**: `~/Operaciones.master`
- **Control**: `<asp:CreateUserWizard ID="UserLavaderoCreateUserWizard">`
- **Propiedades**:
  - `LoginCreatedUser="False"` → NO auto-login despues de crear
  - `ContinueDestinationPageUrl="~/WFrmUsuarios_Lista.aspx"`
  - `RequiresQuestionAndAnswer="true"` → Pregunta de seguridad obligatoria
  - `InvalidPasswordErrorMessage` → Incluye longitud minima
  - `DuplicateUserNameErrorMessage="Por favor, introduzca un nombre de usuario diferente."`
  - `DuplicateEmailErrorMessage="La dirección de correo electrónico..."`
  - `EmailRequiredErrorMessage` → Email obligatorio
  - `UserNameRequiredErrorMessage` → Usuario obligatorio
- **Pasos del Wizard**:
  1. `CreateUserWizardStep` → Recolecta datos
  2. `CompleteWizardStep` → Confirmacion
- **Botones**: `ContinueButtonText="Continuar"`, `FinishCompleteButtonText="Terminar"`
- **Datos recolectados**:
  - Username, Email, Password, Confirm Password
  - Security Question, Security Answer
  - Informacion personal (según plantilla)

**Flujo**:
```
Admin accede → WFrmUsuarios_Lista.aspx → Boton "CREAR NUEVO USUARIO"
  → WFrmUsuarioCreacion.aspx
  → CreateUserWizard paso 1: ingresa datos
  → CreateUserWizard paso 2: confirma
  → Clic "Terminar"
  → SqlMembershipProvider.CreateUser() crea registro en [dbo].[aspnet_Users] + [dbo].[aspnet_Membership]
  → LoginCreatedUser="False" → NO se logea automaticamente
  → Redirige a WFrmUsuarios_Lista.aspx
```

### WFrmUsuarios_Lista.aspx (Lista de Usuarios)

- **Master Page**: `~/Operaciones.master`
- **Control**: GridView `gwListaUsuarios`
- **Columnas**:
  - `UserName` (Usuario)
  - `Email` (Correo)
  - `IsApproved` (Activo - CheckBox)
  - `CreationDate` (Usuario Desde)
  - `LastLoginDate` (Ultimo Login)
  - `IsOnline` (En Linea - CheckBox)
  - **HyperLinkField**: "Modificar Rol" → `WFrmUsuarioCrearRol.aspx?username={0}`
- **Botones**:
  - `btnCrearUsuario` → Redirige a WFrmUsuarioCreacion.aspx

**Flujo**:
```
Admin accede a WFrmUsuarios_Lista.aspx
  → GridView cargado con datos de SqlMembershipProvider
  → Muestra todos los usuarios registrados
  → Cada fila tiene link "Modificar Rol"
  → Boton "CREAR NUEVO USUARIO" abre WFrmUsuarioCreacion.aspx
```

### Datos en GridView

| Columna | Tipo | Origen | Descripcion |
|---------|------|--------|-------------|
| UserName | Texto | aspnet_Users.UserName | Nombre de usuario login |
| Email | Texto | aspnet_Users.Email | Correo electronico |
| IsApproved | CheckBox | aspnet_Membership.IsApproved | Activo/Inactivo |
| CreationDate | Fecha | aspnet_Membership.CreationDate | Fecha de creacion |
| LastLoginDate | Fecha | aspnet_Membership.LastLoginDate | Ultimo acceso |
| IsOnline | CheckBox | SqlMembershipProvider | Estado en linea (ventana 20 min) |

---

## SF-004: GESTION DE ROLES DE USUARIO

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-004 |
| **Descripcion** | Gestion de roles de usuario (asignacion y modificacion) |
| **Proveedor BD** | SqlRoleProvider |
| **Paginas** | WFrmUsuarioCrearRol.aspx |
| **Prioridad** | Alta |

### WFrmUsuarioCrearRol.aspx

- **Master Page**: `~/Operaciones.master`
- **Controles**:
  - `ListBox` (`lbxUsuarioRol`) → Roles actuales del usuario
  - `DropDownList` (`ddlUsuarioRoles`) → Roles disponibles para agregar
  - `ImageButton` (`ibGuardarUsuarioRol`) → Guardar asignacion
  - `Label` (`lblUser`) → Muestra el username siendo modificado
- **Acceso**: Desde WFrmUsuarios_Lista.aspx → HyperLink "Modificar Rol"
- **Query String**: `WFrmUsuarioCrearRol.aspx?username={username}`

**Flujo**:
```
Admin hace clic "Modificar Rol" en WFrmUsuarios_Lista.aspx
  → Redirige a WFrmUsuarioCrearRol.aspx?username=xxx
  → lblUser muestra el username
  → ListBox cargado con roles actuales del usuario (SqlRoleProvider.GetRolesForUser)
  → DropDownList cargado con roles disponibles no asignados
  → Admin selecciona rol del DropDownList
  → Clic ImageButton "Guardar"
  → SqlRoleProvider.AddUserToRole() actualiza [dbo].[aspnet_UsersInRoles]
  → ListBox se actualiza mostrando nuevo rol
```

### Tablas de Roles ASP.NET

```
[dbo].[aspnet_Roles]
  ├── RoleId (PK)
  ├── ApplicationId (FK)
  └── RoleName

[dbo].[aspnet_UsersInRoles]
  ├── UserId (PK, FK)
  └── RoleId (PK, FK)
```

### Configuracion RoleManager

```xml
<roleManager enabled="true" cacheRolesInCookie="true"
             cookieName=".ASPROLES" defaultProvider="SqlProvider">
  <providers>
    <add connectionStringName="cnx" applicationName="/"
         name="SqlProvider" type="System.Web.Security.SqlRoleProvider"/>
  </providers>
</roleManager>
```

- `cacheRolesInCookie="true"` → Roles cacheados en cookie `.ASPROLES` para rendimiento
- `cookieName=".ASPROLES"` → Nombre de la cookie de roles

---

## SF-005: CAMBIO DE CONTRASENA POR USUARIO

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-005 |
| **Descripcion** | Actualizacion de contrasena por el propio usuario |
| **Proveedor BD** | SqlMembershipProvider |
| **Paginas** | WFrmUsuarioContraseña.aspx, WFrmUsuarioContraseñaActualizar.aspx |
| **Prioridad** | Alta |

### WFrmUsuarioContraseña.aspx (Cambio Principal)

- **Master Page**: `~/Operaciones.master`
- **Control**: `<asp:ChangePassword ID="cpUsuarios">`
- **Propiedades**:
  - `SuccessPageUrl="~/WFrmBienvenido.aspx"`
  - `CancelDestinationPageUrl="~/WFrmBienvenido.aspx"`
  - `PasswordLabelText="Contraseña Actual:"`
  - `NewPasswordLabelText="Nuevo Password:"`
  - `ConfirmNewPasswordLabelText="Confirmar Nuevo Password:"`
  - `ChangePasswordFailureText` con info de validacion
- **Template personalizado**: `ChangePasswordTemplate` con los 3 campos de contrasena
- **Acceso**: Desde menu `Operaciones.master` → Control de Accesos

**Flujo**:
```
Usuario autenticado → Menu → Control de Accesos → Cambiar Clave de Acceso
  → WFrmUsuarioContraseña.aspx
  → Ingresa: Contrasena Actual, Nueva Password, Confirmar
  → <asp:ChangePassword> valida contrasena actual
  → Si valido:
       → SqlMembershipProvider.ChangePassword() actualiza [dbo].[aspnet_Membership]
       → Redirige a ~/WFrmBienvenido.aspx
  → Si invalido:
       → Muestra ChangePasswordFailureText
```

### WFrmUsuarioContraseñaActualizar.aspx (Cambio Forzado por Politica)

- **Master Page**: `~/Blanco.master` (pantalla simplificada)
- **Control**: `<asp:ChangePassword ID="cpUsuarios">`
- **Propiedades**:
  - `SuccessPageUrl="~/WFrmInicio.aspx"`
  - `CancelDestinationPageUrl="~/Login.aspx"`
  - `PasswordLabelText="Contraseña Actual:"`
  - Font size reducido a 8pt (display compacto)
- **Política de Seguridad**:
  > "Estimado(a) por POLITICA DE CIBERSEGURIDAD Y TECNOLOGIAS DE LA INFORMACION la contraseña de su usuario debera cambiar cada 90 dias despues de su ultima actualizacion."
- **Acceso**: Forzado por el sistema cada 90 dias

**Flujo**:
```
Sistema detecta que contrasena expiro (90 dias)
  → Redirige a WFrmUsuarioContraseñaActualizar.aspx
  → Pantalla simplificada (Blanco.master)
  → Usuario debe cambiar contrasena obligatoriamente
  → Si cancela → Redirige a Login.aspx (cierra sesion)
  → Si cambia → Redirige a ~/WFrmInicio.aspx
```

### Politica de Rotacion

| Aspecto | Valor |
|---------|-------|
| **Periodo** | 90 dias |
| **Base** | Ultima actualizacion de contrasena |
| **Enforcement** | Via pagina WFrmUsuarioContraseñaActualizar.aspx |
| **Cancel action** | Redirige a Login (cierra sesion) |
| **Origen** | Politica organizacional de Ciberseguridad |

---

## SF-006: REDIRECCION POST-AUTENTICACION

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | SF-006 |
| **Descripcion** | Redireccion de paginas segun rol despues de autenticacion |
| **Paginas** | Redirect.aspx |
| **Prioridad** | Media |

### Redirect.aspx

- **Tipo**: Pagina vacia sin master page
- **Clase compilada**: `Redirect, App_Web_swbaep6g`
- **Contenido**: Form vacío, funcionalidad mínima
- **Uso**: Destino intermedio después de autenticación o cambios de contrasena

---

## ENTIDADES RELACIONADAS

### PERSONAL (Entidad principal de autenticacion)

**Archivo**: `OperacionesIdentity/PERSONAL.cs`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_Personal` | `System.Int32` | **SI** | - | Identificador unico de personal |
| `Usuario_Personal` | `System.String` | - | - | **Campo de login** (username) |
| `Nom_Personal` | `System.String` | - | - | Nombre |
| `AP_Personal` | `System.String` | - | - | Apellido paterno |
| `AM_Personal` | `System.String` | - | - | Apellido materno |
| `DNI_Personal` | `System.String` | - | - | Documento de identidad |
| `Email_Personal` | `System.String` | - | - | Correo electronico |
| `cel_Personal` | `System.String` | - | - | Celular |
| `tlf_Pesronal` | `System.String` | - | - | Telefono alterno |
| `direccion_Personal` | `System.String` | - | - | Direccion |
| `lugarNacimiento_Personal` | `System.String` | - | - | Lugar de nacimiento |
| `lugarResidencia_Personal` | `System.String` | - | - | Lugar de residencia |
| `fechNac_Personal` | `Nullable<DateTime>` | - | - | Fecha de nacimiento |
| `fechaAdmitido_Personal` | `Nullable<DateTime>` | - | - | Fecha de ingreso a empresa |
| `fechaBaja_Personal` | `Nullable<DateTime>` | - | - | Fecha de baja/termino |
| `fechaIngresoAFP` | `Nullable<DateTime>` | - | - | Fecha de ingreso a AFP |
| `sexo_Personal` | `System.String` | - | - | Genero |
| `estadoCivil_Personal` | `System.String` | - | - | Estado civil |
| `id_NivelEducativo` | `System.Int32` | - | - | Nivel educativo |
| `id_Contratista` | `System.Int32` | - | - | FK a CONTRATISTA |
| `statusOP` | `Nullable<Int32>` | - | - | Status operacional |
| `sueldoBruto_Personal` | `Nullable<Decimal>` | - | - | Sueldo bruto |
| `lic_Personal` | `System.String` | - | - | Licencia de conducir |
| `id_Lic_Personal` | `Nullable<Int32>` | - | - | FK a tipo licencia |
| `pasaporte_Personal` | `System.String` | - | - | Numero de pasaporte |
| `requerimientos` | `Nullable<Int32>` | - | - | Requerimientos count |
| `foto_Personal` / `fot_Personal` | `System.String` | - | - | Ruta de foto |
| `cUSSP` | `System.String` | - | - | Codigo USS/P |
| `aFP_Personal` | `Nullable<Int32>` | - | - | FK a AFP |
| `eMP_COD` | `Nullable<Int32>` | - | - | Codigo de empresa |
| `eSALUD_AutoGenerado` | `System.String` | - | - | Salud auto-generado |
| `rpc_Personal` | `System.String` | - | - | Codigo RPC |
| `rPM_Personal` | `System.String` | - | - | Codigo RPM |
| `sCTR` | `System.String` | - | - | Codigo SCTR |

**Relacion con autenticacion**: `Usuario_Personal` es el campo que vincula la tabla `[dbo].[PERSONAL]` con `[dbo].[aspnet_Users].[UserName]`

### OPERACION_USUARIO (Relacion Operacion-Usuario)

**Archivo**: `OperacionesIdentity/OPERACION_USUARIO.cs`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `IdOperacionPersonal` | `System.Int32` | **SI** | - | Identificador unico |
| `Id_Personal` | `Nullable<Int32>` | - | **FK → PERSONAL** | Personal asignado |
| `IdOperacion` | `Nullable<Int32>` | - | **FK → OPERACION** | Operacion asignada |
| `estado` | `System.String` | - | - | Estado |
| `fechaInicio` | `Nullable<DateTime>` | - | - | Fecha inicio |
| `fechaFin` | `Nullable<DateTime>` | - | - | Fecha fin |

**Funcion**: Actua como mecanismo de **roles operacionales** — asigna qué operaciones puede realizar cada usuario personal

### PERSONAL_CARGO (Cargo del Personal)

**Archivo**: `OperacionesIdentity/PERSONAL_CARGO.cs`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_Personal` | `System.Int32` | **SI** | **FK → PERSONAL** | Personal |
| `Id_Cargo` | `System.Int32` | **SI** | **FK → CARGO** | Cargo |
| `Id_PersonalCargo` | `System.Int32` | **SI** | - | Identificador de relacion |
| `fechaIncio_Cargo` | `Nullable<DateTime>` | - | - | Fecha inicio |
| `fechaFin_Cargo` | `Nullable<DateTime>` | - | - | Fecha fin |
| `estado` | `System.String` | - | - | Estado |

### PERSONAL_AREA_MULTITRAC (Area del Personal)

**Archivo**: `OperacionesIdentity/PERSONAL_AREA_MULTITRAC.cs`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_Personal` | `Nullable<Int32>` | - | **FK → PERSONAL** | Personal |
| `Id_AreaMultitrac` | `Nullable<Int32>` | - | **FK → AREA** | Area asignada |
| `Id_PersonalAreaMultitrac` | `System.Int32` | **SI** | - | Identificador de relacion |
| `fechaInicio` | `Nullable<DateTime>` | - | - | Fecha inicio |
| `fechaFin` | `Nullable<DateTime>` | - | - | Fecha fin |
| `estado` | `System.String` | - | - | Estado |

---

## REPOSITORIOS RELACIONADOS

### IPERSONALRepository

**Archivo**: `OperacionesDAL/IPERSONALRepository.cs`

```csharp
public interface IPERSONALRepository
{
    List<PERSONAL> GetAllFromPERSONAL();
    PERSONAL GetPERSONALById_Personal(System.Int32 id_Personal);
    void Add(PERSONAL pERSONAL);
    void Remove(System.Int32 id_Personal);
    void Save(PERSONAL pERSONAL);
}
```

### IOPERACION_USUARIORepository

**Archivo**: `OperacionesDAL/IOPERACION_USUARIORepository.cs`

```csharp
public interface IOPERACION_USUARIORepository
{
    List<OPERACION_USUARIO> GetAllFromOPERACION_USUARIO();
    void Add(OPERACION_USUARIO oPERACION_USUARIO);
    void Remove(System.Int32 idOperacionPersonal);
    void Save(OPERACION_USUARIO oPERACION_USUARIO);
}
```

### PERSONALRepository Implementation

**Archivo**: `OperacionesDAL/OperacionesIdentity.PERSONALRepositoryArtifacts/PERSONALRepository.cs`

- Extiende `Repository<PERSONAL>` (Microsoft.Practices.Repository)
- Usa: `GetAllFromPERSONALSelectionFactory`, `GetPERSONALById_PersonalFactory`, `PERSONALInsertFactory`, `PERSONALUpdateFactory`, `PERSONALDeleteFactory`
- Error handling: `RepositoryValidationException`, `ConcurrencyViolationException`, `RepositoryFailureException`
- Todas las operaciones usan `SqlException` handling con `ErrorCodes.SqlUserRaisedError`

### Registro de Repositorios (App.config)

```xml
<repositoryFactory>
  <add interfaceType="OperacionesDAL.IPERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONALRepositoryArtifacts.PERSONALRepository, OperacionesDAL" />
  <add interfaceType="OperacionesDAL.IOPERACION_USUARIORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.OPERACION_USUARIORepositoryArtifacts.OPERACION_USUARIORepository, OperacionesDAL" />
  ... + 80+ otros mapeos
</repositoryFactory>
```

---

## MASTER PAGES CON FUNCIONALIDAD DE SEGURIDAD

### Operaciones.master (Master Principal)

**Archivo**: `PrecompiledWeb/Operaciones-2026-02-25 - 01/Operaciones.master`

- **Clase**: `Operaciones, App_Web_swbaep6g`
- **Elementos de seguridad**:
  - `<asp:LoginStatus ID="lgsOperaciones">` → `LoginText="INICIAR SESION"`, `LogoutText="CERRAR SESION"`
  - `<asp:Label ID="lblUsuario">` → Muestra nombre de usuario logueado
  - `<asp:Label ID="lblUser">` → Datos adicionales del usuario
  - `<asp:Label ID="lblCargoUsuario">` → Cargo del usuario
  - `<asp:Label ID="lblHoydia">` → Fecha actual con reloj JavaScript
- **Menú Accordion** (`cc1:Accordion`):
  - INICIO
  - ADMINISTRACION
  - OPERACIONES
  - CONTABILIDAD
  - MANTENIMIENTO
  - S S O M A
  - ESTADISTICAS
  - **USUARIOS** → Links a WFrmUsuarios_Lista.aspx y otras paginas

### Principal.master (Master de Gestion)

**Archivo**: `PrecompiledWeb/Operaciones-2026-02-25 - 01/Principal.master`

- **Clase**: `Principal, App_Web_swbaep6g`
- **Menu** (`asp:Menu`):
  - **Control de Accesos** → `~/CambiarClave.aspx` (Cambiar Clave de Acceso)
  - Gestion de RRHH: Areas, Cargos, Personal, Plan de Formacion
  - Gestion de Documentos, Calidad, Auditorias, Encuestas, Proyectos

### Blanco.master (Master en Blanco)

**Archivo**: `PrecompiledWeb/Operaciones-2026-02-25 - 01/Blanco.master`

- **Clase**: `Blanco, App_Web_swbaep6g`
- **Uso**: Pantalla simplificada para WFrmUsuarioContraseñaActualizar.aspx
- Solo contiene `<asp:contentplaceholder id="CphOperaciones">`

### SIGAM.master (Master de SIGAM)

**Archivo**: `PrecompiledWeb/Operaciones-2026-02-25 - 01/SIGAM.master`

- **Clase**: `SIGAM, App_Web_swbaep6g`
- Similar a Operaciones.master con branding SIGAM
- Contiene `<asp:LoginStatus>` y Accordion con INICIO, S I G A M, TABLERO DE CONTROL

---

## CONFIGURACION DE SEGURIDAD (web.config)

### Authentication

```xml
<authentication mode="Forms"/>
```

### Authorization

```xml
<authorization>
    <allow users="?"/>  <!-- Permite acceso anonimo -->
</authorization>
```

### Membership Provider

```xml
<membership defaultProvider="SqlProvider" userIsOnlineTimeWindow="20">
    <providers>
        <add name="SqlProvider"
             type="System.Web.Security.SqlMembershipProvider"
             connectionStringName="cnx"
             enablePasswordRetrieval="false"
             enablePasswordReset="true"
             requiresQuestionAndAnswer="true"
             passwordFormat="Hashed"
             applicationName="/"/>
    </providers>
</membership>
```

**Propiedades clave**:
| Propiedad | Valor | Significado |
|-----------|-------|-------------|
| `mode` | `Forms` | Autenticación por formulario |
| `enablePasswordRetrieval` | `false` | No se puede recuperar contraseña |
| `enablePasswordReset` | `true` | Se puede resetear contraseña |
| `requiresQuestionAndAnswer` | `true` | Pregunta de seguridad obligatoria |
| `passwordFormat` | `Hashed` | Contraseña almacenada hasheada |
| `applicationName` | `/` | Nombre de aplicación |
| `userIsOnlineTimeWindow` | `20` | Ventana de 20 minutos para considerarlo en linea |

### Role Manager

```xml
<roleManager enabled="true" cacheRolesInCookie="true"
             cookieName=".ASPROLES" defaultProvider="SqlProvider">
    <providers>
        <add connectionStringName="cnx" applicationName="/"
             name="SqlProvider" type="System.Web.Security.SqlRoleProvider"/>
    </providers>
</roleManager>
```

### Session State

```xml
<sessionState timeout="120"/>
```

**Tiempo de sesion**: 120 minutos (2 horas)

### Connection String

```
Data Source=SERVER_M; Initial Catalog=BDMultitrac; User ID=sa; Password=Multitr@c2009
```

**Nota**: Las credenciales SQL Server estan visibles en el archivo de configuración (RNF-010: Privacidad de datos parcial)

---

## INDICADORES DEL MODULO

| Indicador | Valor |
|-----------|-------|
| Numero de paginas de autenticacion | 9 |
| Numero de master pages con LoginStatus | 3 |
| Proveedor de autenticacion | SqlMembershipProvider |
| Proveedor de roles | SqlRoleProvider |
| Formato de contrasena | Hashed |
| Timeout de sesion | 120 minutos |
| Ventana usuario online | 20 minutos |
| Rotacion de contrasena | 90 dias |
| Pregunta de seguridad requerida | Si |
| Auto-login al crear usuario | No |
| Repository Pattern (entidades) | IPERSONALRepository, IOPERACION_USUARIORepository |

---

## DIAGRAMA DE FLUJO COMPLETO

```
                    ┌─────────────────────────────┐
                    │     USUARIO NO AUTENTICADO   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     Login.aspx / LoginAnt.aspx │
                    │   <asp:Login> Control         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  SqlMembershipProvider       │
                    │  Validación en BD            │
                    │  [aspnet_Users] +            │
                    │  [aspnet_Membership]         │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │  COOKIE DE AUTENTICACION     │
                    │  Forms Authentication        │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Operaciones.master         │
                    │   <asp:LoginStatus>          │
                    │   lblUsuario, lblCargoUsuario│
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │        OPCAIONES                │
                    │                                 │
                    │  ┌──────────┐ ┌───────────────┐ │
                    │  │ WFrmUsuario│ │ Control de    │ │
                    │  │ _Creacion│ │ Accesos       │ │
                    │  └────┬─────┘ └───────┬───────┘ │
                    │       │               │          │
                    │  ┌────▼─────┐  ┌──────▼───────┐ │
                    │  │Cambiar   │  │ Cambiar      │ │
                    │  │ Clave    │  │ Contrasena   │ │
                    │  │(Admin)  │  │ (Usuario)    │ │
                    │  └──────────┘  └──────────────┘ │
                    │                                 │
                    │  ┌─────────────────────────────┐│
                    │  │ WFrmUsuarios_Lista.aspx     ││
                    │  │ (Lista, crear, modificar    ││
                    │  │  roles)                     ││
                    │  └─────────────────────────────┘│
                    └─────────────────────────────────┘
```

---

## OBSERVACIONES Y LIMITACIONES

1. **Sin código .aspx.vb disponible** — El proyecto está precompilado, toda la lógica de eventos está en DLLs compilados
2. **Sin autenticación personalizada** — Todo el flujo depende de ASP.NET SqlMembershipProvider
3. **La entidad PERSONAL con `Usuario_Personal`** actúa como puente entre los datos operacionales y el sistema de autenticación ASP.NET
4. **Contraseñas hasheadas** con formato HASHED (SHA1 por defecto) — no se pueden recuperar, solo resetear
5. **Politica de 90 dias** no es técnica sino organizacional (ciberseguridad), implementada via WFrmUsuarioContraseñaActualizar.aspx
6. **OPERACION_USUARIO** funciona como un sistema de roles operacionales adicional al de ASP.NET SqlRoleProvider
7. **Sin .ashx handlers** para archivos — los archivos se sirven directamente desde el filesystem
8. **Credential exposure** — Las credenciales SQL Server (sa/Multitr@c2009) están visibles en App.config

---

*Documento generado el 18/09/2026 a partir del analisis del codigo fuente del proyecto MULTITRAC.*
*Fuente: C:\Users\ASUS\Downloads\Multitrac (2)\Multitrac*
*Modulo: SF - Seguridad y Autenticacion (SF-001 a SF-006)*

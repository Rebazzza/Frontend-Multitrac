# MODULO PE: PERSONAL (PE-001 a PE-024)
## Matriz de Trazabilidad de Requerimientos - MULTITRAC S.A.

---

## Informacion General del Modulo

| Campo | Valor |
|-------|-------|
| **ID Modulo** | PE-001 a PE-024 |
| **Nombre** | Personal |
| **Descripcion** | Gestion integral del personal de la empresa: empleados, cargos, EPP, licencias, records, vacaciones, areas, capacitacion, documentos, y mas |
| **Cantidad de Sub-Modulos** | 24 requerimientos funcionales |
| **Entidades Principales** | PERSONAL, CARGO, PERSONAL_EPP, PERSONAL_EPP_KARDEX, PERSONAL_RECORD, PERSONAL_VACACIONES, PERSONAL_AREA_MULTITRAC |
| **Repositorios** | ~24 interfaces + ~24 implementaciones |
| **Paginas Web** | ~24 paginas .aspx |
| **Patron** | Repository Pattern (Microsoft.Practices.Repository) con Factory Pattern |
| **Framework** | .NET Framework 2.0 |
| **Lenguaje** | C# (BE/DAL), VB.NET (Frontend) |

---

## INDICADORES DEL MODULO

| Indicador | Valor |
|-----------|-------|
| Total de entidades BE | 24+ |
| Total de interfaces de repositorio | ~24 |
| Total de implementaciones de repositorio | ~24 |
| Total de paginas ASP.NET | ~24 |
| Tablas de base de datos relacionadas | 24+ |
| Stored Procedures CRUD | 5 por entidad (~120+) |
| Connection String | `Data Source=SERVER_M; Initial Catalog=BDMultitrac; User ID=sa; Password=Multitr@c2009` |

---

## ESTRUCTURA DEL MODULO PERSONAL

| ID Requerimiento | Sub-Modulo | Descripcion | Entidad Principal | Repositorio | Pagina Web | Prioridad |
|------------------|------------|-------------|-------------------|-------------|------------|-----------|
| PE-001 | DATOS GENERALES | Registro de personal/empleados | PERSONAL | IPERSONALRepository | RegEmpleado.aspx, WFrmPersonalData.aspx | Alta |
| PE-002 | CARGOS | Gestion de personal por cargo | PERSONAL_CARGO | IPERSONAL_CARGORepository | RegCargo.aspx | Alta |
| PE-003 | EPP | Gestion de personal por equipo de proteccion personal | PERSONAL_EPP | IPERSONAL_EPPRepository | WFrmPersonal_EPP_Data.aspx | Alta |
| PE-004 | KARDEX EPP | Historial de entrega de EPP | PERSONAL_EPP_KARDEX | IPERSONAL_EPP_KARDEXRepository | WFrmPersonal_Kardex_Data.aspx, WFrmPersonal_Kardex_List.aspx | Alta |
| PE-005 | DOCUMENTOS PERSONALES | Gestion de documentos personales | PERSONAL_DOCUMENTO | IPERSONAL_DOCUMENTORepository | RegDocumento.aspx, WFrmDocumentosEquipoPersonal_List.aspx | Alta |
| PE-006 | CORREOS | Gestion de correos electronicos | PERSONAL_CORREOS | IPERSONAL_CORREOSRepository | - | Media |
| PE-007 | LICENCIAS | Gestion de licencias de conducir | PERSONAL_LICENCIA_CONDUCIR | IPERSONAL_LICENCIA_CONDUCIRRepository | - | Alta |
| PE-008 | RECORDS | Gestion de records de personal | PERSONAL_RECORD | IPERSONAL_RECORDRepository | WFrmPersonalRecord_Data.aspx | Alta |
| PE-009 | OPORTUNIDADES DE MEJORA | Gestion de oportunidades de mejora | PERSONAL_RECORD_OPORTUNIDAD_MEJORA | IPERSONAL_RECORD_OPORTUNIDAD_MEJORARepository | - | Alta |
| PE-010 | REQUERIMIENTOS | Aprobacion de requerimientos | PERSONAL_REQUERIMIENTOS_APROBACION | IPERSONAL_REQUERIMIENTOS_APROBACIONRepository | WFrmPersonalRequerimientoAprobacion.aspx | Alta |
| PE-011 | VIATICOS | Aprobacion de viaticos | PERSONAL_VIATICOS_APROBACION | IPERSONAL_VIATICOS_APROBACIONRepository | WFrmPersonalViaticosAprobacion.aspx | Alta |
| PE-012 | VACACIONES | Gestion de vacaciones | PERSONAL_VACACIONES | IPERSONAL_VACACIONESRepository | WFrmPersonalVacacionesReg.aspx | Alta |
| PE-013 | REGISTRO VACACIONES | Registro de vacaciones | PERSONAL_VACACIONES_REGISTRO | IPERSONAL_VACACIONES_REGISTRORepository | WFrmPersonalVacacionesReg.aspx | Alta |
| PE-014 | AREAS | Gestion de areas de personal | PERSONAL_AREA_MULTITRAC | IPERSONAL_AREA_MULTITRACRepository | WFrmPersonalData.aspx (tab AREA) | Alta |
| PE-015 | ESTADO DOCUMENTOS | Historial de estado de documentos | PERSONAL_ESTADO_DOCUMENTO | IPERSONAL_ESTADO_DOCUMENTORepository | - | Alta |
| PE-016 | NIVEL EDUCATIVO | Gestion de niveles educativos | NIVEL_EDUCATIVO | INIVEL_EDUCATIVORepository | WFrmPersonalData.aspx | Media |
| PE-017 | GRADO DE INSTRUCCION | Gestion de grados de instruccion | GRADO_INSTRUCCION | IGRADO_INSTRUCCIONRepository | WFrmPersonalData.aspx | Media |
| PE-018 | NUMERO DE PERSONAL | Gestion de numeros de personal | NRO_PERSONAL | INRO_PERSONALRepository | - | Media |
| PE-019 | AFP | Gestion de AFP | AFP | IAFPRepository | WFrmPersonalData.aspx | Alta |
| PE-020 | EXAMEN MEDICO | Gestion de examenes medicos | BC_EXAMEN_MEDICO | IBC_EXAMEN_MEDICORepository | - | Alta |
| PE-021 | CAPACITACION PERSONAL | Gestion de capacitaciones | CAPACITACION_PERSONAL | ICAPACITACION_PERSONALRepository | WFrmSeguridadRegistrarCurso.aspx, WFrmSeguridadListarCursosPersonal.aspx | Alta |
| PE-022 | CAPACITACION PER PERSONAL | Gestion de asistencia a capacitaciones | CAPACITACION_PER_PERSONAL | ICAPACITACION_PER_PERSONALRepository | - | Alta |
| PE-023/24 | TIPO CARGA | Gestion de tipos de carga | TIPO_CARGA | ITIPO_CARGARepository | WFrmTipoCarga.aspx | Alta |

---

## PE-001: REGISTRO DE PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-001 |
| **Descripcion** | Registro de personal/empleados |
| **Entidad BE** | PERSONAL |
| **Repositorio DAL** | IPERSONALRepository → PERSONALRepository |
| **Paginas Web** | RegEmpleado.aspx, WFrmPersonalData.aspx, WFrmPersonalList.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL (Completa)

**Archivo**: `OperacionesIdentity/PERSONAL.cs`
**Tabla**: `[dbo].[PERSONAL]`

| Propiedad | Tipo .NET | PK | FK | Nullable | Descripcion |
|-----------|-----------|----|----|----------|-------------|
| `Id_Personal` | `System.Int32` | **SI** | - | No | Identificador unico del personal |
| `Usuario_Personal` | `System.String` | - | - | No | Username para autenticacion |
| `Nom_Personal` | `System.String` | - | - | No | Nombre completo |
| `AP_Personal` | `System.String` | - | - | No | Apellido paterno |
| `AM_Personal` | `System.String` | - | - | No | Apellido materno |
| `DNI_Personal` | `System.String` | - | - | No | Documento de identidad nacional |
| `Email_Personal` | `System.String` | - | - | No | Correo electronico |
| `Cel_Personal` | `System.String` | - | - | No | Celular |
| `Tlf_Pesronal` | `System.String` | - | - | No | Telefono fijo |
| `Direccion_Personal` | `System.String` | - | - | No | Direccion domiciliaria |
| `LugarNacimiento_Personal` | `System.String` | - | - | No | Lugar de nacimiento |
| `LugarResidencia_Personal` | `System.String` | - | - | No | Lugar de residencia |
| `FechNac_Personal` | `Nullable<DateTime>` | - | - | Si | Fecha de nacimiento |
| `FechaAdmitido_Personal` | `Nullable<DateTime>` | - | - | Si | Fecha de admision |
| `FechaBaja_Personal` | `Nullable<DateTime>` | - | - | Si | Fecha de baja/termino |
| `FechaIngresoAFP` | `Nullable<DateTime>` | - | - | Si | Fecha de ingreso a AFP |
| `Sexo_Personal` | `System.String` | - | - | No | Genero (M/F) |
| `EstadoCivil_Personal` | `System.String` | - | - | No | Estado civil |
| `Id_NivelEducativo` | `System.Int32` | - | **FK → NIVEL_EDUCATIVO** | No | Nivel educativo |
| `Id_Contratista` | `System.Int32` | - | **FK → CONTRATISTA** | No | Empresa/Contratista |
| `StatusOP` | `Nullable<Int32>` | - | - | Si | Status operacional (0=Activo, 1=Inactivo) |
| `SueldoBruto_Personal` | `Nullable<Decimal>` | - | - | Si | Sueldo bruto mensual |
| `Lic_Personal` | `System.String` | - | - | No | Numero de licencia |
| `Id_Lic_Personal` | `Nullable<Int32>` | - | **FK → PERSONAL_LICENCIA_CONDUCIR** | Si | Tipo de licencia |
| `Pasaporte_Personal` | `System.String` | - | - | No | Numero de pasaporte |
| `Requerimientos` | `Nullable<Int32>` | - | - | Si | Flag de requerimientos |
| `Foto_Personal` | `System.String` | - | - | No | Ruta de fotografia |
| `fot_Personal` | `System.String` | - | - | No | Fotocheck reference |
| `cUSSP` | `System.String` | - | - | No | Codigo USS/P |
| `aFP_Personal` | `Nullable<Int32>` | - | **FK → AFP** | Si | Codigo AFP |
| `eMP_COD` | `Nullable<Int32>` | - | - | Si | Codigo de empresa |
| `eSALUD_AutoGenerado` | `System.String` | - | - | No | ESSALUD auto-generado |
| `rpc_Personal` | `System.String` | - | - | No | Codigo RPC |
| `rPM_Personal` | `System.String` | - | - | No | Codigo RPM |
| `sCTR` | `System.String` | - | - | No | Codigo SCTR |

### Repositorio IPERSONALRepository

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

### Implementacion PERSONALRepository

**Archivo**: `OperacionesDAL/OperacionesIdentity.PERSONALRepositoryArtifacts/PERSONALRepository.cs`

- Extiende `Repository<PERSONAL>` base class
- **Error Handling**: `HandleSqlException` con `RepositoryValidationException`, `ConcurrencyViolationException`, `RepositoryFailureException`
- Usa `ErrorCodes.SqlUserRaisedError` para mapeo de errores SQL

### Repository Artifacts (8 archivos)

| Artefacto | Archivo | Procedimiento Almacenado |
|-----------|---------|--------------------------|
| PERSONALInsertFactory | `PERSONALInsertFactory.cs` | `dbo.InsertPERSONAL` |
| PERSONALUpdateFactory | `PERSONALUpdateFactory.cs` | `dbo.UpdatePERSONAL` |
| PERSONALDeleteFactory | `PERSONALDeleteFactory.cs` | `dbo.DeletePERSONAL` |
| GetAllFromPERSONALFactory | `GetAllFromPERSONALFactory.cs` | Mapeo DataReader → PERSONAL |
| GetAllFromPERSONALSelectionFactory | `GetAllFromPERSONALSelectionFactory.cs` | `dbo.GetAllFromPERSONAL` |
| GetPERSONALById_PersonalFactory | `GetPERSONALById_PersonalFactory.cs` | Mapeo DataReader → PERSONAL |
| GetPERSONALById_PersonalSelectionFactory | `GetPERSONALById_PersonalSelectionFactory.cs` | `dbo.GetPERSONALById_Personal` |
| PERSONALRepository | `PERSONALRepository.cs` | Clase principal |

### INSERT Factory Detalle

Llama a `dbo.InsertPERSONAL` con parametros:
- Todos los campos NO NULLABLE siempre se envian
- Todos los campos NULLABLE se envian condicionalmente (`if(field != null)`)
- `id_Personal` es **OUTPUT** (auto-generado)
- `SetNewID` lee el OUTPUT y asigna al entity

### UPDATE Factory Detalle

Llama a `dbo.UpdatePERSONAL` con:
- `id_Personal` como WHERE (obligatorio)
- Todos los campos como input
- Incluye verificacion de concurrencia con `@@ROWCOUNT`

### Paginas Web

**WFrmPersonalData.aspx** (FORMULARIO PRINCIPAL DE REGISTRO):
- **Master Page**: `Operaciones.master`
- **TabContainer** con pestañas: DATOS GENERALES, AREA, CARGO, EQUIPO
- **Campos**:
  - Id_Personal, Cod_EMP
  - Apellido Paterno, Apellido Materno, Nombres
  - Brevete, DNI, Fotocheck
  - Fecha Nacimiento (CalendarExtender), Sexo
  - Celular, Telefono Fijo
  - RPC, RPM
  - Grado Instruccion (DropDownList)
  - AFP (DropDownList)
  - Email, Lugar Residencia
  - Fecha Ingreso AFP, Lugar Nacimiento
  - CUSSP, Empresa/Socio/Tercero
  - Usuario, ESSALUD
  - Fecha Ingreso, Sueldo Bruto, Estado Personal
  - Fecha Sece, Pasaporte
  - Requerimientos, Foto Personal
- **ObjectDataSources**: `odsGradoInstruccion`, `odsBrevereTipo`, `odsAFP`, `odsEmpresSocioTercero`

**WFrmPersonalList.aspx** (LISTA):
- **Master Page**: `Operaciones.master`
- **GridView** `gwListaUsuarios` con columnas:
  - `Id_Personal`, `Personal`, `Contratista`, `DNI`, `Fot_Personal`, `Cargo`, `Estado`
  - HyperLinkField → `WFrmPersonalData.aspx?acc=EDITAR&IdPer={0}`
- **ObjectDataSource**: `SP_PERSONAL_List` (TypeName: `PERSONAL_DAL`)
- **Filtro**: StatusOP dropdown

**RegEmpleado.aspx** (MANTENIMIENTO LEGACY):
- **DetailsView** con `EMPLEADO1` data source
- Campos: `emp_cod`, `emp_apa`, `emp_ama`, etc.
- Clase compilada: `RegEmpleado, App_Web_3lbhlb5a`

**WFrmPersonal_EPP_Data.aspx** (REGISTRO EPP):
- DropDownList para seleccionar personal
- DetailsView muestra: `Id_Personal`, `Personal`, `Cargo`, `DNI`, `Fot_Personal`, `Lic_Personal`, `Contratista`
- GridView para items EPP con columnas: Nro, Desc_Requerimiento, Talla

**WFrmPersonal_Kardex_Data.aspx** (KARDEX EPP):
- DetailsView: `Id_Personal`, `Personal`, `Cargo`, `DNI_Personal`, `Fot_Personal`, `Lic_Personal`, `Contratista`
- DropDownList para Personal-EPP
- Campos: `IdDetReq`, `IdReqGen`, `Cantidad`

**WFrmPersonal_Kardex_List.aspx** (LISTA KARDEX):
- GridView con: `COD PERS.`, `PERSONAL`, `CARGO`, `EMPRESA/SOCIO/TERCERO`
- CheckBox columns para EPP items: Botas de Jebe, Camisa de Drill, Casco, Chaleco, Guantes de Cuero, Guantes de Nitrilo, etc.
- ObjectDataSource: `odsPersonalEPP_Kardex`

---

## PE-002: GESTION DE CARGOS POR AREAS

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-002 |
| **Descripcion** | Gestion de personal por areas y cargos |
| **Entidad BE** | PERSONAL_CARGO |
| **Repositorio** | IPERSONAL_CARGORepository |
| **Paginas** | RegCargo.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_CARGO

**Archivo**: `OperacionesIdentity/PERSONAL_CARGO.cs`
**Tabla**: `[dbo].[PERSONAL_CARGO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PersonalCargo` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `Id_Cargo` | `System.Int32` | - | **FK → CARGO** | No | FK al cargo |
| `FechaIncio_Cargo` | `Nullable<DateTime>` | - | - | Si | Fecha de inicio del cargo |
| `FechaFin_Cargo` | `Nullable<DateTime>` | - | - | Si | Fecha de fin del cargo |
| `estado` | `System.String` | - | - | No | Estado (A/I) |

**Repositorio**: IPERSONAL_CARGORepository → `PERSONAL_CARGORepository`
**Stored Procedures**: `InsertPERSONAL_CARGO`, `UpdatePERSONAL_CARGO`, `DeletePERSONAL_CARGO`, `GetAllFromPERSONAL_CARGO`, `GetPERSONAL_CARGOById_PersonalCargo`

**Pagina**: `RegCargo.aspx`
- DropDownList para seleccionar area
- DetailsView con campos: `nombreCargo`, `certificación académica`, `requerimientos`, `experiencia`

---

## PE-003: GESTION DE EPP (EQUIPO DE PROTECCION PERSONAL)

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-003 |
| **Descripcion** | Gestion de personal por equipo de proteccion personal |
| **Entidad BE** | PERSONAL_EPP |
| **Repositorio** | IPERSONAL_EPPRepository |
| **Paginas** | WFrmPersonal_EPP_Data.aspx, WFrmPersonal_Kardex_List.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_EPP

**Archivo**: `OperacionesIdentity/PERSONAL_EPP.cs`
**Tabla**: `[dbo].[PERSONAL_EPP]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_Pesonal_EPP` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `Id_RequerimientoGeneral` | `Nullable<Int32>` | - | **FK → REQUERIMIENTO** | Si | FK a requerimiento general |
| `Talla` | `System.String` | - | - | No | Talla del EPP |
| `Estado` | `System.String` | - | - | No | Estado |
| `Observacion` | `System.String` | - | - | No | Observaciones |

**Repositorio**: IPERSONAL_EPPRepository → `PERSONAL_EPPRepository`
**Stored Procedures**: `InsertPERSONAL_EPP` (OUT `id_Pesonal_EPP`), `UpdatePERSONAL_EPP`, `DeletePERSONAL_EPP`, `GetAllFromPERSONAL_EPP`, `GetPERSONAL_EPPById_Pesonal_EPP`

---

## PE-004: KARDEX DE EPP DEL PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-004 |
| **Descripcion** | Historial de entrega y reposicion de EPP |
| **Entidad BE** | PERSONAL_EPP_KARDEX |
| **Repositorio** | IPERSONAL_EPP_KARDEXRepository |
| **Paginas** | WFrmPersonal_Kardex_Data.aspx, WFrmPersonal_Kardex_List.aspx, WFrmReporte_PersonalEppKardex.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_EPP_KARDEX

**Archivo**: `OperacionesIdentity/PERSONAL_EPP_KARDEX.cs`
**Tabla**: `[dbo].[PERSONAL_EPP_KARDEX]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PeronalEPP_Kardex` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Pesonal_EPP` | `System.Int32` | - | **FK → PERSONAL_EPP** | No | FK al EPP |
| `IdUndidadCantidad` | `Nullable<Int32>` | - | - | Si | Unidad de cantidad |
| `Cantidad` | `Nullable<Int32>` | - | - | Si | Cantidad entregada |
| `Estado` | `System.String` | - | - | No | Estado |
| `FechaEntrega` | `Nullable<DateTime>` | - | - | Si | Fecha de entrega |
| `FechaReposicion` | `Nullable<DateTime>` | - | - | Si | Fecha de reposicion |
| `FechaRevision` | `Nullable<DateTime>` | - | - | Si | Fecha de revision |
| `Id_EPP_Condicion_Entrega` | `Nullable<Int32>` | - | - | Si | Condicion al entregar |
| `Id_EPP_Condicion_Reposicion` | `Nullable<Int32>` | - | - | Si | Condicion al reposicionar |
| `Id_EPP_Condicion_Revision` | `Nullable<Int32>` | - | - | Si | Condicion al revisar |

**Repositorio**: IPERSONAL_EPP_KARDEXRepository → `PERSONAL_EPP_KARDEXRepository`
**Reporte**: `WFrmReporte_PersonalEppKardex.aspx`

---

## PE-005: GESTION DE DOCUMENTOS PERSONALES

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-005 |
| **Descripcion** | Gestion de documentos personales de empleados |
| **Entidad BE** | PERSONAL_DOCUMENTO |
| **Repositorio** | IPERSONAL_DOCUMENTORepository |
| **Paginas** | WFrmDocumentosEquipoPersonal_List.aspx, WFrmDocumentosEquipoPersonal_Data.aspx, WFrmDocumentosEquipoPersonal_MostrarArchivo.aspx, WFrmReporteDocumentosPersonal.aspx, RegDocumento.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_DOCUMENTO

**Archivo**: `OperacionesIdentity/PERSONAL_DOCUMENTO.cs`
**Tabla**: `[dbo].[PERSONAL_DOCUMENTO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdPersonalDocumento` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonal` | `Nullable<Int32>` | - | **FK → PERSONAL** | Si | FK al personal |
| `IdDocumento` | `Nullable<Int32>` | - | **FK → DOCUMENTO** | Si | FK al tipo de documento |
| `nroDocumento` | `System.String` | - | - | No | Numero de documento |
| `fechaExped` | `Nullable<DateTime>` | - | - | Si | Fecha de expedicion |
| `fechaVencimiento` | `Nullable<DateTime>` | - | - | Si | Fecha de vencimiento |
| `estado` | `System.String` | - | - | No | Estado (A/I) |
| `nombreArchivo` | `System.String` | - | - | No | Nombre del archivo |
| `uRL` | `System.String` | - | - | No | Ruta del archivo |
| `observacion` | `System.String` | - | - | No | Observaciones |
| `usuarioModificacion` | `System.String` | - | - | No | Usuario que modifico |
| `fechaModificacion` | `Nullable<DateTime>` | - | - | Si | Fecha de modificacion |

**Repositorio**: IPERSONAL_DOCUMENTORepository → `PERSONAL_DOCUMENTORepository`
**Artifacts**: 8 archivos (InsertFactory, UpdateFactory, DeleteFactory, GetAllFactory, GetByIdFactory, GetAllSelectionFactory, GetByIdSelectionFactory)

**Paginas**:
- `WFrmDocumentosEquipoPersonal_List.aspx` (lista principal con 3 grids: Equipos, Personal, Contratista)
- `WFrmDocumentosEquipoPersonal_Data.aspx` (formulario con FileUpload)
- `WFrmDocumentosEquipoPersonal_MostrarArchivo.aspx` (visor de imagen/documento)
- `WFrmReporteDocumentosPersonal.aspx` (reporte SSRS)

---

## PE-006: GESTION DE CORREOS ELECTRONICOS

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-006 |
| **Descripcion** | Gestion de correos electronicos del personal |
| **Entidad BE** | PERSONAL_CORREOS |
| **Repositorio** | IPERSONAL_CORREOSRepository |
| **Paginas** | - |
| **Prioridad** | Media |

### Entidad PERSONAL_CORREOS

**Archivo**: `OperacionesIdentity/PERSONAL_CORREOS.cs`
**Tabla**: `[dbo].[PERSONAL_CORREOS]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdCorreosMail` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `CorreoMail` | `System.String` | - | - | No | Dirección de correo |

**Repositorio**: IPERSONAL_CORREOSRepository → `PERSONAL_CORREOSRepository`
**Stored Procedures**: `InsertPERSONAL_CORREOS`, `UpdatePERSONAL_CORREOS`, `DeletePERSONAL_CORREOS`, `GetAllFromPERSONAL_CORREOS`

---

## PE-007: GESTION DE LICENCIAS DE CONDUCIR

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-007 |
| **Descripcion** | Gestion de licencias de conducir del personal |
| **Entidad BE** | PERSONAL_LICENCIA_CONDUCIR |
| **Repositorio** | IPERSONAL_LICENCIA_CONDUCIRRepository |
| **Paginas** | - |
| **Prioridad** | Alta |

### Entidad PERSONAL_LICENCIA_CONDUCIR

**Archivo**: `OperacionesIdentity/PERSONAL_LICENCIA_CONDUCIR.cs`
**Tabla**: `[dbo].[PERSONAL_LICENCIA_CONDUCIR]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_Lic_Personal` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Nombre_Lic_Personal` | `System.String` | - | - | No | Nombre/tipo de licencia |
| `Observaciones` | `System.String` | - | - | No | Observaciones |

**Repositorio**: IPERSONAL_LICENCIA_CONDUCIRRepository → `PERSONAL_LICENCIA_CONDUCIRRepository`

---

## PE-008: GESTION DE RECORDS DE PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-008 |
| **Descripcion** | Gestion de records de personal (sanciones/recompensas) |
| **Entidad BE** | PERSONAL_RECORD |
| **Repositorio** | IPERSONAL_RECORDRepository |
| **Paginas** | WFrmPersonalRecord_Data.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_RECORD

**Archivo**: `OperacionesIdentity/PERSONAL_RECORD.cs`
**Tabla**: `[dbo].[PERSONAL_RECORD]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_Personal_Record` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `Id_TipoOcurrencia` | `System.Int32` | - | - | No | Tipo de ocurrencia |
| `FechaOcurrencia` | `Nullable<DateTime>` | - | - | Si | Fecha de la ocurrencia |
| `Fecha_Reporte` | `Nullable<DateTime>` | - | - | Si | Fecha del reporte |
| `Descripcion_Ocurrencia` | `System.String` | - | - | No | Descripcion de la ocurrencia |
| `Merito` | `System.String` | - | - | No | Tipo de merito/sancion |
| `Demerito` | `System.String` | - | - | No | Demerito |
| `RecordIncial` | `System.String` | - | - | No | Record inicial |
| `RecordFinal` | `System.String` | - | - | No | Record final |
| `Medidas_A_Implementar` | `System.String` | - | - | No | Medidas a implementar |
| `Id_Personal_MedImpl` | `Nullable<Int32>` | - | - | Si | Personal que implemento medidas |
| `Id_Personal_Verificacion` | `Nullable<Int32>` | - | - | Si | Personal que verifico |

**Repositorio**: IPERSONAL_RECORDRepository → `PERSONAL_RECORDRepository`
**Stored Procedures**: `InsertPERSONAL_RECORD` (OUT `id_Personal_Record`), `UpdatePERSONAL_RECORD`, `DeletePERSONAL_RECORD`, `GetAllFromPERSONAL_RECORD`, `GetPERSONAL_RECORDById_Personal_Record`

---

## PE-009: OPORTUNIDADES DE MEJORA

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-009 |
| **Descripcion** | Gestion de oportunidades de mejora derivadas de records |
| **Entidad BE** | PERSONAL_RECORD_OPORTUNIDAD_MEJORA |
| **Repositorio** | IPERSONAL_RECORD_OPORTUNIDAD_MEJORARepository |
| **Paginas** | - |
| **Prioridad** | Alta |

### Entidad PERSONAL_RECORD_OPORTUNIDAD_MEJORA

**Archivo**: `OperacionesIdentity/PERSONAL_RECORD_OPORTUNIDAD_MEJORA.cs`
**Tabla**: `[dbo].[PERSONAL_RECORD_OPORTUNIDAD_MEJORA]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PerRec_OportMej` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal_Record` | `System.Int32` | - | **FK → PERSONAL_RECORD** | No | FK al record |
| `Id_Oportunidad_Mejora` | `System.Int32` | - | **FK → OPORTUNIDAD_MEJORA** | No | FK a oportunidad |
| `Oportunidad_Mejora` | `System.String` | - | - | No | Descripcion de oportunidad |
| `Puntaje` | `Nullable<Int32>` | - | - | Si | Puntaje asignado |
| `Activo` | `System.String` | - | - | No | Estado |

---

## PE-010: REQUERIMIENTOS APROBADOS

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-010 |
| **Descripcion** | Aprobacion de requerimientos del personal |
| **Entidad BE** | PERSONAL_REQUERIMIENTOS_APROBACION |
| **Repositorio** | IPERSONAL_REQUERIMIENTOS_APROBACIONRepository |
| **Paginas** | WFrmPersonalRequerimientoAprobacion.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_REQUERIMIENTOS_APROBACION

**Archivo**: `OperacionesIdentity/PERSONAL_REQUERIMIENTOS_APROBACION.cs`
**Tabla**: `[dbo].[PERSONAL_REQUERIMIENTOS_APROBACION]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PersonalRequerimientosAprobacion` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `FechaInicio` | `Nullable<DateTime>` | - | - | Si | Fecha de inicio |
| `FechaFin` | `Nullable<DateTime>` | - | - | Si | Fecha de fin |
| `Estado` | `System.String` | - | - | No | Estado |

**Repositorio**: IPERSONAL_REQUERIMIENTOS_APROBACIONRepository → `PERSONAL_REQUERIMIENTOS_APROBACIONRepository`
**Pagina**: `WFrmPersonalRequerimientoAprobacion.aspx` con CalendarExtender para fechas y GridView

---

## PE-011: VIATICOS APROBADOS

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-011 |
| **Descripcion** | Aprobacion de viaticos del personal |
| **Entidad BE** | PERSONAL_VIATICOS_APROBACION |
| **Repositorio** | IPERSONAL_VIATICOS_APROBACIONRepository |
| **Paginas** | WFrmPersonalViaticosAprobacion.aspx, WFrmViaticosRequerimientosAdicional.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_VIATICOS_APROBACION

**Archivo**: `OperacionesIdentity/PERSONAL_VIATICOS_APROBACION.cs`
**Tabla**: `[dbo].[PERSONAL_VIATICOS_APROBACION]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PersonalAprobacionViaticos` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `FechaInicio` | `Nullable<DateTime>` | - | - | Si | Fecha de inicio |
| `FechaFin` | `Nullable<DateTime>` | - | - | Si | Fecha de fin |
| `Estado` | `System.String` | - | - | No | Estado |

**Repositorio**: IPERSONAL_VIATICOS_APROBACIONRepository → `PERSONAL_VIATICOS_APROBACIONRepository`
**Paginas**: `WFrmPersonalViaticosAprobacion.aspx`, `WFrmViaticosRequerimientosAdicional.aspx`, `WFrmViaticosRequerimientoAdicional_List.aspx`, `WFrmViaticosOperacion.aspx`, `WFrmViaticosImprimir.aspx`, `WFrmViaticosImprimirControl.aspx`, `WFrmViaticosEntrega.aspx`, `WFrmReporte_ViaticosOperacion.aspx`, `WFrmReporte_ViaticosGuiasRemision.aspx`

---

## PE-012: GESTION DE VACACIONES

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-012 |
| **Descripcion** | Gestion de vacaciones del personal |
| **Entidad BE** | PERSONAL_VACACIONES |
| **Repositorio** | IPERSONAL_VACACIONESRepository |
| **Paginas** | WFrmPersonalVacacionesReg.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_VACACIONES

**Archivo**: `OperacionesIdentity/PERSONAL_VACACIONES.cs`
**Tabla**: `[dbo].[PERSONAL_VACACIONES]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdPersonalVacaciones` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `PeriodoIni` | `Nullable<DateTime>` | - | - | Si | Inicio del periodo |
| `PeriodoFin` | `Nullable<DateTime>` | - | - | Si | Fin del periodo |
| `DiasPendientes` | `Nullable<Int32>` | - | - | Si | Dias de vacaciones pendientes |
| `Estado` | `System.String` | - | - | No | Estado |
| `Observaciones` | `System.String` | - | - | No | Observaciones |
| `FechaIng` | `Nullable<DateTime>` | - | - | Si | Fecha de ingreso |

**Repositorio**: IPERSONAL_VACACIONESRepository → `PERSONAL_VACACIONESRepository`
**Nota**: InsertFactory NO usa OUT parameter para `idPersonalVacaciones` (es input)
**Paginas**: `WFrmPersonalVacacionesReg.aspx` con campos: Fecha Salida, Fecha Retorno, Dias, Memo Nro., Observaciones, Archivo checkbox

---

## PE-013: REGISTRO DE VACACIONES

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-013 |
| **Descripcion** | Registro detallado de vacaciones tomadas |
| **Entidad BE** | PERSONAL_VACACIONES_REGISTRO |
| **Repositorio** | IPERSONAL_VACACIONES_REGISTRORepository |
| **Paginas** | WFrmPersonalVacacionesReg.aspx |
| **Prioridad** | Alta |

### Entidad PERSONAL_VACACIONES_REGISTRO

**Archivo**: `OperacionesIdentity/PERSONAL_VACACIONES_REGISTRO.cs`
**Tabla**: `[dbo].[PERSONAL_VACACIONES_REGISTRO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdPersonalVacacionesReg` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonalVacaciones` | `System.Int32` | - | **FK → PERSONAL_VACACIONES** | No | FK a vacaciones |
| `FechaSalVac` | `Nullable<DateTime>` | - | - | Si | Fecha de salida de vacaciones |
| `FechaRetVac` | `Nullable<DateTime>` | - | - | Si | Fecha de retorno de vacaciones |
| `DiasVac` | `Nullable<Int32>` | - | - | Si | Dias de vacaciones |
| `Memo` | `System.String` | - | - | No | Numero de memo |
| `Observaciones` | `System.String` | - | - | No | Observaciones |
| `Archivo` | `System.String` | - | - | No | Ruta de archivo |

---

## PE-014: GESTION DE AREAS DE PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-014 |
| **Descripcion** | Gestion de areas asignadas al personal |
| **Entidad BE** | PERSONAL_AREA_MULTITRAC |
| **Repositorio** | IPERSONAL_AREA_MULTITRACRepository |
| **Paginas** | WFrmPersonalData.aspx (tab AREA) |
| **Prioridad** | Alta |

### Entidad PERSONAL_AREA_MULTITRAC

**Archivo**: `OperacionesIdentity/PERSONAL_AREA_MULTITRAC.cs`
**Tabla**: `[dbo].[PERSONAL_AREA_MULTITRAC]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_PersonalAreaMultitrac` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_Personal` | `Nullable<Int32>` | - | **FK → PERSONAL** | Si | FK al personal |
| `Id_AreaMultitrac` | `Nullable<Int32>` | - | **FK → AREA_MULTITRAC** | Si | FK al area |
| `FechaInicio` | `Nullable<DateTime>` | - | - | Si | Fecha de inicio |
| `FechaFin` | `Nullable<DateTime>` | - | - | Si | Fecha de fin |
| `Estado` | `System.String` | - | - | No | Estado |

**Repositorio**: IPERSONAL_AREA_MULTITRACRepository → `PERSONAL_AREA_MULTITRACRepository`
**Pagina**: Tab AREA dentro de `WFrmPersonalData.aspx` con ObjectDataSource

---

## PE-015: HISTORIAL DE ESTADO DE DOCUMENTOS

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-015 |
| **Descripcion** | Historial de estados de documentos personales (trazabilidad) |
| **Entidad BE** | PERSONAL_ESTADO_DOCUMENTO |
| **Repositorio** | IPERSONAL_ESTADO_DOCUMENTORepository |
| **Paginas** | - |
| **Prioridad** | Alta |

### Entidad PERSONAL_ESTADO_DOCUMENTO

**Archivo**: `OperacionesIdentity/PERSONAL_ESTADO_DOCUMENTO.cs`
**Tabla**: `[dbo].[PERSONAL_ESTADO_DOCUMENTO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdPersonalEstadoDocumento` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonalDocumento` | `Nullable<Int32>` | - | **FK → PERSONAL_DOCUMENTO** | Si | FK al documento |
| `IdEstadoDocumento` | `Nullable<Int32>` | - | - | Si | Tipo de estado |
| `IdEnviadoPor` | `Nullable<Int32>` | - | - | Si | Quien envio |
| `IdEnviadoA` | `Nullable<Int32>` | - | - | Si | A quien se envio |
| `FechaHoraLlegada` | `Nullable<DateTime>` | - | - | Si | Fecha de llegada |
| `FechaHoraSalida` | `Nullable<DateTime>` | - | - | Si | Fecha de salida |
| `Estado` | `System.String` | - | - | No | Estado |
| `Observaciones` | `System.String` | - | - | No | Observaciones |

**Repositorio**: IPERSONAL_ESTADO_DOCUMENTORepository → `PERSONAL_ESTADO_DOCUMENTORepository`
**Stored Procedures**: `InsertPERSONAL_ESTADO_DOCUMENTO`, `UpdatePERSONAL_ESTADO_DOCUMENTO`, `DeletePERSONAL_ESTADO_DOCUMENTO`, `GetAllFromPERSONAL_ESTADO_DOCUMENTO`, `GetPERSONAL_ESTADO_DOCUMENTOByIdPersonalEstadoDocumento`

---

## PE-016: NIVEL EDUCATIVO

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-016 |
| **Descripcion** | Gestion de niveles educativos |
| **Entidad BE** | NIVEL_EDUCATIVO |
| **Repositorio** | INIVEL_EDUCATIVORepository |
| **Paginas** | WFrmPersonalData.aspx |
| **Prioridad** | Media |

### Entidad NIVEL_EDUCATIVO

**Archivo**: `OperacionesIdentity/NIVEL_EDUCATIVO.cs`
**Tabla**: `[dbo].[NIVEL_EDUCATIVO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `id_NivelEducativo` | `System.Int32` | **SI** | - | No | Identificador unico |
| `codInterno` | `System.String` | - | - | No | Codigo interno |
| `descripcion_NivelEducativo` | `System.String` | - | - | No | Descripcion del nivel |
| `id_GradoInstruccion` | `System.Int32` | - | **FK → GRADO_INSTRUCCION** | No | FK al grado |

**Repositorio**: INIVEL_EDUCATIVORepository → `NIVEL_EDUCATIVORepository`
**App.config**: Registrado como `INIVEL_EDUCATIVORepository`

---

## PE-017: GRADO DE INSTRUCCION

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-017 |
| **Descripcion** | Gestion de grados de instruccion |
| **Entidad BE** | GRADO_INSTRUCCION |
| **Repositorio** | IGRADO_INSTRUCCIONRepository |
| **Paginas** | WFrmPersonalData.aspx |
| **Prioridad** | Media |

### Entidad GRADO_INSTRUCCION

**Archivo**: `OperacionesIdentity/GRADO_INSTRUCCION.cs`
**Tabla**: `[dbo].[GRADO_INSTRUCCION]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_GradoInstruccion` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Nom_GradoInstucion` | `System.String` | - | - | No | Nombre del grado |

**Repositorio**: IGRADO_INSTRUCCIONRepository → `GRADO_INSTRUCCIONRepository`
**App.config**: Registrado como `IGRADO_INSTRUCCIONRepository`

---

## PE-018: NUMERO DE PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-018 |
| **Descripcion** | Gestion de numeros de personal |
| **Entidad BE** | NRO_PERSONAL |
| **Repositorio** | INRO_PERSONALRepository |
| **Paginas** | - |
| **Prioridad** | Media |

### Entidad NRO_PERSONAL

**Archivo**: `OperacionesIdentity/NRO_PERSONAL.cs`
**Tabla**: `[dbo].[NRO_PERSONAL]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdNroPer` | `System.Int32` | **SI** | - | No | Identificador unico |

**Repositorio**: INRO_PERSONALRepository → `NRO_PERSONALRepository`
**Implementation**: `NRO_PERSONALRepository.cs` en `OperacionesIdentity.NRO_PERSONALRepositoryArtifacts\`
**App.config**: Registrado como `INRO_PERSONALRepository`

---

## PE-019: GESTION DE AFP

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-019 |
| **Descripcion** | Gestion de Administradoras de Fondos de Pensiones |
| **Entidad BE** | AFP |
| **Repositorio** | IAFPRepository |
| **Paginas** | WFrmPersonalData.aspx |
| **Prioridad** | Alta |

### Entidad AFP

**Archivo**: `OperacionesIdentity/AFP.cs`
**Tabla**: `[dbo].[AFP]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_AFP` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Nom_AFP` | `System.String` | - | - | No | Nombre de la AFP |
| `CodigoExcel` | `System.String` | - | - | No | Codigo Excel |
| `Comision` | `System.String` | - | - | No | Comision |
| `Observacion` | `System.String` | - | - | No | Observaciones |
| `Estado` | `System.String` | - | - | No | Estado |

**Repositorio**: IAFPRepository → `AFPRepository`
**App.config**: Registrado como `IAFPRepository`

---

## PE-020: EXAMEN MEDICO

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-020 |
| **Descripcion** | Gestion de examenes medicos del personal |
| **Entidad BE** | BC_EXAMEN_MEDICO |
| **Repositorio** | IBC_EXAMEN_MEDICORepository |
| **Paginas** | - |
| **Prioridad** | Alta |

### Entidad BC_EXAMEN_MEDICO

**Archivo**: `OperacionesIdentity/BC_EXAMEN_MEDICO.cs`
**Tabla**: `[dbo].[BC_EXAMEN_MEDICO]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `IdExamenMedico` | `System.Int32` | **SI** | - | No | Identificador unico |
| `IdPersonal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `IdPersonalDocumento` | `System.Int32` | - | **FK → PERSONAL_DOCUMENTO** | No | FK al documento |
| `IdContratista` | `System.Int32` | - | **FK → CONTRATISTA** | No | FK al contratista |
| `IdBaucherCaja` | `System.Int32` | - | **FK → BAUCHER_CAJA** | No | FK a caja chica |
| `IdBaucherEgresos` | `System.Int32` | - | **FK → BAUCHER_EGRESOS** | No | FK a egresos |
| `IdMoneda` | `System.Int32` | - | **FK → MONEDA** | No | FK a moneda |
| `Descripcion` | `System.String` | - | - | No | Descripcion del examen |
| `Monto` | `System.String` | - | - | No | Monto |
| `Factura` | `System.String` | - | - | No | Numero de factura |
| `FechaFactura` | `System.String` | - | - | No | Fecha de factura |

**Repositorio**: IBC_EXAMEN_MEDICORepository → `BC_EXAMEN_MEDICORepository`

---

## PE-021: CAPACITACION PERSONAL

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-021 |
| **Descripcion** | Gestion de programas de capacitacion |
| **Entidad BE** | CAPACITACION_PERSONAL |
| **Repositorio** | ICAPACITACION_PERSONALRepository |
| **Paginas** | WFrmSeguridadRegistrarCurso.aspx, WFrmSeguridadListarCursosPersonal.aspx, WFrmPlanCapacitacionPersonal.aspx |
| **Prioridad** | Alta |

### Entidad CAPACITACION_PERSONAL

**Archivo**: `OperacionesIdentity/CAPACITACION_PERSONAL.cs`
**Tabla**: `[dbo].[CAPACITACION_PERSONAL]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_CapacitacionPersonal` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_CapacitacionTipo` | `System.Int32` | - | **FK → CAPACITACION_TIPO** | No | Tipo de capacitacion |
| `Tema` | `System.String` | - | - | No | Tema de capacitacion |
| `CodigoExpositor` | `System.String` | - | - | No | Codigo del expositor |
| `HoraInicio` | `System.String` | - | - | No | Hora de inicio |
| `HoraFin` | `System.String` | - | - | No | Hora de fin |
| `Fecha_Capacitacion` | `System.DateTime` | - | - | No | Fecha de capacitacion |
| `TotalAsistentes` | `System.Int32` | - | - | No | Total de asistentes |
| `Id_AreaMina` | `System.Int32` | - | - | No | Area de mina |
| `Id_CargoExpositor` | `System.Int32` | - | - | No | Cargo del expositor |
| `Id_Expositor` | `System.Int32` | - | - | No | Expositor |
| `Id_Supervisor` | `System.Int32` | - | - | No | Supervisor |
| `Id_Empresa` | `System.Int32` | - | - | No | Empresa |

**Repositorio**: ICAPACITACION_PERSONALRepository → `CAPACITACION_PERSONALRepository`
**Nota**: InsertFactory NO usa OUT parameter para `id_CapacitacionPersonal`

**Paginas**:
- `WFrmSeguridadRegistrarCurso.aspx` - Formulario de registro de cursos
- `WFrmSeguridadListarCursosPersonal.aspx` - Lista con GridView: IdCursoProg, FechaReg, CantPersonal, PersonalProg, CorreoEnviado
- `WFrmPlanCapacitacionPersonal.aspx` - Reporte con codigo de colores (FALTAN +15 DIAS = verde, <15 DÍAS = amarillo, 0/EXPIRED = rojo)

---

## PE-022: ASISTENCIA A CAPACITACIONES

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-022 |
| **Descripcion** | Gestion de asistencia de personal a capacitaciones |
| **Entidad BE** | CAPACITACION_PER_PERSONAL |
| **Repositorio** | ICAPACITACION_PER_PERSONALRepository |
| **Paginas** | - |
| **Prioridad** | Alta |

### Entidad CAPACITACION_PER_PERSONAL

**Archivo**: `OperacionesIdentity/CAPACITACION_PER_PERSONAL.cs`
**Tabla**: `[dbo].[CAPACITACION_PER_PERSONAL]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_CapPer_Personal` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_CapacitacionPersonal` | `System.Int32` | - | **FK → CAPACITACION_PERSONAL** | No | FK a capacitacion |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | No | FK al personal |
| `Asistencia` | `System.String` | - | - | No | Estado de asistencia |

**Repositorio**: ICAPACITACION_PER_PERSONALRepository → `CAPACITACION_PER_PERSONALRepository`
**Stored Procedures**: `InsertCAPACITACION_PER_PERSONAL`, `UpdateCAPACITACION_PER_PERSONAL`, `DeleteCAPACITACION_PER_PERSONAL`, `GetAllFromCAPACITACION_PER_PERSONAL`, `GetCAPACITACION_PER_PERSONALById_CapPer_Personal`

---

## PE-023/24: TIPO DE CARGA

### Detalles Funcionales

| Campo | Descripcion |
|-------|-------------|
| **ID** | PE-023/24 |
| **Descripcion** | Gestion de tipos de carga (químicos, insumos) |
| **Entidad BE** | TIPO_CARGA |
| **Repositorio** | ITIPO_CARGARepository |
| **Paginas** | WFrmTipoCarga.aspx |
| **Prioridad** | Alta |

### Entidad TIPO_CARGA

**Archivo**: `OperacionesIdentity/TIPO_CARGA.cs`
**Tabla**: `[dbo].[TIPO_CARGA]`

| Propiedad | Tipo | PK | FK | Nullable | Descripcion |
|-----------|------|----|----|----------|-------------|
| `Id_TipoCarga` | `System.Int32` | **SI** | - | No | Identificador unico |
| `Id_TipoProducto` | `System.Int32` | - | - | No | Tipo de producto |
| `Nombre_TipoCarga` | `System.String` | - | - | No | Nombre del tipo |
| `Descripcion_TipoCarga` | `System.String` | - | - | No | Descripcion |
| `CodigoSunat` | `System.String` | - | - | No | Codigo SUNAT |
| `Concentracion` | `System.String` | - | - | No | Concentracion |
| `Nom_InsumoComercial` | `System.String` | - | - | No | Insumo comercial |
| `Nom_InsumoQuimicoFiscalizado` | `System.String` | - | - | No | Insumo quimico fiscalizado |
| `PropietarioCertificado` | `System.String` | - | - | No | Propietario certificado |
| `PropietarioDireccionEntrega` | `System.String` | - | - | No | Direccion de entrega |
| `ProveedorCertificado` | `System.String` | - | - | No | Proveedor certificado |
| `ProveedorDireccionEmbarque` | `System.String` | - | - | No | Direccion de embarque |

**Repositorio**: ITIPO_CARGARepository → `TIPO_CARGARepository`
**Pagina**: `WFrmTipoCarga.aspx`
- GridView con columnas: ID, Descripcion, Tipo Producto, Tipo, Insumo Quimico, Codigo Sunat
- Boton: "REGISTRAR TIPO CARGA"
- ObjectDataSource: `SP_TIPO_CARGA_List`

---

## ENTIDADES ADICIONALES RELACIONADAS CON PERSONAL

### OPERACION_GENERAL_PERSONAL

**Archivo**: `OperacionesIdentity/OPERACION_GENERAL_PERSONAL.cs`
**Tabla**: `[dbo].[OPERACION_GENERAL_PERSONAL]`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `IdOperacionGeneralPersonal` | `System.Int32` | **SI** | - | Identificador unico |
| `Id_Personal` | `Nullable<Int32>` | - | **FK → PERSONAL** | Personal asignado |
| `IdOperacion` | `Nullable<Int32>` | - | **FK → OPERACION** | Operacion asignada |
| `Cod_Equipo` | `System.String` | - | - | Codigo de equipo |
| `Convoy` | `System.String` | - | - | Numero de convoy |
| `EquipoAlquilado` | `System.String` | - | - | Equipo alquilado |
| `Id_Cargo` | `System.Int32` | - | - | Cargo |
| `Id_OperacionGeneralEstado` | `System.Int32` | - | - | Estado |
| `Km_Salida` | `Nullable<Decimal>` | - | - | Kilometros de salida |
| `Km_Final` | `Nullable<Decimal>` | - | - | Kilometros final |
| `Km_Ultimo` | `Nullable<Decimal>` | - | - | Ultimo kilometraje |
| `Observaciones` | `System.String` | - | - | Observaciones |
| `OperacionInformeMantto` | `System.String` | - | - | Informe mantenimiento |
| `OperacionInformePdP` | `System.String` | - | - | Informe Pay Pay |
| `ViaticosRendicion` | `System.String` | - | - | Rendicion de viaticos |
| `FechaInicio` | `Nullable<DateTime>` | - | - | Fecha inicio |
| `FechaFin` | `Nullable<DateTime>` | - | - | Fecha fin |
| `estado` | `System.String` | - | - | Estado |

### CUMPLIMIENTO_PERSONAL

**Archivo**: `OperacionesIdentity/CUMPLIMIENTO_PERSONAL.cs`
**Tabla**: `[dbo].[CUMPLIMIENTO_PERSONAL]`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `IdCumplimiento` | `System.Int32` | **SI** | - | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | Personal |
| `IdCumplimientoPersonal` | `System.Int32` | - | - | Codigo de cumplimiento |
| `FechaRegistro` | `System.DateTime` | - | - | Fecha de registro |
| `FechaCumplimiento` | `System.DateTime` | - | - | Fecha de cumplimiento |
| `Observaciones` | `System.String` | - | - | Observaciones |
| `Archivo` | `System.String` | - | - | Ruta de archivo |

### PERSONAL_SUEÑO

**Archivo**: `OperacionesIdentity/PERSONAL_SUEÑO.cs`
**Tabla**: `[dbo].[PERSONAL_SUEÑO]`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `IdSueño` | `System.Int32` | **SI** | - | Identificador unico |
| `IdPersonal` | `System.Int32` | - | **FK → PERSONAL** | Personal |
| `IdEmpresa` | `System.Int32` | - | - | Empresa |
| `IdOperacionGeneral` | `System.Int32` | - | **FK → OPERACION_GENERAL** | Operacion |
| `Sueño` | `System.Int32` | - | - | Horas de sueño |
| `CHM` | `System.String` | - | - | Codigo CHM |
| `Estado` | `System.String` | - | - | Estado |
| `Fecha` | `System.DateTime` | - | - | Fecha |
| `Observaciones` | `System.String` | - | - | Observaciones |
| `Foto` | `System.String` | - | - | Ruta de foto |

### PERSONAL_EQUIPO

**Archivo**: `OperacionesIdentity/PERSONAL_EQUIPO.cs`
**Tabla**: `[dbo].[PERSONAL_EQUIPO]`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_PersonalEquipo` | `System.Int32` | **SI** | - | Identificador unico |
| `Id_Personal` | `System.Int32` | - | **FK → PERSONAL** | Personal |
| `Cod_Equipo` | `System.String` | - | - | Codigo de equipo |
| `Estado` | `System.String` | - | - | Estado |
| `Fech_Ini` | `DateTime` | - | - | Fecha inicio |
| `Fech_Fin` | `DateTime` | - | - | Fecha fin |
| `Id_Remplazo` | `System.Int32` | - | - | ID de reemplazo |

### EVALUACION_COMP_PERSONAL

**Archivo**: `OperacionesIdentity/EVALUACION_COMP_PERSONAL.cs`
**Tabla**: `[dbo].[EVALUACION_COMP_PERSONAL]`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_EvalDesemp_CompPersonales` | `System.Int32` | **SI** | - | Identificador unico |
| `Id_EvaluacionDesempenio` | `System.Int32` | - | **FK → EVALUACION_DESEMPEÑO** | Evaluación |
| `Id_GD_Calificacion` | `System.Int32` | - | **FK → GD_CALIFICACION** | Calificación |
| `Id_GD_CompetenciaPersonal` | `System.Int32` | - | **FK → GD_COMPETENCIA_PERSONAL** | Competencia personal |

### VIEW_PERSONAL_List

**Archivo**: `OperacionesIdentity/VIEW_PERSONAL_List.cs`
**Tabla**: `VIEW_PERSONAL_List`

| Propiedad | Tipo | PK | FK | Descripcion |
|-----------|------|----|----|-------------|
| `Id_Personal` | `System.Int32` | **SI** | - | Identificador |
| `Personal` | `System.String` | - | - | Nombre del personal |

**Repositorio**: IVIEW_PERSONAL_ListRepository → `VIEW_PERSONAL_ListRepository`
**Uso**: Utilizado por `WFrmPersonalList.aspx` y `WFrmDocumentosEquipoPersonal_List.aspx`

---

## CONFIGURACION DE REPOSITORIOS (App.config)

**Archivo**: `OperacionesDAL/App.config`

Todos los repositorios del modulo PERSONAL estan registrados en la seccion `repositoryFactory`:

```xml
<repositoryFactory>
  <!-- PE-001 -->
  <add interfaceType="OperacionesDAL.IPERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONALRepositoryArtifacts.PERSONALRepository, OperacionesDAL" />
  
  <!-- PE-002 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_CARGORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_CARGORepositoryArtifacts.PERSONAL_CARGORepository, OperacionesDAL" />
  
  <!-- PE-003 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_EPPRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_EPPRepositoryArtifacts.PERSONAL_EPPRepository, OperacionesDAL" />
  
  <!-- PE-004 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_EPP_KARDEXRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_EPP_KARDEXRepositoryArtifacts.PERSONAL_EPP_KARDEXRepository, OperacionesDAL" />
  
  <!-- PE-005 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_DOCUMENTORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_DOCUMENTORepositoryArtifacts.PERSONAL_DOCUMENTORepository, OperacionesDAL" />
  
  <!-- PE-006 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_CORREOSRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_CORREOSRepositoryArtifacts.PERSONAL_CORREOSRepository, OperacionesDAL" />
  
  <!-- PE-007 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_LICENCIA_CONDUCIRRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_LICENCIA_CONDUCIRRepositoryArtifacts.PERSONAL_LICENCIA_CONDUCIRRepository, OperacionesDAL" />
  
  <!-- PE-008 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_RECORDRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_RECORDRepositoryArtifacts.PERSONAL_RECORDRepository, OperacionesDAL" />
  
  <!-- PE-009 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_RECORD_OPORTUNIDAD_MEJORARepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_RECORD_OPORTUNIDAD_MEJORARepositoryArtifacts.PERSONAL_RECORD_OPORTUNIDAD_MEJORARepository, OperacionesDAL" />
  
  <!-- PE-010 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_REQUERIMIENTOS_APROBACIONRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_REQUERIMIENTOS_APROBACIONRepositoryArtifacts.PERSONAL_REQUERIMIENTOS_APROBACIONRepository, OperacionesDAL" />
  
  <!-- PE-011 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_VIATICOS_APROBACIONRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_VIATICOS_APROBACIONRepositoryArtifacts.PERSONAL_VIATICOS_APROBACIONRepository, OperacionesDAL" />
  
  <!-- PE-012 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_VACACIONESRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_VACACIONESRepositoryArtifacts.PERSONAL_VACACIONESRepository, OperacionesDAL" />
  
  <!-- PE-013 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_VACACIONES_REGISTRORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_VACACIONES_REGISTRORepositoryArtifacts.PERSONAL_VACACIONES_REGISTRORepository, OperacionesDAL" />
  
  <!-- PE-014 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_AREA_MULTITRACRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_AREA_MULTITRACRepositoryArtifacts.PERSONAL_AREA_MULTITRACRepository, OperacionesDAL" />
  
  <!-- PE-015 -->
  <add interfaceType="OperacionesDAL.IPERSONAL_ESTADO_DOCUMENTORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.PERSONAL_ESTADO_DOCUMENTORepositoryArtifacts.PERSONAL_ESTADO_DOCUMENTORepository, OperacionesDAL" />
  
  <!-- PE-016 -->
  <add interfaceType="OperacionesDAL.INIVEL_EDUCATIVORepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.NIVEL_EDUCATIVORepositoryArtifacts.NIVEL_EDUCATIVORepository, OperacionesDAL" />
  
  <!-- PE-017 -->
  <add interfaceType="OperacionesDAL.IGRADO_INSTRUCCIONRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.GRADO_INSTRUCCIONRepositoryArtifacts.GRADO_INSTRUCCIONRepository, OperacionesDAL" />
  
  <!-- PE-018 -->
  <add interfaceType="OperacionesDAL.INRO_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.NRO_PERSONALRepositoryArtifacts.NRO_PERSONALRepository, OperacionesDAL" />
  
  <!-- PE-019 -->
  <add interfaceType="OperacionesDAL.IAFPRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.AFPRepositoryArtifacts.AFPRepository, OperacionesDAL" />
  
  <!-- PE-021 -->
  <add interfaceType="OperacionesDAL.ICAPACITACION_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.CAPACITACION_PERSONALRepositoryArtifacts.CAPACITACION_PERSONALRepository, OperacionesDAL" />
  
  <!-- PE-022 -->
  <add interfaceType="OperacionesDAL.ICAPACITACION_PER_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.CAPACITACION_PER_PERSONALRepositoryArtifacts.CAPACITACION_PER_PERSONALRepository, OperacionesDAL" />
  
  <!-- Adicionales -->
  <add interfaceType="OperacionesDAL.IOPERACION_GENERAL_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.OPERACION_GENERAL_PERSONALRepositoryArtifacts.OPERACION_GENERAL_PERSONALRepository, OperacionesDAL" />
  <add interfaceType="OperacionesDAL.ICUMPLIMIENTO_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.CUMPLIMIENTO_PERSONALRepositoryArtifacts.CUMPLIMIENTO_PERSONALRepository, OperacionesDAL" />
  <add interfaceType="OperacionesDAL.IEVALUACION_COMP_PERSONALRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.EVALUACION_COMP_PERSONALRepositoryArtifacts.EVALUACION_COMP_PERSONALRepository, OperacionesDAL" />
  <add interfaceType="OperacionesDAL.IVIEW_PERSONAL_ListRepository, OperacionesDAL"
       repositoryType="OperacionesDAL.OperacionesIdentity.VIEW_PERSONAL_ListRepositoryArtifacts.VIEW_PERSONAL_ListRepository, OperacionesDAL" />
</repositoryFactory>
```

**Connection String**:
```
Data Source=SERVER_M; Initial Catalog=BDMultitrac; Persist Security Info=True;User ID=sa;Password=Multitr@c2009
```

---

## FLUJO DE DATOS GENERAL DEL MODULO PERSONAL

```
WFrmPersonalData.aspx (Formulario Principal)
  ├── Tab DATOS GENERALES
  │     → ObjectDataSource: odsGradoInstruccion, odsBrevereTipo, odsAFP, odsEmpresSocioTercero
  │     → Campos: Nom, AP, AM, DNI, Email, Cel, Tlf, Dir, FechNac, Sexo, EstadoCivil
  │     → Id_NivelEducativo → NIVEL_EDUCATIVO
  │     → Id_Contratista → CONTRATISTA
  │     → id_Lic_Personal → PERSONAL_LICENCIA_CONDUCIR
  │     → AFP → AFP
  │     → Usuario_Personal → Autenticacion
  │
  ├── Tab AREA
  │     → IPERSONAL_AREA_MULTITRACRepository
  │     → PERSONAL_AREA_MULTITRAC → AREA_MULTITRAC
  │
  ├── Tab CARGO
  │     → IPERSONAL_CARGORepository
  │     → PERSONAL_CARGO → CARGO
  │
  └── Tab EQUIPO
        → IPERSONAL_EQUIPORepository
        → PERSONAL_EQUIPO → EQUIPO

WFrmPersonalList.aspx (Lista)
  → SP_PERSONAL_List → IPERSONALRepository.GetAllFromPERSONAL()
  → GridView con filtro por StatusOP
  → Link WFrmPersonalData.aspx?acc=EDITAR&IdPer={id}

WFrmPersonal_EPP_Data.aspx
  → IPERSONAL_EPPRepository
  → PERSONAL_EPP → PERSONAL_EPP_KARDEX

WFrmPersonal_Kardex_List.aspx
  → ObjectDataSource: odsPersonalEPP_Kardex
  → GridView con CheckBox para EPP items

WFrmDocumentosEquipoPersonal_List.aspx
  → SP_VIEW_PERSONAL_DOCUMENTO_List_All → IPERSONAL_DOCUMENTORepository
  → 3 grids: Equipos, Personal, Contratista
  → ARCHIVO link → WFrmDocumentosEquipoPersonal_MostrarArchivo.aspx

WFrmPersonalVacacionesReg.aspx
  → IPERSONAL_VACACIONESRepository
  → PERSONAL_VACACIONES → PERSONAL_VACACIONES_REGISTRO

WFrmPersonalRequerimientoAprobacion.aspx
  → IPERSONAL_REQUERIMIENTOS_APROBACIONRepository
  → PERSONAL_REQUERIMIENTOS_APROBACION

WFrmPersonalViaticosAprobacion.aspx
  → IPERSONAL_VIATICOS_APROBACIONRepository
  → PERSONAL_VIATICOS_APROBACION

WFrmSeguridadRegistrarCurso.aspx
  → ICAPACITACION_PERSONALRepository
  → CAPACITACION_PERSONAL → CAPACITACION_PER_PERSONAL
```

---

## PATRONES DE CODIGO

### Naming Convention Repositorios
- Interfaces: `I[Entity]Repository` (ej: `IPERSONALRepository`)
- Implementaciones: `[Entity]Repository` en carpeta `OperacionesIdentity.[Entity]RepositoryArtifacts\`
- Artifacts: `[Entity]InsertFactory`, `[Entity]UpdateFactory`, `[Entity]DeleteFactory`, `GetAllFrom[Entity]Factory`, `Get[Entity]ById_[IdField]Factory`

### Naming Convention Stored Procedures
- `Insert[Entity]` → Insert con OUT parameter para ID auto-generado
- `Update[Entity]` → Update por ID
- `Delete[Entity]` → Delete por ID
- `GetAllFrom[Entity]` → Select all
- `Get[Entity]ById_[IdField]` → Select by ID

### Error Handling
- Todos los repositorios implementan `HandleSqlException`
- Tipos de excepcion: `RepositoryValidationException`, `ConcurrencyViolationException`, `RepositoryFailureException`
- Mapeo: `ErrorCodes.SqlUserRaisedError` para errores SQL definidos por usuario

### Factory Pattern
- Todas las clases Factories implementan `IDbToBusinessEntityNameMapper` para mapeo de mensajes de error
- InsertFactory condicional para campos NULLABLE
- OUT parameters para IDs auto-generados

---

## INDICADORES DE CANTIDAD

| Indicador | Valor |
|-----------|-------|
| Total de entidades BE del modulo | 24+ |
| Total de tablas de base de datos | 24+ |
| Total de repositorios | ~24 |
| Total de stored procedures CRUD | ~120+ |
| Total de paginas ASP.NET | ~24 |
| Total de archivos C# (.cs) | ~200+ (incluye todos los artifacts) |
| Connection Strings | 1 |
| Campos promedio por entidad | 8-35 |
| Campos PK de PERSONAL | 1 (Id_Personal) |
| Campos FK de PERSONAL | 2+ (id_Contratista, id_NivelEducativo) |

---

*Documento generado el 18/09/2026 a partir del analisis del codigo fuente del proyecto MULTITRAC.*
*Fuente: C:\Users\ASUS\Downloads\Multitrac (2)\Multitrac*
*Modulo: PE - Personal (PE-001 a PE-024)*

# MATRIZ DE TRASABILIDAD DE REQUERIMIENTOS - PROYECTO MULTITRAC

## Informacion General del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre del Proyecto** | MULTITRAC S.A. - Sistema de Gestion de Operaciones de Transporte |
| **Empresa** | MULTITRAC S.A. |
| **Ubicacion** | Carretera a San Marcos - Km 07 - Llacanora - Cajamarca, Peru |
| **Sitio Web** | www.multitracsa.com |
| **Contacto** | Ing. Jose Luis Torres Rodriguez |
| **Telefono** | 948 331 657 |
| **Email** | jose.torres@multitracsa.com |
| **Framework** | .NET Framework 2.0 |
| **Lenguaje Backend** | C# (capas BE y DAL) |
| **Lenguaje Frontend** | VB.NET (ASP.NET WebForms) |
| **Base de Datos** | SQL Server (BDMultitrac, BDAlertasMultitrac, BdNava01) |
| **Patron Arquitectonico** | Repository Pattern (Microsoft.Practices.Repository) |
| **ORM/DAL** | Microsoft Enterprise Library 3.1 |
| **IDE** | Visual Studio 2019 (v18.8) |
| **Version** | 1.0.0 |
| **Estructura** | 3 capas: WebSite / Identity (BE) / DAL |

---

## ESTRUCTURA DEL PROYECTO

| Capa | Nombre | Tipo | Archivos Principales | Cantidad Aprox. |
|------|--------|------|---------------------|-----------------|
| Presentacion | Operaciones | ASP.NET WebForms (VB.NET) | .aspx, .master, .ascx | ~379 paginas |
| Entidades (BE) | OperacionesIdentity | C# Class Library | .cs (clases POCO) | ~300 clases |
| Acceso a Datos (DAL) | OperacionesDAL | C# Class Library | .cs (interfaces repositorio) | ~300 interfaces + ~300 implementaciones |
| Configuracion | App.config | XML | connection strings, repositoryFactory | 1 |

---

## MODULOS FUNCIONALES

### Modulo 1: SEGURIDAD Y AUTENTICACION (SF-001 a SF-006)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| SF-001 | Autenticacion de usuario con login | - | - | Login.aspx, LoginAnt.aspx | Alta |
| SF-002 | Cambio de contrasena de usuario | - | - | CambiarClave.aspx | Alta |
| SF-003 | Gestion de usuarios (crear, listar, actualizar) | - | - | WFrmUsuarioCreacion.aspx, WFrmUsuarios_Lista.aspx | Alta |
| SF-004 | Gestion de roles de usuario | - | - | WFrmUsuarioCrearRol.aspx | Alta |
| SF-005 | Actualizacion de contrasena por usuario | - | - | WFrmUsuarioContraseña.aspx, WFrmUsuarioContraseñaActualizar.aspx | Media |
| SF-006 | Redireccion de paginas segun rol | - | - | Redirect.aspx | Media |

### Modulo 2: PERSONAL (PE-001 a PE-024)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| PE-001 | Registro de personal/empleados | PERSONAL | IPERSONALRepository | RegEmpleado.aspx | Alta |
| PE-002 | Gestion de personal por cargo | PERSONAL, CARGO | IPERSONALRepository, ICARGORepository | RegCargo.aspx | Alta |
| PE-003 | Gestion de personal por equipo | PERSONAL, EQUIPO | IPERSONALRepository, IEQUIPORepository | - | Alta |
| PE-004 | Gestion de personal por documento | PERSONAL, DOCUMENTO | IPERSONALRepository, IDOCUMENTOARCHIVORepository | RegDocumento.aspx | Alta |
| PE-005 | Gestion de personal por EPP | PERSONAL, PERSONAL_EPP, EPP_CONDICION | IPERSONAL_EPPRepository, IEPP_CONDICIONRepository | - | Alta |
| PE-006 | Gestion de personal por EPP Kardex | PERSONAL_EPP_KARDEX | IPERSONAL_EPP_KARDEXRepository | WFrmReporte_PersonalEppKardex.aspx | Media |
| PE-007 | Gestion de personal por correo | PERSONAL_CORREOS | IPERSONAL_CORREOSRepository | - | Media |
| PE-008 | Gestion de licencia de conducir | PERSONAL_LICENCIA_CONDUCIR | IPERSONAL_LICENCIA_CONDUCIRRepository | - | Alta |
| PE-009 | Gestion de record de personal | PERSONAL_RECORD, PERSONAL_RECORD_OPORTUNIDAD_MEJORA | IPERSONAL_RECORDRepository, IPERSONAL_RECORD_OPORTUNIDAD_MEJORARepository | - | Alta |
| PE-010 | Gestion de requerimientos de personal | PERSONAL_REQUERIMIENTOS_APROBACION | IPERSONAL_REQUERIMIENTOS_APROBACIONRepository | - | Alta |
| PE-011 | Gestion de viaticos de personal | PERSONAL_VIATICOS_APROBACION, PERSONAL_VACACIONES | IPERSONAL_VIATICOS_APROBACIONRepository, IPERSONAL_VACACIONESRepository | - | Alta |
| PE-012 | Gestion de personal por area Multitrac | PERSONAL_AREA_MULTITRAC | IPERSONAL_AREA_MULTITRACRepository | - | Media |
| PE-013 | Gestion de personal por estado de documento | PERSONAL_ESTADO_DOCUMENTO | IPERSONAL_ESTADO_DOCUMENTORepository | - | Alta |
| PE-014 | Gestion de nivel educativo | NIVEL_EDUCATIVO, GRADO_INSTRUCCION | INIVEL_EDUCATIVORepository, IGRADO_INSTRUCCIONRepository | - | Media |
| PE-015 | Gestion de personal por SCTR/AFP | PERSONAL | IPERSONALRepository, IAFPRepository | - | Alta |
| PE-016 | Reporte de personal por EPP/NIT | PERSONAL_EPP, OPERACION | IPERSONAL_EPPRepository, IOPERACIONRepository | WFrmReporte_PersonalEpp.aspx | Media |

### Modulo 3: CONTRATISTAS Y CLIENTES (CT-001 a CT-010)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| CT-001 | Registro de contratistas | CONTRATISTA | ICONTRATISTARepository | RegProveedor.aspx | Alta |
| CT-002 | Gestion de contratistas por tipo | CONTRATISTA_TIPO | ICONTRATISTA_TIPORepository | - | Alta |
| CT-003 | Gestion de contratistas por cuenta | CONTRATISTA_CUENTA | ICONTRATISTA_CUENTARepository | - | Alta |
| CT-004 | Gestion de contratistas por descuento | CONTRATISTA_DESCUENTO, CONTRATISTA_DESCUENTO_ESTADO | ICONTRATISTA_DESCUENTORepository, ICONTRATISTA_DESCUENTO_ESTADORepository | WFrmBaucherCaja_List.aspx | Alta |
| CT-005 | Gestion de contratistas por documento/equipo | CONTRATISTA_DOCUMENTO, CONTRATISTA_EQUIPO | ICONTRATISTA_DOCUMENTORepository, ICONTRATISTA_EQUIPORepository | - | Alta |
| CT-006 | Gestion de contactos | CONTACTO | ICONTACTORepository | - | Media |
| CT-007 | Gestion de clientes | CLIENTE | ICLIENTERepository | WFrmClientes_List.aspx | Alta |
| CT-008 | Analisis de clientes/proveedores | CLIENTE, CONTRATISTA | ICLIENTERepository, ICONTRATISTARepository | AnalisisClientes.aspx, AnalisisProveedores.aspx | Media |

### Modulo 4: OPERACIONES DE TRANSPORTE (OP-001 a OP-026)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| OP-001 | Registro de operaciones de transporte | OPERACION | IOPERACIONRepository | frmDetalleOperacion.aspx | Alta |
| OP-002 | Gestion de operaciones por equipo | OPERACION_EQUIPO | IOPERACION_EQUIPORepository | frmDetalleOperacion.aspx | Alta |
| OP-003 | Gestion de operaciones por personal | OPERACION_GENERAL_PERSONAL | IOPERACION_GENERAL_PERSONALRepository | - | Alta |
| OP-004 | Gestion de operaciones por ubicacion | OPERACION_UBICACION_OP, UBICACION_OP | IOPERACION_UBICACION_OPRepository, IUBICACION_OPRepository | WFrmUbicacion.aspx | Alta |
| OP-005 | Gestion de operaciones generales | OPERACION_GENERAL | IOPERACION_GENERALRepository | - | Alta |
| OP-006 | Gestion de operaciones generales por equipo | OPERACION_GENERAL_EQUIPO | IOPERACION_GENERAL_EQUIPORepository | - | Alta |
| OP-007 | Gestion de operaciones por horario/tipo/turno | OPERACION_HORARIO, OPERACION_TIPO, OPERACION_TURNO | IOPERACION_HORARIORepository, IOPERACION_TIPORepository, IOPERACION_TURNORepository | - | Alta |
| OP-008 | Gestion de operaciones por responsable/usuario | OPERACION_RESPONSABLE, OPERACION_USUARIO | IOPERACION_RESPONSABLERepository, IOPERACION_USUARIORepository | - | Alta |
| OP-009 | Gestion de operaciones por carga | OPERACION_CARGA, TIPO_CARGA | IOPERACION_CARGARepository, ITIPO_CARGARepository | WFrmTipoCarga.aspx | Alta |
| OP-010 | Gestion de operaciones estiba/flete | OPERACION_ESTIBA, OPERACION_FLETE, OPERACION_FLETE_RANSA | IOPERACION_ESTIBARepository, IOPERACION_FLETERepository | - | Alta |
| OP-011 | Gestion de operaciones liquidez | OPERACION_LIQUIDEZ | IOPERACION_LIQUIDEZRepository | - | Alta |
| OP-012 | Gestion de operaciones informe/foto | OPERACION_INFORME, OPERACION_INFORME_FOTO_EQUIPO, OPERACION_INFORME_FOTO_PERSONAL | IOPERACION_INFORMERepository | RegInformeFinal.aspx | Alta |
| OP-013 | Gestion de operaciones mapa/GPS | OPERACION (campos GPS) | IOPERACIONRepository | frmDetalleOperacion_Mapa.aspx | Alta |
| OP-014 | Registro de operacion por convoy | CONVOY, OPERACION (campo convoy) | IOPERACIONRepository, ICONVOYRepository | - | Alta |
| OP-015 | Gestion de orden de operacion | ORDEN_CONTRATISTA_OPERACION | IORDEN_CONTRATISTA_OPERACIONRepository | - | Alta |

### Modulo 5: FLOTA Y EQUIPOS (FL-001 a FL-015)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| FL-001 | Registro de equipos | EQUIPO, EQUIPOS, EQUIPO_CARRETA, EQUIPO_ALQUILADO | IEQUIPORepository, IEQUIPOSRepository | - | Alta |
| FL-002 | Gestion de equipos por combustible | EQUIPO_COMBUSTIBLE, EQUIPO_COMBUSTIBLE_FACTURA, EQUIPO_COMB_FACT_ESTADO | IEQUIPO_COMBUSTIBLERepository, IEQUIPO_COMBUSTIBLE_FACTURARepository | - | Alta |
| FL-003 | Gestion de equipos por documento/estado | EQUIPO_DOCUMENTO, EQUIPO_ESTADO_DOCUMENTO | IEQUIPO_DOCUMENTORepository, IEQUIPO_ESTADO_DOCUMENTORepository | - | Alta |
| FL-004 | Gestion de equipos por estado general/kilometraje | EQUIPO_ESTADO_GENERAL, EQUIPO_KILOMETRAJE | IEQUIPO_ESTADO_GENERALRepository, IEQUIPO_KILOMETRAJERepository | - | Alta |
| FL-005 | Gestion de equipos por mantenimiento | EQUIPO_MANTENIMIENTO, EQUIPO_MANTENIMIENTO_DETALLE, EQUIPO_MANTTO_PM | IEQUIPO_MANTENIMIENTORepository, IEQUIPO_MANTTO_PMRepository | - | Alta |
| FL-006 | Gestion de equipos por mantenimiento de llantas | EQUIPO_MANTTO_LLANTA, EQUIPO_MANTTO_LLANTA_DET, EQUIPO_MANTTO_LLANTA_DET_COSTOS, EQUIPO_MANTTO_LLANTA_MATERIALES, EQUIPO_MANTTO_LLANTA_DETR | IEQUIPO_MANTTO_LLANTARepository, IEQUIPO_MANTTO_LLANTA_DETRepository, IEQUIPO_MANTTO_LLANTA_DET_COSTOSRepository, IEQUIPO_MANTTO_LLANTA_MATERIALESRepository, IEQUIPO_MANTTO_LLANTA_DETRepository | - | Alta |
| FL-007 | Gestion de equipos por ubicacion mantenimiento | EQUIPO_UBICACION_MANTTO | IEQUIPO_UBICACION_MANTTORepository | - | Alta |
| FL-008 | Gestion de flota y areas de equipo | FLOTA, AREA_GENERAL_EQ, AREA_ESPEC_EQ | IFlotaRepository, IArea_General_EqRepository, IArea_Espec_EqRepository | - | Alta |
| FL-009 | Analisis de equipos | EQUIPO | IEQUIPORepository | AnalisisEquipos.aspx | Media |
| FL-010 | Reporte de mantenimiento de equipos | EQUIPO_MANTENIMIENTO | IEQUIPO_MANTENIMIENTORepository | WFrmReporte_ImprimirManttoObservacion.aspx | Alta |

### Modulo 6: LLANTAS (LL-001 a LL-007)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| LL-001 | Registro de llantas | LLANTA | ILLANTARepository | - | Alta |
| LL-002 | Gestion de llantas por marca/diseño/material/medida | LLANTA_MARCA, LLANTA_DISEÑO, LLANTA_MATERIAL, LLANTA_MEDIDA | ILLANTA_MARCARepository, ILLANTA_DISEÑORepository, ILLANTA_MATERIALRepository, ILLANTA_MEDIDARepository | - | Alta |
| LL-003 | Historial de rotacion de llantas | EQUIPO_MANTTO_LLANTA_DET, EQUIPO_MANTTO_LLANTA_DET_COSTOS | IEQUIPO_MANTTO_LLANTA_DETRepository, IEQUIPO_MANTTO_LLANTA_DET_COSTOSRepository | - | Alta |

### Modulo 7: COMBUSTIBLE (CB-001 a CB-007)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| CB-001 | Registro de combustible y precios por grifo | COMBUSTIBLE, COMBUSTIBLE_PRECIO_GRIFO | ICOMBUSTIBLERepository, ICOMBUSTIBLE_PRECIO_GRIFORepository | - | Alta |
| CB-002 | BC Combustible/GPS/Hospedaje/Poliza/SCTR/UNT | BC_COMBUSTIBLE, BC_GPS, BC_HOSPEDAJE, BC_POLIZA_RC, BC_SCTR, BC_UNT | IBC_COMBUSTIBLERepository, IBC_GPSRepository, IBC_HOSPEDAJERepository | - | Alta |
| CB-003 | Equipo Combustible Factura | EQUIPO_COMBUSTIBLE_FACTURA, EQUIPO_COMB_FACT_ESTADO | IEQUIPO_COMBUSTIBLE_FACTURARepository, IEQUIPO_COMB_FACT_ESTADORepository | - | Alta |
| CB-004 | Gestion de vale de combustible | TICKET_CARGA, TICKET_CARGA_DETALLE | ITICKET_CARGARepository, ITICKET_CARGA_DETALLERepository | WFrmValeCombustibleLista.aspx | Alta |
| CB-005 | BC Descuento/Comision | BC_DESCUENTO, BC_DESCUENTO_COMISION | IBC_DESCUENTORepository, IBC_DESCUENTO_COMISIONRepository | - | Alta |

### Modulo 8: GUIA DE REMISION (GR-001 a GR-006)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| GR-001 | Registro de guias de remision | GUIA_REMISION | IGUIA_REMISIONRepository | - | Alta |
| GR-002 | Control de guias de remision | GUIA_REMISION_CONTROL, CONTROL_GUIAREMISION | IGUIA_REMISION_CONTROLRepository, ICONTROL_GUIAREMISIONRepository | - | Alta |
| GR-003 | Detalle de guias de remision | GUIA_REMISION_DETALLE | IGUIA_REMISION_DETALLERepository | - | Alta |
| GR-004 | Guias de remision policial | GUIA_REMISION_POLICIA | IGUIA_REMISION_POLICIARepository | - | Alta |

### Modulo 9: FACTURACION Y LIQUIDACION (FC-001 a FC-013)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| FC-001 | Gestion de factura socio | FACTURA_SOCIO | IFACTURA_SOCIORepository | - | Alta |
| FC-002 | Gestion de liquidacion | LIQUIDACION | ILIQUIDACIONRepository | WFrmReporte_ImprimirLiquidacion.aspx | Alta |
| FC-003 | Gestion de liquidacion por contratista descuento | LIQUIDACION_CONTRATISTA_DESCUENTO, CONTRATISTA_DESCUENTO, CONTRATISTA_DESCUENTO_ESTADO | ILIQUIDACION_CONTRATISTA_DESCUENTORepository, ICONTRATISTA_DESCUENTORepository, ICONTRATISTA_DESCUENTO_ESTADORepository | - | Alta |
| FC-004 | Gestion de liquidacion por factura/tipo cambio | LIQUIDACION_FACTURA, LIQUIDACION_TIPO_CAMBIO, MONEDA | ILIQUIDACION_FACTURARepository, ILIQUIDACION_TIPO_CAMBIORepository, IMONEDARepository | - | Alta |
| FC-005 | Gestion de modo de pago/tipo de pago | MODO_PAGO, TIPO_PAGO | IMODO_PAGORepository, ITIPO_PAGORepository | - | Alta |
| FC-006 | Gestion de banco y cuenta | BANCO, BANCO_CUENTA | IBANCORepository, IBANCO_CUENTARepository | - | Alta |
| FC-007 | Baucher de caja | BAUCHER_CAJA, BAUCHER_CONVERSION, BAUCHER_EGRESOS | IBAUCHER_CAJARepository, IBAUCHER_CONVERSIONRepository, IBAUCHER_EGRESOSRepository | WFrmBaucherCaja_List.aspx, WFrmBaucherCaja_Data.aspx, WFrmBaucherCaja_Imprimir.aspx | Alta |
| FC-008 | Descuento | DESCUENTO, MANTTO_DESCUENTO | IDESCUENTORepository, IMANTTO_DESCUENTORepository | - | Alta |

### Modulo 10: ALMACEN (AL-001 a AL-009)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| AL-001 | Gestion de almacen | ALMACEN | IALMACENRepository | WFrmAlamcen.aspx | Alta |
| AL-002 | Gestion de almacen ingresos/egresos | ALMACEN_INGRESOS, ALMACEN_EGRESOS | IALMACEN_INGRESOSRepository, IALMACEN_EGRESOSRepository | WFrmAlmacenIngreso_Data.aspx, WFrmAlmacenSalida_Data.aspx | Alta |
| AL-003 | Gestion de almacen totales/marca | ALMACEN_TOTALES, ALMACEN_MARCA | IALMACEN_TOTALESRepository, IALMACEN_MARCARepository | - | Alta |
| AL-004 | Control de almacen | ALMACEN, ALMACEN_EGRESOS, ALMACEN_INGRESOS | IALMACENRepository | WFrmAlamaceVerIngSal.aspx | Alta |
| AL-005 | Impresion de almacen | ALMACEN_INGRESOS, ALMACEN_EGRESOS | IALMACEN_INGRESOSRepository, IALMACEN_EGRESOSRepository | WFrmAlmacenImpIng.aspx, WFrmAlmacenImpSalReq.aspx | Alta |

### Modulo 11: CAJA CHICA (CH-001 a CH-006)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| CH-001 | Gestion de caja chica | CAJA_CHICA | ICAJA_CHICARepository | - | Alta |
| CH-002 | Gestion de caja chica detalle | CAJA_CHICA_DETALLE | ICAJA_CHICA_DETALLERepository | - | Alta |
| CH-003 | Gestion de caja chica detalle documento/tipo | CAJA_CHICA_DETALLE_DOCUMENTO, CAJA_CHICA_DETALLE_TIPO | ICAJA_CHICA_DETALLE_DOCUMENTORepository, ICAJA_CHICA_DETALLE_TIPORepository | - | Alta |
| CH-004 | Gestion de caja chica estado | CAJA_CHICA_ESTADO, CAJA_CHICA_ESTADO_ACTUAL | ICAJA_CHICA_ESTADORepository, ICAJA_CHICA_ESTADO_ACTUALRepository | - | Alta |

### Modulo 12: REQUERIMIENTOS (RR-001 a RR-009)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| RR-001 | Gestion de requerimientos | REQUERIMIENTO, REQUERIMIENTO_DETALLE, REQUERIMIENTO_CONTROL, REQUERIMIENTO_GENERAL | IREQUERIMIENTORepository, IREQUERIMIENTO_DETALLERepository | WFrmRequerimientoGeneral_List.aspx | Alta |
| RR-002 | Gestion de requerimientos archivo/cambio estado | REQUERIMIENTO_ARCHIVO, REQUERIMIENTO_CAMBIO_STATUS | IREQUERIMIENTO_ARCHIVORepository, IREQUERIMIENTO_CAMBIO_STATUSRepository | WFrmRequerimientoVerArchivo.aspx, WFrmRequerimientoCambioStatus.aspx | Alta |
| RR-003 | Gestion de requerimientos por operacion | OPERACION, REQUERIMIENTO | IOPERACIONRepository, IREQUERIMIENTORepository | WFrmRequerimientosOperacion.aspx | Alta |
| RR-004 | Control de requerimientos | REQUERIMIENTO_CONTROL | IREQUERIMIENTO_CONTROLRepository | WFrmRequerimientoControl.aspx | Alta |
| RR-005 | Gestion de viaticos | PERSONAL_VIATICOS_APROBACION | IPERSONAL_VIATICOS_APROBACIONRepository | WFrmViaticosRequerimientosAdicional.aspx | Alta |
| RR-006 | Reporte de viaticos | OPERACION, PERSONAL | IOPERACIONRepository, IPERSONALRepository | WFrmReporte_ViaticosOperacion.aspx | Alta |

### Modulo 13: INCIDENTES Y ACCIONES CORRECTIVAS (IN-001 a IN-011)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| IN-001 | Registro de incidentes | INCIDENT | IINCIDENTRepository | - | Alta |
| IN-002 | Gestion de incidentes por causa basica | INCIDENT_CAUSABASICA, CAUSABASICA, DETCAUSABASICA | IINCIDENT_CAUSABASICARepository, ICAUSABASICARepository, IDETCAUSABASICARepository | - | Alta |
| IN-003 | Gestion de incidentes por causa inmediata | INCIDENT_CAUSAINMEDIATA, CAUSAINMEDIATA | IINCIDENT_CAUSAINMEDIATARepository, ICAUSAINMEDIATARepository | - | Alta |
| IN-004 | Gestion de incidentes por clasificacion | INCIDENT_CLASIFICACION | IINCIDENT_CLASIFICACIONRepository | - | Alta |
| IN-005 | Gestion de incidentes por involucrado | INCIDENT_INVOLUCRADO | IINCIDENT_INVOLUCRADORepository | - | Alta |
| IN-006 | Gestion de incidentes por acciones correctivas | INCIDENT_ACCIONESCORRECTIVAS, ACCIONCORRECTIVA | IINCIDENT_ACCIONESCORRECTIVASRepository, IACCIONCORRECTIVARepository | WFrmAccionCorrectiva.aspx | Alta |
| IN-007 | Gestion de incidentes archivo ACP | INCIDENT_ACP_ARCHIVO, INCIDENT_ARCHIVO | IINCIDENT_ACP_ARCHIVORepository, IINCIDENT_ARCHIVORepository | WFrmVerIncidenteArchivo.aspx | Alta |
| IN-008 | Reporte de incidentes | INCIDENT | IINCIDENTRepository | WFrmReporte_Incident_Tendencia.aspx | Alta |
| IN-009 | Gestion de consecuencia | CONSECUENCIA | ICONSECUENCIARepository | - | Alta |
| IN-010 | Gestion de oportunidad de mejora | OPORTUNIDAD_MEJORA | IOPORTUNIDAD_MEJORARepository | - | Alta |

### Modulo 14: CHECKLIST (CK-001 a CK-004)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| CK-001 | Gestion de checklist | CHECKLIST, CHECKLIST_REGISTRO, CHECKLIST_WWW, CHECKLIST_ESTADO | ICHECKLISTRepository, ICHECKLIST_ESTADORepository | - | Alta |
| CK-002 | Reporte de checklist | CHECKLIST | ICHECKLISTRepository | ChecklistInforme.aspx | Alta |

### Modulo 15: CAPACITACION Y SEGURIDAD (CP-001 a CP-015)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| CP-001 | Gestion de capacitacion por personal | CAPACITACION_PERSONAL, CAPACITACION_PER_PERSONAL | ICAPACITACION_PERSONALRepository | - | Alta |
| CP-002 | Gestion de capacitacion por tipo | CAPACITACION_TIPO | ICAPACITACION_TIPORepository | - | Alta |
| CP-003 | Gestion de curso empresa/programacion | CURSO_EMPRESA, CURSO_PROGRAMACION, CURSO_PROGRAMACION_DETALLE, CURSO_PROGRAMACION_ESTADO | ICURSO_EMPRESARepository, ICURSO_PROGRAMACIONRepository | - | Alta |
| CP-004 | Gestion de curso costo/factura | CURSO_COSTO, CURSO_FACTURA, CURSO_FACTURA_DETALLE | ICURSO_COSTORepository, ICURSO_FACTURARepository | - | Alta |
| CP-005 | Registro de COVID | REGISTROS_COVID, REGISTROS_COVID_DATA, REGISTROS_COVID_DETALLE | IREGISTROS_COVIDRepository | RegistrosCovid.aspx | Alta |
| CP-006 | Gestion de EPP | PERSONAL_EPP, EPP_CONDICION, PERSONAL_EPP_KARDEX | IPERSONAL_EPPRepository, IEPP_CONDICIONRepository | - | Alta |
| CP-007 | Gestion de seguridad por curso | CURSO_PROGRAMACION | ICURSO_PROGRAMACIONRepository | WFrmSeguridadRegistrarCurso.aspx | Alta |

### Modulo 16: AUDITORIA - SAC (AU-001 a AU-019)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| AU-001 | Gestion de programas auditoria | PROCESO, OPERACION | IOPERACIONRepository | ProgramasAuditoria.aspx, RegProceso.aspx | Alta |
| AU-002 | Gestion de auditores | AUDITOR | IAREA_MULTITRACRepository | RegAuditores.aspx | Alta |
| AU-003 | Gestion de areas | AREA_MULTITRAC | IAREA_MULTITRACRepository | RegArea.aspx, ProgramasByArea.aspx | Alta |
| AU-004 | Gestion de procesos | PROCESO | IOPERACIONRepository | RegProceso.aspx, RegProgramaProcesos.aspx | Alta |
| AU-005 | Gestion de objetivos/indicadores | GD_OBJETIVO_MEJORAMIENTO, GD_SEGUIMIENTO | IGD_OBJETIVO_MEJORAMIENTORepository, IGD_SEGUIMIENTORepository | RegObjetivos.aspx, RegObjetivoIndicador.aspx | Alta |
| AU-006 | Gestion de normas | NORMA | IOPERACIONRepository | RegNorma.aspx | Alta |
| AU-007 | Gestion de criterios auditoria | CRITERIO_AUDITORIA, CRITERIO_EVALUACION, CRITERIO_DOCUMENTACION, CRITERIO_OPCION | ICHECKLISTRepository | RegCriterioAuditoria.aspx, RegCriterioEvaluacion.aspx | Alta |
| AU-008 | Gestion de definiciones/tema/sesiones/resultados/recursos/realizaciones/proyectos/programa anual/tablero/estrategias/encuestas | DEFINICION, TEMA, SESION, RESULTADO, RECURSO, REALIZACION, PROYECTO, PROGRAMA_ANUAL, TABLERO, ESTRATEGIA, ENCUESTA | ICHECKLISTRepository | RegDefinicion.aspx, RegTema.aspx, RegSesiones.aspx, RegResultados.aspx, RegRecursos.aspx, RegRealizaciones.aspx, RegProyectos.aspx, ParamProgramasAnuales.aspx, TableroControl.aspx, RegEstrategia.aspx, RegEncuesta.aspx | Alta |

### Modulo 17: DOCUMENTOS (DC-001 a DC-007)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| DC-001 | Gestion de documentos | DOCUMENTO, DOCUMENTO_ARCHIVO, DOCUMENTO_ADMIN | IDOCUMENTOARCHIVORepository, IDOCUMENTO_ADMINRepository | RegDocumento.aspx, ListarDocumentos.aspx | Alta |
| DC-002 | Documentos por tipo/norma/area/proceso | DOCUMENTO_ADMIN_TIPO | IDOCUMENTO_ADMIN_TIPORepository | RegTipoDocumento.aspx, DocumentosByNorma.aspx, DocumentosByArea.aspx | Alta |
| DC-003 | Versiones de documentos | - | - | RegVersiones.aspx, ListarVersiones.aspx | Alta |
| DC-004 | Parametros de documentos | - | - | ParamDocumentos.aspx | Alta |

### Modulo 18: REPORTES (RP-001 a RP-016)

| ID | Descripcion Funcional | Entidad BE | Repositorio DAL | Pagina Web | Prioridad |
|----|-----------------------|------------|-----------------|------------|-----------|
| RP-001 | Reporte de viajes por socio | OPERACION, CONTRATISTA | IOPERACIONRepository, ICONTRATISTARepository | WFrmReporte_NroViajes_X_Socio.aspx | Alta |
| RP-002 | Reporte de viajes por operacion/equipo | OPERACION, EQUIPO | IOPERACIONRepository, IEQUIPORepository | WFrmReporte_NroViajes_X_Operacion.aspx, WFrmReporte_NroViajes_X_Equipo.aspx | Alta |
| RP-003 | Reporte de round trip | OPERACION | IOPERACIONRepository | WFrmReporte_RoundTrip.aspx | Alta |
| RP-004 | Reporte de incidentes | INCIDENT | IINCIDENTRepository | WFrmReporte_Incident_Tendencia.aspx | Alta |
| RP-005 | Reporte de EPP | PERSONAL_EPP | IPERSONAL_EPPRepository | WFrmReporte_PersonalEpp.aspx | Alta |
| RP-006 | Reporte de viaticos | OPERACION, PERSONAL | IOPERACIONRepository, IPERSONALRepository | WFrmReporte_ViaticosOperacion.aspx | Alta |
| RP-007 | Reporte de mantenimiento | EQUIPO_MANTENIMIENTO | IEQUIPO_MANTENIMIENTORepository | WFrmReporte_ImprimirManttoObservacion.aspx | Alta |
| RP-008 | Reporte de liquidacion | LIQUIDACION | ILIQUIDACIONRepository | WFrmReporte_ImprimirLiquidacion.aspx | Alta |
| RP-009 | Reporte IP Kit Emergencia | - | - | WFrmReporte_IP_KitEmergencia_*.aspx | Alta |
| RP-010 | Reporte de planilla/sobre estadia | OPERACION | IOPERACIONRepository | WFrmReporte_ImprimirPlanilla.aspx, WFrmReporte_SobreEstadia.aspx | Alta |
| RP-011 | Reporte RAC/seguridad operacion | OPERACION | IOPERACIONRepository | WFrmReporte_RAC.aspx, WFrmReporte_SeguridadOperacion.aspx | Alta |
| RP-012 | Reporte de ingresos comision | OPERACION | IOPERACIONRepository | WFrmReporte_Ingresos_ComisionPloteo.aspx | Alta |

---

## MATRIZ DE REQUERIMIENTOS NO FUNCIONALES

| ID | Requerimiento No Funcional | Descripcion | Evidencia en Codigo | Estado |
|----|---------------------------|-------------|---------------------|--------|
| RNF-001 | Rendimiento | Uso de Microsoft Enterprise Library para acceso optimizado | Referencias a Microsoft.Practices.EnterpriseLibrary.Data, Repository | Cumple |
| RNF-002 | Escalabilidad | Arquitectura en 3 capas desacoplada | Capas: WebSite / Identity (BE) / DAL con interfaces | Cumple |
| RNF-003 | Mantenibilidad | Patrón Repository con fábricas CRUD | Cada entidad tiene DeleteFactory, InsertFactory, UpdateFactory, GetById, GetAllFrom | Cumple |
| RNF-004 | Seguridad | Autenticación de usuarios y roles | Login.aspx, WFrmUsuarioCreacion.aspx | Cumple |
| RNF-005 | Compatibilidad | .NET 2.0 con AjaxControlToolkit | Todas las páginas usan ASP.NET WebForms + AjaxControlToolkit | Cumple |
| RNF-006 | Disponibilidad | Múltiples conexiones a SQL Server | 6 connection strings en App.config | Cumple |
| RNF-007 | Usabilidad | Interfaz con GridView, dropdowns, calendarios | AjaxControlToolkit CalendarExtender, GridView AllowPaging | Cumple |
| RNF-008 | Integridad de datos | Validación mediante manejo de excepciones SQL | HandleSqlException con ValidationError y ConcurrencyViolationError | Cumple |
| RNF-009 | Portabilidad | Funciona en Windows con IIS | Web Application ASP.NET | Cumple |
| RNF-010 | Privacidad de datos | Conexiones con credenciales SQL Server | Contraseñas visibles en App.config | Parcial |
| RNF-011 | Fiabilidad | Manejo de excepciones SQL | Try-catch en todos los repositorios | Cumple |
| RNF-012 | Interoperabilidad | Reportes con Microsoft ReportViewer | rsweb:ReportViewer con LocalReport | Cumple |
| RNF-013 | Multiusuario | GridView paginados | AllowPaging=True, PageSize=25 | Cumple |
| RNF-014 | Trazabilidad | Registro de auditoría | Campos de auditoría en entidades | Cumple |
| RNF-015 | Accesibilidad | Navegación consistente | MasterPage en todas las páginas | Cumple |

---

## INDICADORES DE CANTIDAD

| Indicador | Valor |
|-----------|-------|
| Total de clases de entidad (BE) | ~300+ |
| Total de interfaces de repositorio (DAL) | ~300+ |
| Total de implementaciones de repositorio | ~300+ |
| Total de páginas ASP.NET (.aspx) | 379 |
| Total de archivos C# (.cs) | ~600+ |
| Total de archivos SQL (.sql) | ~50+ |
| Número de módulos funcionales | 18 |
| Número de repositorios registrados | ~200+ |
| Connection Strings | 6 |

---

## DIAGRAMA DE ARQUITECTURA

```
CAPA PRESENTACION
  Operaciones (ASP.NET WebForms VB.NET)
  ~379 paginas .aspx + MasterPages + AjaxControlToolkit
       |
CAPA ENTIDADES (BE)
  OperacionesIdentity (C# Class Library)
  ~300 clases POCO (una por tabla de BD)
       |
CAPA ACCESO A DATOS (DAL)
  OperacionesDAL (C# Class Library)
  ~300 interfaces + ~300 implementaciones Repository
  Pattern con Microsoft Enterprise Library 3.1
       |
BASE DE DATOS SQL SERVER
  BDMultitrac, BDAlertasMultitrac, BdNava01
```

---

*Documento generado el 18/09/2026 a partir del analisis del codigo fuente del proyecto MULTITRAC.*
*Fuente: C:\Users\ASUS\Downloads\Multitrac (2)\Multitrac*
*Proyecto: Operaciones.sln (3 proyectos)*

export interface Personal {
  idPersonal: number;
  nomPersonal?: string | null;
  apPersonal?: string | null;
  amPersonal?: string | null;
  dniPersonal?: string | null;
  codigo?: string | null;
  fechNacPersonal?: string | null;
  tlfPesronal?: string | null;
  emailPersonal?: string | null;
  direccionPersonal?: string | null;
  estado?: string | null;
  idCargo?: number | null;
  idArea?: number | null;
  idEmpresa?: number | null;
  fechaIngreso?: string | null;
  fechaBajaPersonal?: string | null;
  fotoPersonal?: string | null;
}

export interface DocumentoVencimiento {
  nombreDocumento?: string | null;
  descripcion?: string | null;
  nroDocumento?: string | null;
  fechaExped?: string | null;
  fechaVencimiento?: string | null;
  diasParaVencer?: number | null;
  estado?: string | null;
  nivelAlerta?: string | null;
}

export interface PersonalVencimientos {
  idPersonal: number;
  nombres?: string | null;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  dni?: string | null;
  codigo?: string | null;
  documentos?: DocumentoVencimiento[] | null;
}

export interface PersonalVencimientosResponse {
  items?: PersonalVencimientos[] | null;
  totalCount?: number | null;
  page?: number | null;
  pageSize?: number | null;
  totalPages?: number | null;
  hasPrevious?: boolean | null;
  hasNext?: boolean | null;
}

/** Espeja Multitrac.Application.DTOs.PersonalVencimientoDto (GET /api/PersonalData/vencimientos). */
export interface PersonalVencimientoDto {
  idPersonalDocumento: number;
  idPersonal?: number | null;
  empCod?: number | null;
  idPersonalMultitrac?: number | null;
  dniPersonal?: string | null;
  nombreCompleto?: string | null;
  idDocumento?: number | null;
  nombreDocumento?: string | null;
  nroDocumento?: string | null;
  fechaExped?: string | null;
  fechaVencimiento?: string | null;
  diasParaVencer?: number | null;
  estado?: string | null;
  tiempoAlertaDias?: number | null;
  nivelAlerta?: string | null;
}

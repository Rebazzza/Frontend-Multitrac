export interface PersonalDocumentoListadoDto {
  idPersonalDocumento: number;
  idPersonal?: number | null;
  personal?: string | null;
  idDocumento?: number | null;
  nombreDocumento?: string | null;
  nroDocumento?: string | null;
  fechaExpedida?: string | null;
  fechaCaducidad?: string | null;
  estado?: string | null;
  diasParaVencer?: number | null;
  nivelAlerta?: string | null;
}

export interface PersonalDocumentoDto {
  idPersonalDocumento?: number | null;
  idPersonal?: number | null;
  idDocumento?: number | null;
  nroDocumento?: string | null;
  fechaExped?: string | null;
  fechaVencimiento?: string | null;
  estado?: string | null;
  url?: string | null;
  nombreArchivo?: string | null;
  observacion?: string | null;
  usuarioModificacion?: string | null;
  fechaModificacion?: string | null;
}

export interface PersonalDocumentoFiltro {
  idPersonal?: number;
  idDocumento?: number;
  estado?: string;
}

export interface CatalogoPersonalDocumento {
  idDocumento: number;
  nombreDocumento?: string | null;
  tipo?: string | null;
  estadoDocReg?: string | null;
}

export interface CatalogoPersonalPersonal {
  idPersonal: number;
  personal?: string | null;
}

export interface CatalogoEstadoDocumento {
  idEstadoDocumento: number;
  estado?: string | null;
  observaciones?: string | null;
  activo?: string | null;
}
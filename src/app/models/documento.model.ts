import type { PagedParams } from './paged-params.model';

/**
 * Módulo Registro Documental y Bandeja de Validación.
 *
 * El backend .NET todavía NO expone un controlador genérico de documentos por
 * sujeto (equipo/personal/contratista), ni pendientes de validación, ni metadata
 * por tipo de documento, ni un endpoint de archivo. Estos tipos definen el
 * contrato REST propuesto; mientras el backend no exista, `documento.service.ts`
 * sirve datos mock (ver `documento.mocks.ts`).
 */

export type TipoSujeto = 'EQUIPO' | 'PERSONAL' | 'CONTRATISTA';

export type EstadoRegistro =
  | 'VIGENTE'
  | 'POR_VENCER'
  | 'VENCIDO'
  | 'SIN_VENCIMIENTO'
  | 'PENDIENTE'
  | 'RECHAZADO';

export type EstadoValidacion = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

/** Sujeto documental (equipo, persona o contratista), según el tipo. */
export interface SujetoOption {
  idSujeto: number;
  tipoSujeto: TipoSujeto;
  codigo: string;
  descripcion?: string | null;
}

/**
 * Metadata del tipo de documento. Define qué campos exige el formulario para
 * ese tipo (fecha de caducidad, kilometraje y facturación del examen médico).
 */
export interface TipoDocumentoMetadata {
  idTipoDocumento: number;
  nombreTipoDocumento: string;
  tipoSujeto: TipoSujeto;
  requiereFechaCaducidad: boolean;
  requiereKilometraje: boolean;
  requiereExamenMedico: boolean;
  requiereFacturacion: boolean;
}

export interface EstadoRegistroOption {
  value: EstadoRegistro;
  label: string;
}

/** Fila del listado GET /api/Documento/paged. */
export interface DocumentoListadoDto {
  idDocumentoRegistro: number;
  tipoSujeto: TipoSujeto;
  idSujeto?: number | null;
  codigoSujeto: string;
  nombreSujeto?: string | null;
  idTipoDocumento: number;
  nombreTipoDocumento?: string | null;
  nroDocumento?: string | null;
  fechaExpedicion?: string | null;
  fechaCaducidad?: string | null;
  kilometraje?: number | null;
  estado: EstadoRegistro;
  diasParaVencer?: number | null;
  nivelAlerta?: string | null;
  tieneArchivo: boolean;
  nombreArchivo?: string | null;
}

/** Detalle / alta / edición GET/POST/PUT /api/Documento. */
export interface DocumentoDto {
  idDocumentoRegistro?: number | null;
  tipoSujeto: TipoSujeto;
  idSujeto?: number | null;
  idTipoDocumento?: number | null;
  nroDocumento?: string | null;
  fechaExpedicion?: string | null;
  fechaCaducidad?: string | null;
  kilometraje?: number | null;
  observacion?: string | null;
  examenMedicoFactura?: string | null;
  examenMedicoFechaFactura?: string | null;
  examenMedicoMonto?: number | null;
  examenMedicoMoneda?: string | null;
  tieneArchivo?: boolean;
  nombreArchivo?: string | null;
}

export interface DocumentoPagedParams extends PagedParams {
  tipoSujeto?: TipoSujeto | null;
  idTipoDocumento?: number | null;
  estado?: EstadoRegistro | '' | null;
}

/** Fila de la bandeja GET /api/Documento/pendientes. */
export interface DocumentoPendienteDto {
  idSolicitud: number;
  idDocumentoRegistro: number;
  tipoSujeto: TipoSujeto;
  codigoSujeto: string;
  nombreSujeto?: string | null;
  nombreTipoDocumento?: string | null;
  nroDocumento?: string | null;
  solicitante?: string | null;
  fechaSolicitud?: string | null;
  estado: EstadoValidacion;
  observacion?: string | null;
  tieneArchivo: boolean;
  nombreArchivo?: string | null;
}

export interface DocumentoPendientesParams extends PagedParams {
  tipoSujeto?: TipoSujeto | null;
  estado?: EstadoValidacion | '' | null;
}

/** Cuerpo de POST /api/Documento/pendientes/validar | /rechazar. */
export interface ResolucionLoteDto {
  ids: number[];
  observacion?: string | null;
}

export const SUJETO_LABELS: Record<TipoSujeto, string> = {
  EQUIPO: 'Equipos',
  PERSONAL: 'Personal',
  CONTRATISTA: 'Contratistas',
};

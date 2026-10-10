import type { PagedParams } from './paged-params.model';

/** CHECKLIST_AREA: 1 = MANTENIMIENTO, 2 = SEGURIDAD Y PDP. */
export interface ChecklistArea {
  idChecklistArea: number;
  /** Ojo: en CHECKLIST_TIPO este campo referencia el id de CHECKLIST_AREA, no el de la tabla AREA. */
  idAreaMultitrac: number;
  nombreArea?: string | null;
}

export interface ChecklistTipo {
  idCheckListTipo: number;
  idAreaMultitrac: number;
  nombreTipo?: string | null;
}

/** CHECKLIST_ESTADO: 1 = OPERATIVO, 2 = INOPERATIVO, 3 = OBSEVADO (typo heredado de la BD). */
export interface ChecklistEstado {
  idEstadoCheckList: number;
  estadoCheckList?: string | null;
}

/** Fila de la tabla CHECKLIST tal como la devuelve GET /api/checklist/paged. */
export interface ChecklistDto {
  idChecklistOp: number;
  codigoChecklist?: string | null;
  estado?: string | null;
  colorEstado?: string | null;
  area?: string | null;
  fecha?: string | null;
  hora?: string | null;
  equipo?: string | null;
  acoplado?: string | null;
  kilometraje?: number | null;
  conductor?: string | null;
  revisor?: string | null;
  observaciones?: string | null;
  extFecCad01?: string | null;
  extFecCad02?: string | null;
  idOperacionGeneralEquipo?: number | null;
}

export interface CrearChecklistDto {
  codigoChecklist?: string | null;
  idChecklistTipo: number;
  idChecklistEstado: number;
  idPersonal?: number | null;
  idPersonalRevision?: number | null;
  equipo?: string | null;
  acoplado?: string | null;
  kilometraje?: number | null;
  fecha?: string | null;
  hora?: string | null;
  observaciones?: string | null;
  extintor01?: string | null;
  extintor02?: string | null;
  ext01Fecha?: string | null;
  ext02Fecha?: string | null;
  idOperacionGeneralEquipo?: number | null;
}

/** Ultimo extintor registrado de un equipo; null si el equipo no tiene ninguno. */
export interface ExtintoresInfoDto {
  equipo?: string | null;
  extintor01?: string | null;
  extintor02?: string | null;
  ext01Fecha?: string | null;
  ext02Fecha?: string | null;
}

/**
 * Revision continua en ruta. No sale de CHECKLIST sino de
 * OPERACION_GENERAL_EQUIPO_CHECKLIST_MANTTO (tipoArea 1) o _PDP (tipoArea 2),
 * que son las unicas con historial real.
 */
export interface OperacionChecklistHistorialDto {
  idCheckList: number;
  idOperacionGeneralEquipo: number;
  tipoArea: number;
  tipoChecklist?: string | null;
  idPersonal?: number | null;
  personal?: string | null;
  fechaRevision?: string | null;
  horaRevision?: string | null;
  idEstadoCheckList?: number | null;
  estadoCheckList?: string | null;
  observaciones?: string | null;
}

export interface ChecklistPagedParams extends PagedParams {
  idTipo?: number | null;
  idArea?: number | null;
  idEstado?: number | null;
  codEquipo?: string | null;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
}

/** Area 1 = MANTENIMIENTO, 2 = SEGURIDAD Y PDP (unico area con bloque de extintores). */
export const AREA_MANTENIMIENTO = 1;
export const AREA_SEGURIDAD_PDP = 2;

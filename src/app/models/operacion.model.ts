export interface Operacion {
  idOperacion: number;
  descOperacion?: string | null;
  origen?: string | null;
  destino?: string | null;
  convoy?: number | null;
  orden?: number | null;
  idCliente?: number | null;
  fechaInicioPlanOp?: string | null;
  fechaFinPlanOp?: string | null;
  fechaSalidaPlanificada?: string | null;
  horaSalidaPlanificada?: string | null;
  estado?: string | null;
  idTipoCarga?: number | null;
  idTurno?: number | null;
  idActividad?: number | null;
  tipoOperacion?: string | null;
  ubicacionActual?: string | null;
  kilometrajeEstimado?: number | null;
  idOperacionGeneral?: number | null;
}

export interface OperacionGeneral {
  idOperacionGeneral: number;
  idOperacion: number;
  idTipoCarga: number;
  idTipoOperacion?: number | null;
  fechaInicioPlanOp?: string | null;
  horaInicioPlanOp?: string | null;
  nroConvoy?: number | null;
  estado?: string | null;
  observaciones?: string | null;
  idTurno?: number | null;
  idActividad?: number | null;
}

export interface OperacionGeneralEquipo {
  idOperacionGeneralEquipo: number;
  idOperacionGeneral: number;
  convoy?: number | null;
  posicion?: number | null;
  codEquipoTracto: string;
  codEquipoCarreta: string;
  carretaTercero?: boolean | null;
  idPersonal: number;
  idPersonalCopiloto?: number | null;
  tipo?: string | null;
  conductorPrincipal?: string | null;
  copiloto?: string | null;
  disponible?: boolean | null;
}

export interface Convoy {
  convoy: number;
  idOperacionGeneral: number;
  tracto?: string | null;
  carreta?: string | null;
  idPersonalConductor?: number | null;
  conductor?: string | null;
  idPersonalCopiloto?: number | null;
  copiloto?: string | null;
  estado?: string | null;
}

export interface OperacionCreateDto {
  descOperacion?: string | null;
  origen?: string | null;
  destino?: string | null;
  convoy?: number | null;
  orden?: number | null;
  idCliente?: number | null;
  fechaInicioPlanOp?: string | null;
  fechaFinPlanOp?: string | null;
  fechaSalidaPlanificada?: string | null;
  horaSalidaPlanificada?: string | null;
  estado?: string | null;
  idTipoCarga?: number | null;
  idTurno?: number | null;
  idActividad?: number | null;
  ubicacionActual?: string | null;
  kilometrajeEstimado?: number | null;
}

export interface OperacionUpdateDto extends OperacionCreateDto {
  idOperacion: number;
}

export interface CrearOperacionRequest extends OperacionCreateDto {}

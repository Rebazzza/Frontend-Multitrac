export interface Turno {
  idTurno: number;
  idContratista: number;
  idOperacion: number;
  posicionTurno?: string;
  fechInicTurno?: string;
  fechFinTurno?: string;
  estado?: string;
}

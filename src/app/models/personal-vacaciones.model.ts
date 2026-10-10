export interface PersonalVacaciones {
  idPersonalVacaciones: number;
  idPersonal?: number | null;
  periodoIni?: number | null;
  periodoFin?: number | null;
  fechaIng?: string | null;
  diasPendientes?: number | null;
  observaciones?: string | null;
  estado?: string | null;
}

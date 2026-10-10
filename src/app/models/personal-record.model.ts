export interface PersonalRecord {
  idPersonalRecord: number;
  idPersonal?: number | null;
  idTipoOcurrencia?: number | null;
  fechaOcurrencia?: string | null;
  descripcionOcurrencia?: string | null;
  medidasAImplementar?: string | null;
  idPersonalMedImpl?: number | null;
  recordInicial?: number | null;
  recordFinal?: number | null;
  merito?: number | null;
  demerito?: number | null;
  idPersonalVerificacion?: number | null;
  fechaReporte?: string | null;
}

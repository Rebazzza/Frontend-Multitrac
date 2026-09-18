export interface PersonalEquipo {
  idPersonalEquipo: number;
  idPersonal: number;
  codEquipo?: string | null;
  fechIni?: string | null;
  fechFin?: string | null;
  idRemplazo?: number | null;
  estado?: string | null;
}
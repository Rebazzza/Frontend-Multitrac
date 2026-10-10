export interface EquipoChecklistItem {
  idEquipoChecklistItem?: number;
  idEquipoChecklist?: number | null;
  seccion?: string | null;
  item?: string | null;
  resultado?: 'Bueno' | 'Malo' | 'NA' | string | null;
  requiereFoto?: boolean | null;
  fotoUrl?: string | null;
  observaciones?: string | null;
}

export interface EquipoChecklist {
  idEquipoChecklist?: number;
  idPersonal?: number | null;
  idEquipoTracto?: number | null;
  idEquipoCarreta?: number | null;
  codigoTracto?: string | null;
  codigoCarreta?: string | null;
  placaTracto?: string | null;
  placaCarreta?: string | null;
  kilometraje?: number | null;
  fecha?: string | null;
  hora?: string | null;
  resultado?: 'Aprobado' | 'Rechazado' | string | null;
  observaciones?: string | null;
  items?: EquipoChecklistItem[] | null;
}

export interface EquipoChecklistCreateDto {
  idPersonal?: number | null;
  idEquipoTracto?: number | null;
  idEquipoCarreta?: number | null;
  codigoTracto?: string | null;
  codigoCarreta?: string | null;
  placaTracto?: string | null;
  placaCarreta?: string | null;
  kilometraje?: number | null;
  fecha?: string | null;
  hora?: string | null;
  resultado?: string | null;
  observaciones?: string | null;
  items?: EquipoChecklistItem[] | null;
}

export interface EquipoChecklistUpdateDto extends EquipoChecklistCreateDto {
  idEquipoChecklist: number;
}

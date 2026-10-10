export interface PersonalEpp {
  idPersonalEpp: number;
  idPersonal?: number | null;
  idRequerimientoGeneral?: number | null;
  talla?: string | null;
  observacion?: string | null;
  estado?: string | null;
}

export interface PersonalEppKardex {
  idPersonalEppKardex: number;
  idPersonalEpp?: number | null;
  fechaEntrega?: string | null;
  idEppCondicionEntrega?: number | null;
  fechaRevision?: string | null;
  idEppCondicionRevision?: number | null;
  fechaReposicion?: string | null;
  idEppCondicionReposicion?: number | null;
  estado?: string | null;
  cantidad?: number | null;
  idUndidadCantidad?: number | null;
}

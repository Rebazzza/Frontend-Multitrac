export interface Equipo {
  idEquipo?: number;
  codEquipo?: string | null;
  noPlaca?: string | null;
  tipoEquipo?: string | null;
  marca?: string | null;
  modelo?: string | null;
  estatusEquipo?: string | null;
  kilometraje?: number | null;
  fechaCompra?: string | null;
  fechaVencimientoSOAT?: string | null;
  fechaVencimientoRevisionTecnica?: string | null;
  diasParaVencerSOAT?: number | null;
  diasParaVencerRevisionTecnica?: number | null;
  alertaDocumentos?: string | null;
}

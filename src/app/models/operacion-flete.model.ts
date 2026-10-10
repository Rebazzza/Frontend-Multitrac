export interface OperacionFlete {
  idOperacionFlete?: number;
  idOperacion?: number | null;
  idContratista?: number | null;
  fleteCalculado?: number | null;
  comision?: number | null;
  descuento?: number | null;
  totalPagar?: number | null;
  observaciones?: string | null;
  tarifaFlete?: number | null;
  horasStandBy?: number | null;
  peso?: number | null;
  grRemitente?: string | null;
  grTransportista?: string | null;
  guiaRemision?: string | null;
  numeroGuia?: string | null;
  fecha?: string | null;
}

export interface OperacionFleteDto extends OperacionFlete {}

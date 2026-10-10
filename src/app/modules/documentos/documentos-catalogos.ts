import type {
  EstadoRegistroOption,
  SujetoOption,
  TipoDocumentoMetadata,
  TipoSujeto,
} from '../../models/documento.model';

/**
 * Catálogos locales. El backend no expone metadata por tipo de documento
 * (requiere caducidad / kilometraje / examen médico / facturación), así que se
 * declara aquí. Si se agregan o cambian tipos en la BD hay que actualizar este
 * archivo a mano.
 */

export const TIPOS_DOCUMENTO: TipoDocumentoMetadata[] = [
  // Equipos
  {
    idTipoDocumento: 1,
    nombreTipoDocumento: 'SOAT',
    tipoSujeto: 'EQUIPO',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 2,
    nombreTipoDocumento: 'Revisión Técnica',
    tipoSujeto: 'EQUIPO',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 3,
    nombreTipoDocumento: 'Tarjeta de Propiedad',
    tipoSujeto: 'EQUIPO',
    requiereFechaCaducidad: false,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 4,
    nombreTipoDocumento: 'Permiso de Operaciones',
    tipoSujeto: 'EQUIPO',
    requiereFechaCaducidad: true,
    requiereKilometraje: true,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  // Personal
  {
    idTipoDocumento: 5,
    nombreTipoDocumento: 'DNI',
    tipoSujeto: 'PERSONAL',
    requiereFechaCaducidad: false,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 6,
    nombreTipoDocumento: 'Licencia de Conducir',
    tipoSujeto: 'PERSONAL',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 7,
    nombreTipoDocumento: 'Examen Médico',
    tipoSujeto: 'PERSONAL',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: true,
    requiereFacturacion: true,
  },
  {
    idTipoDocumento: 8,
    nombreTipoDocumento: 'Contrato de Trabajo',
    tipoSujeto: 'PERSONAL',
    requiereFechaCaducidad: false,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  // Contratistas
  {
    idTipoDocumento: 9,
    nombreTipoDocumento: 'RUC',
    tipoSujeto: 'CONTRATISTA',
    requiereFechaCaducidad: false,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 10,
    nombreTipoDocumento: 'Contrato de Servicio',
    tipoSujeto: 'CONTRATISTA',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 11,
    nombreTipoDocumento: 'SCTR',
    tipoSujeto: 'CONTRATISTA',
    requiereFechaCaducidad: true,
    requiereKilometraje: false,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
  {
    idTipoDocumento: 12,
    nombreTipoDocumento: 'Certificado de Homologación',
    tipoSujeto: 'CONTRATISTA',
    requiereFechaCaducidad: true,
    requiereKilometraje: true,
    requiereExamenMedico: false,
    requiereFacturacion: false,
  },
];

export const SUJETOS: SujetoOption[] = [
  { idSujeto: 1, tipoSujeto: 'EQUIPO', codigo: 'BSG-816', descripcion: 'Tracto Volvo FH16' },
  { idSujeto: 2, tipoSujeto: 'EQUIPO', codigo: 'M2Q-703', descripcion: 'Carreta de plataforma' },
  { idSujeto: 3, tipoSujeto: 'EQUIPO', codigo: 'T0N-847', descripcion: 'Tracto Scania R450' },
  { idSujeto: 1, tipoSujeto: 'PERSONAL', codigo: 'DNI 45678912', descripcion: 'AYALA QUISPE, JUAN' },
  { idSujeto: 2, tipoSujeto: 'PERSONAL', codigo: 'DNI 41234567', descripcion: 'TORRES MENDOZA, LUIS' },
  { idSujeto: 1, tipoSujeto: 'CONTRATISTA', codigo: 'RUC 20481234567', descripcion: 'TRANSPORTES ANDINOS SAC' },
  { idSujeto: 2, tipoSujeto: 'CONTRATISTA', codigo: 'RUC 20599887766', descripcion: 'SERVICIOS LOGISTICOS DEL SUR EIRL' },
];

export const ESTADOS_REGISTRO: EstadoRegistroOption[] = [
  { value: 'VIGENTE', label: 'Vigente' },
  { value: 'POR_VENCER', label: 'Por vencer' },
  { value: 'VENCIDO', label: 'Vencido' },
  { value: 'SIN_VENCIMIENTO', label: 'Sin vencimiento' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'RECHAZADO', label: 'Rechazado' },
];

export function tiposPorSujeto(tipo: TipoSujeto): TipoDocumentoMetadata[] {
  return TIPOS_DOCUMENTO.filter((t) => t.tipoSujeto === tipo);
}

export function sujetosPorTipo(tipo: TipoSujeto): SujetoOption[] {
  return SUJETOS.filter((s) => s.tipoSujeto === tipo);
}

export function metadataTipoDocumento(idTipoDocumento?: number | null): TipoDocumentoMetadata | undefined {
  if (idTipoDocumento == null) return undefined;
  return TIPOS_DOCUMENTO.find((t) => t.idTipoDocumento === idTipoDocumento);
}

import type { DocumentoListadoDto, EstadoRegistro, EstadoValidacion } from '../../models/documento.model';

export type NivelAlerta = 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'gris';

/** Días (enteros) que faltan para la caducidad; negativo si ya venció. */
export function calcularDiasParaVencer(fechaCaducidad?: string | null): number | null {
  if (!fechaCaducidad) return null;
  const objetivo = new Date(fechaCaducidad);
  if (Number.isNaN(objetivo.getTime())) return null;
  const hoy = new Date();
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();
  return Math.round((objetivo.getTime() - base) / 86400000);
}

/** Nivel de vigencia usado para colorear los badges. */
export function getNivelAlerta(
  item: Pick<DocumentoListadoDto, 'diasParaVencer' | 'fechaCaducidad' | 'nivelAlerta'>,
): NivelAlerta {
  const dias = item.diasParaVencer ?? calcularDiasParaVencer(item.fechaCaducidad);
  if (dias == null) {
    const api = item.nivelAlerta;
    if (api === 'verde' || api === 'amarillo' || api === 'naranja' || api === 'rojo') return api;
    return 'gris';
  }
  if (dias <= 5) return 'rojo';
  if (dias <= 10) return 'naranja';
  if (dias <= 30) return 'amarillo';
  return 'verde';
}

export const NIVEL_LABEL: Record<NivelAlerta, string> = {
  verde: 'Al día',
  amarillo: 'Próximo',
  naranja: 'Por vencer',
  rojo: 'Vencido',
  gris: 'Sin vencimiento',
};

export const ESTADO_REGISTRO_LABEL: Record<EstadoRegistro, string> = {
  VIGENTE: 'Vigente',
  POR_VENCER: 'Por vencer',
  VENCIDO: 'Vencido',
  SIN_VENCIMIENTO: 'Sin vencimiento',
  PENDIENTE: 'Pendiente',
  RECHAZADO: 'Rechazado',
};

const ESTADO_REGISTRO_COLOR: Record<EstadoRegistro, NivelAlerta> = {
  VIGENTE: 'verde',
  POR_VENCER: 'amarillo',
  VENCIDO: 'rojo',
  SIN_VENCIMIENTO: 'gris',
  PENDIENTE: 'naranja',
  RECHAZADO: 'rojo',
};

export const ESTADO_VALIDACION_LABEL: Record<EstadoValidacion, string> = {
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
};

const ESTADO_VALIDACION_COLOR: Record<EstadoValidacion, NivelAlerta> = {
  PENDIENTE: 'naranja',
  APROBADO: 'verde',
  RECHAZADO: 'rojo',
};

export function nivelBadgeClass(nivel: NivelAlerta): string {
  return `documentos-badge documentos-badge--${nivel}`;
}

export function estadoRegistroBadgeClass(estado: EstadoRegistro): string {
  return `documentos-badge documentos-badge--${ESTADO_REGISTRO_COLOR[estado] ?? 'gris'}`;
}

export function estadoValidacionBadgeClass(estado: EstadoValidacion): string {
  return `documentos-badge documentos-badge--${ESTADO_VALIDACION_COLOR[estado] ?? 'gris'}`;
}

export function formatearFecha(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatearNumero(value?: number | null): string {
  if (value == null) return '—';
  return value.toLocaleString('es-PE');
}

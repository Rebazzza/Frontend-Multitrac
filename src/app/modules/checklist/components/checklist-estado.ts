/**
 * CHECKLIST.ESTADO guarda "OBSEVADO" con una S de mas. Se corrige solo en pantalla:
 * tocar el dato historico cambiaria el reporte del sistema legacy.
 */
export function normalizarEstado(estado?: string | null): string {
  if (!estado) return '—';
  return estado.trim().toUpperCase() === 'OBSEVADO' ? 'OBSERVADO' : estado.trim();
}

/** Colores de badge por estado; el backend tambien los manda en ChecklistDto.colorEstado. */
export const ESTADO_COLORES: Record<string, string> = {
  OPERATIVO: '#28a745',
  INOPERATIVO: '#dc3545',
  OBSEVADO: '#fd7e14',
  OBSERVADO: '#fd7e14',
};

export const ESTADO_FALLBACK = '#6c757d';

export function colorEstado(estado?: string | null): string {
  if (!estado) return ESTADO_FALLBACK;
  return ESTADO_COLORES[estado.trim().toUpperCase()] ?? ESTADO_FALLBACK;
}

export function formatFecha(value?: string | null): string {
  if (!value) return '—';
  const soloFecha = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (soloFecha) return `${soloFecha[3]}/${soloFecha[2]}/${soloFecha[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function toDateInput(value?: string | null): string {
  return value ? value.slice(0, 10) : '';
}

export function toApiDate(value: string): string | null {
  return value ? `${value}T00:00:00` : null;
}

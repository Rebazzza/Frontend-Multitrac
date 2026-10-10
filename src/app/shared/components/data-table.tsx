import { useMemo, type ReactNode } from 'react';
import './data-table.css';

export interface Column<T> {
  /**
   * Identificador estable y unico de la columna. React lo usa como `key`.
   * Si no se informa, se usa `key`. Debe ser unico dentro de la tabla.
   */
  id?: string;
  /** Propiedad del registro que se lee por defecto y que se usa para ordenar. */
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  /** Ancho opcional de la columna (numero en px o cualquier valor CSS). */
  width?: number | string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSort?: (key: string) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  /**
   * Identificador unico de cada fila (por ejemplo `item => item.idSueno`).
   * Nunca usar propiedades de celdas que puedan repetirse. Si se omite,
   * se usa el indice de la fila.
   */
  getRowKey?: (item: T, index: number) => string | number;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortDirection,
  emptyMessage = 'No hay registros.',
  viewLabel = 'Ver',
  editLabel = 'Editar',
  deleteLabel = 'Eliminar',
  getRowKey,
}: DataTableProps<T>) {
  // React exige que las `key` sean estrictamente unicas dentro de cada lista.
  // Si dos columnas comparten `id`/`key` (deuda tecnica en la definicion de
  // columnas), se desambigua la segunda para no romper la reconciliacion del
  // DOM virtual, que es lo que desalinea y aplasta las celdas.
  const columnIds = useMemo(() => {
    const repeticiones = new Map<string, number>();
    return columns.map((col, i) => {
      const base = col.id ?? col.key ?? `col-${i}`;
      const veces = repeticiones.get(base) ?? 0;
      repeticiones.set(base, veces + 1);
      return veces === 0 ? base : `${base}__${veces}`;
    });
  }, [columns]);

  const anchoDe = (col: Column<T>): string | undefined => {
    if (col.width === undefined) return undefined;
    return typeof col.width === 'number' ? `${col.width}px` : col.width;
  };

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={columnIds[i]}
                style={anchoDe(col) ? { width: anchoDe(col) } : undefined}
                className={col.sortable ? 'data-table__th--sortable' : ''}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
              >
                {col.header}
                {col.sortable && sortBy === col.key && (
                  <span className="data-table__sort-icon">
                    {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </th>
            ))}
            {(onView || onEdit || onDelete) && <th className="data-table__actions-th">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onView || onEdit || onDelete ? 1 : 0)} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={getRowKey ? getRowKey(item, idx) : idx}>
                {columns.map((col, i) => (
                  <td key={columnIds[i]}>
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="data-table__actions">
                    {onView && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => onView(item)}>
                        {viewLabel}
                      </button>
                    )}
                    {onEdit && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => onEdit(item)}>
                        {editLabel}
                      </button>
                    )}
                    {onDelete && (
                      <button type="button" className="btn btn--danger btn--sm" onClick={() => onDelete(item)}>
                        {deleteLabel}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

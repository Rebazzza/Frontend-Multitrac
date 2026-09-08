import type { ReactNode } from 'react';
import './data-table.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onSort?: (key: string) => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortDirection,
  emptyMessage = 'No hay registros.',
}: DataTableProps<T>) {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
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
            {(onEdit || onDelete) && <th className="data-table__actions-th">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="data-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="data-table__actions">
                    {onEdit && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => onEdit(item)}>
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button type="button" className="btn btn--danger btn--sm" onClick={() => onDelete(item)}>
                        Eliminar
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

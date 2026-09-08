import './pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}

const PAGE_SIZES = [10, 25, 50, 100];

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

export function Pagination({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  pageSize = 25,
  onPageSizeChange,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Paginación">
      <div className="pagination__sizes">
        <span className="pagination__label">Elementos por página:</span>
        {onPageSizeChange && (
          <select
            className="pagination__select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Elementos por página"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        )}
      </div>
      <span className="pagination__info">
        {page} de {totalPages}
      </span>
      <div className="pagination__arrows">
        <button
          type="button"
          className="pagination__arrow"
          aria-label="Página anterior"
          disabled={!hasPrevious}
          onClick={() => onPageChange(page - 1)}
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          className="pagination__arrow"
          aria-label="Página siguiente"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </nav>
  );
}
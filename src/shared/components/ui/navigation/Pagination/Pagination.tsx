import React from 'react';

/**
 * Propiedades del componente Pagination
 */
export interface PaginationProps {
  /** Página actual (1-indexed) */
  currentPage: number;
  /** Total de páginas */
  totalPages: number;
  /** Callback cuando cambia la página */
  onPageChange: (page: number) => void;
  /** Tamaño de página (opcional) */
  pageSize?: number;
  /** Callback cuando cambia el tamaño de página */
  onPageSizeChange?: (size: number) => void;
  /** Opciones de tamaño de página */
  pageSizeOptions?: number[];
  /** Mostrar selector de tamaño de página */
  showPageSizeSelector?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Pagination para controles de paginación
 * Implementa accesibilidad WCAG 2.1 AA con navegación completa
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      pageSize,
      onPageSizeChange,
      pageSizeOptions = [10, 25, 50, 100],
      showPageSizeSelector = false,
      className = '',
    },
    ref
  ) => {
    // Validar que currentPage está dentro del rango
    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    // Calcular rango de páginas a mostrar
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 7; // Máximo de botones de página visibles

      if (totalPages <= maxVisible) {
        // Mostrar todas las páginas si son menos que el máximo
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Siempre mostrar primera página
        pages.push(1);

        // Calcular rango alrededor de la página actual
        const start = Math.max(2, safeCurrentPage - 2);
        const end = Math.min(totalPages - 1, safeCurrentPage + 2);

        // Agregar ellipsis al inicio si es necesario
        if (start > 2) {
          pages.push('...');
        }

        // Agregar páginas del rango
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        // Agregar ellipsis al final si es necesario
        if (end < totalPages - 1) {
          pages.push('...');
        }

        // Siempre mostrar última página
        pages.push(totalPages);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    // Manejar cambio de página
    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages && page !== safeCurrentPage) {
        onPageChange(page);
      }
    };

    // Manejar cambio de tamaño de página
    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = parseInt(e.target.value, 10);
      onPageSizeChange?.(newSize);
    };

    const combinedClasses = `
      flex items-center justify-between
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos de botón de página
    const getPageButtonStyles = (isActive: boolean, isDisabled: boolean) => {
      const baseStyles =
        'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200' +
        ' focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2';

      const activeStyles = 'bg-emerald-600 text-white border-emerald-600';
      const inactiveStyles =
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
      const disabledStyles =
        'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed';

      return `
        ${baseStyles}
        ${isDisabled ? disabledStyles : isActive ? activeStyles : inactiveStyles}
      `.replace(/\s+/g, ' ').trim();
    };

    return (
      <nav ref={ref} aria-label="Pagination" className={combinedClasses}>
        <div className="flex items-center space-x-2">
          {/* Botón Previous */}
          <button
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className={getPageButtonStyles(false, safeCurrentPage === 1)}
            aria-label="Previous page"
          >
            ‹ Previous
          </button>

          {/* Botones de página */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === safeCurrentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={getPageButtonStyles(isActive, false)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Botón Next */}
          <button
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            className={getPageButtonStyles(false, safeCurrentPage === totalPages)}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>

        {/* Selector de tamaño de página */}
        {showPageSizeSelector && pageSize && onPageSizeChange && (
          <div className="flex items-center space-x-2 ml-4">
            <label htmlFor="page-size" className="text-sm text-gray-700">
              Items per page:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Información de página */}
        <div className="text-sm text-gray-700 ml-4">
          Page {safeCurrentPage} of {totalPages}
        </div>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

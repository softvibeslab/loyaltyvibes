import React, { useState } from 'react';

/**
 * Interfaz para una columna de la tabla
 */
export interface TableColumn<T = unknown> {
  /** Identificador único de la columna */
  id: string;
  /** Etiqueta visible de la columna */
  label: string;
  /** Función para renderizar el contenido de la celda */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** Clave del objeto de datos para mostrar el valor */
  key?: keyof T;
  /** Si la columna es ordenable */
  sortable?: boolean;
  /** Clase CSS adicional para la celda */
  cellClassName?: string;
}

/**
 * Ordenamiento de la tabla
 */
export type SortOrder = 'asc' | 'desc' | null;

/**
 * Propiedades del componente Table
 */
export interface TableProps<T = unknown> {
  /** Definición de columnas */
  columns: TableColumn<T>[];
  /** Datos a mostrar */
  data: T[];
  /** Si la tabla es ordenable */
  sortable?: boolean;
  /** Callback cuando se ordena una columna */
  onSort?: (columnId: string, order: SortOrder) => void;
  /** Mensaje para mostrar cuando no hay datos */
  emptyMessage?: string;
  /** Si mostrar filas con efecto zebra */
  zebraStripes?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Table para mostrar datos tabulares con ordenamiento
 * Implementa accesibilidad WCAG 2.1 AA con tabla semántica
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      sortable = false,
      onSort,
      emptyMessage = 'No data available',
      zebraStripes = true,
      className = '',
    },
    ref
  ) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);

    // Manejar ordenamiento
    const handleSort = (column: TableColumn) => {
      if (!sortable || !column.sortable) return;

      let newOrder: SortOrder = 'asc';

      if (sortColumn === column.id) {
        if (sortOrder === 'asc') {
          newOrder = 'desc';
        } else if (sortOrder === 'desc') {
          newOrder = null;
        }
      }

      setSortColumn(newOrder ? column.id : null);
      setSortOrder(newOrder);
      onSort?.(column.id, newOrder);
    };

    // Obtener valor de celda
    const getCellValue = (column: TableColumn, row: unknown, index: number) => {
      if (column.render) {
        return column.render(
          column.key ? (row as Record<string, unknown>)[column.key] : null,
          row as T,
          index
        );
      }

      if (column.key) {
        return String((row as Record<string, unknown>)[column.key] ?? '');
      }

      return null;
    };

    // Ordenar datos si hay un orden activo
    const sortedData = React.useMemo(() => {
      if (!sortColumn || !sortOrder) return data;

      const column = columns.find((col) => col.id === sortColumn);
      if (!column || !column.key) return data;

      return [...data].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[column.key!];
        const bValue = (b as Record<string, unknown>)[column.key!];

        if (aValue === bValue) return 0;

        const comparison = aValue < bValue ? -1 : 1;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }, [data, sortColumn, sortOrder, columns]);

    // Renderizar indicador de ordenamiento
    const renderSortIndicator = (column: TableColumn) => {
      if (!sortable || !column.sortable) return null;

      const isActive = sortColumn === column.id;

      return (
        <span className="ml-2" aria-hidden="true">
          {isActive ? (
            sortOrder === 'asc' ? '↑' : '↓'
          ) : (
            <span className="text-gray-400">↕</span>
          )}
        </span>
      );
    };

    const combinedClasses = `
      min-w-full divide-y divide-gray-200
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // No hay datos
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500" role="status">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table ref={ref} className={combinedClasses}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  onClick={() => handleSort(column)}
                  aria-sort={
                    sortColumn === column.id
                      ? sortOrder === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIndicator(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${zebraStripes && rowIndex % 2 === 0 ? 'bg-white' : zebraStripes ? 'bg-gray-50' : ''}
                  hover:bg-gray-100 transition-colors duration-150
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-900
                      ${column.cellClassName || ''}
                    `}
                  >
                    {getCellValue(column, row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

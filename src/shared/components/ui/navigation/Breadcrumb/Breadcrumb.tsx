import React from 'react';
import Link from 'next/link';

/**
 * Interfaz para un item del breadcrumb
 */
export interface BreadcrumbItem {
  /** Etiqueta visible del item */
  label: string;
  /** URL de navegación (opcional, si no se proporciona el item no será clickeable) */
  href?: string;
  /** Icono opcional (emoji o string) */
  icon?: string;
}

/**
 * Propiedades del componente Breadcrumb
 */
export interface BreadcrumbProps {
  /** Array de items del breadcrumb */
  items: BreadcrumbItem[];
  /** Separador entre items (default: '/') */
  separator?: string;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Breadcrumb para mostrar la ruta de navegación actual
 * Implementa accesibilidad WCAG 2.1 AA con navegación semántica
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', className = '' }, ref) => {
    if (!items || items.length === 0) {
      return null;
    }

    const combinedClasses = `
      flex items-center space-x-2 text-sm
      ${className}
    `.replace(/\s+/g, ' ').trim();

    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={combinedClasses}
      >
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {/* Separador (excepto antes del primer item) */}
                {!isFirst && (
                  <span
                    className="mx-2 text-gray-400"
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                )}

                {/* Item del breadcrumb */}
                {isLast ? (
                  // Página actual - no es clickeable
                  <span
                    className="font-medium text-gray-900"
                    aria-current="page"
                  >
                    {item.icon && (
                      <span className="mr-1" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                ) : item.href ? (
                  // Item clickeable con Link
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                  >
                    {item.icon && (
                      <span className="mr-1" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                ) : (
                  // Item sin href - no clickeable
                  <span className="text-gray-600">
                    {item.icon && (
                      <span className="mr-1" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

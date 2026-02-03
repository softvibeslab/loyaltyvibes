import React, { useState, useRef, useEffect } from 'react';
import { TooltipProps, TooltipPlacement } from './Tooltip.types';

/**
 * Componente Tooltip con posicionamiento automático
 * Implementa WCAG 2.1 AA
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  arrow = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Mostrar tooltip con retraso
  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  // Ocultar tooltip inmediatamente
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Manejar foco
  const handleFocus = () => {
    showTooltip();
  };

  const handleBlur = () => {
    hideTooltip();
  };

  // Clonar el hijo para agregar event handlers
  const triggerElement = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-describedby': isVisible ? `tooltip-${React.useId()}` : undefined,
  });

  // Mapeo de posiciones a clases
  const placementClasses: Record<TooltipPlacement, { tooltip: string; arrow: string }> = {
    top: {
      tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      arrow: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    },
    bottom: {
      tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
      arrow: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    },
    left: {
      tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
      arrow: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    },
    right: {
      tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
      arrow: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
    },
  };

  const classes = placementClasses[placement];

  return (
    <>
      {triggerElement}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 text-xs text-white
            bg-gray-900 rounded shadow-lg whitespace-nowrap
            ${classes.tooltip}
            ${className}
          `}
          role="tooltip"
          id={`tooltip-${React.useId()}`}
        >
          {content}
          {arrow && (
            <div
              className={`
                absolute w-0 h-0 border-4
                ${classes.arrow}
              `}
              aria-hidden="true"
            />
          )}
        </div>
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

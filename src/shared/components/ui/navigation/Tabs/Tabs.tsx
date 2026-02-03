import React, { useState, KeyboardEvent } from 'react';

/**
 * Interfaz para definir una pestaña individual
 */
export interface Tab {
  /** Identificador único de la pestaña */
  id: string;
  /** Etiqueta visible de la pestaña */
  label: string;
  /** Contenido a mostrar cuando la pestaña está activa */
  content: React.ReactNode;
  /** Icono opcional (emoji o string) */
  icon?: string;
  /** Si la pestaña está deshabilitada */
  disabled?: boolean;
}

/**
 * Orientación del componente Tabs
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Propiedades del componente Tabs
 */
export interface TabsProps {
  /** Array de pestañas a mostrar */
  tabs: Tab[];
  /** ID de la pestaña activa por defecto */
  defaultTab?: string;
  /** Callback cuando cambia la pestaña activa */
  onChange?: (tabId: string) => void;
  /** Orientación de las pestañas (horizontal | vertical) */
  orientation?: TabsOrientation;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Tabs para navegación por pestañas con orientación configurable
 * Implementa accesibilidad WCAG 2.1 AA con navegación por teclado
 * - Flechas: Navegar entre pestañas
 * - Home/End: Ir a primera/última pestaña
 * - Enter/Space: Activar pestaña
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      tabs,
      defaultTab,
      onChange,
      orientation = 'horizontal',
      className = '',
    },
    ref
  ) => {
    // Estado para la pestaña activa
    const [activeTab, setActiveTab] = useState(
      defaultTab || (tabs.length > 0 ? tabs[0].id : '')
    );
    // Estado para el foco del teclado
    const [focusedTab, setFocusedTab] = useState(activeTab);

    // Manejar cambio de pestaña
    const handleTabChange = (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && !tab.disabled) {
        setActiveTab(tabId);
        setFocusedTab(tabId);
        onChange?.(tabId);
      }
    };

    // Manejar navegación por teclado
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      const currentIndex = tabs.findIndex((t) => t.id === focusedTab);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleTabChange(focusedTab);
          return;
        default:
          return;
      }

      // Encontrar la siguiente pestaña no deshabilitada
      let searchIndex = nextIndex;
      let loops = 0;
      while (tabs[searchIndex].disabled && loops < tabs.length) {
        searchIndex =
          searchIndex < tabs.length - 1 ? searchIndex + 1 : 0;
        loops++;
      }

      if (!tabs[searchIndex].disabled) {
        setFocusedTab(tabs[searchIndex].id);
      }
    };

    // Estilos de orientación
    const orientationStyles: Record<TabsOrientation, string> = {
      horizontal: 'flex-row border-b border-gray-200',
      vertical: 'flex-col border-b-0 border-r border-gray-200 h-full',
    };

    // Estilos de botón de pestaña
    const getTabButtonStyles = (tab: Tab) => {
      const isActive = activeTab === tab.id;
      const isFocused = focusedTab === tab.id;

      const baseStyles =
        'flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200' +
        ' focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset' +
        ' disabled:opacity-50 disabled:cursor-not-allowed';

      const orientationSpecific: Record<TabsOrientation, string> = {
        horizontal: 'border-b-2 -mb-px',
        vertical: 'border-l-2 -ml-px border-t-0 border-b-0 border-r-0 w-full text-left',
      };

      const activeStyles = orientation === 'horizontal'
        ? 'border-emerald-500 text-emerald-600'
        : 'border-emerald-500 text-emerald-600 bg-emerald-50';

      const inactiveStyles = orientation === 'horizontal'
        ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50';

      const focusStyles = isFocused ? 'focus:ring-2 focus:ring-emerald-500' : '';

      return `
        ${baseStyles}
        ${orientationSpecific[orientation]}
        ${isActive ? activeStyles : inactiveStyles}
        ${focusStyles}
      `.replace(/\s+/g, ' ').trim();
    };

    // Estilos del contenedor de paneles
    const panelStyles = orientation === 'vertical'
      ? 'flex-1 pl-4 mt-0'
      : 'mt-4';

    const combinedClasses = `
      ${orientationStyles[orientation]}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    const activeTabContent = tabs.find((t) => t.id === activeTab)?.content;

    return (
      <div ref={ref} className={`flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'}`}>
        {/* Lista de pestañas */}
        <div
          role="tablist"
          aria-orientation={orientation}
          className={combinedClasses}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              aria-disabled={tab.disabled || undefined}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              disabled={tab.disabled}
              className={getTabButtonStyles(tab)}
              onClick={() => handleTabChange(tab.id)}
              onFocus={() => setFocusedTab(tab.id)}
              onKeyDown={handleKeyDown}
            >
              {tab.icon && <span className="mr-2" aria-hidden="true">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel de contenido */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
          className={panelStyles}
        >
          {activeTabContent}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

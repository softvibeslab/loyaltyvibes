import React from 'react';

/**
 * Interfaz para un paso del Stepper
 */
export interface Step {
  /** Identificador único del paso */
  id: string;
  /** Etiqueta visible del paso */
  label: string;
  /** Descripción opcional del paso */
  description?: string;
  /** Icono opcional (emoji o string) */
  icon?: string;
  /** Si el paso está completado */
  completed?: boolean;
}

/**
 * Variante de orientación del Stepper
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Propiedades del componente Stepper
 */
export interface StepperProps {
  /** Array de pasos a mostrar */
  steps: Step[];
  /** Paso actual (1-indexed) */
  currentStep: number;
  /** Callback cuando se hace clic en un paso */
  onStepClick?: (stepId: string) => void;
  /** Orientación del stepper */
  orientation?: StepperOrientation;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Stepper para indicar progreso multi-paso
 * Implementa accesibilidad WCAG 2.1 AA con navegación por teclado
 */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      currentStep,
      onStepClick,
      orientation = 'horizontal',
      className = '',
    },
    ref
  ) => {
    // Validar currentStep
    const safeCurrentStep = Math.max(1, Math.min(currentStep, steps.length));

    // Determinar el estado de cada paso
    const getStepStatus = (index: number) => {
      const stepNumber = index + 1;
      if (stepNumber < safeCurrentStep || steps[index].completed) {
        return 'completed';
      } else if (stepNumber === safeCurrentStep) {
        return 'active';
      }
      return 'pending';
    };

    // Manejar clic en un paso
    const handleStepClick = (stepId: string, index: number) => {
      // Permitir clic solo en pasos completados o el paso actual
      const status = getStepStatus(index);
      if (status === 'completed' || status === 'active') {
        onStepClick?.(stepId);
      }
    };

    const combinedClasses = `
      ${orientation === 'horizontal' ? 'flex items-center justify-between' : 'flex flex-col space-y-4'}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    // Estilos del conector entre pasos
    const getConnectorStyles = (index: number) => {
      const status = getStepStatus(index);
      const baseStyles = orientation === 'horizontal'
        ? 'flex-1 h-1 mx-2'
        : 'absolute left-4 w-0.5 h-full';

      const completedStyles = 'bg-emerald-600';
      const pendingStyles = 'bg-gray-300';

      return `
        ${baseStyles}
        ${status === 'completed' ? completedStyles : pendingStyles}
      `.replace(/\s+/g, ' ').trim();
    };

    // Estilos del círculo del paso
    const getCircleStyles = (status: string) => {
      const baseStyles =
        'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-200' +
        ' focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2';

      const completedStyles = 'bg-emerald-600 text-white';
      const activeStyles = 'bg-emerald-600 text-white ring-4 ring-emerald-100';
      const pendingStyles = 'bg-gray-200 text-gray-600';

      return `
        ${baseStyles}
        ${status === 'completed' ? completedStyles : status === 'active' ? activeStyles : pendingStyles}
      `.replace(/\s+/g, ' ').trim();
    };

    // Estilos del texto del paso
    const getTextStyles = (status: string) => {
      const baseStyles = 'text-sm font-medium';
      const completedStyles = 'text-emerald-600';
      const activeStyles = 'text-gray-900';
      const pendingStyles = 'text-gray-500';

      return `
        ${baseStyles}
        ${status === 'completed' ? completedStyles : status === 'active' ? activeStyles : pendingStyles}
      `.replace(/\s+/g, ' ').trim();
    };

    return (
      <div ref={ref} className={combinedClasses} role="group" aria-label="Progress stepper">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = status === 'completed' || status === 'active';

          return (
            <React.Fragment key={step.id}>
              {/* Paso */}
              <div
                className={`
                  flex ${orientation === 'horizontal' ? 'flex-col items-center' : 'items-start relative'}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                `}
                role="button"
                tabIndex={isClickable ? 0 : -1}
                aria-current={status === 'active' ? 'step' : undefined}
                onClick={() => handleStepClick(step.id, index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleStepClick(step.id, index);
                  }
                }}
              >
                {/* Círculo del paso */}
                <div className={getCircleStyles(status)}>
                  {status === 'completed' ? (
                    <span aria-hidden="true">✓</span>
                  ) : step.icon ? (
                    <span aria-hidden="true">{step.icon}</span>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Etiqueta y descripción */}
                <div
                  className={`
                    ${orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-12 mt-1'}
                  `}
                >
                  <div className={getTextStyles(status)}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>

                {/* Conector (vertical) */}
                {orientation === 'vertical' && index < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-0.5 bg-gray-300 h-8 -z-10">
                    <div
                      className={getConnectorStyles(index)}
                      style={{ height: status === 'completed' ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>

              {/* Conector (horizontal) */}
              {orientation === 'horizontal' && index < steps.length - 1 && (
                <div className={getConnectorStyles(index)} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

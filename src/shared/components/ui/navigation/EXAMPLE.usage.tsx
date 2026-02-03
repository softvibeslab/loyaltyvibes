/**
 * Ejemplos de uso de componentes de Navegación
 * Navigation Components Usage Examples for LoyaltyVibes
 */

import React, { useState } from 'react';
import { Tabs } from './Tabs/Tabs';
import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import { Pagination } from './Pagination/Pagination';
import { Stepper } from './Stepper/Stepper';

/**
 * Ejemplo 1: Tabs con contenido de recompensas
 * Muestra diferentes categorías de recompensas del programa de lealtad
 */
export function RewardCategoriesTabs() {
  const rewardTabs = [
    {
      id: 'all',
      label: 'Todas',
      icon: '🎁',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Recompensa 1</div>
          <div className="p-4 border rounded">Recompensa 2</div>
          <div className="p-4 border rounded">Recompensa 3</div>
        </div>
      ),
    },
    {
      id: 'products',
      label: 'Productos',
      icon: '📦',
      content: <div className="p-4">Contenido de productos</div>,
    },
    {
      id: 'experiences',
      label: 'Experiencias',
      icon: '⭐',
      content: <div className="p-4">Contenido de experiencias</div>,
    },
    {
      id: 'discounts',
      label: 'Descuentos',
      icon: '💰',
      content: <div className="p-4">Contenido de descuentos</div>,
    },
  ];

  return <Tabs tabs={rewardTabs} defaultTab="all" />;
}

/**
 * Ejemplo 2: Breadcrumb de navegación de productos
 * Muestra la ruta de navegación actual del usuario
 */
export function ProductNavigationBreadcrumb() {
  const navigationItems = [
    { label: 'Inicio', href: '/', icon: '🏠' },
    { label: 'Recompensas', href: '/rewards', icon: '🎁' },
    { label: 'Productos', href: '/rewards/products' },
    { label: 'Electrónica', href: '/rewards/products/electronics' },
    { label: 'Auriculares Wireless' }, // Current page
  ];

  return <Breadcrumb items={navigationItems} />;
}

/**
 * Ejemplo 3: Paginación de lista de recompensas
 * Permite navegar a través de una lista grande de recompensas
 */
export function RewardsListPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const totalRewards = 156;
  const totalPages = Math.ceil(totalRewards / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Aquí se cargarían las recompensas para la página seleccionada
    console.log(`Cargando página ${page}`);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    console.log(`Cambiando tamaño de página a ${size}`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded">
        Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRewards)} de {totalRewards} recompensas
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        showPageSizeSelector={true}
      />
    </div>
  );
}

/**
 * Ejemplo 4: Stepper de proceso de canje
 * Guía al usuario a través del proceso de canjear puntos
 */
export function RedemptionProcessStepper() {
  const [currentStep, setCurrentStep] = useState(1);

  const redemptionSteps = [
    {
      id: 'select',
      label: 'Seleccionar Recompensa',
      description: 'Elige la recompensa que deseas canjear',
      icon: '🎁',
    },
    {
      id: 'confirm',
      label: 'Confirmar Datos',
      description: 'Verifica tu información de envío',
      icon: '✓',
    },
    {
      id: 'redeem',
      label: 'Canjear Puntos',
      description: 'Confirma el canje de tus puntos',
      icon: '💰',
    },
    {
      id: 'complete',
      label: 'Canje Completado',
      description: '¡Tu recompensa está en camino!',
      icon: '🎉',
    },
  ];

  const handleStepClick = (stepId: string) => {
    const stepIndex = redemptionSteps.findIndex((s) => s.id === stepId);
    // Permitir navegar solo a pasos anteriores o al actual
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      <Stepper
        steps={redemptionSteps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      <div className="p-4 bg-gray-50 rounded">
        Paso actual: {redemptionSteps[currentStep - 1].label}
      </div>
    </div>
  );
}

/**
 * Ejemplo 5: Tabs vertical con configuración de cuenta
 * Muestra un menú lateral de configuración con pestañas verticales
 */
export function AccountSettingsTabs() {
  const settingsTabs = [
    {
      id: 'profile',
      label: 'Perfil',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Información del Perfil</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input type="text" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Seguridad',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Configuración de Seguridad</h3>
          <div>
            <label className="block text-sm font-medium">Contraseña Actual</label>
            <input type="password" className="w-full border rounded px-3 py-2" />
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Preferencias de Notificación</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Email de promociones
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Notificaciones push
            </label>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex gap-6">
      <div className="w-64">
        <Tabs tabs={settingsTabs} defaultTab="profile" orientation="vertical" />
      </div>
    </div>
  );
}

/**
 * Ejemplo 6: Breadcrumb personalizado con separador diferente
 */
export function CustomBreadcrumb() {
  const items = [
    { label: 'Panel', href: '/dashboard', icon: '📊' },
    { label: 'Reportes', href: '/dashboard/reports' },
    { label: 'Reporte Mensual', href: '/dashboard/reports/monthly' },
    { label: 'Febrero 2024' },
  ];

  return <Breadcrumb items={items} separator=">" />;
}

/**
 * Ejemplo 7: Combinación de Breadcrumb y Tabs
 * Navegación completa con breadcrumb y pestañas
 */
export function CombinedNavigationExample() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb de navegación */}
      <ProductNavigationBreadcrumb />

      {/* Tabs de contenido */}
      <RewardCategoriesTabs />
    </div>
  );
}

/**
 * Ejemplo 8: Stepper con pasos completados
 * Progreso de compra con algunos pasos ya completados
 */
export function CheckoutProgressStepper() {
  const checkoutSteps = [
    {
      id: 'cart',
      label: 'Carrito',
      description: 'Revisa tus productos',
      completed: true,
    },
    {
      id: 'shipping',
      label: 'Envío',
      description: 'Datos de envío',
      completed: true,
    },
    {
      id: 'payment',
      label: 'Pago',
      description: 'Método de pago',
      completed: false,
    },
    {
      id: 'confirmation',
      label: 'Confirmación',
      description: 'Revisa tu pedido',
      completed: false,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Progreso de Compra</h2>
      <Stepper steps={checkoutSteps} currentStep={3} />
    </div>
  );
}

/**
 * Ejemplo 9: Paginación con estado de carga
 * Simula carga de datos durante cambio de página
 */
export function PaginationWithLoadingState() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPages = 10;

  const handlePageChange = async (page: number) => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setCurrentPage(page);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded">
          Cargando página {currentPage}...
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

/**
 * Ejemplo 10: Tabs con pestañas deshabilitadas
 * Muestra pestañas que no están disponibles para el usuario
 */
export function TabsWithDisabledItems() {
  const tabs = [
    {
      id: 'overview',
      label: 'Resumen',
      content: <div className="p-4">Vista general de tu cuenta</div>,
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      content: <div className="p-4">Historial de transacciones</div>,
    },
    {
      id: 'premium',
      label: 'Premium',
      content: <div className="p-4">Beneficios premium</div>,
      disabled: true, // Requiere suscripción premium
    },
  ];

  return (
    <Tabs
      tabs={tabs}
      defaultTab="overview"
      onChange={(tabId) => console.log('Cambiado a:', tabId)}
    />
  );
}

/**
 * Página de ejemplo completa que muestra todos los componentes
 * de navegación trabajando juntos
 */
export function NavigationComponentsShowcase() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Ejemplos de Navegación</h1>

      {/* Breadcrumb */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Breadcrumb</h2>
        <ProductNavigationBreadcrumb />
      </section>

      {/* Tabs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs Horizontales</h2>
        <RewardCategoriesTabs />
      </section>

      {/* Tabs Verticales */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabs Verticales</h2>
        <AccountSettingsTabs />
      </section>

      {/* Stepper */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Stepper de Proceso</h2>
        <RedemptionProcessStepper />
      </section>

      {/* Paginación */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Paginación</h2>
        <RewardsListPagination />
      </section>
    </div>
  );
}

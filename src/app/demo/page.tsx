'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Alert } from '@/shared/components/ui/Alert';
import { TextField } from '@/shared/components/ui/forms/TextField';
import { TextArea } from '@/shared/components/ui/forms/TextArea';
import { Select } from '@/shared/components/ui/forms/Select';
import { Checkbox } from '@/shared/components/ui/forms/Checkbox';
import { RadioGroup } from '@/shared/components/ui/forms/RadioGroup';
import { FormField } from '@/shared/components/ui/forms/FormField';
import { useToast, ToastContainer } from '@/shared/components/ui/overlays/Toast/useToast';
import { Modal } from '@/shared/components/ui/overlays/Modal';
import { ConfirmDialog } from '@/shared/components/ui/overlays/ConfirmDialog';
import { Tooltip } from '@/shared/components/ui/overlays/Tooltip';
import { Tabs } from '@/shared/components/ui/navigation/Tabs';
import { Breadcrumb } from '@/shared/components/ui/navigation/Breadcrumb';
import { Pagination } from '@/shared/components/ui/navigation/Pagination';
import { Stepper } from '@/shared/components/ui/navigation/Stepper';
import { Card } from '@/shared/components/ui/data-display/Card';
import { Table } from '@/shared/components/ui/data-display/Table';
import { Badge } from '@/shared/components/ui/data-display/Badge';
import { Avatar } from '@/shared/components/ui/data-display/Avatar';
import { StatCard } from '@/shared/components/ui/data-display/StatCard';
import { Divider } from '@/shared/components/ui/data-display/Divider';

export default function DemoPage() {
  const { toasts, showSuccess, showError, showWarning, showInfo, closeToast } = useToast();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    country: '',
    terms: false,
    newsletter: 'no',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);
    showInfo('Botón presionado', 'Procesando tu solicitud...');
    setTimeout(() => {
      setIsLoading(false);
      showSuccess('¡Éxito!', 'La operación se completó correctamente.');
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showError('Error de validación', 'Por favor completa los campos requeridos.');
      return;
    }
    showSuccess('Formulario enviado', 'Tus datos han sido recibidos correctamente.');
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    showSuccess('Confirmado', 'La acción se ha completado exitosamente.');
  };

  // Demo data for Table
  const tableColumns = [
    { id: 'name', label: 'Nombre', key: 'name' as const, sortable: true },
    { id: 'email', label: 'Email', key: 'email' as const },
    { id: 'role', label: 'Rol', key: 'role' as const },
    { id: 'status', label: 'Estado', key: 'status' as const, sortable: true },
  ];

  const tableData = [
    { name: 'María García', email: 'maria@email.com', role: 'Admin', status: 'Activo' },
    { name: 'Juan López', email: 'juan@email.com', role: 'Usuario', status: 'Activo' },
    { name: 'Ana Martínez', email: 'ana@email.com', role: 'Usuario', status: 'Inactivo' },
    { name: 'Carlos Ruiz', email: 'carlos@email.com', role: 'Editor', status: 'Activo' },
  ];

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Componentes', href: '/components' },
    { label: 'Demo', href: '/demo' },
  ];

  // Stepper steps
  const stepperSteps = [
    { id: '1', label: 'Registro' },
    { id: '2', label: 'Verificación' },
    { id: '3', label: 'Configuración' },
    { id: '4', label: 'Finalizar' },
  ].map((s) => ({ ...s, completed: false }));

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onClose={closeToast} position="bottom-right" />

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">LoyaltyVibes UI</h1>
          <p className="text-xl opacity-90">
            Biblioteca de componentes completa para tu aplicación de lealtad
          </p>
          <p className="text-sm mt-4 opacity-75">
            25 Componentes • Diseño Moderno • Accesibilidad WCAG 2.1 AA
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="lg:sticky lg:top-4 bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Secciones</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#base" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Componentes Base
                  </a>
                </li>
                <li>
                  <a href="#forms" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Formularios
                  </a>
                </li>
                <li>
                  <a href="#overlays" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Overlays
                  </a>
                </li>
                <li>
                  <a href="#navigation" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Navegación
                  </a>
                </li>
                <li>
                  <a href="#data-display" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Presentación de Datos
                  </a>
                </li>
                <li>
                  <a href="#examples" className="text-emerald-600 hover:text-emerald-700 block py-1">
                    Ejemplos Reales
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-12">
            {/* Base Components Section */}
            <section id="base" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Componentes Base</h2>
                <p className="text-gray-600 mb-8">Los componentes fundamentales de la biblioteca</p>

                {/* Buttons */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Button</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Variantes:</p>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="primary">Primario</Button>
                        <Button variant="secondary">Secundario</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Tamaños:</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button size="sm">Pequeño</Button>
                        <Button size="md">Mediano</Button>
                        <Button size="lg">Grande</Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Estados:</p>
                      <div className="flex flex-wrap gap-3">
                        <Button disabled>Deshabilitado</Button>
                        <Button loading loadingText="Cargando...">
                          Con Loading
                        </Button>
                        <Button fullWidth>Ancho Completo</Button>
                      </div>
                    </div>
                    <div>
                      <Button onClick={handleButtonClick} loading={isLoading}>
                        Probar Interacción
                      </Button>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Spinner */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Spinner</h3>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Pequeño (sm):</p>
                      <Spinner size="sm" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Mediano (md):</p>
                      <Spinner size="md" />
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Skeleton */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Skeleton</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Texto:</p>
                      <div className="space-y-2 max-w-md">
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Avatar:</p>
                        <Skeleton variant="avatar" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Tarjeta:</p>
                        <Skeleton variant="card" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Personalizado:</p>
                      <Skeleton variant="custom" width="200px" height="100px" />
                    </div>
                  </div>
                </div>

                <Divider />

                {/* EmptyState */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">EmptyState</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <EmptyState
                      title="No hay datos"
                      description="Comienza agregando tu primer elemento"
                      icon="📋"
                    />
                    <EmptyState
                      title="Búsqueda sin resultados"
                      description="Intenta con otros términos de búsqueda"
                      icon="🔍"
                    />
                  </div>
                </div>

                <Divider />

                {/* Alert */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert</h3>
                  <div className="space-y-4">
                    <Alert
                      variant="success"
                      title="¡Éxito!"
                      description="Tu operación se completó correctamente."
                    />
                    <Alert
                      variant="warning"
                      title="Advertencia"
                      description="Revisa la información antes de continuar."
                    />
                    <Alert
                      variant="error"
                      title="Error"
                      description="Algo salió mal. Inténtalo de nuevo."
                    />
                    <Alert
                      variant="info"
                      description="Información adicional sobre el proceso."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Forms Section */}
            <section id="forms" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Formularios</h2>
                <p className="text-gray-600 mb-8">Componentes para entrada de datos</p>

                {/* Complete Form Example */}
                <Card className="mb-8">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <TextField
                      label="Nombre"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      required
                      fullWidth
                    />

                    <TextField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      helperText="Te enviaremos confirmación a este correo"
                      required
                      fullWidth
                    />

                    <TextArea
                      label="Mensaje"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Escribe tu mensaje aquí..."
                      rows={4}
                      maxLength={500}
                      showCount
                      fullWidth
                    />

                    <Select
                      label="País"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      options={[
                        { value: '', label: 'Selecciona un país' },
                        { value: 'mx', label: 'México' },
                        { value: 'es', label: 'España' },
                        { value: 'ar', label: 'Argentina' },
                        { value: 'co', label: 'Colombia' },
                      ]}
                      fullWidth
                    />

                    <FormField label="Preferencias" required>
                      <RadioGroup
                        name="newsletter"
                        value={formData.newsletter}
                        onChange={(value) => setFormData({ ...formData, newsletter: value })}
                        options={[
                          { value: 'yes', label: 'Sí, deseo recibir noticias' },
                          { value: 'no', label: 'No, gracias' },
                        ]}
                      />
                    </FormField>

                    <Checkbox
                      label="Acepto los términos y condiciones"
                      checked={formData.terms}
                      onChange={(checked) => setFormData({ ...formData, terms: checked })}
                      required
                    />

                    <div className="flex gap-3">
                      <Button type="submit" loading={isLoading}>
                        Enviar Formulario
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData({ name: '', email: '', message: '', country: '', terms: false, newsletter: 'no' })}
                      >
                        Limpiar
                      </Button>
                    </div>
                  </form>
                </Card>

                <Divider />

                {/* FormField Examples */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">FormField Wrapper</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Con Error"
                      error="Este campo es obligatorio"
                      required
                    >
                      <TextField placeholder="Campo inválido" fullWidth />
                    </FormField>

                    <FormField
                      label="Con Ayuda"
                      helperText="Este es un texto de ayuda para el usuario"
                    >
                      <TextField placeholder="Campo con ayuda" fullWidth />
                    </FormField>
                  </div>
                </div>
              </div>
            </section>

            {/* Overlays Section */}
            <section id="overlays" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Overlays</h2>
                <p className="text-gray-600 mb-8">Componentes superpuestos y modales</p>

                {/* Toast Examples */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Toast Notifications</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={() => showSuccess('¡Éxito!', 'Operación completada')}
                    >
                      Toast de Éxito
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => showError('Error', 'Algo salió mal')}
                    >
                      Toast de Error
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => showWarning('Advertencia', 'Revisa los datos')}
                    >
                      Toast de Advertencia
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => showInfo('Info', 'Mensaje informativo')}
                    >
                      Toast de Info
                    </Button>
                  </div>
                </div>

                <Divider />

                {/* Modal Example */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Modal</h3>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Abrir Modal
                  </Button>

                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Ejemplo de Modal"
                    size="lg"
                  >
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Este es un modal con focus trap y accesibilidad. Intenta navegar con Tab.
                      </p>
                      <TextField
                        label="Campo en modal"
                        placeholder="El foco se atrapa aquí"
                        fullWidth
                      />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setIsModalOpen(false)}>
                          Confirmar
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>

                <Divider />

                {/* ConfirmDialog Example */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">ConfirmDialog</h3>
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    Abrir Confirmación
                  </Button>

                  <ConfirmDialog
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleConfirm}
                    title="¿Estás seguro?"
                    message="Esta acción no se puede deshacer. ¿Deseas continuar?"
                    confirmText="Sí, confirmar"
                    cancelText="Cancelar"
                    variant="error"
                  />
                </div>

                <Divider />

                {/* Tooltip Examples */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tooltip</h3>
                  <div className="flex flex-wrap gap-4">
                    <Tooltip content="Tooltip superior" placement="top">
                      <Button>Hover Arriba</Button>
                    </Tooltip>

                    <Tooltip content="Tooltip inferior" placement="bottom">
                      <Button variant="secondary">Hover Abajo</Button>
                    </Tooltip>

                    <Tooltip content="Tooltip izquierdo" placement="left">
                      <Button variant="outline">Hover Izquierda</Button>
                    </Tooltip>

                    <Tooltip content="Tooltip derecho" placement="right">
                      <Button variant="ghost">Hover Derecha</Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation Section */}
            <section id="navigation" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Navegación</h2>
                <p className="text-gray-600 mb-8">Componentes de navegación y progreso</p>

                {/* Tabs */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tabs</h3>
                  <Tabs
                    tabs={[
                      {
                        id: 'tab1',
                        label: 'Inicio',
                        icon: '🏠',
                        content: (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Contenido de Inicio</h4>
                            <p className="text-gray-600">Bienvenido a la pestaña de inicio.</p>
                          </div>
                        ),
                      },
                      {
                        id: 'tab2',
                        label: 'Perfil',
                        icon: '👤',
                        content: (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Contenido de Perfil</h4>
                            <p className="text-gray-600">Gestiona tu información personal.</p>
                          </div>
                        ),
                      },
                      {
                        id: 'tab3',
                        label: 'Configuración',
                        icon: '⚙️',
                        content: (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Contenido de Configuración</h4>
                            <p className="text-gray-600">Ajusta tus preferencias.</p>
                          </div>
                        ),
                      },
                    ]}
                    defaultTab="tab1"
                  />
                </div>

                <Divider />

                {/* Breadcrumb */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Breadcrumb</h3>
                  <Breadcrumb items={breadcrumbItems} />
                </div>

                <Divider />

                {/* Pagination */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Pagination</h3>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Página actual: {currentPage} de {totalPages}
                  </p>
                </div>

                <Divider />

                {/* Stepper */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Stepper</h3>
                  <Stepper
                    steps={stepperSteps.map((s, i) => ({ ...s, completed: i + 1 < currentStep }))}
                    currentStep={currentStep}
                  />
                  <div className="mt-4 flex gap-3">
                    <Button
                      size="sm"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                      disabled={currentStep === 4}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Display Section */}
            <section id="data-display" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Presentación de Datos</h2>
                <p className="text-gray-600 mb-8">Componentes para mostrar información</p>

                {/* Cards */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Card</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card
                      variant="elevated"
                      title="Tarjeta Elevada"
                      description="Con sombra y efecto hover"
                      footer={<Button size="sm">Acción</Button>}
                    >
                      <p className="text-gray-600">Contenido de la tarjeta elevada.</p>
                    </Card>

                    <Card
                      variant="outlined"
                      title="Tarjeta Outline"
                      description="Con borde visible"
                    >
                      <p className="text-gray-600">Contenido de la tarjeta con borde.</p>
                    </Card>

                    <Card
                      variant="flat"
                      title="Tarjeta Flat"
                      description="Estilo plano y simple"
                    >
                      <p className="text-gray-600">Contenido de la tarjeta plana.</p>
                    </Card>
                  </div>
                </div>

                <Divider />

                {/* StatCard */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">StatCard</h3>
                  <div className="grid md:grid-cols-4 gap-6">
                    <StatCard
                      title="Usuarios Activos"
                      value="2,543"
                      change="+12.5%"
                      trend="up"
                      icon="👥"
                    />
                    <StatCard
                      title="Ingresos"
                      value="$45,231"
                      change="+8.2%"
                      trend="up"
                      icon="💰"
                    />
                    <StatCard
                      title="Conversiones"
                      value="3.2%"
                      change="-2.1%"
                      trend="down"
                      icon="📈"
                    />
                    <StatCard
                      title="Tasa de Rebote"
                      value="42.3%"
                      change="+0.5%"
                      trend="neutral"
                      icon="📊"
                    />
                  </div>
                </div>

                <Divider />

                {/* Table */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Table</h3>
                  <Table
                    columns={tableColumns}
                    data={tableData}
                    sortable
                    zebraStripes
                  />
                </div>

                <Divider />

                {/* Badges */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Badge</h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="success">Éxito</Badge>
                    <Badge variant="warning">Advertencia</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-gray-700">María García</span>
                    <Badge variant="success" size="sm">Activo</Badge>
                  </div>
                </div>

                <Divider />

                {/* Avatars */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Avatar</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="sm" alt="María García" fallback="MG" />
                      <span className="text-xs text-gray-600">Pequeño</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="md" alt="Juan López" fallback="JL" />
                      <span className="text-xs text-gray-600">Mediano</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="lg" alt="Ana Martínez" fallback="AM" />
                      <span className="text-xs text-gray-600">Grande</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="md" alt="Carlos Ruiz" src="https://i.pravatar.cc/150?img=12" fallback="CR" />
                      <span className="text-xs text-gray-600">Con imagen</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Avatar size="md" fallback="+5" alt="Más usuarios" />
                      <span className="text-xs text-gray-600">Fallback</span>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Divider */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Divider</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-2">Horizontal (por defecto):</p>
                      <Divider />
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">Con etiqueta:</p>
                      <Divider label="O divide contenido" />
                    </div>
                    <div>
                      <p className="text-gray-600 mb-2">Vertical:</p>
                      <div className="flex items-center gap-4 h-20">
                        <span className="text-gray-700">Sección 1</span>
                        <Divider orientation="vertical" className="h-12" />
                        <span className="text-gray-700">Sección 2</span>
                        <Divider orientation="vertical" className="h-12" />
                        <span className="text-gray-700">Sección 3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Real-world Examples */}
            <section id="examples" className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Ejemplos Reales</h2>
                <p className="text-gray-600 mb-8">Patrones de UI simulados de LoyaltyVibes</p>

                {/* User Profile Card */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Perfil de Usuario</h3>
                  <Card>
                    <div className="flex items-start gap-6">
                      <Avatar size="lg" alt="María García" src="https://i.pravatar.cc/150?img=47" fallback="MG" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">María García</h4>
                          <Badge variant="success" size="sm">Miembro Oro</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">maria.garcia@email.com</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-2xl font-bold text-emerald-600">1,250</p>
                            <p className="text-sm text-gray-600">Puntos</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">12</p>
                            <p className="text-sm text-gray-600">Visitas</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-amber-600">3</p>
                            <p className="text-sm text-gray-600">Recompensas</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <Divider />

                {/* Rewards List */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Recompensas</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Café Gratis', points: 100, available: true },
                      { name: '2x1 en Postre', points: 250, available: true },
                      { name: 'Plato Especial', points: 500, available: false },
                    ].map((reward, index) => (
                      <Card key={index} variant="outlined" className={!reward.available ? 'opacity-60' : ''}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">🎁</div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                              <p className="text-sm text-gray-600">{reward.points} puntos requeridos</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {!reward.available && <Badge variant="warning">Agotado</Badge>}
                            <Button
                              size="sm"
                              disabled={!reward.available}
                              onClick={() => reward.available && showSuccess('¡Canjeado!', 'Tu recompensa ha sido canjeada')}
                            >
                              Canjear
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Transaction History */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Historial de Transacciones</h3>
                  <Card>
                    <Table
                      columns={[
                        { id: 'date', label: 'Fecha', key: 'date' as const },
                        { id: 'description', label: 'Descripción', key: 'description' as const },
                        { id: 'points', label: 'Puntos', key: 'points' as const },
                        { id: 'type', label: 'Tipo', key: 'type' as const },
                      ]}
                      data={[
                        { date: '2024-01-15', description: 'Visita a Restaurante', points: '+50', type: 'Ganado' },
                        { date: '2024-01-10', description: 'Canje: Café Gratis', points: '-100', type: 'Canjeado' },
                        { date: '2024-01-08', description: 'Visita a Restaurante', points: '+50', type: 'Ganado' },
                        { date: '2024-01-05', description: 'Bono de Bienvenida', points: '+100', type: 'Ganado' },
                      ]}
                      zebraStripes
                    />
                  </Card>
                </div>
              </div>
            </section>

            {/* Code Examples Section */}
            <section className="scroll-mt-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Ejemplos de Código</h2>
                <p className="text-gray-600 mb-8">Importa y usa los componentes fácilmente</p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Importar Componentes</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
{`import { Button } from '@/shared/components/ui/Button';
import { TextField } from '@/shared/components/ui/forms/TextField';
import { useToast } from '@/shared/components/ui/overlays/Toast/useToast';
import { Modal } from '@/shared/components/ui/overlays/Modal';
import { Table } from '@/shared/components/ui/data-display/Table';`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Botón con Toast</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
{`function MyComponent() {
  const { showSuccess } = useToast();

  return (
    <Button onClick={() => showSuccess('¡Éxito!', 'Operación completada')}>
      Click Me
    </Button>
  );
}`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Tabla con Datos</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
{`const columns = [
  { id: 'name', label: 'Nombre', key: 'name' as const, sortable: true },
  { id: 'email', label: 'Email', key: 'email' as const },
];

const data = [
  { name: 'María', email: 'maria@email.com' },
  { name: 'Juan', email: 'juan@email.com' },
];

<Table columns={columns} data={data} sortable />`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Modal con Formulario</h3>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
{`const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Nuevo Usuario"
>
  <form onSubmit={handleSubmit}>
    <TextField label="Nombre" fullWidth />
    <Button type="submit">Guardar</Button>
  </form>
</Modal>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">LoyaltyVibes UI</h3>
            <p className="text-gray-400 mb-4">
              Biblioteca de componentes accesibles y modernos
            </p>
            <p className="text-sm text-gray-500">
              25 Componentes • TailwindCSS • React • TypeScript • WCAG 2.1 AA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

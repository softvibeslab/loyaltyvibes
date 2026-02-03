/**
 * Ejemplos de uso de componentes de Visualización de Datos
 * Data Display Components Usage Examples for LoyaltyVibes
 */

import React, { useState } from 'react';
import { Card } from './Card/Card';
import { Table } from './Table/Table';
import { Badge } from './Badge/Badge';
import { Avatar } from './Avatar/Avatar';
import { StatCard } from './StatCard/StatCard';
import { Divider } from './Divider/Divider';

// Datos de ejemplo
interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  tier: string;
  status: 'active' | 'inactive' | 'pending';
}

const mockUsers: User[] = [
  { id: 1, name: 'María García', email: 'maria@example.com', points: 2500, tier: 'Gold', status: 'active' },
  { id: 2, name: 'Juan Pérez', email: 'juan@example.com', points: 1800, tier: 'Silver', status: 'active' },
  { id: 3, name: 'Ana López', email: 'ana@example.com', points: 500, tier: 'Bronze', status: 'pending' },
  { id: 4, name: 'Carlos Ruiz', email: 'carlos@example.com', points: 3200, tier: 'Platinum', status: 'active' },
  { id: 5, name: 'Laura Martínez', email: 'laura@example.com', points: 1200, tier: 'Silver', status: 'inactive' },
];

/**
 * Ejemplo 1: Card con diferentes variantes
 * Muestra las variantes elevated, outlined y flat
 */
export function CardVariantsExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        title="Card Elevated"
        description="Variante con sombra"
        variant="elevated"
      >
        <p>Contenido de la tarjeta con efecto de elevación.</p>
      </Card>

      <Card
        title="Card Outlined"
        description="Variante con borde"
        variant="outlined"
      >
        <p>Contenido de la tarjeta con borde resaltado.</p>
      </Card>

      <Card
        title="Card Flat"
        description="Variante plana"
        variant="flat"
      >
        <p>Contenido de la tarjeta con diseño plano.</p>
      </Card>
    </div>
  );
}

/**
 * Ejemplo 2: Card con footer personalizado
 */
export function CardWithFooterExample() {
  return (
    <Card
      title="Resumen de Puntos"
      description="Tus puntos actuales y progreso"
      footer={
        <div className="flex justify-between">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
            Ver Historial
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
            Canjear Puntos
          </button>
        </div>
      }
    >
      <div className="text-center py-4">
        <p className="text-4xl font-bold text-emerald-600">2,500</p>
        <p className="text-gray-600">Puntos disponibles</p>
      </div>
    </Card>
  );
}

/**
 * Ejemplo 3: Tabla de usuarios con ordenamiento
 */
export function UsersTableExample() {
  const [sortedData, setSortedData] = useState(mockUsers);

  const columns = [
    { id: 'id', label: 'ID', key: 'id' as keyof User, sortable: true },
    { id: 'name', label: 'Nombre', key: 'name' as keyof User, sortable: true },
    { id: 'email', label: 'Email', key: 'email' as keyof User },
    {
      id: 'points',
      label: 'Puntos',
      key: 'points' as keyof User,
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold text-emerald-600">{value as string}</span>
      ),
    },
    {
      id: 'tier',
      label: 'Nivel',
      key: 'tier' as keyof User,
      render: (value: unknown) => {
        const tier = value as string;
        const variant = tier === 'Platinum' ? 'neutral' :
                        tier === 'Gold' ? 'warning' :
                        tier === 'Silver' ? 'info' : 'success';
        return <Badge variant={variant}>{tier}</Badge>;
      },
    },
    {
      id: 'status',
      label: 'Estado',
      key: 'status' as keyof User,
      render: (value: unknown) => {
        const status = value as string;
        const variant = status === 'active' ? 'success' :
                        status === 'inactive' ? 'error' : 'warning';
        return <Badge variant={variant} size="sm">{status}</Badge>;
      },
    },
  ];

  const handleSort = (columnId: string, order: 'asc' | 'desc' | null) => {
    console.log(`Ordenando por ${columnId} en orden ${order}`);
  };

  return (
    <Table
      columns={columns}
      data={sortedData}
      sortable={true}
      onSort={handleSort}
      emptyMessage="No hay usuarios registrados"
    />
  );
}

/**
 * Ejemplo 4: Badges con diferentes variantes y tamaños
 */
export function BadgeVariantsExample() {
  return (
    <div className="space-y-6">
      {/* Variantes */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </div>

      {/* Tamaños */}
      <div className="flex items-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>

      {/* Con indicador de punto */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" showDot>Activo</Badge>
        <Badge variant="warning" showDot>Pendiente</Badge>
        <Badge variant="error" showDot>Error</Badge>
      </div>

      {/* Ejemplos de uso real */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="info">Nueva función</Badge>
        <Badge variant="success" showDot>En línea</Badge>
        <Badge variant="warning">3 pendientes</Badge>
        <Badge variant="error">1 error</Badge>
      </div>
    </div>
  );
}

/**
 * Ejemplo 5: Avatares con diferentes tamaños y estados
 */
export function AvatarExamples() {
  return (
    <div className="space-y-6">
      {/* Diferentes tamaños */}
      <div className="flex items-center gap-4">
        <Avatar size="sm" src="/avatar1.png" alt="Small avatar" fallback="JD" />
        <Avatar size="md" src="/avatar2.png" alt="Medium avatar" fallback="AB" />
        <Avatar size="lg" src="/avatar3.png" alt="Large avatar" fallback="XY" />
        <Avatar size="xl" src="/avatar4.png" alt="Extra large avatar" fallback="Z" />
      </div>

      {/* Solo fallback (sin imagen) */}
      <div className="flex items-center gap-4">
        <Avatar fallback="María García" />
        <Avatar fallback="Juan Pérez" />
        <Avatar fallback="Ana López" />
        <Avatar fallback="Carlos Ruiz" />
      </div>

      {/* Con imágenes fallidas (muestra fallback) */}
      <div className="flex items-center gap-4">
        <Avatar src="/invalid1.png" fallback="MG" alt="María" />
        <Avatar src="/invalid2.png" fallback="JP" alt="Juan" />
      </div>

      {/* Iniciales generados */}
      <div className="flex items-center gap-4">
        <Avatar fallback="JD" />
        <Avatar fallback="AB" />
        <Avatar fallback="XYZ" />
      </div>
    </div>
  );
}

/**
 * Ejemplo 6: StatCards para dashboard
 */
export function DashboardStatsExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Usuarios Totales"
        value="12,456"
        change={12.5}
        trend="up"
        icon="👥"
      />
      <StatCard
        title="Puntos Canjeados"
        value="45,678"
        change={-3.2}
        trend="down"
        icon="💰"
      />
      <StatCard
        title="Recompensas Activas"
        value="234"
        change={8.1}
        trend="up"
        icon="🎁"
      />
      <StatCard
        title="Tasa de Retención"
        value="78.5%"
        change={0}
        trend="neutral"
        icon="📊"
      />
    </div>
  );
}

/**
 * Ejemplo 7: StatCards en estado de carga
 */
export function LoadingStatsExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Cargando..." value="---" loading={true} />
      <StatCard title="Cargando..." value="---" loading={true} />
      <StatCard title="Cargando..." value="---" loading={true} />
    </div>
  );
}

/**
 * Ejemplo 8: Dividers horizontales y verticales
 */
export function DividerExamples() {
  return (
    <div className="space-y-6">
      {/* Divider horizontal simple */}
      <div>
        <p>Contenido antes del divider</p>
        <Divider />
        <p>Contenido después del divider</p>
      </div>

      {/* Divider horizontal con etiqueta */}
      <div>
        <p>Sección 1</p>
        <Divider label="O sección" />
        <p>Sección 2</p>
      </div>

      {/* Divisor con grosor personalizado */}
      <div>
        <p>Grosor normal</p>
        <Divider thickness={1} />
        <p>Grosor doble</p>
        <Divider thickness={2} />
        <p>Grosor triple</p>
        <Divider thickness={3} />
      </div>

      {/* Divider vertical */}
      <div className="flex items-center gap-4 h-32">
        <div className="flex-1 bg-gray-100 p-4">Columna 1</div>
        <Divider orientation="vertical" />
        <div className="flex-1 bg-gray-100 p-4">Columna 2</div>
      </div>
    </div>
  );
}

/**
 * Ejemplo 9: Tabla integrada con paginación
 * Muestra cómo combinar Table con Pagination
 */
export function TableWithPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const totalPages = Math.ceil(mockUsers.length / pageSize);

  // Obtener datos para la página actual
  const paginatedData = mockUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    { id: 'name', label: 'Nombre', key: 'name' as keyof User },
    { id: 'email', label: 'Email', key: 'email' as keyof User },
    {
      id: 'points',
      label: 'Puntos',
      key: 'points' as keyof User,
      render: (value: unknown) => <strong>{value as string}</strong>,
    },
  ];

  return (
    <div className="space-y-4">
      <Table
        columns={columns}
        data={paginatedData}
        sortable={true}
      />
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

/**
 * Ejemplo 10: Lista de usuarios con avatares y badges
 * Combinación de Avatar, Badge y Divider
 */
export function UserListWithBadgesExample() {
  return (
    <div className="space-y-4">
      {mockUsers.map((user, index) => (
        <div key={user.id}>
          <div className="flex items-center gap-4">
            <Avatar
              fallback={user.name}
              size="lg"
              alt={user.name}
            />
            <div className="flex-1">
              <h4 className="font-semibold">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Badge
              variant={user.status === 'active' ? 'success' : 'error'}
              showDot
            >
              {user.status}
            </Badge>
            <Badge variant="info">{user.tier}</Badge>
          </div>
          {index < mockUsers.length - 1 && <Divider />}
        </div>
      ))}
    </div>
  );
}

/**
 * Ejemplo 11: Dashboard completo
 * Combinación de StatCard, Table, y otros componentes
 */
export function CompleteDashboardExample() {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard de Lealtad</h1>
        <p className="text-gray-600">Vista general del programa de fidelización</p>
      </div>

      <Divider label="Estadísticas" />

      {/* Stats */}
      {loading ? (
        <LoadingStatsExample />
      ) : (
        <DashboardStatsExample />
      )}

      <Divider label="Usuarios Recientes" />

      {/* Tabla */}
      <UsersTableExample />

      {/* Botón para simular carga */}
      <div className="flex justify-center">
        <button
          onClick={simulateLoading}
          className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Simular Carga
        </button>
      </div>
    </div>
  );
}

/**
 * Ejemplo 12: Grid de Cards con diferentes contenidos
 */
export function CardGridExample() {
  const rewards = [
    { title: 'Descuento 10%', description: 'En tu próxima compra', points: 500 },
    { title: 'Envío Gratis', description: 'Sin costo de envío', points: 300 },
    { title: 'Producto Premium', description: 'Producto exclusivo', points: 1000 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rewards.map((reward) => (
        <Card
          key={reward.title}
          title={reward.title}
          description={reward.description}
          variant="elevated"
          footer={
            <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
              Canjear {reward.points} pts
            </button>
          }
        >
          <div className="text-center py-4">
            <span className="text-2xl">{reward.points} pts</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

/**
 * Página de ejemplo completa que muestra todos los componentes
 * de visualización de datos
 */
export function DataDisplayShowcase() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Ejemplos de Visualización de Datos</h1>

      {/* Stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">StatCards</h2>
        <DashboardStatsExample />
      </section>

      <Divider />

      {/* Badges */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <BadgeVariantsExample />
      </section>

      <Divider />

      {/* Avatares */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Avatares</h2>
        <AvatarExamples />
      </section>

      <Divider />

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>
        <CardVariantsExample />
      </section>

      <Divider />

      {/* Tabla */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Tabla de Datos</h2>
        <UsersTableExample />
      </section>

      <Divider />

      {/* Dividers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dividers</h2>
        <DividerExamples />
      </section>

      <Divider />

      {/* Lista de usuarios */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Lista de Usuarios</h2>
        <UserListWithBadgesExample />
      </section>

      <Divider />

      {/* Dashboard completo */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Completo</h2>
        <CompleteDashboardExample />
      </section>
    </div>
  );
}

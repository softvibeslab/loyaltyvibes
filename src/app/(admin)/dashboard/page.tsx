'use client';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Panel de Administracion
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Usuarios Totales</p>
          <p className="text-3xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Puntos Emitidos</p>
          <p className="text-3xl font-bold text-gray-900">--</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Transacciones Hoy</p>
          <p className="text-3xl font-bold text-gray-900">--</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Acciones Rapidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors">
            Gestionar Usuarios
          </button>
          <button className="p-4 bg-blue-50 rounded-lg text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors">
            Ver Transacciones
          </button>
          <button className="p-4 bg-blue-50 rounded-lg text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors">
            Configurar Recompensas
          </button>
          <button className="p-4 bg-blue-50 rounded-lg text-blue-700 font-medium text-sm hover:bg-blue-100 transition-colors">
            Analiticas
          </button>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          El dashboard completo sera implementado en fases posteriores de
          SPEC-AUTH-001 y SPECs adicionales.
        </p>
      </div>
    </div>
  );
}

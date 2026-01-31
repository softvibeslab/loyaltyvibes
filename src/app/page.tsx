import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Loyalty<span className="text-purple-600">Vibes</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Tu wallet de lealtad para restaurantes y hoteles en San Cristobal de
          Las Casas
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            Registrarse
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Acumula Puntos</h3>
            <p className="text-gray-600 text-sm">
              Gana puntos en cada visita y sube de nivel
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-semibold text-gray-900 mb-2">Niveles VIP</h3>
            <p className="text-gray-600 text-sm">
              Explorador, Conocedor y Embajador con beneficios exclusivos
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Canjea Recompensas
            </h3>
            <p className="text-gray-600 text-sm">
              Usa tus puntos para obtener premios increibles
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

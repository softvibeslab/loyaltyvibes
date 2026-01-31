'use client';

import { useState } from 'react';

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Terminal de Escaneo</h2>
        <p className="text-gray-400">
          Escanea el codigo QR del cliente para registrar su visita
        </p>
      </div>

      {/* Scanner Placeholder */}
      <div className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-700">
        {scanning ? (
          <div className="text-center">
            <div className="animate-pulse text-6xl mb-4">📷</div>
            <p className="text-gray-400">Escaneando...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-gray-400">Camara lista para escanear</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setScanning(!scanning)}
        className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
          scanning
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {scanning ? 'Detener Escaneo' : 'Iniciar Escaneo'}
      </button>

      <div className="bg-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-400 text-center">
          El modulo de escaneo QR sera implementado en SPEC-QR-001
        </p>
      </div>
    </div>
  );
}

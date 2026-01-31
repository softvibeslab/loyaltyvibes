'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { registerSchema, type RegisterInput } from '@/features/auth/types';

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    clearError();
    await registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            Loyalty<span className="text-purple-600">Vibes</span>
          </Link>
          <p className="mt-2 text-gray-600">
            Crea tu cuenta y empieza a ganar puntos
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre (opcional)
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              {...register('name')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contrasena
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                placeholder="Minimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
              >
                {showPassword ? (
                  <span className="text-gray-400 text-sm">Ocultar</span>
                ) : (
                  <span className="text-gray-400 text-sm">Mostrar</span>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimo 8 caracteres, una mayuscula y un numero
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-800 font-medium mb-2">
              Al registrarte obtendras:
            </p>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Nivel Explorador (Bronce)</li>
              <li>• 1 punto por cada $10 MXN</li>
              <li>• Acceso a promociones exclusivas</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Ya tienes cuenta?{' '}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}

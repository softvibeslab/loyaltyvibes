'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '@/features/auth/hooks/useProfile';
import { TierBadge, TierMultiplier } from '@/shared/components/ui/TierBadge';
import { TierProgress } from '@/features/wallet/components/TierProgress';

const profileSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      await updateProfile(data);
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setUpdateError('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    reset({ name: profile?.name || '' });
    setIsEditing(false);
    setUpdateError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'No se pudo cargar el perfil'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Success Message */}
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          Perfil actualizado correctamente
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
              {profile.name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.name || 'Usuario'}
              </h2>
              <p className="text-gray-500">{profile.email}</p>
              <div className="mt-1">
                <TierBadge tier={profile.tier} />
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Editar
            </button>
          )}
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {updateError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {updateError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          /* Stats Summary */
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {profile.points_balance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Puntos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.visit_count}
              </p>
              <p className="text-sm text-gray-500">Visitas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                <TierMultiplier tier={profile.tier} />
              </p>
              <p className="text-sm text-gray-500">Multiplicador</p>
            </div>
          </div>
        )}
      </div>

      {/* Tier Progress */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Progreso de Nivel</h3>
        <TierProgress
          currentTier={profile.tier}
          totalSpent={profile.total_spent}
          visitCount={profile.visit_count}
        />
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{profile.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Rol</dt>
            <dd className="text-gray-900 capitalize">{profile.role}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Total gastado</dt>
            <dd className="text-gray-900">${profile.total_spent.toLocaleString()} MXN</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Miembro desde</dt>
            <dd className="text-gray-900">
              {new Date(profile.created_at).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

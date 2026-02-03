/**
 * Ejemplo de uso de componentes de Formulario
 * Ejemplo de integración con React Hook Form + Zod
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  TextArea,
  Select,
  Checkbox,
  RadioGroup,
  FormField,
} from '@/shared/components/ui/forms';
import { Button } from '@/shared/components/ui';

// Esquema de validación con Zod
const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
  category: z.enum(['tech', 'design', 'business'], {
    required_error: 'Selecciona una categoría',
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos',
  }),
  notification: z.enum(['email', 'sms', 'none']),
});

type FormData = z.infer<typeof formSchema>;

/**
 * Ejemplo de formulario completo con validación
 */
export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form data:', data);
  };

  const categoryOptions = [
    { value: 'tech', label: 'Tecnología' },
    { value: 'design', label: 'Diseño' },
    { value: 'business', label: 'Negocios' },
  ];

  const notificationOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'none', label: 'Ninguna' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registro de Usuario</h1>

      {/* Nombre */}
      <TextField
        label="Nombre completo"
        error={errors.name?.message}
        helperText="Ingresa tu nombre completo"
        required
        {...register('name')}
      />

      {/* Email */}
      <TextField
        label="Email"
        type="email"
        error={errors.email?.message}
        placeholder="ejemplo@correo.com"
        required
        {...register('email')}
      />

      {/* Biografía */}
      <TextArea
        label="Biografía"
        error={errors.bio?.message}
        helperText="Cuéntanos sobre ti (opcional)"
        rows={4}
        showCount
        maxLength={500}
        {...register('bio')}
      />

      {/* Categoría */}
      <Select
        label="Categoría"
        options={categoryOptions}
        placeholder="Selecciona una categoría"
        error={errors.category?.message}
        clearable
        required
        {...register('category')}
      />

      {/* Preferencias de notificación */}
      <RadioGroup
        label="Preferencias de notificación"
        name="notification"
        options={notificationOptions}
        error={errors.notification?.message}
        orientation="vertical"
        {...register('notification')}
      />

      {/* Términos y condiciones */}
      <div>
        <Checkbox
          label="Acepto los términos y condiciones"
          error={errors.terms?.message}
          required
          {...register('terms')}
        />
      </div>

      {/* Botón de envío */}
      <div className="flex gap-4">
        <Button type="submit" loading={isSubmitting} fullWidth>
          Registrarse
        </Button>
        <Button type="button" variant="outline" fullWidth>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

/**
 * Ejemplo de uso de FormField wrapper
 */
export function FormFieldExample() {
  return (
    <form className="space-y-4 max-w-md">
      <FormField
        label="Nombre"
        helperText="Tu nombre completo"
        required
      >
        <input
          type="text"
          name="name"
          className="w-full px-3 py-2 border rounded-md"
        />
      </FormField>

      <FormField
        label="Email"
        helperText="ejemplo@correo.com"
        required
      >
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border rounded-md"
        />
      </FormField>
    </form>
  );
}

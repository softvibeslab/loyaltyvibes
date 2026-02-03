import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast Hook', () => {
  describe('Basic functionality', () => {
    it('debería inicializar sin toasts', () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toasts).toHaveLength(0);
    });

    it('debería agregar un toast con showToast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast({
          variant: 'info',
          message: 'Test message',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        variant: 'info',
        message: 'Test message',
      });
    });

    it('debería devolver ID del toast creado', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;

      act(() => {
        toastId = result.current.showToast({
          variant: 'info',
          message: 'Test message',
        });
      });

      expect(toastId).toBeDefined();
      expect(typeof toastId).toBe('string');
      expect(result.current.toasts[0].id).toBe(toastId);
    });
  });

  describe('Convenience methods', () => {
    it('debería mostrar toast de éxito con showSuccess', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Operación exitosa');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        variant: 'success',
        message: 'Operación exitosa',
      });
    });

    it('debería mostrar toast de éxito con título', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Operación exitosa', 'Éxito');
      });

      expect(result.current.toasts[0]).toMatchObject({
        variant: 'success',
        title: 'Éxito',
        message: 'Operación exitosa',
      });
    });

    it('debería mostrar toast de error con showError', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showError('Operación fallida');
      });

      expect(result.current.toasts[0]).toMatchObject({
        variant: 'error',
        message: 'Operación fallida',
      });
    });

    it('debería mostrar toast de advertencia con showWarning', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showWarning('Cuidado');
      });

      expect(result.current.toasts[0]).toMatchObject({
        variant: 'warning',
        message: 'Cuidado',
      });
    });

    it('debería mostrar toast de información con showInfo', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showInfo('Información');
      });

      expect(result.current.toasts[0]).toMatchObject({
        variant: 'info',
        message: 'Información',
      });
    });
  });

  describe('Closing toasts', () => {
    it('debería cerrar un toast específico con closeToast', () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;

      act(() => {
        toastId = result.current.showToast({
          variant: 'info',
          message: 'Test message',
        });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.closeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('debería cerrar todos los toasts con closeAllToasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showError('Error 1');
        result.current.showWarning('Warning 1');
      });

      expect(result.current.toasts).toHaveLength(3);

      act(() => {
        result.current.closeAllToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('no debería lanzar error al cerrar toast inexistente', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.closeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('Multiple toasts', () => {
    it('debería agregar múltiples toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showError('Error 1');
        result.current.showWarning('Warning 1');
        result.current.showInfo('Info 1');
      });

      expect(result.current.toasts).toHaveLength(4);
      expect(result.current.toasts[0].variant).toBe('success');
      expect(result.current.toasts[1].variant).toBe('error');
      expect(result.current.toasts[2].variant).toBe('warning');
      expect(result.current.toasts[3].variant).toBe('info');
    });

    it('debería generar IDs únicos para cada toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Success 1');
        result.current.showError('Error 1');
        result.current.showWarning('Warning 1');
      });

      const ids = result.current.toasts.map((toast) => toast.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it('debería mantener el orden de los toasts', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('First');
        result.current.showError('Second');
        result.current.showWarning('Third');
      });

      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Second');
      expect(result.current.toasts[2].message).toBe('Third');
    });
  });

  describe('Custom duration', () => {
    it('debería aceptar duración personalizada en showToast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast({
          variant: 'info',
          message: 'Test message',
          duration: 10000,
        });
      });

      expect(result.current.toasts[0].duration).toBe(10000);
    });

    it('debería usar duración por defecto (5000ms) en métodos de conveniencia', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showSuccess('Test');
      });

      expect(result.current.toasts[0].duration).toBe(5000);
    });
  });

  describe('Edge cases', () => {
    it('debería manejar strings vacíos', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast({
          variant: 'info',
          message: '',
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].message).toBe('');
    });

    it('debería manejar título opcional', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast({
          variant: 'info',
          message: 'Message',
          title: undefined,
        });
      });

      expect(result.current.toasts[0].title).toBeUndefined();
    });

    it('debería manejar duración de 0 (no auto-dismiss)', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.showToast({
          variant: 'info',
          message: 'Test',
          duration: 0,
        });
      });

      expect(result.current.toasts[0].duration).toBe(0);
    });
  });

  describe('Re-renders', () => {
    it('debería mantener estabilidad de referencias', () => {
      const { result, rerender } = renderHook(() => useToast());

      const originalShowSuccess = result.current.showSuccess;
      const originalCloseToast = result.current.closeToast;

      rerender();

      expect(result.current.showSuccess).toBe(originalShowSuccess);
      expect(result.current.closeToast).toBe(originalCloseToast);
    });
  });
});

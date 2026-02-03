import React, { useState, useRef } from 'react';

/**
 * Tamaños predefinidos del Avatar
 */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Propiedades del componente Avatar
 */
export interface AvatarProps {
  /** URL de la imagen */
  src?: string;
  /** Texto alternativo para accesibilidad */
  alt?: string;
  /** Texto de fallback (iniciales) */
  fallback?: string;
  /** Tamaño del avatar */
  size?: AvatarSize;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Componente Avatar para mostrar imágenes de usuario con fallback
 * Implementa accesibilidad WCAG 2.1 AA con alt text y carga diferida
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      src,
      alt = 'Avatar',
      fallback = '?',
      size = 'md',
      className = '',
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Manejar error de carga de imagen
    const handleImageError = () => {
      setImageError(true);
    };

    // Manejar carga exitosa de imagen
    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    // Colores de fondo para fallback basados en el string
    const getBackgroundColor = (str: string) => {
      const colors = [
        'bg-emerald-500',
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-amber-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-teal-500',
      ];

      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      return colors[Math.abs(hash) % colors.length];
    };

    // Estilos según el tamaño
    const sizeStyles: Record<AvatarSize, string> = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    // Determinar qué mostrar
    const showImage = src && !imageError && imageLoaded;
    const showFallback = !src || imageError || !imageLoaded;

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-full
          ${sizeStyles[size]}
          ${showFallback ? getBackgroundColor(fallback) + ' text-white font-medium' : ''}
          ${className}
        `}
        aria-label={alt}
      >
        {/* Imagen */}
        {src && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`
              rounded-full object-cover
              ${sizeStyles[size]}
              ${imageLoaded ? 'inline-block' : 'hidden'}
            `}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {/* Fallback (iniciales o ?) */}
        {showFallback && (
          <span className="truncate max-w-full">
            {fallback.length > 2
              ? fallback
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)
              : fallback.toUpperCase()}
          </span>
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

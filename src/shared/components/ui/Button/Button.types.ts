/**
 * Tipos de variantes disponibles para el componente Button
 * - primary: Color esmeralda principal para acciones principales
 * - secondary: Color púrpura para acciones secundarias
 * - outline: Botón con borde para acciones menos prominentes
 * - ghost: Botón transparente para acciones sutiles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Tamaños disponibles para el componente Button
 * - sm: Pequeño para interfaces compactas
 * - md: Tamaño medio por defecto
 * - lg: Grande para énfasis visual
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Propiedades del componente Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant;
  /** Tamaño del botón */
  size?: ButtonSize;
  /** Estado de deshabilitado */
  disabled?: boolean;
  /** Estado de carga con spinner */
  loading?: boolean;
  /** Ocupar todo el ancho disponible */
  fullWidth?: boolean;
  /** Contenido del botón */
  children: React.ReactNode;
  /** Manejador de clic */
  onClick?: () => void;
}

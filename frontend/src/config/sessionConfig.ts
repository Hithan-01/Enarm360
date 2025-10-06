// Configuración de timeouts de sesión
export const SESSION_CONFIG = {
  // Tiempo de inactividad antes del logout automático (en milisegundos)
  TIMEOUT_DURATION: 30 * 60 * 1000, // 30 minutos por defecto
  
  // Tiempo de advertencia antes del logout (en milisegundos)
  WARNING_DURATION: 5 * 60 * 1000, // 5 minutos por defecto
  
  // Habilitar/deshabilitar el sistema de timeout
  ENABLED: true,
  
  // Configuración de entornos específicos
  DEVELOPMENT: {
    TIMEOUT_DURATION: 60 * 60 * 1000, // 60 minutos en desarrollo
    WARNING_DURATION: 10 * 60 * 1000, // 10 minutos de advertencia
    ENABLED: true
  },
  
  PRODUCTION: {
    TIMEOUT_DURATION: 30 * 60 * 1000, // 30 minutos en producción
    WARNING_DURATION: 5 * 60 * 1000, // 5 minutos de advertencia
    ENABLED: true
  }
};

// Función para obtener la configuración según el entorno
export const getSessionConfig = () => {
  const env = process.env.NODE_ENV;
  
  switch (env) {
    case 'development':
      return {
        timeout: SESSION_CONFIG.DEVELOPMENT.TIMEOUT_DURATION,
        warningTime: SESSION_CONFIG.DEVELOPMENT.WARNING_DURATION,
        enabled: SESSION_CONFIG.DEVELOPMENT.ENABLED
      };
    case 'production':
      return {
        timeout: SESSION_CONFIG.PRODUCTION.TIMEOUT_DURATION,
        warningTime: SESSION_CONFIG.PRODUCTION.WARNING_DURATION,
        enabled: SESSION_CONFIG.PRODUCTION.ENABLED
      };
    default:
      return {
        timeout: SESSION_CONFIG.TIMEOUT_DURATION,
        warningTime: SESSION_CONFIG.WARNING_DURATION,
        enabled: SESSION_CONFIG.ENABLED
      };
  }
};

// Utilidades para formatear tiempos
export const formatTimeoutDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  return `${minutes}m`;
};

export default SESSION_CONFIG;
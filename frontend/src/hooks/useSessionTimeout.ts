import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { authService } from '../services/authService';

interface UseSessionTimeoutOptions {
  timeout?: number; // Tiempo en milisegundos (default: 30 minutos)
  warningTime?: number; // Tiempo en milisegundos para mostrar advertencia antes del logout (default: 5 minutos)
  enabled?: boolean; // Permitir habilitar/deshabilitar (default: true)
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const {
    timeout = 30 * 60 * 1000, // 30 minutos por defecto
    warningTime = 5 * 60 * 1000, // 5 minutos de advertencia
    enabled = true
  } = options;

  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef<boolean>(false);

  // Eventos que indican actividad del usuario
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ];

  // Limpiar timeouts existentes
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    warningShownRef.current = false;
  }, []);

  // Hacer logout automático
  const performAutoLogout = useCallback(async () => {
    try {
      await authService.logout();
      notifications.show({
        title: 'Sesión expirada',
        message: 'Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.',
        color: 'orange',
        autoClose: 5000,
      });
      navigate('/login?expired=true', { replace: true });
    } catch (error) {
      console.error('Error durante auto-logout:', error);
      // Forzar redirección aunque falle el logout
      navigate('/login?expired=true', { replace: true });
    }
  }, [navigate]);

  // Mostrar advertencia de próxima expiración
  const showWarning = useCallback(() => {
    if (warningShownRef.current) return;
    
    warningShownRef.current = true;
    notifications.show({
      id: 'session-warning',
      title: '⚠️ Sesión por expirar',
      message: `Tu sesión expirará en ${Math.floor(warningTime / 60000)} minutos por inactividad. Realiza alguna acción para mantener la sesión activa.`,
      color: 'yellow',
      autoClose: false,
      withCloseButton: true,
    });
  }, [warningTime]);

  // Reiniciar el temporizador de inactividad
  const resetTimeout = useCallback(() => {
    if (!enabled || !authService.isAuthenticated()) return;

    clearTimeouts();

    // Limpiar advertencia si está visible
    notifications.hide('session-warning');

    // Configurar advertencia
    warningTimeoutRef.current = setTimeout(() => {
      showWarning();
    }, timeout - warningTime);

    // Configurar auto-logout
    timeoutRef.current = setTimeout(() => {
      performAutoLogout();
    }, timeout);
  }, [enabled, timeout, warningTime, clearTimeouts, showWarning, performAutoLogout]);

  // Manejar actividad del usuario
  const handleActivity = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  // Efecto para configurar los event listeners
  useEffect(() => {
    if (!enabled || !authService.isAuthenticated()) return;

    // Iniciar el temporizador
    resetTimeout();

    // Agregar event listeners para detectar actividad
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup
    return () => {
      clearTimeouts();
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      notifications.hide('session-warning');
    };
  }, [enabled, handleActivity, resetTimeout, clearTimeouts]);

  // Efecto para limpiar cuando el usuario no está autenticado
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      clearTimeouts();
      notifications.hide('session-warning');
    }
  }, [clearTimeouts]);

  // Métodos públicos
  return {
    resetTimeout,
    clearTimeouts,
    isEnabled: enabled
  };
};

export default useSessionTimeout;
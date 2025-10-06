import React, { createContext, useContext, ReactNode } from 'react';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

interface SessionTimeoutContextType {
  resetTimeout: () => void;
  clearTimeouts: () => void;
  isEnabled: boolean;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | undefined>(undefined);

interface SessionTimeoutProviderProps {
  children: ReactNode;
  timeout?: number; // Tiempo de inactividad en milisegundos
  warningTime?: number; // Tiempo de advertencia antes del logout
  enabled?: boolean; // Permitir habilitar/deshabilitar
}

export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({ 
  children, 
  timeout = 30 * 60 * 1000, // 30 minutos por defecto
  warningTime = 5 * 60 * 1000, // 5 minutos de advertencia
  enabled = true 
}) => {
  const sessionTimeout = useSessionTimeout({
    timeout,
    warningTime,
    enabled
  });

  return (
    <SessionTimeoutContext.Provider value={sessionTimeout}>
      {children}
    </SessionTimeoutContext.Provider>
  );
};

export const useSessionTimeoutContext = (): SessionTimeoutContextType => {
  const context = useContext(SessionTimeoutContext);
  if (context === undefined) {
    throw new Error('useSessionTimeoutContext must be used within a SessionTimeoutProvider');
  }
  return context;
};

export default SessionTimeoutProvider;
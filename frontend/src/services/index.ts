import axios from 'axios';

// ==========================================================
// SERVICIOS PRINCIPALES
// ==========================================================

// Servicio de autenticación (core)
export { authService, default as AuthService } from './authService';

// Servicio de registro de usuarios
export { registroService, default as RegistroService } from './registroService';

// Servicio de perfiles de usuario
export { profileService, default as ProfileService } from './profileService';

// Servicio de dashboards
export { dashboardService, default as DashboardService } from './dashboardService';

// Servicio de notificaciones
export { notificationService, default as NotificationService } from './notificationService';

// Servicio de usuarios (admin)
export { userService, default as UserService } from './userService';

// ==========================================================
// CONFIGURACIÓN GLOBAL DE AXIOS
// ==========================================================

// Base URL para todas las peticiones
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
axios.defaults.baseURL = API_BASE_URL;

// Timeout global
axios.defaults.timeout = 30000; // 30 segundos

// Headers por defecto
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Interceptor global para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    // Solo agregar token si no está ya presente
    if (!config.headers.Authorization) {
      const token = localStorage.getItem('accessToken');
      if (token && token !== 'undefined' && token !== 'null') {
        // Validar formato básico del JWT antes de usarlo
        const parts = token.split('.');
        if (parts.length === 3 && parts.every(part => part.length > 0)) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Token malformado, limpiarlo
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    }
    
    // Logging para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue: Array<{resolve: Function, reject: Function}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor global para manejar respuestas y errores
axios.interceptors.response.use(
  (response) => {
    // Logging para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Logging para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    
    // Manejo automático de renovación de token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos renovando el token, añadir esta request a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios.request(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar renovar el token usando authService
        const { authService } = await import('./authService');
        await authService.refreshToken();
        
        // Reintentar la petición original con el nuevo token
        const newToken = localStorage.getItem('accessToken');
        if (newToken) {
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Token refresh failed:', refreshError);
        
        // Redirigir al login si la renovación falla
        const { authService } = await import('./authService');
        authService.logout();
        
        // Redirigir solo si no estamos ya en login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Manejo de otros errores comunes
    if (error.response?.status === 403) {
      console.warn('Acceso denegado. Verificar permisos.');
    }
    
    if (error.response?.status >= 500) {
      console.error('Error del servidor. Intentar más tarde.');
    }
    
    if (error.code === 'NETWORK_ERROR') {
      console.error('Error de conexión. Verificar conexión a internet.');
    }
    
    return Promise.reject(error);
  }
);

// ==========================================================
// UTILIDADES COMUNES
// ==========================================================

export const apiUtils = {
  /**
   * Construir URL completa para un endpoint
   */
  buildUrl: (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
  },
  
  /**
   * Formatear parámetros de query string
   */
  formatParams: (params: Record<string, any>): URLSearchParams => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(`${key}[]`, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams;
  },
  
  /**
   * Verificar si una respuesta es exitosa
   */
  isSuccessResponse: (response: any): boolean => {
    return response?.success === true || (response?.status >= 200 && response?.status < 300);
  },
  
  /**
   * Extraer mensaje de error de una respuesta
   */
  extractErrorMessage: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Error desconocido';
  },
  
  /**
   * Crear FormData para subida de archivos
   */
  createFormData: (data: Record<string, any>): FormData => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    return formData;
  }
};

// ==========================================================
// CONSTANTES DE API
// ==========================================================

export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    LOGOUT_ALL: '/api/auth/logout-all',
    ME: '/api/auth/me',
    SESSIONS: '/api/auth/sessions',
    ROLES: '/api/auth/me/roles',
    IS_ADMIN: '/api/auth/me/is-admin',
    IS_ESTUDIANTE: '/api/auth/me/is-estudiante'
  },
  
  // Registro
  REGISTRO: {
    CREAR_CUENTA: '/api/registro/crear-cuenta',
    INFO: '/api/registro/info',
    VALIDAR_PASSWORD: '/api/registro/validar-password',
    CHECK_AVAILABILITY: '/api/registro/check-availability',
    CHECK_EMAIL: '/api/registro/check-email',
    CHECK_USERNAME: '/api/registro/check-username'
  },
  
  // Dashboards
  DASHBOARD: {
    ADMIN: '/api/dashboard/admin',
    ESTUDIANTE: '/api/dashboard/estudiante',
    GENERAL: '/api/dashboard/general',
    STATS: '/api/dashboard/stats'
  },
  
  // Perfil
  PERFIL: {
    ME: '/api/perfil/me',
    USUARIO: '/api/perfil/usuarios',
    AVATAR: '/api/perfil/me/avatar'
  },
  
  // Notificaciones
  NOTIFICACIONES: {
    MIAS: '/api/notificaciones/mias',
    COUNT: '/api/notificaciones/mias/count',
    MARCAR_LEIDA: (id: number) => `/api/notificaciones/${id}/leer`,
    CREAR: '/api/notificaciones',
    BROADCAST: '/api/notificaciones/broadcast'
  }
} as const;

// ==========================================================
// TIPOS DE RESPUESTA COMUNES
// ==========================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface FileUploadResponse extends ApiResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
}

// ==========================================================
// CONFIGURACIÓN DE DESARROLLO
// ==========================================================

if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Services initialized in development mode');
  console.log('📍 API Base URL:', API_BASE_URL || 'Same origin');
  console.log('🚀 Available services: AuthService, RegistroService, ProfileService, DashboardService');
}
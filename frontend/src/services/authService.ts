import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  TokenResponse,
  UsuarioInfo,
  AdminDashboardData,
  EstudianteDashboardData,
  CheckFieldResponse,
  ActiveSessionsResponse
} from '../types/auth';

const API_BASE = '/api/auth';

// Configurar axios para incluir token automáticamente
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar renovación automática de token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        await authService.refreshToken();
        const token = localStorage.getItem('accessToken');
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // ==========================================================
  // AUTENTICACIÓN BÁSICA
  // ==========================================================

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE}/login`, credentials);
      const { accessToken, refreshToken, usuario } = response.data;
      
      // Guardar tokens en localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(): Promise<TokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<TokenResponse>(`${API_BASE}/refresh`, {
      refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${API_BASE}/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearTokens();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await axios.post(`${API_BASE}/logout-all`);
    } catch (error) {
      console.error('Error during logout all:', error);
    } finally {
      this.clearTokens();
    }
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // ==========================================================
  // INFORMACIÓN DE USUARIO
  // ==========================================================

  async getCurrentUser(): Promise<UsuarioInfo> {
    const response = await axios.get<UsuarioInfo>(`${API_BASE}/me`);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  }

  async getMyRoles(): Promise<{ roles: string[], isAdmin: boolean, isEstudiante: boolean }> {
    const response = await axios.get(`${API_BASE}/me/roles`);
    return response.data;
  }

  async checkIsAdmin(): Promise<boolean> {
    const response = await axios.get<{ isAdmin: boolean }>(`${API_BASE}/me/is-admin`);
    return response.data.isAdmin;
  }

  async checkIsEstudiante(): Promise<boolean> {
    const response = await axios.get<{ isEstudiante: boolean }>(`${API_BASE}/me/is-estudiante`);
    return response.data.isEstudiante;
  }

  async getActiveSessions(): Promise<ActiveSessionsResponse> {
    const response = await axios.get<ActiveSessionsResponse>(`${API_BASE}/sessions`);
    return response.data;
  }

  // ==========================================================
  // DASHBOARDS
  // ==========================================================

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await axios.get<AdminDashboardData>(`${API_BASE}/admin/dashboard`);
    return response.data;
  }

  async getEstudianteDashboard(): Promise<EstudianteDashboardData> {
    const response = await axios.get<EstudianteDashboardData>(`${API_BASE}/estudiante/dashboard`);
    return response.data;
  }

  async getGeneralDashboard(): Promise<any> {
    const response = await axios.get(`${API_BASE}/dashboard/general`);
    return response.data;
  }

  // ==========================================================
  // VALIDACIONES
  // ==========================================================

  async checkEmailAvailability(email: string): Promise<CheckFieldResponse> {
    const response = await axios.get<CheckFieldResponse>(`${API_BASE}/check-email`, {
      params: { email }
    });
    return response.data;
  }

  async checkUsernameAvailability(username: string): Promise<CheckFieldResponse> {
    const response = await axios.get<CheckFieldResponse>(`${API_BASE}/check-username`, {
      params: { username }
    });
    return response.data;
  }

  // ==========================================================
  // UTILIDADES
  // ==========================================================

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('accessToken');
      const user = this.getCurrentUserFromStorage();
      return !!(token && user);
    } catch (error) {
      console.warn('Error checking authentication:', error);
      return false;
    }
  }

  getCurrentUserFromStorage(): UsuarioInfo | null {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.warn('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Limpiar datos corruptos
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUserFromStorage();
    return (user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN')) ?? false;
  }

  isEstudiante(): boolean {
    const user = this.getCurrentUserFromStorage();
    return (user?.roles?.includes('ROLE_ESTUDIANTE') || user?.roles?.includes('ESTUDIANTE')) ?? false;
  }
}

export const authService = new AuthService();
export default authService;
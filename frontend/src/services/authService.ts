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

// Los interceptors de axios están configurados globalmente en services/index.ts

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
    if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null') {
      this.clearTokens();
      throw new Error('No refresh token available');
    }

    // Validar formato básico del JWT
    if (!this.isValidJwtFormat(refreshToken)) {
      this.clearTokens();
      throw new Error('Invalid refresh token format');
    }

    const response = await axios.post<TokenResponse>(`${API_BASE}/refresh`, {
      refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return response.data;
  }

  private isValidJwtFormat(token: string): boolean {
    // JWT debe tener exactamente 2 puntos (3 partes)
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
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
  // DASHBOARDS - DEPRECATED: Use dashboardService instead
  // ==========================================================

  /**
   * @deprecated Use dashboardService.getAdminDashboard() instead
   */
  async getAdminDashboard(): Promise<AdminDashboardData> {
    console.warn('authService.getAdminDashboard() is deprecated. Use dashboardService.getAdminDashboard() instead.');
    const response = await axios.get<AdminDashboardData>(`/api/dashboard/admin`);
    return response.data;
  }

  /**
   * @deprecated Use dashboardService.getEstudianteDashboard() instead
   */
  async getEstudianteDashboard(): Promise<EstudianteDashboardData> {
    console.warn('authService.getEstudianteDashboard() is deprecated. Use dashboardService.getEstudianteDashboard() instead.');
    const response = await axios.get<EstudianteDashboardData>(`/api/dashboard/estudiante`);
    return response.data;
  }

  /**
   * @deprecated Use dashboardService.getGeneralDashboard() instead
   */
  async getGeneralDashboard(): Promise<any> {
    console.warn('authService.getGeneralDashboard() is deprecated. Use dashboardService.getGeneralDashboard() instead.');
    const response = await axios.get(`/api/dashboard/general`);
    return response.data;
  }

  // ==========================================================
  // VALIDACIONES - DEPRECATED: Use registroService instead
  // ==========================================================

  /**
   * @deprecated Use registroService.checkEmailAvailability() instead
   */
  async checkEmailAvailability(email: string): Promise<CheckFieldResponse> {
    console.warn('authService.checkEmailAvailability() is deprecated. Use registroService.checkEmailAvailability() instead.');
    const response = await axios.get<CheckFieldResponse>(`/api/registro/check-email`, {
      params: { email }
    });
    return response.data;
  }

  /**
   * @deprecated Use registroService.checkUsernameAvailability() instead
   */
  async checkUsernameAvailability(username: string): Promise<CheckFieldResponse> {
    console.warn('authService.checkUsernameAvailability() is deprecated. Use registroService.checkUsernameAvailability() instead.');
    const response = await axios.get<CheckFieldResponse>(`/api/registro/check-username`, {
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
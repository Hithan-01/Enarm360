// Tipos basados en el AuthController
export interface LoginRequest {
  login: string;  // username o email
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: UsuarioInfo;
  success?: boolean;
}

export interface UsuarioInfo {
  id: number;
  username: string;
  email: string;
  roles: string[];
  activo: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CheckFieldResponse {
  available: boolean;
  message: string;
}

export interface ActiveSessionsResponse {
  activeSessions: number;
}

// Tipos para respuestas de error
export interface ErrorResponse {
  message: string;
  success: boolean;
}

// Tipos para dashboards
export interface AdminDashboardData {
  message: string;
  stats: {
    usuariosActivos: number;
    preguntasTotales: number;
    examenesCreados: number;
  };
  actions: string[];
  accessLevel: string;
}

export interface EstudianteDashboardData {
  message: string;
  stats: {
    cursosInscritos: number;
    examenesCompletados: number;
    puntuacionPromedio: number;
    horasEstudio: number;
    materiasMejor: string;
    proximoExamen: string;
  };
  actions: string[];
  accessLevel: string;
}

// Tipos para contexto de autenticación
export interface AuthContextType {
  user: UsuarioInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAdmin: () => boolean;
  isEstudiante: () => boolean;
}

// Roles disponibles
export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  ESTUDIANTE = 'ROLE_ESTUDIANTE'
}
// ==========================================================
// TIPOS PARA PERFIL DE USUARIO
// ==========================================================

export interface UsuarioProfile {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  telefono?: string;
  genero?: 'M' | 'F' | 'Otro';
  avatar?: string;
  
  // Información académica
  universidad?: string;
  anioGraduacion?: number;
  numeroTitulo?: string;
  especialidadInteres?: string;
  
  // Configuraciones
  recibirNotificaciones: boolean;
  recibirNewsletters: boolean;
  perfilPublico: boolean;
  
  // Metadata
  fechaRegistro: string;
  ultimaActividad?: string;
  estado: 'activo' | 'inactivo' | 'suspendido';
  emailVerificado: boolean;
  
  // Roles y permisos
  roles: string[];
  
  // Estadísticas (solo lectura)
  stats?: {
    simulacrosCompletados: number;
    promedioGeneral: number;
    tiempoEstudioTotal: number;
    especialidadFavorita?: string;
    nivelProgreso: number;
  };
  
  // Configuración de privacidad
  privacy?: {
    mostrarEmail: boolean;
    mostrarTelefono: boolean;
    mostrarUniversidad: boolean;
    permitirMensajes: boolean;
    mostrarEstadisticas: boolean;
  };
}

export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  telefono?: string;
  genero?: 'M' | 'F' | 'Otro';
  
  // Información académica
  universidad?: string;
  anioGraduacion?: number;
  numeroTitulo?: string;
  especialidadInteres?: string;
  
  // Configuraciones
  recibirNotificaciones?: boolean;
  recibirNewsletters?: boolean;
  perfilPublico?: boolean;
  
  // Configuración de privacidad
  privacy?: {
    mostrarEmail?: boolean;
    mostrarTelefono?: boolean;
    mostrarUniversidad?: boolean;
    permitirMensajes?: boolean;
    mostrarEstadisticas?: boolean;
  };
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string;
  avatarUrl: string;
  avatarPath: string;
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
}

// ==========================================================
// TIPOS PARA CONFIGURACIONES DE USUARIO
// ==========================================================

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  timezone: string;
  
  // Notificaciones
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    newsletter: boolean;
    simulacroReminders: boolean;
    progressReports: boolean;
  };
  
  // Estudio
  study: {
    defaultSimulationTime: number; // en minutos
    autoSaveProgress: boolean;
    showDetailedResults: boolean;
    enableSounds: boolean;
    preferredSpecialties: string[];
  };
  
  // Privacidad
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
    shareStudyProgress: boolean;
  };
}

export interface UpdateSettingsRequest extends Partial<UserSettings> {}

// ==========================================================
// TIPOS PARA ACTIVIDAD DE USUARIO
// ==========================================================

export interface UserActivity {
  id: number;
  type: 'login' | 'logout' | 'simulacro_completed' | 'profile_updated' | 'settings_changed';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface ActivityLog {
  activities: UserActivity[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==========================================================
// TIPOS PARA CONEXIONES SOCIALES
// ==========================================================

export interface UserConnection {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  avatar?: string;
  universidad?: string;
  especialidadInteres?: string;
  connectionType: 'friend' | 'study_buddy' | 'blocked';
  connectedSince: string;
  lastActivity?: string;
  isOnline: boolean;
}

export interface ConnectionRequest {
  id: number;
  fromUserId: number;
  fromUser: {
    username: string;
    nombre: string;
    apellido: string;
    avatar?: string;
    universidad?: string;
  };
  message?: string;
  type: 'friend' | 'study_buddy';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// ==========================================================
// CONSTANTES Y CONFIGURACIONES
// ==========================================================

export const PROFILE_CONSTANTS = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_AVATAR_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MIN_AGE: 18,
  MAX_AGE: 100,
  PHONE_REGEX: /^[0-9+\-\s()]{10,15}$/,
  
  UNIVERSIDADES_MEXICO: [
    'UNAM', 'IPN', 'UAM', 'BUAP', 'UV', 'UdeG', 'UANL', 'ITESM', 
    'UAA', 'UAS', 'UCO', 'UJED', 'UNACH', 'UABCS', 'UABC', 'UACh',
    'UAEM', 'UAEMEX', 'UAQ', 'UAT', 'UAZ', 'UC', 'UCA', 'UCLM',
    'UPN', 'UR', 'USB', 'UTC', 'UTO', 'UTP', 'UTS', 'UVA'
  ],
  
  ESPECIALIDADES_ENARM: [
    'Anestesiología', 'Cardiología', 'Cirugía General', 'Dermatología',
    'Endocrinología', 'Gastroenterología', 'Ginecología y Obstetricia',
    'Hematología', 'Infectología', 'Medicina Interna', 'Nefrología',
    'Neumología', 'Neurología', 'Oncología', 'Ortopedia', 'Otorrinolaringología',
    'Pediatría', 'Psiquiatría', 'Radiología e Imagen', 'Reumatología',
    'Urología', 'Medicina Familiar', 'Medicina del Trabajo',
    'Medicina de Rehabilitación', 'Patología', 'Medicina Nuclear',
    'Genética Médica'
  ]
};

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No puede tener más de ${max} caracteres`,
  invalidEmail: 'Formato de email inválido',
  invalidPhone: 'Formato de teléfono inválido',
  invalidDate: 'Fecha inválida',
  fileTooLarge: (maxSize: string) => `El archivo no puede superar ${maxSize}`,
  invalidFileType: (types: string) => `Solo se permiten archivos: ${types}`,
  minAge: (age: number) => `Debes tener al menos ${age} años`,
  maxAge: (age: number) => `Edad máxima permitida: ${age} años`
};
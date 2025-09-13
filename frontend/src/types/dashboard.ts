// ==========================================================
// TIPOS PARA DASHBOARDS
// ==========================================================

export interface GeneralDashboardData {
  success: boolean;
  message: string;
  usuario: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    email: string;
    roles: string[];
  };
  stats: {
    totalUsuarios: number;
    usuariosActivos: number;
    simulacrosCompletados: number;
    promedioGeneral: number;
  };
  recentActivity: ActivityItem[];
  systemStatus: SystemStatus;
}

export interface AdminDashboardData {
  success: boolean;
  message: string;
  totalUsuarios: number;
  usuariosActivos: number;
  nuevosUsuarios: number;
  totalSimulacros: number;
  simulacrosHoy: number;
  promedioGeneral: number;
  tasaConversion: number;
  
  // Estadísticas avanzadas
  usuariosPorRol: {
    [key: string]: number;
  };
  
  actividadDiaria: {
    fecha: string;
    usuarios: number;
    simulacros: number;
    promedio: number;
  }[];
  
  especialidadesMasEstudiadas: {
    especialidad: string;
    cantidad: number;
    promedio: number;
  }[];
  
  universidadesMasActivas: {
    universidad: string;
    estudiantes: number;
    promedio: number;
  }[];
  
  reportesPendientes: ReportItem[];
  alertasSeguridad: SecurityAlert[];
  metricas: SystemMetrics;
}

export interface EstudianteDashboardData {
  success: boolean;
  message: string;
  
  // Información básica del estudiante
  estudiante: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    avatar?: string;
    universidad?: string;
    especialidadInteres?: string;
  };
  
  // Progreso académico
  progreso: {
    simulacrosCompletados: number;
    totalSimulacros: number;
    promedioGeneral: number;
    ultimoPromedio: number;
    mejorPromedio: number;
    tendencia: 'subiendo' | 'bajando' | 'estable';
    desviacionEstandar: number;
  };
  
  // Análisis por especialidades
  especialidades: {
    [especialidad: string]: {
      simulacros: number;
      promedio: number;
      ultimoIntento: string;
      mejorPromedio: number;
      tendencia: 'subiendo' | 'bajando' | 'estable';
    };
  };
  
  // Áreas de fortaleza y mejora
  areasFortaleza: string[];
  areasMejora: string[];
  
  // Recomendaciones personalizadas
  recomendaciones: StudyRecommendation[];
  
  // Actividad reciente
  actividadReciente: StudentActivity[];
  
  // Objetivos y metas
  objetivos: {
    objetivoPromedio: number;
    progresoObjetivo: number;
    fechaExamen?: string;
    diasRestantes?: number;
    simulacrosPorDia: number;
    tiempoEstudioRecomendado: number;
    proximoObjetivo: string;
  };
  
  // Estadísticas de tiempo
  tiempoEstudio: {
    hoyMinutos: number;
    semanaMinutos: number;
    mesMinutos: number;
    totalMinutos: number;
    promedioDiario: number;
    racha: number; // días consecutivos
  };
  
  // Comparación con otros
  ranking: {
    posicionGeneral?: number;
    totalEstudiantes?: number;
    posicionUniversidad?: number;
    estudiantesUniversidad?: number;
    percentil: number;
  };
}

export interface DashboardStats {
  global: {
    totalUsers: number;
    activeUsers: number;
    totalSimulations: number;
    averageScore: number;
    completionRate: number;
  };
  
  trends: {
    userGrowth: TrendData[];
    scoreImprovement: TrendData[];
    popularSpecialties: SpecialtyData[];
  };
  
  performance: {
    systemUptime: number;
    averageResponseTime: number;
    errorRate: number;
    activeConnections: number;
  };
}

// ==========================================================
// TIPOS AUXILIARES
// ==========================================================

export interface ActivityItem {
  id: number;
  type: 'simulation' | 'login' | 'achievement' | 'system';
  user?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface SystemStatus {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastUpdate: string;
  services: {
    database: 'online' | 'offline' | 'slow';
    redis: 'online' | 'offline' | 'slow';
    storage: 'online' | 'offline' | 'slow';
    email: 'online' | 'offline' | 'slow';
  };
}

export interface StudyRecommendation {
  id: number;
  type: 'specialty' | 'weakness' | 'review' | 'practice';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  specialty?: string;
  estimatedTime: number; // minutos
  difficulty: 'easy' | 'medium' | 'hard';
  completionReward: number; // puntos
  dueDate?: string;
  isCompleted: boolean;
}

export interface StudentActivity {
  id: number;
  type: 'simulation_start' | 'simulation_complete' | 'achievement' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  specialty?: string;
  duration?: number; // minutos
  metadata?: Record<string, any>;
}

export interface ReportItem {
  id: number;
  type: 'user_report' | 'content_issue' | 'technical_problem';
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'in_review' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
}

export interface SecurityAlert {
  id: number;
  type: 'suspicious_login' | 'multiple_failures' | 'unusual_activity' | 'system_breach';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  affectedUser?: string;
  ipAddress?: string;
  resolved: boolean;
  actions: string[];
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  
  memory: {
    used: number;
    total: number;
    cached: number;
    percentage: number;
  };
  
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number;
    slowQueries: number;
  };
  
  api: {
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    activeConnections: number;
  };
}

export interface TrendData {
  date: string;
  value: number;
  change?: number;
  percentage?: number;
}

export interface SpecialtyData {
  name: string;
  students: number;
  averageScore: number;
  totalSimulations: number;
  difficulty: number; // 1-5
  popularity: number; // 1-100
}

// ==========================================================
// TIPOS PARA WIDGETS DE DASHBOARD
// ==========================================================

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'stat' | 'list' | 'progress' | 'calendar';
  title: string;
  subtitle?: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  data: any;
  config: WidgetConfig;
  permissions: string[];
  isVisible: boolean;
  lastUpdated: string;
}

export interface WidgetConfig {
  refreshInterval?: number; // segundos
  showHeader?: boolean;
  allowFullscreen?: boolean;
  exportable?: boolean;
  filters?: Record<string, any>;
  styling?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };
}

// ==========================================================
// CONSTANTES
// ==========================================================

export const DASHBOARD_CONSTANTS = {
  REFRESH_INTERVALS: {
    REAL_TIME: 5, // segundos
    FREQUENT: 30,
    NORMAL: 60,
    SLOW: 300
  },
  
  WIDGET_SIZES: {
    SMALL: { width: 4, height: 3 },
    MEDIUM: { width: 6, height: 4 },
    LARGE: { width: 8, height: 6 },
    FULL: { width: 12, height: 8 }
  },
  
  SCORE_THRESHOLDS: {
    EXCELLENT: 90,
    GOOD: 80,
    FAIR: 70,
    POOR: 60
  },
  
  STUDY_TIME_RECOMMENDATIONS: {
    BEGINNER: 120, // minutos por día
    INTERMEDIATE: 90,
    ADVANCED: 60,
    MAINTENANCE: 30
  }
};
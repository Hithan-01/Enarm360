import axios from 'axios';
import {
  AdminDashboardData,
  EstudianteDashboardData,
  GeneralDashboardData,
  DashboardStats
} from '../types/dashboard';

const API_BASE = '/api/dashboard';

// Los interceptors de axios están configurados globalmente en services/index.ts

class DashboardService {
  // ==========================================================
  // DASHBOARDS ESPECÍFICOS POR ROL
  // ==========================================================

  async getAdminDashboard(): Promise<AdminDashboardData> {
    try {
      const response = await axios.get<AdminDashboardData>(`${API_BASE}/admin`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEstudianteDashboard(): Promise<EstudianteDashboardData> {
    try {
      const response = await axios.get<EstudianteDashboardData>(`${API_BASE}/estudiante`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getGeneralDashboard(): Promise<GeneralDashboardData> {
    try {
      const response = await axios.get<GeneralDashboardData>(`${API_BASE}/general`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==========================================================
  // ESTADÍSTICAS GENERALES
  // ==========================================================

  async getStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get<DashboardStats>(`${API_BASE}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==========================================================
  // UTILIDADES PARA PROCESAR DATOS
  // ==========================================================

  processAdminStats(data: AdminDashboardData): {
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    totalSimulacros: number;
    averageScore: number;
    conversionRate: number;
  } {
    return {
      totalUsers: data.totalUsuarios || 0,
      activeUsers: data.usuariosActivos || 0,
      newUsersThisMonth: data.nuevosUsuarios || 0,
      totalSimulacros: data.totalSimulacros || 0,
      averageScore: data.promedioGeneral || 0,
      conversionRate: data.tasaConversion || 0
    };
  }

  processEstudianteProgress(data: EstudianteDashboardData): {
    completionPercentage: number;
    strongAreas: string[];
    weakAreas: string[];
    recommendedStudyTime: number;
    nextMilestone: string;
  } {
    const completedSimulacros = data.progreso.simulacrosCompletados || 0;
    const totalSimulacros = data.progreso.totalSimulacros || 1;
    
    return {
      completionPercentage: (completedSimulacros / totalSimulacros) * 100,
      strongAreas: data.areasFortaleza || [],
      weakAreas: data.areasMejora || [],
      recommendedStudyTime: data.objetivos.tiempoEstudioRecomendado || 120, // minutos
      nextMilestone: data.objetivos.proximoObjetivo || 'Completar siguiente simulacro'
    };
  }

  generateStudyRecommendations(studentData: EstudianteDashboardData): {
    priority: 'high' | 'medium' | 'low';
    type: 'review' | 'practice' | 'study';
    specialty: string;
    description: string;
    estimatedTime: number; // en minutos
  }[] {
    const recommendations = [];
    
    // Recomendaciones basadas en áreas débiles
    if (studentData.areasMejora && studentData.areasMejora.length > 0) {
      for (const area of studentData.areasMejora.slice(0, 3)) {
        recommendations.push({
          priority: 'high' as const,
          type: 'study' as const,
          specialty: area,
          description: `Reforzar conocimientos en ${area}`,
          estimatedTime: 60
        });
      }
    }
    
    // Recomendaciones basadas en simulacros recientes
    if (studentData.progreso.ultimoPromedio && studentData.progreso.ultimoPromedio < 70) {
      recommendations.push({
        priority: 'high' as const,
        type: 'review' as const,
        specialty: 'General',
        description: 'Revisar errores del último simulacro',
        estimatedTime: 45
      });
    }
    
    // Recomendaciones para mantener áreas fuertes
    if (studentData.areasFortaleza && studentData.areasFortaleza.length > 0) {
      const strongArea = studentData.areasFortaleza[0];
      recommendations.push({
        priority: 'low' as const,
        type: 'practice' as const,
        specialty: strongArea,
        description: `Mantener nivel en ${strongArea}`,
        estimatedTime: 30
      });
    }
    
    return recommendations;
  }

  // ==========================================================
  // FORMATTERS
  // ==========================================================

  formatScore(score: number): string {
    if (score >= 80) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Regular';
    return 'Necesita mejorar';
  }

  formatStudyTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`.trim();
    }
    return `${mins}m`;
  }

  formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    const percentage = (value / total) * 100;
    return `${Math.round(percentage)}%`;
  }

  // ==========================================================
  // ANÁLISIS Y PREDICCIONES
  // ==========================================================

  predictExamReadiness(studentData: EstudianteDashboardData): {
    readinessLevel: number; // 0-100
    status: 'not_ready' | 'preparing' | 'almost_ready' | 'ready';
    factors: {
      simulacrosCompleted: number;
      averageScore: number;
      consistencyScore: number;
      coverageScore: number;
    };
    recommendations: string[];
  } {
    const simulacrosCompleted = studentData.progreso.simulacrosCompletados || 0;
    const averageScore = studentData.progreso.promedioGeneral || 0;
    const areasStudied = (studentData.areasFortaleza?.length || 0) + (studentData.areasMejora?.length || 0);
    
    // Factores de evaluación
    const factors = {
      simulacrosCompleted: Math.min(simulacrosCompleted / 20, 1) * 25, // 25% del total
      averageScore: (averageScore / 100) * 35, // 35% del total
      consistencyScore: this.calculateConsistency(studentData) * 20, // 20% del total
      coverageScore: Math.min(areasStudied / 15, 1) * 20 // 20% del total
    };
    
    const readinessLevel = Object.values(factors).reduce((sum, factor) => sum + factor, 0);
    
    let status: 'not_ready' | 'preparing' | 'almost_ready' | 'ready';
    if (readinessLevel >= 85) status = 'ready';
    else if (readinessLevel >= 70) status = 'almost_ready';
    else if (readinessLevel >= 40) status = 'preparing';
    else status = 'not_ready';
    
    const recommendations = this.generateReadinessRecommendations(readinessLevel, factors);
    
    return {
      readinessLevel: Math.round(readinessLevel),
      status,
      factors,
      recommendations
    };
  }

  private calculateConsistency(studentData: EstudianteDashboardData): number {
    // Simulación de cálculo de consistencia basado en variabilidad de puntajes
    // En implementación real, esto vendría del backend con datos históricos
    const baseConsistency = 0.7; // Valor por defecto
    const scoreVariation = studentData.progreso.desviacionEstandar || 15;
    
    // Menos variación = mayor consistencia
    return Math.max(0, Math.min(1, baseConsistency - (scoreVariation / 100)));
  }

  private generateReadinessRecommendations(readinessLevel: number, factors: any): string[] {
    const recommendations = [];
    
    if (factors.simulacrosCompleted < 20) {
      recommendations.push('Completar más simulacros de práctica');
    }
    
    if (factors.averageScore < 25) {
      recommendations.push('Mejorar puntaje promedio con estudio dirigido');
    }
    
    if (factors.consistencyScore < 15) {
      recommendations.push('Trabajar en mantener consistencia en los puntajes');
    }
    
    if (factors.coverageScore < 15) {
      recommendations.push('Estudiar una mayor variedad de especialidades');
    }
    
    if (readinessLevel >= 85) {
      recommendations.push('¡Estás listo para el examen! Mantén el nivel con repasos');
    }
    
    return recommendations;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
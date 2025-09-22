import { BadgeLevel, BADGE_LEVELS } from '../components/RankingBadge';

export interface StudentRankingData {
  id: string;
  name: string;
  position: number;
  score: number;
  streak: number;
  specialty: string;
  isCurrentUser?: boolean;
  totalQuestions?: number;
  correctAnswers?: number;
  studyTime?: number; // en horas
  weeklyProgress?: number;
  monthlyProgress?: number;
}

export interface RankingPeriod {
  type: 'daily' | 'weekly' | 'monthly' | 'all-time';
  label: string;
  description: string;
}

export const RANKING_PERIODS: RankingPeriod[] = [
  {
    type: 'daily',
    label: 'Diario',
    description: 'Ranking basado en el progreso de hoy'
  },
  {
    type: 'weekly',
    label: 'Semanal',
    description: 'Ranking basado en el progreso de esta semana'
  },
  {
    type: 'monthly',
    label: 'Mensual',
    description: 'Ranking basado en el progreso de este mes'
  },
  {
    type: 'all-time',
    label: 'Histórico',
    description: 'Ranking general de todos los tiempos'
  }
];

class RankingService {
  /**
   * Obtiene el badge correspondiente a una posición específica
   */
  getBadgeForPosition(position: number): BadgeLevel {
    for (const badge of BADGE_LEVELS) {
      if (position >= badge.minPosition && (!badge.maxPosition || position <= badge.maxPosition)) {
        return badge;
      }
    }
    return BADGE_LEVELS[BADGE_LEVELS.length - 1];
  }

  /**
   * Calcula la posición basada en el puntaje y otros criterios
   */
  calculatePosition(score: number, streak: number, studyTime: number = 0): number {
    // Algoritmo simple para calcular posición basado en múltiples factores
    const scoreWeight = 0.7;
    const streakWeight = 0.2;
    const timeWeight = 0.1;

    const normalizedStreak = Math.min(streak / 30, 1); // Normalizar streak a máximo 30 días
    const normalizedTime = Math.min(studyTime / 200, 1); // Normalizar tiempo a máximo 200 horas

    const weightedScore = (score * scoreWeight) +
                         (normalizedStreak * 100 * streakWeight) +
                         (normalizedTime * 100 * timeWeight);

    // Simulación de posición basada en el puntaje ponderado
    if (weightedScore >= 95) return Math.floor(Math.random() * 3) + 1; // Top 3
    if (weightedScore >= 90) return Math.floor(Math.random() * 7) + 4; // Top 10
    if (weightedScore >= 85) return Math.floor(Math.random() * 40) + 11; // Top 50
    if (weightedScore >= 80) return Math.floor(Math.random() * 50) + 51; // Top 100
    if (weightedScore >= 75) return Math.floor(Math.random() * 150) + 101; // Top 250

    return Math.floor(Math.random() * 500) + 251; // Resto
  }

  /**
   * Obtiene el color del badge para un estudiante específico
   */
  getBadgeColor(position: number): string {
    const badge = this.getBadgeForPosition(position);
    return badge.color;
  }

  /**
   * Determina si un estudiante está en el podium (top 3)
   */
  isInPodium(position: number): boolean {
    return position <= 3;
  }

  /**
   * Determina si un estudiante está en un nivel elite (top 10)
   */
  isElite(position: number): boolean {
    return position <= 10;
  }

  /**
   * Genera mensaje motivacional basado en la posición
   */
  getMotivationalMessage(position: number, previousPosition?: number): string {
    const badge = this.getBadgeForPosition(position);

    if (previousPosition && position < previousPosition) {
      const improvement = previousPosition - position;
      return `¡Excelente! Has subido ${improvement} posiciones y alcanzado el nivel ${badge.name}`;
    }

    if (position === 1) {
      return '🎉 ¡Felicidades! Eres el #1 nacional. ¡Sigue así!';
    } else if (position <= 3) {
      return `🏆 ¡Increíble! Estás en el podium nacional con nivel ${badge.name}`;
    } else if (position <= 10) {
      return `💎 ¡Excelente trabajo! Estás en el top 10 con nivel ${badge.name}`;
    } else if (position <= 50) {
      return `🥇 ¡Muy bien! Estás en el top 50 con nivel ${badge.name}`;
    } else if (position <= 100) {
      return `🥈 ¡Buen trabajo! Estás en el top 100 con nivel ${badge.name}`;
    } else if (position <= 250) {
      return `🥉 ¡Sigue así! Estás en el top 250 con nivel ${badge.name}`;
    } else {
      return `📚 Continúa estudiando para mejorar tu posición actual de nivel ${badge.name}`;
    }
  }

  /**
   * Genera datos de ranking simulados para desarrollo/testing
   */
  generateMockRankingData(count: number = 25, currentUserPosition: number = 23): StudentRankingData[] {
    const specialties = [
      'Medicina Interna', 'Cirugía General', 'Pediatría', 'Ginecología',
      'Medicina Familiar', 'Neurología', 'Cardiología', 'Dermatología',
      'Ortopedia', 'Psiquiatría', 'Radiología', 'Anestesiología',
      'Urología', 'Oftalmología', 'Medicina General'
    ];

    const firstNames = [
      'Ana', 'Carlos', 'María', 'Diego', 'Laura', 'Roberto', 'Patricia',
      'Miguel', 'Sandra', 'Fernando', 'Elena', 'Ricardo', 'Carmen',
      'José', 'Liliana', 'Andrés', 'Gloria', 'Héctor', 'Mónica', 'Raúl',
      'Cristina', 'Alberto', 'Verónica', 'Óscar', 'Gabriela'
    ];

    const lastNames = [
      'Martínez', 'López', 'Rodríguez', 'Hernández', 'García', 'Silva',
      'González', 'Torres', 'Morales', 'Cruz', 'Vázquez', 'Jiménez',
      'Ruiz', 'Mendoza', 'Castro', 'Romero', 'Flores', 'Vargas',
      'Delgado', 'Aguilar', 'Peña', 'Sánchez', 'Ortiz', 'Luna', 'Ramírez'
    ];

    const students: StudentRankingData[] = [];

    for (let i = 1; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const specialty = specialties[Math.floor(Math.random() * specialties.length)];

      // Generar puntajes más altos para posiciones mejores
      const baseScore = 99 - (i - 1) * 0.5 - Math.random() * 2;
      const score = Math.max(75, Math.min(99, baseScore));

      const streak = Math.floor(Math.random() * 30) + 1;
      const studyTime = Math.floor(Math.random() * 200) + 50;

      students.push({
        id: `student-${i}`,
        name: i === currentUserPosition ? 'Tú' : `${firstName} ${lastName}`,
        position: i,
        score: Math.round(score * 10) / 10,
        streak,
        specialty,
        isCurrentUser: i === currentUserPosition,
        totalQuestions: Math.floor(Math.random() * 1000) + 500,
        correctAnswers: Math.floor(score * 10),
        studyTime,
        weeklyProgress: Math.floor(Math.random() * 20) + 5,
        monthlyProgress: Math.floor(Math.random() * 50) + 20
      });
    }

    return students;
  }

  /**
   * Filtra ranking por especialidad
   */
  filterBySpecialty(students: StudentRankingData[], specialty: string): StudentRankingData[] {
    if (specialty === 'all') return students;

    return students
      .filter(student => student.specialty === specialty)
      .map((student, index) => ({ ...student, position: index + 1 }));
  }

  /**
   * Obtiene estadísticas generales del ranking
   */
  getRankingStats(students: StudentRankingData[]): {
    totalStudents: number;
    averageScore: number;
    topSpecialties: Array<{ specialty: string; count: number; avgScore: number }>;
    currentUserStats?: {
      position: number;
      percentile: number;
      badge: BadgeLevel;
    };
  } {
    const totalStudents = students.length;
    const averageScore = students.reduce((sum, s) => sum + s.score, 0) / totalStudents;

    const currentUser = students.find(s => s.isCurrentUser);

    // Agrupar por especialidad
    const specialtyGroups = students.reduce((acc, student) => {
      if (!acc[student.specialty]) {
        acc[student.specialty] = [];
      }
      acc[student.specialty].push(student);
      return acc;
    }, {} as Record<string, StudentRankingData[]>);

    const topSpecialties = Object.entries(specialtyGroups)
      .map(([specialty, studentsInSpecialty]) => ({
        specialty,
        count: studentsInSpecialty.length,
        avgScore: studentsInSpecialty.reduce((sum, s) => sum + s.score, 0) / studentsInSpecialty.length
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    const currentUserStats = currentUser ? {
      position: currentUser.position,
      percentile: Math.round((1 - (currentUser.position - 1) / totalStudents) * 100),
      badge: this.getBadgeForPosition(currentUser.position)
    } : undefined;

    return {
      totalStudents,
      averageScore: Math.round(averageScore * 10) / 10,
      topSpecialties,
      currentUserStats
    };
  }
}

export const rankingService = new RankingService();
export default rankingService;
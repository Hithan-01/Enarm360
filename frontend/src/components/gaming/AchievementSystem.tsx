import React from 'react';
import { Box, Text, Stack, Group, Badge, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
  IconFlame,
  IconBrain,
  IconTarget,
  IconCalendar,
  IconTrophy,
  IconBolt,
  IconStar,
  IconHeart,
  IconClock,
  IconAward,
  IconMedal,
  IconCrown,
  IconRocket,
  IconSun,
  IconMoon,
  IconUsers,
  IconBook,
  IconChartBar,
  IconShield,
  IconSword
} from '@tabler/icons-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'study' | 'performance' | 'social' | 'special';
  requirements: {
    type: string;
    value: number;
    timeframe?: string;
  };
  xpReward: number;
  unlockedAt?: Date;
  progress?: number;
}

const ACHIEVEMENT_CATEGORIES = {
  study: { name: 'Estudio', color: '#3b82f6', icon: IconBook },
  performance: { name: 'Rendimiento', color: '#10b981', icon: IconTarget },
  social: { name: 'Social', color: '#8b5cf6', icon: IconUsers },
  special: { name: 'Especial', color: '#f59e0b', icon: IconStar }
};

const RARITY_CONFIG = {
  common: { name: 'Común', color: '#6b7280', glow: 'rgba(107, 114, 128, 0.3)' },
  rare: { name: 'Raro', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.3)' },
  epic: { name: 'Épico', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
  legendary: { name: 'Legendario', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }
};

const ACHIEVEMENTS: Achievement[] = [
  // Study Achievements
  {
    id: 'first_session',
    name: 'Primer Paso',
    description: 'Completa tu primera sesión de estudio',
    icon: IconRocket,
    color: '#3b82f6',
    rarity: 'common',
    category: 'study',
    requirements: { type: 'sessions_completed', value: 1 },
    xpReward: 50
  },
  {
    id: 'fire_streak',
    name: 'Racha de Fuego',
    description: 'Estudia 7 días consecutivos',
    icon: IconFlame,
    color: '#ef4444',
    rarity: 'rare',
    category: 'study',
    requirements: { type: 'daily_streak', value: 7 },
    xpReward: 200
  },
  {
    id: 'unstoppable',
    name: 'Imparable',
    description: 'Mantén una racha de 30 días',
    icon: IconBolt,
    color: '#f59e0b',
    rarity: 'epic',
    category: 'study',
    requirements: { type: 'daily_streak', value: 30 },
    xpReward: 500
  },
  {
    id: 'early_bird',
    name: 'Madrugador',
    description: 'Estudia antes de las 6:00 AM',
    icon: IconSun,
    color: '#fbbf24',
    rarity: 'rare',
    category: 'study',
    requirements: { type: 'early_session', value: 1, timeframe: 'before_6am' },
    xpReward: 150
  },
  {
    id: 'night_owl',
    name: 'Búho Nocturno',
    description: 'Estudia después de las 11:00 PM',
    icon: IconMoon,
    color: '#6366f1',
    rarity: 'rare',
    category: 'study',
    requirements: { type: 'late_session', value: 1, timeframe: 'after_11pm' },
    xpReward: 150
  },
  {
    id: 'marathon',
    name: 'Maratonista',
    description: 'Estudia 6 horas en un solo día',
    icon: IconClock,
    color: '#059669',
    rarity: 'epic',
    category: 'study',
    requirements: { type: 'daily_hours', value: 6 },
    xpReward: 300
  },

  // Performance Achievements
  {
    id: 'perfect_score',
    name: 'Puntuación Perfecta',
    description: 'Obtén 100% en un simulacro',
    icon: IconTarget,
    color: '#10b981',
    rarity: 'epic',
    category: 'performance',
    requirements: { type: 'perfect_exam', value: 1 },
    xpReward: 400
  },
  {
    id: 'specialist',
    name: 'Especialista',
    description: 'Alcanza 90% de precisión en una especialidad',
    icon: IconBrain,
    color: '#8b5cf6',
    rarity: 'rare',
    category: 'performance',
    requirements: { type: 'specialty_accuracy', value: 90 },
    xpReward: 250
  },
  {
    id: 'rapid_fire',
    name: 'Fuego Rápido',
    description: 'Responde 100 preguntas en una hora',
    icon: IconBolt,
    color: '#f59e0b',
    rarity: 'rare',
    category: 'performance',
    requirements: { type: 'questions_per_hour', value: 100 },
    xpReward: 200
  },
  {
    id: 'improvement',
    name: 'En Ascenso',
    description: 'Mejora tu puntuación promedio en 10 puntos',
    icon: IconChartBar,
    color: '#06b6d4',
    rarity: 'common',
    category: 'performance',
    requirements: { type: 'score_improvement', value: 10 },
    xpReward: 100
  },

  // Social Achievements
  {
    id: 'team_player',
    name: 'Jugador de Equipo',
    description: 'Participa en 5 discusiones del foro',
    icon: IconUsers,
    color: '#8b5cf6',
    rarity: 'common',
    category: 'social',
    requirements: { type: 'forum_posts', value: 5 },
    xpReward: 75
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Ayuda a 10 estudiantes con sus dudas',
    icon: IconHeart,
    color: '#f43f5e',
    rarity: 'rare',
    category: 'social',
    requirements: { type: 'help_students', value: 10 },
    xpReward: 300
  },

  // Special Achievements
  {
    id: 'first_blood',
    name: 'Primera Sangre',
    description: 'Sé el primero en completar un challenge semanal',
    icon: IconSword,
    color: '#dc2626',
    rarity: 'legendary',
    category: 'special',
    requirements: { type: 'first_weekly_challenge', value: 1 },
    xpReward: 1000
  },
  {
    id: 'champion',
    name: 'Campeón',
    description: 'Alcanza el puesto #1 en el ranking nacional',
    icon: IconCrown,
    color: '#fbbf24',
    rarity: 'legendary',
    category: 'special',
    requirements: { type: 'national_rank', value: 1 },
    xpReward: 2000
  },
  {
    id: 'defender',
    name: 'Defensor',
    description: 'Mantén tu posición en el top 10 por 7 días',
    icon: IconShield,
    color: '#059669',
    rarity: 'epic',
    category: 'special',
    requirements: { type: 'maintain_top10', value: 7 },
    xpReward: 750
  }
];

interface AchievementCardProps {
  achievement: Achievement;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  unlocked = false,
  size = 'md',
  showProgress = false
}) => {
  const { colorScheme } = useMantineColorScheme();
  const IconComponent = achievement.icon;
  const rarity = RARITY_CONFIG[achievement.rarity];

  const sizeMap = {
    sm: { icon: 20, padding: '12px', title: 'sm' },
    md: { icon: 28, padding: '16px', title: 'md' },
    lg: { icon: 36, padding: '20px', title: 'lg' }
  };

  const currentSize = sizeMap[size];

  return (
    <Tooltip
      label={
        <Stack gap="xs">
          <Text size="sm" fw={600}>{achievement.name}</Text>
          <Text size="xs">{achievement.description}</Text>
          <Group gap="xs">
            <Badge size="xs" color={rarity.color}>{rarity.name}</Badge>
            <Text size="xs">+{achievement.xpReward} XP</Text>
          </Group>
        </Stack>
      }
      multiline
      w={250}
    >
      <Box
        style={{
          background: unlocked
            ? colorScheme === 'dark'
              ? 'rgba(30, 41, 59, 0.9)'
              : 'rgba(255, 255, 255, 0.9)'
            : colorScheme === 'dark'
              ? 'rgba(30, 41, 59, 0.5)'
              : 'rgba(255, 255, 255, 0.5)',
          border: unlocked
            ? `2px solid ${rarity.color}`
            : `2px solid ${colorScheme === 'dark' ? '#374151' : '#d1d5db'}`,
          borderRadius: '12px',
          padding: currentSize.padding,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          opacity: unlocked ? 1 : 0.6,
          filter: unlocked ? 'none' : 'grayscale(1)',
        }}
        onMouseEnter={(e) => {
          if (unlocked) {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            e.currentTarget.style.boxShadow = `0 10px 30px ${rarity.glow}`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Rarity glow effect for unlocked achievements */}
        {unlocked && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${rarity.color}, ${rarity.color}80, ${rarity.color})`,
              borderRadius: '12px 12px 0 0',
            }}
          />
        )}

        <Stack gap="sm" align="center">
          <Box
            style={{
              backgroundColor: unlocked
                ? `${rarity.color}20`
                : colorScheme === 'dark' ? '#374151' : '#d1d5db',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent
              size={currentSize.icon}
              style={{
                color: unlocked ? rarity.color : colorScheme === 'dark' ? '#6b7280' : '#9ca3af'
              }}
            />
          </Box>

          <Text
            size={currentSize.title as any}
            fw={600}
            ta="center"
            style={{
              color: unlocked
                ? colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
                : colorScheme === 'dark' ? '#6b7280' : '#9ca3af',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}
          >
            {achievement.name}
          </Text>

          {unlocked && (
            <Badge
              size="xs"
              style={{
                backgroundColor: `${rarity.color}20`,
                color: rarity.color,
                border: `1px solid ${rarity.color}`,
              }}
            >
              +{achievement.xpReward} XP
            </Badge>
          )}
        </Stack>
      </Box>
    </Tooltip>
  );
};

interface AchievementGridProps {
  achievements: Achievement[];
  unlockedIds: string[];
  filterCategory?: string;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  unlockedIds,
  filterCategory
}) => {
  const filteredAchievements = filterCategory && filterCategory !== 'all'
    ? achievements.filter(a => a.category === filterCategory)
    : achievements;

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        width: '100%',
      }}
    >
      {filteredAchievements.map(achievement => (
        <AchievementCard
          key={achievement.id}
          achievement={achievement}
          unlocked={unlockedIds.includes(achievement.id)}
          size="md"
        />
      ))}
    </Box>
  );
};

export default AchievementCard;
export { AchievementGrid, ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES };
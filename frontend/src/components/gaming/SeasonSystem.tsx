import React from 'react';
import { Box, Text, Stack, Group, Progress, Badge, useMantineColorScheme } from '@mantine/core';
import { IconCalendar, IconTrophy, IconStar, IconFlame } from '@tabler/icons-react';

export interface Season {
  id: string;
  name: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  rewards: SeasonReward[];
  specialEvents: SeasonEvent[];
  color: string;
  bgColor: string;
  isActive: boolean;
}

export interface SeasonReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'rank' | 'xp' | 'achievement' | 'special';
    value: any;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SeasonEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  bonusXP: number;
  specialRules: string[];
}

export interface XPSource {
  action: string;
  baseXP: number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  multipliers?: {
    condition: string;
    multiplier: number;
  }[];
}

export const XP_SOURCES: XPSource[] = [
  {
    action: 'correct_answer',
    baseXP: 10,
    description: 'Respuesta correcta en simulacro',
    icon: IconStar,
    color: '#10b981'
  },
  {
    action: 'perfect_exam',
    baseXP: 500,
    description: 'Simulacro con 100% de aciertos',
    icon: IconTrophy,
    color: '#f59e0b'
  },
  {
    action: 'daily_goal',
    baseXP: 100,
    description: 'Completar meta diaria de estudio',
    icon: IconFlame,
    color: '#ef4444'
  },
  {
    action: 'streak_bonus',
    baseXP: 50,
    description: 'Bonus por racha de días consecutivos',
    icon: IconFlame,
    color: '#f97316',
    multipliers: [
      { condition: 'streak_7_days', multiplier: 2 },
      { condition: 'streak_14_days', multiplier: 3 },
      { condition: 'streak_30_days', multiplier: 5 }
    ]
  },
  {
    action: 'first_place_weekly',
    baseXP: 1000,
    description: 'Primer lugar en ranking semanal',
    icon: IconTrophy,
    color: '#fbbf24'
  },
  {
    action: 'improvement_bonus',
    baseXP: 200,
    description: 'Mejora significativa en puntuación',
    icon: IconStar,
    color: '#06b6d4'
  }
];

export const CURRENT_SEASON: Season = {
  id: 'season_fall_2024',
  name: 'Temporada Otoño 2024',
  theme: 'Cosecha del Conocimiento',
  startDate: new Date('2024-09-01'),
  endDate: new Date('2024-11-30'),
  color: '#f97316',
  bgColor: 'rgba(249, 115, 22, 0.1)',
  isActive: true,
  rewards: [
    {
      id: 'bronze_trophy',
      name: 'Trofeo de Bronce',
      description: 'Alcanza liga Bronze',
      icon: '🥉',
      requirement: { type: 'rank', value: 'bronze' },
      rarity: 'common'
    },
    {
      id: 'silver_trophy',
      name: 'Trofeo de Plata',
      description: 'Alcanza liga Silver',
      icon: '🥈',
      requirement: { type: 'rank', value: 'silver' },
      rarity: 'rare'
    },
    {
      id: 'gold_trophy',
      name: 'Trofeo de Oro',
      description: 'Alcanza liga Gold',
      icon: '🥇',
      requirement: { type: 'rank', value: 'gold' },
      rarity: 'epic'
    },
    {
      id: 'legend_crown',
      name: 'Corona de Leyenda',
      description: 'Alcanza liga Legend',
      icon: '👑',
      requirement: { type: 'rank', value: 'legend' },
      rarity: 'legendary'
    },
    {
      id: 'season_master',
      name: 'Maestro de Temporada',
      description: 'Acumula 15,000 XP en la temporada',
      icon: '⭐',
      requirement: { type: 'xp', value: 15000 },
      rarity: 'epic'
    }
  ],
  specialEvents: [
    {
      id: 'double_xp_weekend',
      name: 'Fin de Semana de Doble XP',
      description: 'XP doble en todos los simulacros',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-10-17'),
      bonusXP: 2,
      specialRules: ['Doble XP en simulacros', 'Bonus adicional por rachas']
    }
  ]
};

function calculateXP(action: string, context: any = {}): number {
  const xpSource = XP_SOURCES.find(source => source.action === action);
  if (!xpSource) return 0;

  let xp = xpSource.baseXP;

  // Aplicar multiplicadores
  if (xpSource.multipliers) {
    for (const multiplier of xpSource.multipliers) {
      if (context[multiplier.condition]) {
        xp *= multiplier.multiplier;
      }
    }
  }

  // Aplicar bonus de temporada
  if (CURRENT_SEASON.isActive && context.seasonBonus) {
    xp *= context.seasonBonus;
  }

  return Math.floor(xp);
}

interface SeasonProgressProps {
  currentXP: number;
  seasonStartXP: number;
  targetXP: number;
  daysRemaining: number;
}

const SeasonProgress: React.FC<SeasonProgressProps> = ({
  currentXP,
  seasonStartXP,
  targetXP,
  daysRemaining
}) => {
  const { colorScheme } = useMantineColorScheme();
  const seasonXP = currentXP - seasonStartXP;
  const progress = Math.min((seasonXP / targetXP) * 100, 100);
  const xpPerDay = daysRemaining > 0 ? Math.ceil((targetXP - seasonXP) / daysRemaining) : 0;

  return (
    <Box
      style={{
        background: colorScheme === 'dark'
          ? 'rgba(30, 41, 59, 0.7)'
          : 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${CURRENT_SEASON.color}`,
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Season header */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${CURRENT_SEASON.color}, ${CURRENT_SEASON.color}80, ${CURRENT_SEASON.color})`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <Box
              style={{
                backgroundColor: CURRENT_SEASON.bgColor,
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCalendar size={24} style={{ color: CURRENT_SEASON.color }} />
            </Box>
            <Stack gap={2}>
              <Text
                size="lg"
                fw={700}
                style={{
                  color: CURRENT_SEASON.color,
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                {CURRENT_SEASON.name}
              </Text>
              <Text
                size="sm"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {CURRENT_SEASON.theme}
              </Text>
            </Stack>
          </Group>

          <Badge
            size="lg"
            style={{
              backgroundColor: `${CURRENT_SEASON.color}20`,
              color: CURRENT_SEASON.color,
              border: `1px solid ${CURRENT_SEASON.color}`,
            }}
          >
            {daysRemaining} días restantes
          </Badge>
        </Group>

        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Progreso de temporada
            </Text>
            <Text size="sm" fw={600} style={{ color: CURRENT_SEASON.color }}>
              {seasonXP.toLocaleString()} / {targetXP.toLocaleString()} XP
            </Text>
          </Group>

          <Progress
            value={progress}
            color={CURRENT_SEASON.color}
            size="lg"
            radius="xl"
            style={{
              '& .mantine-Progress-bar': {
                background: `linear-gradient(90deg, ${CURRENT_SEASON.color}, ${CURRENT_SEASON.color}80)`,
              }
            }}
          />

          <Group justify="space-between">
            <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              {progress.toFixed(1)}% completado
            </Text>
            {xpPerDay > 0 && (
              <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                {xpPerDay.toLocaleString()} XP/día necesario
              </Text>
            )}
          </Group>
        </Stack>

        {/* Season rewards preview */}
        <Box>
          <Text
            size="sm"
            fw={600}
            mb="xs"
            style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}
          >
            Recompensas de temporada
          </Text>
          <Group gap="xs">
            {CURRENT_SEASON.rewards.slice(0, 4).map(reward => (
              <Box
                key={reward.id}
                style={{
                  backgroundColor: colorScheme === 'dark' ? '#374151' : '#f3f4f6',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '20px',
                  textAlign: 'center',
                  minWidth: '40px',
                  opacity: seasonXP >= (reward.requirement.value || 0) ? 1 : 0.5,
                }}
              >
                {reward.icon}
              </Box>
            ))}
          </Group>
        </Box>
      </Stack>
    </Box>
  );
};

interface XPGainAnimationProps {
  amount: number;
  source: string;
  onComplete?: () => void;
}

const XPGainAnimation: React.FC<XPGainAnimationProps> = ({
  amount,
  source,
  onComplete
}) => {
  const xpSource = XP_SOURCES.find(s => s.action === source);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Box
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'xpGain 2s ease-out forwards',
      }}
    >
      <style>
        {`
          @keyframes xpGain {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.5) translateY(0);
            }
            20% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.2) translateY(-20px);
            }
            80% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) translateY(-40px);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8) translateY(-60px);
            }
          }
        `}
      </style>
      <Box
        style={{
          background: `linear-gradient(135deg, ${xpSource?.color || '#10b981'}, ${xpSource?.color || '#10b981'}80)`,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: `0 10px 30px ${xpSource?.color || '#10b981'}40`,
          textAlign: 'center',
        }}
      >
        <Text size="lg" fw={700} style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
          +{amount} XP
        </Text>
        <Text size="sm" style={{ opacity: 0.9 }}>
          {xpSource?.description || source}
        </Text>
      </Box>
    </Box>
  );
};

export default SeasonProgress;
export { XPGainAnimation, calculateXP };
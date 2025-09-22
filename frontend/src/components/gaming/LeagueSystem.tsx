import React from 'react';
import { Box, Text, Stack, Group, Progress, useMantineColorScheme } from '@mantine/core';
import { IconStar, IconFlame, IconBolt, IconCrown } from '@tabler/icons-react';

// Importar badges PNG reales
import bronzeBadge from '../../assets/badges/bronze.png';
import silverBadge from '../../assets/badges/silver.png';
import goldBadge from '../../assets/badges/gold.png';
import diamondBadge from '../../assets/badges/diamond.png';
import crimsonBadge from '../../assets/badges/crimson.png';
import iridescentBadge from '../../assets/badges/iridescent.png';
import top250Badge from '../../assets/badges/top250.png';

export interface League {
  id: string;
  name: string;
  tier: number;
  color: string;
  bgColor: string;
  minXP: number;
  maxXP?: number;
  icon: React.ComponentType<any>;
  badgeImage: string;
  description: string;
  perks: string[];
  divisionCount: number;
}

const LEAGUE_SYSTEM: League[] = [
  {
    id: 'legend',
    name: 'Legend',
    tier: 7,
    color: '#ff6b6b',
    bgColor: 'rgba(255, 107, 107, 0.1)',
    minXP: 10000,
    icon: IconCrown,
    badgeImage: iridescentBadge,
    description: 'Elite de México - Top 10 nacional',
    perks: ['Acceso VIP a todas las funciones', 'Sesiones exclusivas con especialistas', 'Badge personalizado'],
    divisionCount: 1
  },
  {
    id: 'master',
    name: 'Master',
    tier: 6,
    color: '#4c6ef5',
    bgColor: 'rgba(76, 110, 245, 0.1)',
    minXP: 7500,
    maxXP: 9999,
    icon: IconStar,
    badgeImage: crimsonBadge,
    description: 'Maestros del conocimiento - Top 50',
    perks: ['Análisis de rendimiento avanzado', 'Predicciones IA personalizadas', 'Foros exclusivos'],
    divisionCount: 3
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tier: 5,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    minXP: 5000,
    maxXP: 7499,
    icon: IconBolt,
    badgeImage: diamondBadge,
    description: 'Diamantes en bruto - Top 100',
    perks: ['Simulacros premium ilimitados', 'Reportes detallados', 'Challenges exclusivos'],
    divisionCount: 4
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tier: 4,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    minXP: 3000,
    maxXP: 4999,
    icon: IconFlame,
    badgeImage: goldBadge,
    description: 'Aspirantes de elite - Top 250',
    perks: ['Estadísticas avanzadas', 'Comparativas detalladas', 'Metas personalizadas'],
    divisionCount: 4
  },
  {
    id: 'gold',
    name: 'Gold',
    tier: 3,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    minXP: 1500,
    maxXP: 2999,
    icon: IconStar,
    badgeImage: silverBadge,
    description: 'Estudiantes dorados - Top 500',
    perks: ['Rankings por especialidad', 'Análisis de fortalezas', 'Duelos semanales'],
    divisionCount: 4
  },
  {
    id: 'silver',
    name: 'Silver',
    tier: 2,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    minXP: 500,
    maxXP: 1499,
    icon: IconBolt,
    badgeImage: bronzeBadge,
    description: 'Plata en ascenso - Top 1000',
    perks: ['Tracking de progreso', 'Simulacros regulares', 'Comunidad activa'],
    divisionCount: 4
  },
  {
    id: 'bronze',
    name: 'Bronze',
    tier: 1,
    color: '#cd7f32',
    bgColor: 'rgba(205, 127, 50, 0.1)',
    minXP: 0,
    maxXP: 499,
    icon: IconFlame,
    badgeImage: top250Badge,
    description: 'Iniciando el camino',
    perks: ['Acceso básico', 'Guías de estudio', 'Comunidad de apoyo'],
    divisionCount: 4
  }
];

export function getLeagueForXP(xp: number): { league: League; division: number } {
  for (const league of LEAGUE_SYSTEM) {
    if (xp >= league.minXP && (!league.maxXP || xp <= league.maxXP)) {
      // Calcular división dentro de la liga
      if (league.divisionCount === 1) {
        return { league, division: 1 };
      }

      const xpRange = (league.maxXP || league.minXP + 1000) - league.minXP;
      const xpInLeague = xp - league.minXP;
      const divisionSize = xpRange / league.divisionCount;
      const division = Math.max(1, Math.min(league.divisionCount, Math.ceil((xpInLeague + 1) / divisionSize)));

      return { league, division };
    }
  }

  // Default a Bronze IV
  return { league: LEAGUE_SYSTEM[LEAGUE_SYSTEM.length - 1], division: 4 };
}

export function getXPToNextRank(currentXP: number): { needed: number; total: number; isMaxRank: boolean } {
  const { league, division } = getLeagueForXP(currentXP);

  // Si está en Legend, ya es max rank
  if (league.id === 'legend') {
    return { needed: 0, total: 0, isMaxRank: true };
  }

  // Si está en la división más alta de la liga
  if (division === league.divisionCount) {
    // Buscar la siguiente liga
    const nextLeagueIndex = LEAGUE_SYSTEM.findIndex(l => l.id === league.id) - 1;
    if (nextLeagueIndex >= 0) {
      const nextLeague = LEAGUE_SYSTEM[nextLeagueIndex];
      return {
        needed: nextLeague.minXP - currentXP,
        total: nextLeague.minXP - league.minXP,
        isMaxRank: false
      };
    }
  } else {
    // Calcular XP para siguiente división
    const xpRange = (league.maxXP || league.minXP + 1000) - league.minXP;
    const divisionSize = xpRange / league.divisionCount;
    const nextDivisionXP = league.minXP + (division * divisionSize);

    return {
      needed: Math.ceil(nextDivisionXP - currentXP),
      total: Math.ceil(divisionSize),
      isMaxRank: false
    };
  }

  return { needed: 0, total: 0, isMaxRank: true };
}

interface LeagueDisplayProps {
  xp: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const LeagueDisplay: React.FC<LeagueDisplayProps> = ({
  xp,
  showProgress = true,
  size = 'md',
  animated = true
}) => {
  const { colorScheme } = useMantineColorScheme();
  const { league, division } = getLeagueForXP(xp);
  const { needed, total, isMaxRank } = getXPToNextRank(xp);
  const IconComponent = league.icon;

  const sizeMap = {
    sm: { icon: 20, title: 'md', progress: 'sm' },
    md: { icon: 28, title: 'lg', progress: 'md' },
    lg: { icon: 36, title: 'xl', progress: 'lg' }
  };

  const currentSize = sizeMap[size];

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];
  const divisionText = league.divisionCount > 1 ? ` ${romanNumerals[division - 1] || division}` : '';

  return (
    <Box
      style={{
        background: colorScheme === 'dark'
          ? 'rgba(30, 41, 59, 0.7)'
          : 'rgba(255, 255, 255, 0.9)',
        border: `2px solid ${league.color}`,
        borderRadius: '16px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: animated ? 'all 0.3s ease' : undefined,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (animated) {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = `0 10px 30px ${league.color}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (animated) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Background glow effect */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${league.color}, ${league.color}80, ${league.color})`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      <Stack gap="md">
        <Group gap="md" align="center">
          <Box
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={league.badgeImage}
              alt={league.name}
              style={{
                width: currentSize.icon + 8,
                height: currentSize.icon + 8,
                objectFit: 'contain',
                filter: `drop-shadow(0 4px 12px ${league.color}40)`,
                transition: animated ? 'all 0.3s ease' : undefined,
              }}
            />

            {/* Tier indicator */}
            <Box
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: league.color,
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                boxShadow: `0 2px 8px ${league.color}40`,
              }}
            >
              {league.tier}
            </Box>
          </Box>

          <Stack gap={2}>
            <Text
              size={currentSize.title as any}
              fw={700}
              style={{
                color: league.color,
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}
            >
              {league.name}{divisionText}
            </Text>
            <Text
              size="sm"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {xp.toLocaleString()} XP
            </Text>
          </Stack>
        </Group>

        {showProgress && !isMaxRank && (
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                Progreso al siguiente rango
              </Text>
              <Text size="xs" fw={600} style={{ color: league.color }}>
                {needed.toLocaleString()} XP restante
              </Text>
            </Group>
            <Progress
              value={((total - needed) / total) * 100}
              color={league.color}
              size={currentSize.progress as any}
              radius="xl"
              style={{
                '& .mantine-Progress-bar': {
                  background: `linear-gradient(90deg, ${league.color}, ${league.color}80)`,
                }
              }}
            />
          </Stack>
        )}

        {isMaxRank && (
          <Box
            style={{
              backgroundColor: `${league.color}20`,
              border: `1px solid ${league.color}`,
              borderRadius: '8px',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            <Text
              size="xs"
              fw={600}
              style={{
                color: league.color,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              🏆 RANGO MÁXIMO ALCANZADO
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default LeagueDisplay;
export { LEAGUE_SYSTEM };
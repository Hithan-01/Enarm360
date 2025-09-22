import React from 'react';
import { Box, Text, Stack, useMantineColorScheme } from '@mantine/core';

// Importar todas las imágenes de badges reales
import bronzeBadge from '../assets/badges/bronze.png';
import silverBadge from '../assets/badges/silver.png';
import goldBadge from '../assets/badges/gold.png';
import diamondBadge from '../assets/badges/diamond.png';
import crimsonBadge from '../assets/badges/crimson.png';
import iridescentBadge from '../assets/badges/iridescent.png';
import top250Badge from '../assets/badges/top250.png';

export interface BadgeLevel {
  name: string;
  image: string;
  color: string;
  backgroundColor: string;
  minPosition: number;
  maxPosition?: number;
  description: string;
}

const BADGE_LEVELS: BadgeLevel[] = [
  {
    name: 'Primer Lugar',
    image: iridescentBadge,
    color: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    minPosition: 1,
    maxPosition: 1,
    description: 'Campeón Nacional'
  },
  {
    name: 'Segundo Lugar',
    image: crimsonBadge,
    color: '#dc2626',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    minPosition: 2,
    maxPosition: 2,
    description: 'Subcampeón Nacional'
  },
  {
    name: 'Tercer Lugar',
    image: diamondBadge,
    color: '#06b6d4',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    minPosition: 3,
    maxPosition: 3,
    description: 'Tercer Lugar Nacional'
  }
];

export function getBadgeForPosition(position: number): BadgeLevel | null {
  for (const badge of BADGE_LEVELS) {
    if (position >= badge.minPosition && (!badge.maxPosition || position <= badge.maxPosition)) {
      return badge;
    }
  }
  return null; // Solo top 3 tienen insignias especiales
}

export function hasSpecialBadge(position: number): boolean {
  return position >= 1 && position <= 3;
}

interface RankingBadgeProps {
  position: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDescription?: boolean;
  showPosition?: boolean;
  showBadgeName?: boolean;
  animated?: boolean;
}

const RankingBadge: React.FC<RankingBadgeProps> = ({
  position,
  size = 'md',
  showDescription = false,
  showPosition = true,
  showBadgeName = true,
  animated = true
}) => {
  const { colorScheme } = useMantineColorScheme();
  const badge = getBadgeForPosition(position);

  // Si no tiene badge especial, no renderizar nada o mostrar solo la posición
  if (!badge) {
    if (showPosition) {
      return (
        <Box
          style={{
            width: size === 'xl' ? 128 : size === 'lg' ? 88 : size === 'md' ? 64 : 48,
            height: size === 'xl' ? 128 : size === 'lg' ? 88 : size === 'md' ? 64 : 48,
            borderRadius: '12px',
            backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.5)',
            border: `2px solid ${colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.8)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: animated ? 'all 0.3s ease' : undefined,
          }}
        >
          <Stack gap={2} align="center">
            <Text fw={700} style={{
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              fontFamily: 'Space Grotesk',
              fontSize: size === 'xl' ? '1.5rem' : size === 'lg' ? '1.2rem' : '1rem'
            }}>
              #{position}
            </Text>
            <Text size="xs" c="dimmed">Posición</Text>
          </Stack>
        </Box>
      );
    }
    return null;
  }

  const sizeMap = {
    sm: { badge: 48, text: 'sm' },
    md: { badge: 64, text: 'md' },
    lg: { badge: 88, text: 'lg' },
    xl: { badge: 128, text: 'xl' }
  };

  const currentSize = sizeMap[size];

  return (
    <Stack gap="xs" align="center">
      <Box
        style={{
          position: 'relative',
          transition: animated ? 'all 0.3s ease' : undefined,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          if (animated) {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (animated) {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }
        }}
      >
        <img
          src={badge.image}
          alt={badge.name}
          style={{
            width: currentSize.badge,
            height: currentSize.badge,
            objectFit: 'contain',
            objectPosition: 'center',
            filter: `drop-shadow(0 6px 12px ${badge.color}60)`,
            transition: animated ? 'all 0.3s ease' : undefined,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />

        {showPosition && (
          <Box
            style={{
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: badge.backgroundColor,
              border: `2px solid ${badge.color}`,
              borderRadius: '12px',
              padding: '4px 8px',
              minWidth: '32px',
              textAlign: 'center',
            }}
          >
            <Text
              size="xs"
              fw={700}
              style={{
                color: badge.color,
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}
            >
              #{position}
            </Text>
          </Box>
        )}
      </Box>

      {showBadgeName && (
        <Stack gap={2} align="center">
          <Text
            size={currentSize.text as any}
            fw={600}
            ta="center"
            style={{
              color: badge.color,
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}
          >
            {badge.name}
          </Text>

          {showDescription && (
            <Text
              size="xs"
              ta="center"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '120px',
              }}
            >
              {badge.description}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default RankingBadge;
export { BADGE_LEVELS };
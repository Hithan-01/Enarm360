import React from 'react';
import { SimpleGrid, Box, Text, ThemeIcon, Progress, Group, useMantineColorScheme } from '@mantine/core';
import {
  IconTrendingUp,
  IconTarget,
  IconClock,
  IconAward,
  IconBrain,
  IconChartBar,
} from '@tabler/icons-react';
import GradientCard from '../ui/GradientCard';

interface StatsGridProps {
  stats?: {
    simulacrosCompletados: number;
    promedioGeneral: number;
    tiempoEstudioTotal: number;
    materiasMejor?: string;
    proximoExamen?: string;
  };
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const { colorScheme } = useMantineColorScheme();

  if (!stats) return null;

  const statItems = [
    {
      icon: IconChartBar,
      label: 'Simulacros',
      value: stats.simulacrosCompletados,
      color: '#3b82f6',
    },
    {
      icon: IconTarget,
      label: 'Promedio',
      value: `${stats.promedioGeneral}%`,
      color: stats.promedioGeneral >= 80 ? '#10b981' : '#f59e0b',
      progress: stats.promedioGeneral,
    },
    {
      icon: IconClock,
      label: 'Tiempo Estudio',
      value: `${stats.tiempoEstudioTotal}h`,
      color: '#8b5cf6',
    },
    {
      icon: IconAward,
      label: 'Mejor Materia',
      value: stats.materiasMejor || 'N/A',
      color: '#0ea5e9',
      isText: true,
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
      {statItems.map((item, index) => (
        <GradientCard
          key={index}
          p="lg"
          radius="xl"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#1e2028' : '#ffffff',
            border: colorScheme === 'dark' ? '1px solid #374151' : '1px solid #e2e8f0',
          }}
        >
          <Box style={{ textAlign: 'center' }}>
            <ThemeIcon
              size="xl"
              radius="xl"
              style={{
                backgroundColor: item.color,
                border: 'none',
                marginBottom: '1rem',
              }}
            >
              <item.icon size={28} />
            </ThemeIcon>

            <Text
              size="xl"
              fw={700}
              style={{
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                fontSize: item.isText ? '0.9rem' : '1.8rem',
                color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                marginBottom: '0.5rem',
                lineHeight: 1.2,
              }}
            >
              {item.value}
            </Text>

            <Text
              size="sm"
              c="dimmed"
              fw={500}
              style={{
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontSize: '0.8rem',
              }}
            >
              {item.label}
            </Text>

            {item.progress !== undefined && (
              <Progress
                value={item.progress}
                mt="sm"
                size="sm"
                radius="xl"
                style={{
                  '& .mantine-Progress-bar': {
                    backgroundColor: item.color,
                  },
                }}
              />
            )}
          </Box>
        </GradientCard>
      ))}
    </SimpleGrid>
  );
};

export default StatsGrid;
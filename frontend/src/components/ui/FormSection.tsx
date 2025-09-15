import React from 'react';
import { Box, Title, Group, ThemeIcon, useMantineColorScheme } from '@mantine/core';
import GradientCard from './GradientCard';

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  icon,
  children,
  iconColor = '#0ea5e9',
  gradientFrom = '#0ea5e9',
  gradientTo = '#10b981',
}) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <GradientCard
      p="xl"
      radius="xl"
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
      glowEffect
    >
      <Box>
        <Group mb="xl" style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.3)', paddingBottom: '1rem' }}>
          <ThemeIcon
            size="lg"
            radius="xl"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              border: 'none',
            }}
          >
            {icon}
          </ThemeIcon>
          <Title
            order={3}
            style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              fontWeight: 600,
              fontSize: '1.5rem',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              letterSpacing: '-0.025em',
            }}
          >
            {title}
          </Title>
        </Group>
        {children}
      </Box>
    </GradientCard>
  );
};

export default FormSection;
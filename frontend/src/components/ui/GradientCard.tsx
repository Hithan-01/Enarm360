import React from 'react';
import { Card, CardProps, Box, useMantineColorScheme } from '@mantine/core';

interface GradientCardProps extends CardProps {
  gradientFrom?: string;
  gradientTo?: string;
  borderGradient?: boolean;
  glowEffect?: boolean;
  children: React.ReactNode;
}

const GradientCard: React.FC<GradientCardProps> = ({
  gradientFrom = '#0ea5e9',
  gradientTo = '#10b981',
  borderGradient = false,
  glowEffect = false,
  children,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme();
  return (
      <Card
        {...props}
        className="medical-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
          borderRadius: '16px',
          boxShadow: colorScheme === 'dark'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          ...props.style,
        }}
      >
        {borderGradient && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: gradientFrom,
              borderRadius: '16px 16px 0 0',
            }}
          />
        )}
        <Box style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Box>
      </Card>
  );
};

export default GradientCard;
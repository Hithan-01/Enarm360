import React from 'react';
import { Switch, SwitchProps, Box, Text, useMantineColorScheme } from '@mantine/core';

interface ElegantSwitchProps extends SwitchProps {
  elegant?: boolean;
  title?: string;
  subtitle?: string;
}

const ElegantSwitch: React.FC<ElegantSwitchProps> = ({
  elegant = true,
  title,
  subtitle,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <Box
      style={{
        padding: '1rem',
        borderRadius: '12px',
        backgroundColor: 'transparent',
        border: 'none',
      }}
    >
      <Switch
        {...props}
        styles={{
          label: {
            fontFamily: 'Outfit, Inter, sans-serif',
            fontWeight: 500,
            color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
            fontSize: '0.95rem',
          },
          description: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem',
            color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
            fontStyle: 'italic',
            marginTop: '0.25rem',
          },
          track: {
            backgroundColor: props.checked ? '#0ea5e9' : (colorScheme === 'dark' ? '#374151' : '#e2e8f0'),
            border: 'none',
          },
          thumb: {
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
          ...props.styles,
        }}
      />
      {(title || subtitle) && (
        <Box mt="xs">
          {title && (
            <Text
              size="sm"
              fw={500}
              style={{ fontFamily: 'Outfit, Inter, sans-serif', color: colorScheme === 'dark' ? '#e2e8f0' : '#374151' }}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              size="xs"
              c="dimmed"
              style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}
            >
              {subtitle}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ElegantSwitch;
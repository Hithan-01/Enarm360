import React from 'react';
import { TextInput, TextInputProps, Select, SelectProps, PasswordInput, PasswordInputProps, useMantineColorScheme } from '@mantine/core';

interface BaseElegantProps {
  elegant?: boolean;
  gradientFocus?: boolean;
}

type ElegantTextInputProps = TextInputProps & BaseElegantProps;
type ElegantSelectProps = SelectProps & BaseElegantProps;
type ElegantPasswordProps = PasswordInputProps & BaseElegantProps;

const getElegantStyles = (gradientFocus = true, colorScheme = 'light') => ({
  label: {
    fontFamily: 'Outfit, Inter, sans-serif',
    fontWeight: 500,
    color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
  },
  input: {
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px',
    border: colorScheme === 'dark' ? '1px solid #374151' : '1px solid #e2e8f0',
    backgroundColor: colorScheme === 'dark' ? '#1e2028' : '#ffffff',
    color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
    fontSize: '0.95rem',
    padding: '0.75rem 1rem',
    '&:focus': {
      borderColor: '#0ea5e9',
      backgroundColor: colorScheme === 'dark' ? '#1e2028' : '#ffffff',
    },
  },
  description: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
    fontStyle: 'italic',
  },
  error: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
});

export const ElegantTextInput: React.FC<ElegantTextInputProps> = ({
  elegant = true,
  gradientFocus = true,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <TextInput
      {...props}
      styles={{
        ...getElegantStyles(gradientFocus, colorScheme),
        ...props.styles,
      }}
    />
  );
};

export const ElegantSelect: React.FC<ElegantSelectProps> = ({
  elegant = true,
  gradientFocus = true,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Select
      {...props}
      styles={{
        ...getElegantStyles(gradientFocus, colorScheme),
        ...props.styles,
      }}
    />
  );
};

export const ElegantPasswordInput: React.FC<ElegantPasswordProps> = ({
  elegant = true,
  gradientFocus = true,
  ...props
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <PasswordInput
      {...props}
      styles={{
        ...getElegantStyles(gradientFocus, colorScheme),
        ...props.styles,
      }}
    />
  );
};
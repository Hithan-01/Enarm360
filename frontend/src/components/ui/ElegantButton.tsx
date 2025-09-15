import React from 'react';
import { Button, ButtonProps } from '@mantine/core';

interface ElegantButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  elegant?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  leftSection?: React.ReactNode;
}

const ElegantButton: React.FC<ElegantButtonProps> = ({
  variant = 'primary',
  elegant = true,
  children,
  ...props
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      fontFamily: 'Outfit, Inter, sans-serif',
      fontWeight: 600,
      borderRadius: '12px',
      padding: '0.75rem 2rem',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      fontSize: '0.95rem',
      letterSpacing: '0.025em',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: '#0ea5e9',
          color: 'white',
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: '#f1f5f9',
          color: '#374151',
          border: '1px solid #e2e8f0',
        };
      case 'outline':
        return {
          ...baseStyles,
          background: 'transparent',
          color: '#0ea5e9',
          border: '2px solid #0ea5e9',
        };
      case 'ghost':
        return {
          ...baseStyles,
          background: 'transparent',
          color: '#64748b',
          border: 'none',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Button
      {...props}
      style={{
        ...getButtonStyles(),
        ...props.style,
      }}
    >
      {children}
    </Button>
  );
};

export default ElegantButton;
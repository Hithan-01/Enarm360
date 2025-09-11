import React, { useState, useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

interface MedicalButtonProps extends Omit<ButtonProps, 'onClick'> {
  rippleEffect?: boolean;
  heartbeatHover?: boolean;
  morphOnClick?: boolean;
  pulseOnLoad?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const MedicalButton: React.FC<MedicalButtonProps> = ({
  children,
  rippleEffect = true,
  heartbeatHover = true,
  morphOnClick = true,
  pulseOnLoad = false,
  onClick,
  style,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (pulseOnLoad) {
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [pulseOnLoad]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!rippleEffect || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    
    if (morphOnClick) {
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 150);
    }

    if (onClick) {
      onClick(event);
    }
  };

  const baseStyles = {
    position: 'relative' as const,
    overflow: 'hidden' as const,
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    background: props.variant === 'gradient' 
      ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
      : undefined,
    animation: isLoaded && pulseOnLoad ? 'medicalPulse 1s ease-out' : undefined,
    ...(style as any)
  };

  return (
    <>
      <style>
        {`
          @keyframes medicalPulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.7);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(14, 165, 233, 0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
            }
          }

          @keyframes heartbeat {
            0%, 100% {
              transform: scale(1);
            }
            25% {
              transform: scale(1.02);
            }
            50% {
              transform: scale(1.05);
            }
            75% {
              transform: scale(1.02);
            }
          }

          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 0.6;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }

          .medical-button:hover {
            ${heartbeatHover ? 'animation: heartbeat 1s ease-in-out infinite;' : ''}
          }

          .medical-button .ripple {
            position: absolute;
            border-radius: 50%;
            background: ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(14, 165, 233, 0.3)'};
            animation: ripple 0.6s linear;
            pointer-events: none;
          }
        `}
      </style>
      
      <Button
        ref={buttonRef}
        className="medical-button"
        onClick={handleClick}
        style={baseStyles}
        {...props}
      >
        {children}
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="ripple"
            style={{
              left: ripple.x - 15,
              top: ripple.y - 15,
              width: 30,
              height: 30,
            }}
          />
        ))}
      </Button>
    </>
  );
};

export default MedicalButton;
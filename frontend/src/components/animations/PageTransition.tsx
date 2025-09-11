import React, { useState, useEffect } from 'react';
import { Box } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

interface PageTransitionProps {
  children: React.ReactNode;
  duration?: number;
  type?: 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'medical';
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  duration = 600,
  type = 'medical'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const getTransitionStyles = () => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      width: '100%',
      height: '100%'
    };

    switch (type) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0,
        };
      
      case 'slideUp':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        };
      
      case 'slideLeft':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        };
      
      case 'scale':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        };
      
      case 'medical':
        return {
          ...baseStyle,
          opacity: isVisible ? 1 : 0,
          transform: isVisible 
            ? 'translateY(0) scale(1) rotateX(0deg)' 
            : 'translateY(20px) scale(0.98) rotateX(2deg)',
          filter: isVisible ? 'blur(0px)' : 'blur(2px)',
        };
      
      default:
        return baseStyle;
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes medicalEntry {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            filter: blur(3px);
          }
          50% {
            opacity: 0.8;
            transform: translateY(-5px) scale(1.01);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }


        .medical-transition {
          animation: ${isVisible ? 'medicalEntry 0.8s ease-out' : 'none'};
        }


      `}</style>
      
      <Box 
        className="medical-transition"
        style={getTransitionStyles()}
      >
        {children}
      </Box>
    </>
  );
};

export default PageTransition;
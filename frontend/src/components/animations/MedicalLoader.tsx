import React from 'react';
import { Center, Text, Stack } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';

interface MedicalLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'heartbeat' | 'pulse' | 'dna' | 'cross';
  text?: string;
  color?: string;
}

const MedicalLoader: React.FC<MedicalLoaderProps> = ({
  size = 'md',
  type = 'heartbeat',
  text = 'Cargando...',
  color
}) => {
  const { colorScheme } = useMantineColorScheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { width: 40, height: 40, fontSize: '0.8rem' };
      case 'lg': return { width: 80, height: 80, fontSize: '1.2rem' };
      default: return { width: 60, height: 60, fontSize: '1rem' };
    }
  };

  const getColor = () => {
    if (color) return color;
    return colorScheme === 'dark' ? '#ffffff' : '#0ea5e9';
  };

  const styles = getSizeStyles();
  const loaderColor = getColor();

  const HeartbeatLoader = () => (
    <div
      style={{
        width: styles.width,
        height: styles.height,
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          border: `3px solid ${loaderColor}`,
          borderRadius: '50%',
          animation: 'heartbeatPulse 1.5s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: styles.fontSize,
          color: loaderColor
        }}
      >
        ♥
      </div>
    </div>
  );

  const PulseLoader = () => (
    <div
      style={{
        width: styles.width,
        height: styles.height,
        position: 'relative'
      }}
    >
      {[0, 1, 2].map(index => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: `2px solid ${loaderColor}`,
            borderRadius: '50%',
            animation: `pulseRipple 2s ease-out infinite`,
            animationDelay: `${index * 0.5}s`
          }}
        />
      ))}
    </div>
  );

  const DNALoader = () => (
    <div
      style={{
        width: styles.width,
        height: styles.height,
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(45deg, ${loaderColor} 25%, transparent 25%), 
                       linear-gradient(-45deg, ${loaderColor} 25%, transparent 25%), 
                       linear-gradient(45deg, transparent 75%, ${loaderColor} 75%), 
                       linear-gradient(-45deg, transparent 75%, ${loaderColor} 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          animation: 'dnaRotate 2s linear infinite'
        }}
      />
    </div>
  );

  const CrossLoader = () => (
    <div
      style={{
        width: styles.width,
        height: styles.height,
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '20%',
          background: loaderColor,
          animation: 'crossSpin 1s linear infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20%',
          height: '60%',
          background: loaderColor,
          animation: 'crossSpin 1s linear infinite'
        }}
      />
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'pulse': return <PulseLoader />;
      case 'dna': return <DNALoader />;
      case 'cross': return <CrossLoader />;
      default: return <HeartbeatLoader />;
    }
  };

  return (
    <>
      <style>{`
        @keyframes heartbeatPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          25% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
          75% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes pulseRipple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes dnaRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes crossSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes textFade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <Center h="60vh">
        <Stack align="center" gap="lg">
          {renderLoader()}
          <Text 
            size={styles.fontSize} 
            c="dimmed"
            style={{
              animation: 'textFade 2s ease-in-out infinite',
              fontWeight: 500
            }}
          >
            {text}
          </Text>
        </Stack>
      </Center>
    </>
  );
};

export default MedicalLoader;
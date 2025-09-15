import React, { useState, useEffect, useRef } from 'react';
import { Text } from '@mantine/core';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  style?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
  fw?: number;
  size?: string;
  c?: string;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 2000,
  decimals = 0,
  style,
  suffix = '',
  prefix = '',
  fw = 700,
  size = 'xl',
  c = 'dark'
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCount = () => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div ref={countRef}>
      <Text
        fw={fw}
        size={size}
        style={{
          fontVariantNumeric: 'tabular-nums',
          transition: 'all 0.3s ease',
          color: style?.color || (c === 'dark' ? '#1e293b' : c),
          ...style
        }}
      >
        {prefix}{formatNumber(displayValue)}{suffix}
      </Text>
    </div>
  );
};

export default CountUpNumber;
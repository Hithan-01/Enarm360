import React, { useState, useEffect, useRef } from 'react';
import { Text, Title } from '@mantine/core';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  component?: 'text' | 'title';
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 100,
  delay = 0,
  cursor = true,
  component = 'text',
  order = 2,
  size = 'lg',
  style,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(cursor);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setTimeout(() => {
            startTypewriting();
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (typewriterRef.current) {
      observer.observe(typewriterRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, delay]);

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [cursor]);

  const startTypewriting = () => {
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsComplete(true);
        if (onComplete) onComplete();
        
        // Hide cursor after completion
        if (cursor) {
          setTimeout(() => {
            setShowCursor(false);
          }, 1000);
        }
      }
    }, speed);
  };

  const commonStyles = {
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '-0.025em',
    ...style
  };

  const Component = component === 'title' ? Title : Text;

  return (
    <div ref={typewriterRef}>
      <Component
        order={component === 'title' ? order : undefined}
        size={size}
        style={commonStyles}
      >
        {displayedText}
        {cursor && showCursor && (
          <span 
            style={{
              animation: 'blink 1s infinite',
              marginLeft: '2px',
              color: '#0ea5e9'
            }}
          >
            |
          </span>
        )}
      </Component>
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TypewriterText;
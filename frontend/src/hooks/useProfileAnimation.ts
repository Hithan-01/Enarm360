import { useState, useEffect } from 'react';

export const useProfileAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const animateStep = (step: number) => {
    setCurrentStep(step);
  };

  const getStepStyle = (step: number) => ({
    opacity: currentStep >= step ? 1 : 0.3,
    transform: currentStep >= step ? 'translateY(0px)' : 'translateY(20px)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: `${step * 0.1}s`,
  });

  return {
    isVisible,
    currentStep,
    animateStep,
    getStepStyle,
  };
};

export const useHoverEffect = () => {
  const hoverProps = {};

  const getHoverStyle = (baseStyle: React.CSSProperties = {}) => ({
    ...baseStyle,
  });

  return {
    isHovered: false,
    hoverProps,
    getHoverStyle,
  };
};
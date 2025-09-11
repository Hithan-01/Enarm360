import React, { useEffect, useRef } from 'react';
import { useMantineColorScheme } from '@mantine/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'plus' | 'circle' | 'cross' | 'heartbeat';
  rotation: number;
  rotationSpeed: number;
  pulsePhase: number;
}

interface MedicalParticlesProps {
  particleCount?: number;
  speed?: number;
  opacity?: number;
}

const MedicalParticles: React.FC<MedicalParticlesProps> = ({
  particleCount = 30,
  speed = 0.5,
  opacity = 0.1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * opacity + 0.05,
      type: ['plus', 'circle', 'cross', 'heartbeat'][Math.floor(Math.random() * 4)] as Particle['type'],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      pulsePhase: Math.random() * Math.PI * 2
    });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, createParticle);
    };

    const drawPlus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const halfSize = size / 2;
      const thickness = size / 4;
      
      ctx.fillRect(x - halfSize, y - thickness, size, thickness * 2);
      ctx.fillRect(x - thickness, y - halfSize, thickness * 2, size);
    };

    const drawCross = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const halfSize = size / 2;
      const thickness = size / 6;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-halfSize, -thickness, size, thickness * 2);
      ctx.fillRect(-thickness, -halfSize, thickness * 2, size);
      ctx.restore();
    };

    const drawHeartbeat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pulsePhase: number) => {
      const amplitude = Math.sin(pulsePhase) * 0.3 + 1;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const points = [];
      for (let i = 0; i < size; i++) {
        const t = (i / size) * Math.PI * 2;
        const heartY = Math.sin(t * 3) * amplitude * 2;
        points.push({ x: x - size/2 + i, y: y + heartY });
      }
      
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    };

    const drawParticle = (particle: Particle) => {
      if (!ctx) return;

      ctx.save();
      
      // Set color based on theme
      const baseColor = colorScheme === 'dark' ? '255, 255, 255' : '14, 165, 233';
      ctx.fillStyle = `rgba(${baseColor}, ${particle.opacity})`;
      
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      switch (particle.type) {
        case 'plus':
          drawPlus(ctx, 0, 0, particle.size);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'cross':
          drawCross(ctx, 0, 0, particle.size);
          break;
        case 'heartbeat':
          drawHeartbeat(ctx, 0, 0, particle.size, particle.pulsePhase);
          break;
      }
      
      ctx.restore();
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      particle.pulsePhase += 0.1;

      // Wrap around screen edges
      if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
      if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
      if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
      if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, speed, opacity, colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default MedicalParticles;
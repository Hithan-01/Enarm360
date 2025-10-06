import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  Box,
  useMantineColorScheme,
  SimpleGrid,
  Paper,
  Group,
  Badge,
} from '@mantine/core';
import {
  IconRun,
  IconSettings,
  IconUsers,
  IconTrophy,
  IconPhoto,
  IconWorld,
  IconBrain,
} from '@tabler/icons-react';

const SimuladorPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  // Configuración de las 4 opciones principales
  const opcionesSimulador = [
    {
      id: 'express',
      title: 'Quiz Express',
      description: '10 preguntas al azar',
      status: 'Próximamente',
      icon: IconRun,
      color: '#60a5fa', // azul
      bgColor: colorScheme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(96, 165, 250, 0.05)',
      borderColor: 'rgba(96, 165, 250, 0.3)',
      route: '/estudiante/simulador/rapido', // temporal
      disabled: true
    },
    {
      id: 'filtros',
      title: 'Arma tu Examen',
      description: 'Tú eliges las especialidades\ny la cantidad de preguntas',
      status: null,
      icon: IconSettings,
      color: '#f59e0b', // naranja/amarillo
      bgColor: colorScheme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      route: '/estudiante/simulador/filtros',
      disabled: false
    },
    {
      id: 'multiplayer',
      title: 'Multiplayer',
      description: 'Únete a un examen\ncompartido y compite por\n1er lugar',
      status: 'Próximamente',
      icon: IconUsers,
      color: '#34d399', // verde
      bgColor: colorScheme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(52, 211, 153, 0.05)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      route: '/estudiante/simulador/multiplayer', // temporal
      disabled: true
    },
    {
      id: 'completo',
      title: 'Completo',
      description: 'Simula la experiencia de\nun ENARM completo',
      status: 'Próximamente',
      icon: IconTrophy,
      color: '#f87171', // rojo/coral
      bgColor: colorScheme === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(248, 113, 113, 0.05)',
      borderColor: 'rgba(248, 113, 113, 0.3)',
      route: '/estudiante/simulador/completo',
      disabled: true
    }
  ];

  // Exámenes especiales (sección inferior)
  const examenesEspeciales = [
    {
      id: 'casos-clinicos',
      title: 'Casos Clínicos',
      icon: IconPhoto,
      color: '#f87171', // rosa/rojo
      bgColor: colorScheme === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(248, 113, 113, 0.05)',
      disabled: true
    },
    {
      id: 'internacionales',
      title: 'Internacionales',
      icon: IconWorld,
      color: '#64748b', // gris
      bgColor: colorScheme === 'dark' ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.05)',
      disabled: true
    },
    {
      id: 'ia-personalizado',
      title: 'IA Personalizado',
      icon: IconBrain,
      color: '#a855f7', // púrpura
      bgColor: colorScheme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
      disabled: true
    }
  ];

  const handleOpcionClick = (opcion: any) => {
    if (!opcion.disabled) {
      navigate(opcion.route);
    }
  };

  return (
    <Box
      style={{
        padding: '2rem',
        minHeight: '100vh',
        backgroundColor: colorScheme === 'dark' 
          ? 'rgba(15, 23, 42, 0.5)' 
          : 'rgba(247, 243, 238, 0.3)',
      }}
    >
      {/* Header */}
      <Box mb="3rem" ta="center">
        <Title
          order={1}
          size="2.5rem"
          fw={700}
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            marginBottom: '1rem',
          }}
        >
          Elige tu cuestionario
        </Title>
      </Box>

      {/* Opciones principales - 4 tarjetas */}
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 4 }}
        spacing="xl"
        mb="4rem"
      >
        {opcionesSimulador.map((opcion) => {
          const IconComponent = opcion.icon;
          return (
            <Paper
              key={opcion.id}
              onClick={() => handleOpcionClick(opcion)}
              style={{
                backgroundColor: opcion.bgColor,
                border: `2px solid ${opcion.borderColor}`,
                borderRadius: '24px',
                padding: '2rem',
                minHeight: '280px',
                cursor: opcion.disabled ? 'not-allowed' : 'pointer',
                opacity: opcion.disabled ? 0.6 : 1,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
              onMouseEnter={(e) => {
                if (!opcion.disabled) {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px ${opcion.color}20`;
                }
              }}
              onMouseLeave={(e) => {
                if (!opcion.disabled) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Status badge */}
              {opcion.status && (
                <Badge
                  size="sm"
                  radius="xl"
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(100, 116, 139, 0.8)' : 'rgba(148, 163, 184, 0.8)',
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                  }}
                >
                  {opcion.status}
                </Badge>
              )}

              <Stack align="center" gap="lg" style={{ height: '100%', justifyContent: 'center' }}>
                {/* Icon */}
                <Box
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    backgroundColor: `${opcion.color}20`,
                    border: `2px solid ${opcion.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent size={40} style={{ color: opcion.color }} />
                </Box>

                {/* Content */}
                <Stack align="center" gap="sm">
                  <Title
                    order={3}
                    size="1.25rem"
                    fw={600}
                    ta="center"
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    {opcion.title}
                  </Title>
                  <Text
                    size="sm"
                    ta="center"
                    style={{
                      color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {opcion.description}
                  </Text>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>

      {/* Sección de Exámenes Especiales */}
      <Box>
        <Title
          order={2}
          size="1.5rem"
          fw={600}
          ta="center"
          mb="2rem"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
          }}
        >
          Exámenes especiales
        </Title>

        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing="xl"
        >
          {examenesEspeciales.map((examen) => {
            const IconComponent = examen.icon;
            return (
              <Paper
                key={examen.id}
                style={{
                  backgroundColor: examen.bgColor,
                  border: `1px solid ${examen.color}30`,
                  borderRadius: '20px',
                  padding: '1.5rem',
                  minHeight: '140px',
                  cursor: examen.disabled ? 'not-allowed' : 'pointer',
                  opacity: examen.disabled ? 0.5 : 1,
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
                onMouseEnter={(e) => {
                  if (!examen.disabled) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!examen.disabled) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Group align="center" gap="md">
                  <Box
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      backgroundColor: `${examen.color}20`,
                      border: `1px solid ${examen.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={28} style={{ color: examen.color }} />
                  </Box>

                  <Stack gap="xs">
                    <Title
                      order={4}
                      size="1rem"
                      fw={600}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      {examen.title}
                    </Title>
                    <Badge
                      size="xs"
                      radius="xl"
                      style={{
                        backgroundColor: colorScheme === 'dark' ? 'rgba(100, 116, 139, 0.8)' : 'rgba(148, 163, 184, 0.8)',
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                      }}
                    >
                      Próximamente
                    </Badge>
                  </Stack>
                </Group>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default SimuladorPage;
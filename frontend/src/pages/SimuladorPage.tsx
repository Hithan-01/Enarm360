import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  Box,
  useMantineColorScheme,
  SimpleGrid,
  ActionIcon,
  Group,
} from '@mantine/core';
import {
  IconChevronDown,
  IconPlus,
  IconDots,
  IconClock,
  IconCheck,
  IconTrophy,
} from '@tabler/icons-react';

const SimuladorPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  // Configuración de las 4 columnas
  const columnasSimulador = [
    {
      id: 'rapido',
      title: 'Examen Rápido',
      nuevoTitulo: 'Nuevo Examen Rápido',
      color: '#bbdefb',
      route: '/estudiante/simulador/rapido',
      historial: [
        { id: 1, fecha: '2024-01-15', puntuacion: 85, preguntas: 20, tiempo: '15 min' },
        { id: 2, fecha: '2024-01-12', puntuacion: 78, preguntas: 15, tiempo: '12 min' }
      ]
    },
    {
      id: 'filtros',
      title: 'Examen con Filtros',
      nuevoTitulo: 'Nuevo Examen con Filtros',
      color: '#ffe0b2',
      route: '/estudiante/simulador/filtros',
      historial: [
        { id: 3, fecha: '2024-01-08', puntuacion: 92, preguntas: 30, tiempo: '25 min' }
      ]
    },
    {
      id: 'completo',
      title: 'Simulación Completa',
      nuevoTitulo: 'Nueva Simulación Completa',
      color: '#c8e6c9',
      route: '/estudiante/simulador/completo',
      historial: [
        { id: 4, fecha: '2024-01-10', puntuacion: 78, preguntas: 450, tiempo: '6h 30min' }
      ]
    },
    {
      id: 'inteligente',
      title: 'Repaso Inteligente',
      nuevoTitulo: 'Nuevo Repaso Inteligente',
      color: '#e1bee7',
      route: '/estudiante/simulador/inteligente',
      historial: [
        { id: 5, fecha: '2024-01-05', puntuacion: 88, preguntas: 25, tiempo: '20 min' }
      ]
    }
  ];

  const handleNuevoExamen = (route: string) => {
    navigate(route);
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        style={{
          padding: '16px 24px',
          overflow: 'hidden',
          overflowY: 'auto',
          flex: 1,
        }}
      >
      {/* Page Header */}
      <Box mb="xl" ta="left">
        <Title
          order={2}
          size="1.5rem"
          fw={600}
          ta="left"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            marginBottom: '8px',
          }}
        >
          Simuladores de Examen
        </Title>
        <Text
          size="sm"
          ta="left"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Elige el tipo de simulador que mejor se adapte a tu preparación
        </Text>
      </Box>

      {/* Simulador Cards Container - 4 Columnas Kanban */}
      <SimpleGrid
        cols={4}
        spacing="lg"
        style={{ maxWidth: '1100px' }}
      >
        {columnasSimulador.map((columna) => (
          <Box
            key={columna.id}
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              padding: '8px',
              minHeight: '400px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            {/* Header de cada columna con controles */}
            <Group justify="space-between" align="center" mb="sm">
              <Group gap={2} align="center">
                <ActionIcon
                  variant="subtle"
                  size={16}
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                    minWidth: '16px',
                    minHeight: '16px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Función para colapsar
                  }}
                >
                  <IconChevronDown size={10} />
                </ActionIcon>
                <Title
                  order={6}
                  size="0.75rem"
                  style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Space Grotesk, Inter, sans-serif',
                  }}
                >
                  {columna.title}
                </Title>
              </Group>

              <Group gap={2} align="center">
                <ActionIcon
                  variant="subtle"
                  size={16}
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                    minWidth: '16px',
                    minHeight: '16px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Función para agregar post-it
                  }}
                >
                  <IconPlus size={10} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  size={16}
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                    minWidth: '16px',
                    minHeight: '16px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Función para menú de opciones
                  }}
                >
                  <IconDots size={10} />
                </ActionIcon>
              </Group>
            </Group>

            {/* Línea divisoria */}
            <Box
              style={{
                height: '1px',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                marginBottom: '12px',
              }}
            />

            {/* Post-it pequeño para "Nuevo Examen" */}
            <Box
              onClick={() => handleNuevoExamen(columna.route)}
              mb="sm"
              style={{
                backgroundColor: columna.color,
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: 1,
                minHeight: '50px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Text
                size="xs"
                fw={600}
                ta="center"
                style={{
                  color: '#374151',
                  lineHeight: 1.2,
                }}
              >
                {columna.nuevoTitulo}
              </Text>
            </Box>

            {/* Historial de exámenes de esta columna */}
            <Stack gap="sm">
              {columna.historial.map((examen) => (
                <Box
                  key={examen.id}
                  style={{
                    backgroundColor: columna.color,
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: 1,
                    minHeight: '160px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Stack gap="sm" style={{ height: '100%', justifyContent: 'space-between', flex: 1 }}>
                    <Box>
                      <Group justify="space-between" align="flex-start" mb="xs">
                        <Text
                          size="sm"
                          fw={600}
                          style={{
                            color: '#374151',
                            lineHeight: 1.3,
                          }}
                        >
                          {columna.title}
                        </Text>
                        <IconCheck size={16} style={{ color: '#10b981' }} />
                      </Group>
                      <Text
                        size="xs"
                        style={{
                          color: '#6b7280',
                          fontSize: '10px',
                        }}
                      >
                        {examen.fecha}
                      </Text>
                    </Box>

                    <Box>
                      <Group justify="space-between" align="flex-end">
                        <Stack gap={2}>
                          <Group gap="xs" align="center">
                            <IconTrophy size={12} style={{ color: '#f59e0b' }} />
                            <Text
                              size="xs"
                              fw={600}
                              style={{
                                color: '#374151',
                                fontSize: '11px',
                              }}
                            >
                              {examen.puntuacion}%
                            </Text>
                          </Group>
                          <Group gap="xs" align="center">
                            <IconClock size={12} style={{ color: '#6b7280' }} />
                            <Text
                              size="xs"
                              style={{
                                color: '#6b7280',
                                fontSize: '10px',
                              }}
                            >
                              {examen.tiempo}
                            </Text>
                          </Group>
                        </Stack>

                        <Text
                          size="xs"
                          style={{
                            color: '#6b7280',
                            fontSize: '10px',
                            fontStyle: 'italic',
                          }}
                        >
                          {examen.preguntas} preguntas
                        </Text>
                      </Group>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
      </Box>

      {/* Sticky Footer */}
      <Box
        style={{
          borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(247, 243, 238, 0.8)',
          marginTop: 'auto',
        }}
      >
        <Text
          size="xs"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          © 2024 ENARM360. Todos los derechos reservados.
        </Text>
      </Box>
    </Box>
  );
};

export default SimuladorPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Text,
  Title,
  Group,
  Stack,
  Center,
  Alert,
  useMantineColorScheme,
  Box,
  AppShell,
  SimpleGrid,
  Card,
  RingProgress,
  ThemeIcon,
  Transition,
} from '@mantine/core';
import MedicalLoader from '../components/animations/MedicalLoader';

import {
  IconBrain,
  IconChartBar,
  IconTrophy,
  IconClipboardList,
  IconPlus,
  IconChevronRight,
  IconAlertCircle,
  IconTrendingUp,
  IconClock,
  IconTarget,
  IconBook,
  IconCalendar,
  IconActivity,
  IconShield
} from '@tabler/icons-react';
import { authService } from '../services/authService';
import { EstudianteDashboardData, UsuarioInfo } from '../types/auth';

const EstudianteDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<EstudianteDashboardData | null>(null);
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    loadDashboardData();
    // Actualizar información del usuario desde el servidor
    updateUserInfo();
  }, []);

  // Countdown timer para ENARM
  useEffect(() => {
    // Fecha del próximo ENARM (23 de septiembre de 2025)
    const targetDate = new Date('2025-09-23T08:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const updateUserInfo = async () => {
    try {
      if (authService.isAuthenticated()) {
        await authService.getCurrentUser();
        // Recargar el usuario actualizado
        const updatedUser = authService.getCurrentUserFromStorage();
        setUser(updatedUser);
      }
    } catch (error) {
      console.warn('No se pudo actualizar la información del usuario:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Solo cargar datos si está autenticado, sin redirecciones automáticas
      if (!authService.isAuthenticated()) {
        setError('No estás autenticado');
        return;
      }

      // Usar datos del localStorage en lugar de hacer llamadas al backend
      const user = authService.getCurrentUserFromStorage();
      if (user) {
        setUser(user);
      }

      // Datos estáticos de ejemplo para el dashboard del estudiante
      setDashboardData({
        message: 'Tu Camino Hacia el ENARM',
        stats: {
          cursosInscritos: 8,
          examenesCompletados: 47,
          puntuacionPromedio: 78,
          horasEstudio: 142,
          materiasMejor: 'Medicina Interna',
          proximoExamen: 'Cirugía General'
        },
        actions: [
          'Iniciar Simulacro',
          'Ver Progreso',
          'Revisar Estadísticas',
          'Calendario de Estudio',
          'Materias por Especialidad',
          'Banco de Preguntas'
        ],
        accessLevel: 'ESTUDIANTE'
      });

    } catch (err: any) {
      console.error('Error cargando dashboard:', err);
      setError('Error cargando el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <Box
        style={{
          padding: '16px 24px',
          overflow: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <MedicalLoader
          type="heartbeat"
          size="lg"
          text="Preparando tu espacio de estudio..."
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          padding: '16px 24px',
          overflow: 'hidden',
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <Alert
          icon={<IconAlertCircle size={20} />}
          color="red"
          variant="light"
          radius="md"
          title="Error"
        >
          {error}
        </Alert>
      </Box>
    );
  }


  // Función para renderizar contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Resumen
        return (
          <Stack gap="sm">
            {/* Actividad Reciente */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Actividad Reciente
              </Text>
              <Stack gap="xs">
                {[
                  { action: 'Completaste: Simulacro Cardiología', time: 'Hace 2 horas', score: '89%' },
                  { action: 'Revisaste: Neurología - Casos Clínicos', time: 'Hace 5 horas', score: '92%' },
                  { action: 'Estudiaste: Medicina Interna', time: 'Ayer', score: '85%' },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    style={{
                      padding: '6px',
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(247, 243, 238, 0.8)',
                      borderRadius: '8px',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                    }}
                  >
                    <Group justify="space-between" align="center">
                      <Stack gap={2}>
                        <Text size="sm" fw={500} style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                        }}>
                          {activity.action}
                        </Text>
                        <Text size="xs" style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                        }}>
                          {activity.time}
                        </Text>
                      </Stack>
                      <Box style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                      }}>
                        <Text size="xs" fw={600} style={{ color: '#10b981' }}>
                          {activity.score}
                        </Text>
                      </Box>
                    </Group>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Próximos Exámenes */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Próximos Exámenes
              </Text>
              <SimpleGrid cols={2} spacing="sm">
                {[
                  { title: 'Cardiología Avanzada', date: 'Mañana', difficulty: 'Intermedio' },
                  { title: 'Neurología Clínica', date: '3 días', difficulty: 'Avanzado' },
                ].map((exam, index) => (
                  <Box
                    key={index}
                    style={{
                      padding: '8px',
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(247, 243, 238, 0.8)',
                      borderRadius: '12px',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Stack gap="xs">
                      <Text size="sm" fw={600} style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                      }}>
                        {exam.title}
                      </Text>
                      <Group justify="space-between">
                        <Text size="xs" style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                        }}>
                          {exam.date}
                        </Text>
                        <Text size="xs" style={{ color: '#f59e0b' }}>
                          {exam.difficulty}
                        </Text>
                      </Group>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        );

      case 1: // Progreso
        return (
          <Stack gap="sm">
            <Text size="lg" fw={600} style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}>
              Análisis Detallado de Progreso
            </Text>

            {/* Progreso General Expandido */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Progreso General - 74%
              </Text>
              <Group gap="md" mb="sm">
                <Box style={{ flex: 1 }}>
                  <Text size="xs" mb={4} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Temas completados
                  </Text>
                  <Box style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <Box style={{
                      width: '74%',
                      height: '100%',
                      backgroundColor: '#10b981',
                      borderRadius: '4px',
                    }} />
                  </Box>
                  <Text size="xs" mt={2} style={{ color: '#10b981' }}>74 de 100 temas</Text>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text size="xs" mb={4} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Meta mensual
                  </Text>
                  <Box style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <Box style={{
                      width: '92%',
                      height: '100%',
                      backgroundColor: '#0ea5e9',
                      borderRadius: '4px',
                    }} />
                  </Box>
                  <Text size="xs" mt={2} style={{ color: '#0ea5e9' }}>92% completado</Text>
                </Box>
              </Group>
            </Box>

            {/* Tiempo Total Expandido */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Tiempo Total de Estudio - 127h
              </Text>
              <SimpleGrid cols={3} spacing="sm">
                {[
                  { label: 'Esta semana', valor: '12h', color: '#10b981' },
                  { label: 'Este mes', valor: '48h', color: '#0ea5e9' },
                  { label: 'Promedio diario', valor: '2.1h', color: '#f59e0b' },
                ].map((item, index) => (
                  <Box key={index} style={{
                    padding: '12px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}>
                    <Text size="lg" fw={600} style={{ color: item.color }}>
                      {item.valor}
                    </Text>
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Posición en Ranking Expandida */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Tu Posición en el Ranking - #23
              </Text>
              <Group justify="space-between">
                <Box style={{ textAlign: 'center' }}>
                  <Text size="xl" fw={700} style={{ color: '#f59e0b' }}>#23</Text>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Posición actual
                  </Text>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Text size="xl" fw={700} style={{ color: '#10b981' }}>↑5</Text>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Subiste esta semana
                  </Text>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <Text size="xl" fw={700} style={{ color: '#0ea5e9' }}>95%</Text>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Percentil
                  </Text>
                </Box>
              </Group>
            </Box>
          </Stack>
        );

      case 2: // Comparativa
        return (
          <Stack gap="sm">
            <Text size="lg" fw={600} style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}>
              Tu Rendimiento vs Promedio
            </Text>

            {/* Comparativas */}
            <SimpleGrid cols={2} spacing="md">
              {[
                {
                  titulo: 'Tiempo de Estudio',
                  tuValor: '127h',
                  promedio: '89h',
                  diferencia: '+43%',
                  esMejor: true,
                  color: '#10b981'
                },
                {
                  titulo: 'Exámenes Completados',
                  tuValor: '47',
                  promedio: '52',
                  diferencia: '-10%',
                  esMejor: false,
                  color: '#f59e0b'
                },
                {
                  titulo: 'Puntuación Promedio',
                  tuValor: '87.3%',
                  promedio: '78.1%',
                  diferencia: '+12%',
                  esMejor: true,
                  color: '#10b981'
                },
                {
                  titulo: 'Racha de Estudio',
                  tuValor: '12 días',
                  promedio: '7 días',
                  diferencia: '+71%',
                  esMejor: true,
                  color: '#10b981'
                },
              ].map((item, index) => (
                <Box key={index} style={{
                  padding: '16px',
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '12px',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                }}>
                  <Text size="sm" fw={500} mb="xs" style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  }}>
                    {item.titulo}
                  </Text>

                  <Group justify="space-between" mb="xs">
                    <Box>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        Tú
                      </Text>
                      <Text size="lg" fw={600} style={{ color: item.color }}>
                        {item.tuValor}
                      </Text>
                    </Box>
                    <Box style={{ textAlign: 'right' }}>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        Promedio
                      </Text>
                      <Text size="lg" fw={400} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        {item.promedio}
                      </Text>
                    </Box>
                  </Group>

                  <Box style={{
                    padding: '6px 12px',
                    backgroundColor: item.esMejor
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '20px',
                    textAlign: 'center',
                  }}>
                    <Text size="xs" fw={600} style={{
                      color: item.esMejor ? '#10b981' : '#f59e0b'
                    }}>
                      {item.diferencia} {item.esMejor ? 'mejor' : 'por mejorar'}
                    </Text>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>

            {/* Gráfica de Comparación */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Comparación Visual
              </Text>
              <Box style={{
                padding: '16px',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px',
              }}>
                <Text size="xs" mb="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  Estás en el <strong style={{ color: '#10b981' }}>Top 5%</strong> de todos los estudiantes
                </Text>
                <Box style={{
                  width: '100%',
                  height: '20px',
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <Box style={{
                    width: '95%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)',
                    borderRadius: '10px',
                  }} />
                  <Box style={{
                    position: 'absolute',
                    right: '5%',
                    top: '-8px',
                    width: '12px',
                    height: '36px',
                    backgroundColor: '#0ea5e9',
                    borderRadius: '6px',
                  }} />
                </Box>
                <Group justify="space-between" mt="xs">
                  <Text size="xs" style={{ color: '#10b981' }}>Mejor rendimiento</Text>
                  <Text size="xs" style={{ color: '#0ea5e9' }}>Tu posición</Text>
                  <Text size="xs" style={{ color: '#f59e0b' }}>Menor rendimiento</Text>
                </Group>
              </Box>
            </Box>
          </Stack>
        );

      case 3: // Objetivos
        return (
          <Stack gap="sm">
            {/* Objetivos de la Semana */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Objetivos de la Semana
              </Text>
              <Stack gap="xs">
                {[
                  { objetivo: 'Completar 5 simulacros', progreso: 3, total: 5, completado: false },
                  { objetivo: 'Estudiar 15 horas', progreso: 12, total: 15, completado: false },
                  { objetivo: 'Revisar 200 preguntas', progreso: 200, total: 200, completado: true },
                ].map((item, index) => (
                  <Group key={index} justify="space-between" align="center">
                    <Group gap="xs">
                      <Box
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: item.completado ? '#10b981' : 'transparent',
                          border: `2px solid ${item.completado ? '#10b981' : (colorScheme === 'dark' ? '#94a3b8' : '#64748b')}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.completado && (
                          <Text size="xs" style={{ color: 'white', lineHeight: 1 }}>✓</Text>
                        )}
                      </Box>
                      <Text
                        size="xs"
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                          textDecoration: item.completado ? 'line-through' : 'none',
                          opacity: item.completado ? 0.7 : 1,
                        }}
                      >
                        {item.objetivo}
                      </Text>
                    </Group>
                    <Text
                      size="xs"
                      fw={500}
                      style={{
                        color: item.completado ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {item.progreso}/{item.total}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          </Stack>
        );

      case 4: // Materias
        return (
          <Stack gap="sm">
            {/* Progreso por Materias */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Progreso por Materias
              </Text>
              <Stack gap="xs">
                {[
                  { materia: 'Medicina Interna', progreso: 89, color: '#10b981' },
                  { materia: 'Cardiología', progreso: 74, color: '#0ea5e9' },
                  { materia: 'Neurología', progreso: 65, color: '#f59e0b' },
                  { materia: 'Cirugía General', progreso: 58, color: '#8b5cf6' },
                ].map((item, index) => (
                  <Box key={index}>
                    <Group justify="space-between" mb={4}>
                      <Text size="xs" fw={500} style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                      }}>
                        {item.materia}
                      </Text>
                      <Text size="xs" fw={600} style={{ color: item.color }}>
                        {item.progreso}%
                      </Text>
                    </Group>
                    <Box
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        style={{
                          width: `${item.progreso}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          borderRadius: '3px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        );

      case 5: // Simulacros
        return (
          <Stack gap="sm">
            <Text size="lg" fw={600} style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}>
              Simulacros y Exámenes
            </Text>

            {/* Estadísticas de Simulacros */}
            <SimpleGrid cols={3} spacing="sm" mb="md">
              {[
                { label: 'Completados', valor: '47', color: '#10b981' },
                { label: 'Promedio', valor: '87.3%', color: '#0ea5e9' },
                { label: 'Mejor resultado', valor: '94%', color: '#f59e0b' },
              ].map((stat, index) => (
                <Box key={index} style={{
                  padding: '12px',
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                }}>
                  <Text size="xl" fw={700} style={{ color: stat.color }}>
                    {stat.valor}
                  </Text>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            {/* Últimos Simulacros */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Últimos Simulacros
              </Text>
              <Stack gap="xs">
                {[
                  {
                    nombre: 'Simulacro Cardiología Avanzada',
                    fecha: 'Hace 2 días',
                    resultado: '89%',
                    tiempo: '45 min',
                    estado: 'completado'
                  },
                  {
                    nombre: 'ENARM Simulacro Completo #12',
                    fecha: 'Hace 4 días',
                    resultado: '92%',
                    tiempo: '180 min',
                    estado: 'completado'
                  },
                  {
                    nombre: 'Neurología - Casos Clínicos',
                    fecha: 'Hace 1 semana',
                    resultado: '85%',
                    tiempo: '60 min',
                    estado: 'completado'
                  },
                ].map((simulacro, index) => (
                  <Box key={index} style={{
                    padding: '12px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  }}>
                    <Group justify="space-between" align="center">
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={500} style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                        }}>
                          {simulacro.nombre}
                        </Text>
                        <Group gap="md">
                          <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                            {simulacro.fecha}
                          </Text>
                          <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                            {simulacro.tiempo}
                          </Text>
                        </Group>
                      </Box>
                      <Box style={{
                        padding: '4px 12px',
                        backgroundColor: parseInt(simulacro.resultado) >= 90
                          ? 'rgba(16, 185, 129, 0.1)'
                          : parseInt(simulacro.resultado) >= 80
                            ? 'rgba(14, 165, 233, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                      }}>
                        <Text size="sm" fw={600} style={{
                          color: parseInt(simulacro.resultado) >= 90
                            ? '#10b981'
                            : parseInt(simulacro.resultado) >= 80
                              ? '#0ea5e9'
                              : '#f59e0b'
                        }}>
                          {simulacro.resultado}
                        </Text>
                      </Box>
                    </Group>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Próximos Exámenes Programados */}
            <Box>
              <Text size="sm" fw={500} mb="xs" style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
              }}>
                Próximos Exámenes Programados
              </Text>
              <SimpleGrid cols={2} spacing="sm">
                {[
                  {
                    nombre: 'Cardiología Avanzada',
                    fecha: 'Mañana',
                    duracion: '60 min',
                    dificultad: 'Intermedio'
                  },
                  {
                    nombre: 'Simulacro ENARM Completo',
                    fecha: 'En 3 días',
                    duracion: '180 min',
                    dificultad: 'Avanzado'
                  },
                ].map((examen, index) => (
                  <Box key={index} style={{
                    padding: '12px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '8px',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                    <Text size="sm" fw={600} mb="xs" style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                    }}>
                      {examen.nombre}
                    </Text>
                    <Group justify="space-between" mb="xs">
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        {examen.fecha}
                      </Text>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        {examen.duracion}
                      </Text>
                    </Group>
                    <Box style={{
                      padding: '4px 8px',
                      backgroundColor: examen.dificultad === 'Avanzado'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '6px',
                      display: 'inline-block',
                    }}>
                      <Text size="xs" fw={500} style={{
                        color: examen.dificultad === 'Avanzado' ? '#ef4444' : '#f59e0b'
                      }}>
                        {examen.dificultad}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  // Estadísticas más generales y simples
  const quickStats = [
    {
      label: 'Progreso General',
      value: '74%',
      icon: IconTrendingUp,
      color: '#10b981',
      bg: colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
    },
    {
      label: 'Tiempo Total',
      value: '127h',
      icon: IconClock,
      color: '#0ea5e9',
      bg: colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)'
    },
    {
      label: 'Posición',
      value: '23',
      icon: IconTrophy,
      color: '#f59e0b',
      bg: colorScheme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)'
    },
    {
      label: 'Progreso vs la Media',
      value: '+12%',
      icon: IconTarget,
      color: '#8b5cf6',
      bg: colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'
    }
  ];

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }

          @keyframes flipTop {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(-90deg); }
            100% { transform: rotateX(0deg); }
          }

          @keyframes ledGlow {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }

          @keyframes flipBoard {
            0% { transform: perspective(200px) rotateX(0deg); }
            25% { transform: perspective(200px) rotateX(-5deg); }
            50% { transform: perspective(200px) rotateX(0deg); }
            75% { transform: perspective(200px) rotateX(5deg); }
            100% { transform: perspective(200px) rotateX(0deg); }
          }

          /* Subtle 3D movement for different digits */
          @keyframes flipBoard-0-0 {
            0% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
            25% { transform: perspective(200px) rotateX(-2deg) rotateY(-1deg); }
            50% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
            75% { transform: perspective(200px) rotateX(2deg) rotateY(1deg); }
            100% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
          }

          @keyframes flipBoard-1-0 {
            0% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
            33% { transform: perspective(200px) rotateX(-3deg) rotateY(-1deg); }
            66% { transform: perspective(200px) rotateX(3deg) rotateY(1deg); }
            100% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
          }

          @keyframes flipBoard-2-0 {
            0% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
            20% { transform: perspective(200px) rotateX(-1deg) rotateY(-2deg); }
            40% { transform: perspective(200px) rotateX(1deg) rotateY(0deg); }
            60% { transform: perspective(200px) rotateX(-1deg) rotateY(2deg); }
            80% { transform: perspective(200px) rotateX(1deg) rotateY(0deg); }
            100% { transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
          }

          @keyframes flipBoard-3-0 {
            0% { transform: perspective(200px) rotateX(0deg); }
            10% { transform: perspective(200px) rotateX(-90deg); }
            50% { transform: perspective(200px) rotateX(-90deg); }
            60% { transform: perspective(200px) rotateX(0deg); }
            100% { transform: perspective(200px) rotateX(0deg); }
          }

          @keyframes flipBoard-3-1 {
            0% { transform: perspective(200px) rotateX(0deg); }
            15% { transform: perspective(200px) rotateX(-90deg); }
            55% { transform: perspective(200px) rotateX(-90deg); }
            65% { transform: perspective(200px) rotateX(0deg); }
            100% { transform: perspective(200px) rotateX(0deg); }
          }

          @keyframes pageFlip {
            0% {
              transform: rotateY(0deg) translateX(0px);
              box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
            }
            25% {
              transform: rotateY(25deg) translateX(15px);
              box-shadow: 8px 4px 12px rgba(0, 0, 0, 0.2);
            }
            75% {
              transform: rotateY(120deg) translateX(40px);
              box-shadow: 12px 6px 16px rgba(0, 0, 0, 0.25);
            }
            100% {
              transform: rotateY(160deg) translateX(50px);
              box-shadow: 15px 8px 20px rgba(0, 0, 0, 0.3);
            }
          }

          @keyframes pageFlipBack {
            0% {
              transform: rotateY(160deg) translateX(50px);
              box-shadow: 15px 8px 20px rgba(0, 0, 0, 0.3);
            }
            25% {
              transform: rotateY(120deg) translateX(40px);
              box-shadow: 12px 6px 16px rgba(0, 0, 0, 0.25);
            }
            75% {
              transform: rotateY(25deg) translateX(15px);
              box-shadow: 8px 4px 12px rgba(0, 0, 0, 0.2);
            }
            100% {
              transform: rotateY(0deg) translateX(0px);
              box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
            }
          }

          .page-flip-animation {
            animation: pageFlip 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }

          .page-flip-back-animation {
            animation: pageFlipBack 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
        `}
      </style>
      <Box
        style={{
          padding: '16px 24px',
          overflow: 'hidden',
          overflowY: 'auto',
          background: colorScheme === 'dark' ? undefined : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
          minHeight: '100vh',
        }}
      >
        {/* Welcome Header */}
        <Box mb="sm" ta="left">
          <Title
            order={2}
            size="1.3rem"
            fw={600}
            ta="left"
            style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              marginBottom: '4px',
            }}
          >
            Bienvenido, {user?.nombre || user?.username || 'Estudiante'}
          </Title>
          <Text
            size="xs"
            ta="left"
            style={{
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Continúa tu preparación para el ENARM
          </Text>
        </Box>


        {/* CSS Grid Layout */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '180px 1fr 140px',
            gridColumnGap: '12px',
            gridRowGap: '12px',
            height: 'calc(100vh - 200px)',
            minHeight: '740px',
          }}
        >
          {/* Card 1: Progreso General */}
          <Card
            padding="xs"
            radius="md"
            style={{
              gridArea: '1 / 1 / 2 / 2',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(96, 165, 250, 0.15)'
                : 'rgba(235, 232, 227, 0.9)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(237, 231, 221, 0.8)'}`,
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '180px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Stack align="center" gap="xs" h="100%" justify="center">
              <RingProgress
                size={90}
                thickness={8}
                sections={[
                  { value: 74, color: '#10b981' },
                  { value: 26, color: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
                ]}
                label={
                  <Center>
                    <Text size="lg" fw={600} style={{ color: '#10b981' }}>74%</Text>
                  </Center>
                }
              />
              <Text
                size="xs"
                fw={500}
                ta="center"
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                Progreso General
              </Text>
            </Stack>
          </Card>

          {/* Card 2: Rendimiento Semanal */}
          <Card
            padding="xs"
            radius="md"
            style={{
              gridArea: '1 / 2 / 2 / 3',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(248, 113, 113, 0.15)'
                : 'rgba(235, 232, 227, 0.9)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(237, 231, 221, 0.8)'}`,
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '180px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Stack gap="xs" h="100%" justify="space-between">
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    Tiempo Total
                  </Text>
                  <Text
                    size="10px"
                    style={{
                      color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                      lineHeight: 1.2,
                    }}
                  >
                    Tiempo acumulado de estudio
                  </Text>
                </Stack>
                <Box
                  style={{
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                  }}
                >
                  <Text size="sm" fw={600} style={{ color: '#0ea5e9' }}>+12%</Text>
                </Box>
              </Group>

              <Box style={{ position: 'relative', height: '60px', width: '100%' }}>
                <svg width="100%" height="100%" viewBox="0 0 200 80">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Área bajo la curva */}
                  <polygon
                    points="10,60 40,45 70,35 100,25 130,30 160,20 190,15 190,70 10,70"
                    fill="url(#areaGradient)"
                  />

                  {/* Línea principal */}
                  <polyline
                    points="10,60 40,45 70,35 100,25 130,30 160,20 190,15"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Puntos de datos */}
                  {[10, 40, 70, 100, 130, 160, 190].map((x, i) => (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={[60, 45, 35, 25, 30, 20, 15][i]}
                        r="5"
                        fill="white"
                        stroke="#0ea5e9"
                        strokeWidth="2"
                      />
                      <circle
                        cx={x}
                        cy={[60, 45, 35, 25, 30, 20, 15][i]}
                        r="2"
                        fill="#0ea5e9"
                      />
                    </g>
                  ))}

                  {/* Etiquetas de días */}
                  {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <text
                      key={i}
                      x={[10, 40, 70, 100, 130, 160, 190][i]}
                      y="75"
                      textAnchor="middle"
                      fill={colorScheme === 'dark' ? '#94a3b8' : '#64748b'}
                      fontSize="10"
                      fontFamily="Inter, sans-serif"
                    >
                      {day}
                    </text>
                  ))}
                </svg>
              </Box>

              <Text
                size="lg"
                fw={600}
                style={{
                  color: '#0ea5e9',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                127h
              </Text>
            </Stack>
          </Card>

          {/* Card 3: Ranking */}
          <Card
            padding="xs"
            radius="md"
            style={{
              gridArea: '1 / 3 / 2 / 4',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(251, 191, 36, 0.15)'
                : 'rgba(235, 232, 227, 0.9)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(237, 231, 221, 0.8)'}`,
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '180px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Stack align="center" gap="xs" h="100%" justify="center">
              {/* Icono de trofeo decorativo */}
              <Box
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}
              >
                <Box
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Text
                    size="xl"
                    fw={700}
                    style={{
                      color: 'white',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    #23
                  </Text>
                </Box>

                {/* Estrellitas decorativas */}
                <Box
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: '-3px',
                    left: '-3px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    animation: 'pulse 2s infinite 0.5s',
                  }}
                />
              </Box>

              <Stack align="center" gap={4}>
                <Text
                  size="sm"
                  fw={600}
                  ta="center"
                  style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                    fontFamily: 'Space Grotesk, Inter, sans-serif',
                  }}
                >
                  Tu Posición
                </Text>

                <Box
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                  }}
                >
                  <Text
                    size="sm"
                    ta="center"
                    fw={600}
                    style={{
                      color: '#f59e0b',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    Top 5% Nacional
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Card>

          {/* Main Content Area - 66.66% */}
          <Card
            padding="xs"
            radius="md"
            style={{
              gridArea: '2 / 1 / 3 / 3',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.8)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(237, 231, 221, 0.8)'}`,
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Mini Navbar */}
            <Group gap="xs" mb="sm" style={{
              borderBottom: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              paddingBottom: '6px'
            }}>
              {['Resumen', 'Progreso', 'Comparativa', 'Objetivos', 'Materias', 'Simulacros'].map((tab, index) => (
                <Box
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    backgroundColor: index === activeTab
                      ? (colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (index !== activeTab) {
                      e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(242, 237, 230, 0.8)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== activeTab) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Text
                    size="xs"
                    fw={index === activeTab ? 500 : 400}
                    style={{
                      color: index === activeTab
                        ? '#0ea5e9'
                        : (colorScheme === 'dark' ? '#94a3b8' : '#64748b'),
                    }}
                  >
                    {tab}
                  </Text>
                </Box>
              ))}
            </Group>

            {/* Content Area */}
            <Box style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
              {renderTabContent()}
            </Box>
          </Card>

          {/* Notebook Card - 33.33% */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridArea: '2 / 3 / 3 / 4',
              background: colorScheme === 'dark'
                ? 'linear-gradient(145deg, #3c2414 0%, #8b4513 40%, #d2691e 100%)'
                : 'linear-gradient(145deg, #8b4513 0%, #cd853f 40%, #daa520 100%)',
              border: `3px solid ${colorScheme === 'dark' ? '#654321' : '#8b4513'}`,
              boxShadow: colorScheme === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 32px rgba(139, 69, 19, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: colorScheme === 'dark'
                ? 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                : 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
            }}
          >
            {/* Decorative book spine */}
            <Box
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '8px',
                background: colorScheme === 'dark'
                  ? 'linear-gradient(180deg, #2d1810 0%, #4a2617 50%, #2d1810 100%)'
                  : 'linear-gradient(180deg, #654321 0%, #8b4513 50%, #654321 100%)',
                borderRight: `1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)'}`,
              }}
            />

            {/* Book cover content */}
            <Stack
              align="center"
              justify="center"
              style={{
                height: '100%',
                padding: '20px',
                paddingLeft: '28px',
              }}
            >
              {/* Decorative border frame */}
              <Box
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  right: '20px',
                  bottom: '20px',
                  border: `2px solid ${colorScheme === 'dark' ? 'rgba(244, 208, 63, 0.3)' : 'rgba(45, 24, 16, 0.2)'}`,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              />

              {/* Corner decorations */}
              {[
                { top: '16px', left: '16px' },
                { top: '16px', right: '16px' },
                { bottom: '16px', left: '16px' },
                { bottom: '16px', right: '16px' },
              ].map((pos, i) => (
                <Box
                  key={i}
                  style={{
                    position: 'absolute',
                    ...pos,
                    width: '12px',
                    height: '12px',
                    border: `2px solid ${colorScheme === 'dark' ? '#f4d03f' : '#2d1810'}`,
                    borderRadius: '2px',
                    opacity: 0.6,
                  }}
                />
              ))}

              {/* Notebook icon with elegant circle */}
              <Box
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Box
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: colorScheme === 'dark'
                      ? 'radial-gradient(circle, rgba(244, 208, 63, 0.15) 0%, rgba(244, 208, 63, 0.05) 100%)'
                      : 'radial-gradient(circle, rgba(45, 24, 16, 0.1) 0%, rgba(45, 24, 16, 0.03) 100%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(244, 208, 63, 0.2)' : 'rgba(45, 24, 16, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconBook
                    size={44}
                    style={{
                      color: colorScheme === 'dark' ? '#f4d03f' : '#2d1810',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                    }}
                  />
                </Box>
              </Box>

              {/* Title with elegant styling */}
              <Text
                size="xl"
                fw={700}
                ta="center"
                style={{
                  color: colorScheme === 'dark' ? '#f4d03f' : '#2d1810',
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  marginBottom: '6px',
                  lineHeight: 1.2,
                  letterSpacing: '1px',
                }}
              >
                MIS APUNTES
              </Text>

              {/* Decorative line under title */}
              <Box
                style={{
                  width: '60px',
                  height: '2px',
                  background: colorScheme === 'dark'
                    ? 'linear-gradient(90deg, transparent, #f4d03f, transparent)'
                    : 'linear-gradient(90deg, transparent, #2d1810, transparent)',
                  marginBottom: '12px',
                  opacity: 0.7,
                }}
              />

              {/* Subtitle */}
              <Text
                size="md"
                ta="center"
                style={{
                  color: colorScheme === 'dark' ? '#e8c547' : '#4a2617',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  marginBottom: '8px',
                  fontSize: '14px',
                }}
              >
                Notas de Estudio
              </Text>


              {/* Page indicator */}
              <Text
                size="xs"
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  right: '24px',
                  color: colorScheme === 'dark' ? 'rgba(244, 208, 63, 0.5)' : 'rgba(45, 24, 16, 0.6)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '10px',
                }}
              >
                Página 1
              </Text>

              {/* Author/owner label */}
              <Text
                size="xs"
                style={{
                  position: 'absolute',
                  bottom: '32px',
                  left: '32px',
                  color: colorScheme === 'dark' ? 'rgba(244, 208, 63, 0.5)' : 'rgba(45, 24, 16, 0.6)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '10px',
                }}
              >
                Mi Cuaderno
              </Text>
            </Stack>

            {/* Paper texture overlay */}
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 1px, transparent 1px),
                    radial-gradient(circle at 70% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
                    radial-gradient(circle at 40% 60%, rgba(0,0,0,0.05) 1px, transparent 1px)
                  `,
                backgroundSize: '20px 20px, 30px 30px, 15px 15px',
                pointerEvents: 'none',
              }}
            />
          </Card>

          {/* 3D Flip Board Countdown Calendar */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridArea: '3 / 1 / 4 / 4',
              background: colorScheme === 'dark'
                ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
                : 'linear-gradient(145deg, #2c2c2c 0%, #404040 50%, #2c2c2c 100%)',
              border: `2px solid ${colorScheme === 'dark' ? '#404040' : '#555555'}`,
              boxShadow: colorScheme === 'dark'
                ? '0 12px 40px rgba(0, 0, 0, 0.8), inset 0 2px 0 rgba(255, 255, 255, 0.1)'
                : '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Title Section */}
            <Box style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Text
                size="lg"
                fw={700}
                style={{
                  color: '#ff6b35',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  textShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
                  letterSpacing: '1px',
                  lineHeight: 1.2,
                }}
              >
                EXAMEN NACIONAL PARA ASPIRANTES A RESIDENCIAS MÉDICAS
              </Text>
            </Box>

            {/* Countdown Display */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                perspective: '1000px',
                width: '100%',
              }}
            >

              {/* Flip Boards */}
              {[
                { label: 'DÍAS', value: timeLeft.days, maxDigits: 3 },
                { label: 'HORAS', value: timeLeft.hours, maxDigits: 2 },
                { label: 'MINUTOS', value: timeLeft.minutes, maxDigits: 2 },
                { label: 'SEGUNDOS', value: timeLeft.seconds, maxDigits: 2 },
              ].map((unit, unitIndex) => (
                <Box key={unit.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Digits */}
                  <Box style={{ display: 'flex', gap: '4px' }}>
                    {unit.value.toString().padStart(unit.maxDigits, '0').split('').map((digit, digitIndex) => (
                      <Box
                        key={`${unit.label}-${digitIndex}`}
                        style={{
                          position: 'relative',
                          width: '40px',
                          height: '60px',
                          perspective: '200px',
                        }}
                      >
                        {/* Flip Board Container */}
                        <Box
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s ease-in-out',
                            animation: `flipBoard-${unitIndex}-${digitIndex} 1s ease-in-out infinite`,
                          }}
                        >
                          {/* Top Half */}
                          <Box
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '50%',
                              top: 0,
                              background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
                              border: '1px solid #333333',
                              borderRadius: '4px 4px 0 0',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                              paddingBottom: '2px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                              zIndex: 2,
                            }}
                          >
                            <Text
                              size="xl"
                              fw={700}
                              style={{
                                color: '#1a1a1a',
                                fontFamily: 'monospace',
                                lineHeight: 1,
                                fontSize: '24px',
                              }}
                            >
                              {digit}
                            </Text>
                          </Box>

                          {/* Bottom Half */}
                          <Box
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '50%',
                              bottom: 0,
                              background: 'linear-gradient(0deg, #d0d0d0 0%, #f0f0f0 100%)',
                              border: '1px solid #333333',
                              borderRadius: '0 0 4px 4px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              paddingTop: '2px',
                              boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            <Text
                              size="xl"
                              fw={700}
                              style={{
                                color: '#1a1a1a',
                                fontFamily: 'monospace',
                                lineHeight: 1,
                                fontSize: '24px',
                              }}
                            >
                              {digit}
                            </Text>
                          </Box>

                          {/* Center Line */}
                          <Box
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: 0,
                              right: 0,
                              height: '2px',
                              background: '#333333',
                              transform: 'translateY(-50%)',
                              zIndex: 3,
                              boxShadow: '0 0 4px rgba(0, 0, 0, 0.5)',
                            }}
                          />

                          {/* Flip Animation Overlay */}
                          <Box
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '50%',
                              top: 0,
                              background: 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)',
                              border: '1px solid #333333',
                              borderRadius: '4px 4px 0 0',
                              display: 'flex',
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                              paddingBottom: '2px',
                              transformOrigin: 'bottom',
                              animation: unitIndex === 3 ? `flipTop 1s ease-in-out infinite` : 'none',
                              zIndex: 4,
                            }}
                          >
                            <Text
                              size="xl"
                              fw={700}
                              style={{
                                color: '#1a1a1a',
                                fontFamily: 'monospace',
                                lineHeight: 1,
                                fontSize: '24px',
                              }}
                            >
                              {digit}
                            </Text>
                          </Box>
                        </Box>

                        {/* LED-style glow effect */}
                        <Box
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            left: '-2px',
                            right: '-2px',
                            bottom: '-2px',
                            borderRadius: '6px',
                            background: `linear-gradient(45deg,
                                rgba(255, 107, 53, 0.2) 0%,
                                rgba(255, 107, 53, 0.1) 50%,
                                rgba(255, 107, 53, 0.2) 100%)`,
                            animation: 'ledGlow 2s ease-in-out infinite alternate',
                            zIndex: -1,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Separator (except for last unit) */}
                  {unitIndex < 3 && (
                    <Box style={{ margin: '0 8px' }}>
                      <Text
                        size="xl"
                        fw={700}
                        style={{
                          color: '#ff6b35',
                          fontFamily: 'monospace',
                          animation: 'blink 1s infinite',
                        }}
                      >
                        :
                      </Text>
                    </Box>
                  )}

                  {/* Unit Label */}
                  <Box style={{ marginLeft: '8px', minWidth: '60px' }}>
                    <Text
                      size="xs"
                      fw={600}
                      ta="center"
                      style={{
                        color: '#888888',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {unit.label}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>

        {/* Mini Footer */}
        <Box
          style={{
            marginTop: '24px',
            padding: '16px',
            textAlign: 'center',
            borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.3)'}`,
          }}
        >
          <Text
            size="xs"
            style={{
              color: colorScheme === 'dark' ? '#64748b' : '#6b5b47',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
            }}
          >
            © 2025 ENARM360. Todos los derechos reservados.
          </Text>
        </Box>
      </Box>
    </>

  );
};

export default EstudianteDashboard;
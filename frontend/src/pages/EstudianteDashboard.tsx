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
import CountUpNumber from '../components/animations/CountUpNumber';
import TypewriterText from '../components/animations/TypewriterText';
import MedicalButton from '../components/animations/MedicalButton';
import MedicalLoader from '../components/animations/MedicalLoader';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
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
  IconAward,
  IconCalendar
} from '@tabler/icons-react';
import { authService } from '../services/authService';
import { EstudianteDashboardData, UsuarioInfo } from '../types/auth';

const EstudianteDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<EstudianteDashboardData | null>(null);
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
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
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex'
        }}
      >
        <Sidebar
          user={{
            username: 'Usuario',
            email: '',
          }}
          onLogout={handleLogout}
        />
        <TopHeader
          user={{
            username: 'Usuario',
            email: '',
          }}
          onLogout={handleLogout}
        />
        <Box style={{ marginLeft: '280px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '70px' }}>
          <MedicalLoader
            type="heartbeat"
            size="lg"
            text="Preparando tu espacio de estudio..."
          />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex'
        }}
      >
        <Sidebar
          user={{
            username: user?.username || 'Usuario',
            email: user?.email || '',
            roles: user?.roles || []
          }}
          onLogout={handleLogout}
        />
        <TopHeader
          user={{
            username: user?.username || 'Usuario',
            email: user?.email || '',
            roles: user?.roles || [],
            nombre: user?.nombre,
            apellidos: user?.apellidos,
          }}
          onLogout={handleLogout}
        />
        <Box style={{ marginLeft: '280px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '70px' }}>
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
      </Box>
    );
  }


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
      value: '#23',
      icon: IconTrophy,
      color: '#f59e0b',
      bg: colorScheme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)'
    },
    {
      label: 'Racha Actual',
      value: '12 días',
      icon: IconAward,
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
        `}
      </style>
      <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Sidebar
          user={{
            username: user?.username || '',
            email: user?.email || '',
            roles: user?.roles || []
          }}
          onLogout={handleLogout}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Right Side Container */}
        <Box
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            flex: 1,
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          {/* Top Header */}
          <TopHeader
            user={{
              username: user?.username || '',
              email: user?.email || '',
              roles: user?.roles || [],
              nombre: user?.nombre,
              apellidos: user?.apellidos,
            }}
            onLogout={handleLogout}
            sidebarWidth={0} // Ya no necesita sidebarWidth porque está dentro del contenedor
          />

          {/* Main Content */}
          <Box
            style={{
              flex: 1,
              padding: '32px',
              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
          {/* Countdown Timer Compacto para ENARM */}
          <Card
            padding="xl"
            radius="xl"
            mb="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Stack gap="lg">
              {/* Header compacto del countdown */}
              <Group justify="space-between" align="center">
                <Group gap="md" align="center">
                  <Box
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(14, 165, 233, 0.2)'
                        : 'rgba(14, 165, 233, 0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconCalendar size={24} style={{ color: '#0ea5e9' }} />
                  </Box>
                  <Stack gap={2}>
                    <Title
                      order={2}
                      size="1.5rem"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      Tiempo restante
                    </Title>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      23 de septiembre de 2025
                    </Text>
                  </Stack>
                </Group>
              </Group>

              {/* Contador compacto */}
              {/* Reloj dinámico con RingProgress */}
              <Group justify="center" gap="xl">
                {[
                  {
                    value: timeLeft.days,
                    label: 'Días',
                    color: '#0ea5e9',
                    max: 365,
                    gradient: { from: '#0ea5e9', to: '#06b6d4' }
                  },
                  {
                    value: timeLeft.hours,
                    label: 'Horas',
                    color: '#10b981',
                    max: 24,
                    gradient: { from: '#10b981', to: '#059669' }
                  },
                  {
                    value: timeLeft.minutes,
                    label: 'Min',
                    color: '#f59e0b',
                    max: 60,
                    gradient: { from: '#f59e0b', to: '#d97706' }
                  },
                  {
                    value: timeLeft.seconds,
                    label: 'Seg',
                    color: '#ef4444',
                    max: 60,
                    gradient: { from: '#ef4444', to: '#dc2626' }
                  }
                ].map((time, index) => {
                  const percentage = (time.value / time.max) * 100;

                  return (
                    <Transition
                      key={index}
                      mounted={true}
                      transition="scale"
                      duration={600}
                      timingFunction="spring"
                    >
                      {(styles) => (
                        <Box
                          style={{
                            ...styles,
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '12px',
                            animation: index === 3 ? 'pulse 1s ease-in-out infinite' : undefined,
                          }}
                        >
                          <Box
                            style={{
                              position: 'relative',
                            }}
                          >
                            <RingProgress
                              size={120}
                              thickness={8}
                              sections={[
                                {
                                  value: percentage,
                                  color: time.color,
                                }
                              ]}
                              label={
                                <Center>
                                  <Text
                                    size="xl"
                                    fw={700}
                                    style={{
                                      fontFamily: 'Space Grotesk, sans-serif',
                                      color: time.color,
                                      lineHeight: 1,
                                      textShadow: `0 0 10px ${time.color}40`,
                                      animation: index === 3 ? 'pulse 1s ease-in-out infinite' : undefined,
                                    }}
                                  >
                                    {time.value.toString().padStart(2, '0')}
                                  </Text>
                                </Center>
                              }
                              style={{
                                filter: `drop-shadow(0 0 20px ${time.color}30)`,
                              }}
                            />
                          </Box>

                          <Text
                            size="sm"
                            fw={600}
                            style={{
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                              fontFamily: 'Inter, sans-serif',
                              textAlign: 'center',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {time.label}
                          </Text>
                        </Box>
                      )}
                    </Transition>
                  );
                })}
              </Group>
            </Stack>
          </Card>

          {/* Sección de Logros y Ranking */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
            {/* Primer Puesto Consecutivo */}
            <Card
              padding="xl"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.4)'}`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Stack gap="md">
                <Group gap="md" align="center">
                  <Box
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconTrophy size={28} style={{ color: '#f59e0b' }} />
                  </Box>
                  <Stack gap={2}>
                    <Text
                      size="lg"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      Primer Puesto Consecutivo
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Felicidades, llevas 10 semanas en el TOP 5
                    </Text>
                  </Stack>
                </Group>
                <Box
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid rgba(245, 158, 11, 0.2)`,
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      color: '#f59e0b',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Mantén el ritmo para conservar tu posición
                  </Text>
                </Box>
              </Stack>
            </Card>

            {/* Curso Completado */}
            <Card
              padding="xl"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.4)'}`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Stack gap="md">
                <Group gap="md" align="center">
                  <Box
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconAward size={28} style={{ color: '#10b981' }} />
                  </Box>
                  <Stack gap={2}>
                    <Text
                      size="lg"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      Avanzada
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Has completado al 100% el curso de Farmacología
                    </Text>
                  </Stack>
                </Group>
                <Box
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: `1px solid rgba(16, 185, 129, 0.2)`,
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                >
                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      color: '#10b981',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Excelente dominio de la materia
                  </Text>
                </Box>
              </Stack>
            </Card>
          </SimpleGrid>

          {/* Estadísticas Generales */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg" mb="xl">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  padding="lg"
                  radius="xl"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Stack align="center" gap="sm">
                    <Box
                      style={{
                        backgroundColor: stat.bg,
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={24} style={{ color: stat.color }} />
                    </Box>
                    <Stack gap={2} align="center">
                      <Text
                        size="xl"
                        fw={700}
                        ta="center"
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                          fontFamily: 'Space Grotesk, Inter, sans-serif',
                        }}
                      >
                        {stat.value}
                      </Text>
                      <Text
                        size="sm"
                        ta="center"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {stat.label}
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>

          {/* Ranking General y Apuntes */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="xl">
            {/* Ranking General */}
            <Card
              padding="xl"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              <Stack gap="lg">
                <Group gap="md" align="center">
                  <Box
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(139, 92, 246, 0.2)'
                        : 'rgba(139, 92, 246, 0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconChartBar size={24} style={{ color: '#8b5cf6' }} />
                  </Box>
                  <Stack gap={2}>
                    <Text
                      size="lg"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      Ranking General
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Tu posición entre todos los estudiantes
                    </Text>
                  </Stack>
                </Group>
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Posición actual
                    </Text>
                    <Text size="xl" fw={700} style={{ color: '#8b5cf6', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                      #23
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Puntaje promedio
                    </Text>
                    <Text size="lg" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                      87.3%
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Card>

            {/* Apuntes */}
            <Card
              padding="xl"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Stack gap="lg">
                <Group gap="md" align="center">
                  <Box
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(14, 165, 233, 0.2)'
                        : 'rgba(14, 165, 233, 0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBook size={24} style={{ color: '#0ea5e9' }} />
                  </Box>
                  <Stack gap={2}>
                    <Text
                      size="lg"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                      }}
                    >
                      Mis Apuntes
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Tu libreta personal de estudio
                    </Text>
                  </Stack>
                </Group>
                <Stack gap="sm">
                  <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Notas guardadas: 47
                  </Text>
                  <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Última actualización: Hoy
                  </Text>
                </Stack>
                <Box
                  style={{
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    border: `1px solid rgba(14, 165, 233, 0.2)`,
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Text
                    size="sm"
                    fw={600}
                    style={{
                      color: '#0ea5e9',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Abrir Libreta
                  </Text>
                </Box>
              </Stack>
            </Card>
          </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </PageTransition>
    </>
  );
};

export default EstudianteDashboard;
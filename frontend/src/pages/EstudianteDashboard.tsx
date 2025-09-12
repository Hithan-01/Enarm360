import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppShell, 
  Container, 
  Card, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Badge, 
  Button, 
  ThemeIcon,
  SimpleGrid,
  Avatar,
  Center,
  Loader,
  Alert,
  useMantineColorScheme,
  Box,
  Menu,
  Progress,
  RingProgress,
  Divider
} from '@mantine/core';
import CountUpNumber from '../components/animations/CountUpNumber';
import TypewriterText from '../components/animations/TypewriterText';
import MedicalButton from '../components/animations/MedicalButton';
import MedicalLoader from '../components/animations/MedicalLoader';
import PageTransition from '../components/animations/PageTransition';
import Navbar from '../components/Navbar';
import { 
  IconBrain, 
  IconTrendingUp, 
  IconTarget, 
  IconSchool,
  IconMedicalCross,
  IconClipboardList,
  IconSettings,
  IconClipboardData,
  IconLogout,
  IconUserCheck,
  IconAlertCircle,
  IconSun,
  IconMoon,
  IconCalendar,
  IconAward,
  IconChartBar,
  IconBook
} from '@tabler/icons-react';
import { authService } from '../services/authService';
import { EstudianteDashboardData, UsuarioInfo } from '../types/auth';

const EstudianteDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<EstudianteDashboardData | null>(null);
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

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
            ? 'linear-gradient(135deg, #1a1b23 0%, #2d3142 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative'
        }}
      >
        <AppShell style={{ background: 'transparent' }}>
          <MedicalLoader 
            type="heartbeat" 
            size="lg" 
            text="Preparando tu espacio de estudio..." 
          />
        </AppShell>
      </Box>
    );
  }

  if (error) {
    return (
      <AppShell>
        <Container size="lg" py="xl">
          <Center h="60vh">
            <Alert 
              icon={<IconAlertCircle size={20} />} 
              color="red" 
              variant="light"
              radius="md"
              title="Error"
            >
              {error}
            </Alert>
          </Center>
        </Container>
      </AppShell>
    );
  }

  const getActionIcon = (actionName: string) => {
    switch(actionName) {
      case 'Iniciar Simulacro': return IconClipboardList;
      case 'Ver Progreso': return IconTrendingUp;
      case 'Revisar Estadísticas': return IconChartBar;
      case 'Calendario de Estudio': return IconCalendar;
      case 'Materias por Especialidad': return IconBook;
      case 'Banco de Preguntas': return IconBrain;
      default: return IconSettings;
    }
  };
  
  const getActionDescription = (actionName: string) => {
    switch(actionName) {
      case 'Iniciar Simulacro': return 'Practica con exámenes tipo ENARM';
      case 'Ver Progreso': return 'Revisa tu avance general';
      case 'Revisar Estadísticas': return 'Análisis detallado de rendimiento';
      case 'Calendario de Estudio': return 'Planifica tus sesiones de estudio';
      case 'Materias por Especialidad': return 'Estudio por especialidad médica';
      case 'Banco de Preguntas': return 'Accede a miles de reactivos';
      default: return 'Herramienta de estudio';
    }
  };

  const materiaStats = [
    { materia: 'Medicina Interna', progreso: 85, color: 'blue' },
    { materia: 'Cirugía General', progreso: 72, color: 'teal' },
    { materia: 'Pediatría', progreso: 68, color: 'green' },
    { materia: 'Ginecobstetricia', progreso: 75, color: 'violet' }
  ];

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark' 
            ? 'linear-gradient(135deg, #1a1b23 0%, #2d3142 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: colorScheme === 'dark'
          ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23374151' stroke-width='0.5' opacity='0.2'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`
          : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e2e8f0' stroke-width='0.5' opacity='0.3'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      <AppShell
        padding="md"
        style={{ background: 'transparent' }}
      >
      <Navbar 
        showAuthButtons={false} 
        onLogout={handleLogout}
        userRole="student"
        userInfo={{
          username: user?.username || '',
          email: user?.email || ''
        }}
      />

      <Container size="lg" style={{ paddingBottom: '2rem' }}>
        {/* Welcome Section */}
        <Stack gap="lg" mb="xl">
          <Center>
            <Stack gap="xs" align="center">
              <TypewriterText
                text={dashboardData?.message || "Tu Camino Hacia el ENARM"}
                component="title"
                order={1}
                size="h2"
                speed={80}
                delay={300}
                cursor={false}
                style={{ textAlign: 'center' }}
              />
              <TypewriterText
                text="Tu plataforma personalizada de preparación para el Examen Nacional de Aspirantes a Residencias Médicas"
                component="text"
                size="lg"
                speed={50}
                delay={2000}
                cursor={false}
                style={{ 
                  textAlign: 'center', 
                  maxWidth: '600px',
                  color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'
                }}
              />
            </Stack>
          </Center>
        </Stack>

        {/* Stats Cards - Primera fila */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="lg">
          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '4px solid #10b981',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Group>
              <ThemeIcon size="xl" variant="light" color="teal" radius="xl">
                <IconClipboardData size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.examenesCompletados || 0}
                  duration={2500}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Simulacros Completados
                </Text>
              </div>
            </Group>
          </Card>

          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '4px solid #0ea5e9',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Group>
              <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                <IconTarget size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.puntuacionPromedio || 0}
                  suffix="%"
                  duration={3000}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Promedio General
                </Text>
              </div>
            </Group>
          </Card>

          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '4px solid #8b5cf6',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Group>
              <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                <IconSchool size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.cursosInscritos || 0}
                  duration={2000}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Especialidades
                </Text>
              </div>
            </Group>
          </Card>

          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderLeft: '4px solid #f59e0b',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Group>
              <ThemeIcon size="xl" variant="light" color="orange" radius="xl">
                <IconBrain size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.horasEstudio || 0}
                  suffix=" h"
                  duration={2500}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Horas de Estudio
                </Text>
              </div>
            </Group>
          </Card>
        </SimpleGrid>

        {/* Progreso por Materias y Estadísticas */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="xl">
          {/* Progreso por Materias */}
          <Card 
            withBorder 
            p="lg" 
            radius="lg" 
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Title order={4} mb="md" ta="center">
              Progreso por Especialidades
            </Title>
            
            <Stack gap="md">
              {materiaStats.map((materia, index) => (
                <div key={index}>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>{materia.materia}</Text>
                    <Text size="sm" c="dimmed">{materia.progreso}%</Text>
                  </Group>
                  <Progress 
                    value={materia.progreso} 
                    color={materia.color}
                    size="md" 
                    radius="xl"
                    animated
                  />
                </div>
              ))}
            </Stack>
          </Card>

          {/* Estadísticas Rápidas */}
          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Title order={4} mb="md" ta="center">
              Tu Rendimiento
            </Title>
            
            <Center mb="md">
              <RingProgress
                size={140}
                thickness={8}
                sections={[
                  { value: dashboardData?.stats?.puntuacionPromedio || 0, color: 'teal' },
                ]}
                label={
                  <Center>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="xl" fw={700} style={{ lineHeight: 1 }}>
                        {dashboardData?.stats?.puntuacionPromedio}%
                      </Text>
                      <Text size="xs" c="dimmed" fw={500}>
                        Promedio
                      </Text>
                    </div>
                  </Center>
                }
              />
            </Center>

            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500}>Mejor Especialidad:</Text>
                <Badge variant="light" color="green" size="sm">
                  {dashboardData?.stats?.materiasMejor}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" fw={500}>Próximo Examen:</Text>
                <Badge variant="light" color="blue" size="sm">
                  {dashboardData?.stats?.proximoExamen}
                </Badge>
              </Group>
              
              <Group justify="space-between">
                <Text size="sm" fw={500}>Racha de Estudio:</Text>
                <Badge variant="light" color="orange" size="sm">
                  🔥 7 días
                </Badge>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Actions Section */}
        <Card 
          withBorder 
          p="lg" 
          radius="lg" 
          mb="xl"
          style={{
            background: colorScheme === 'dark' 
              ? 'rgba(30, 30, 40, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: colorScheme === 'dark' 
              ? '1px solid rgba(55, 65, 81, 0.6)'
              : '1px solid rgba(226, 232, 240, 0.6)'
          }}
        >
          <Title order={3} mb="md" ta="center">
            Herramientas de Estudio
          </Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {dashboardData?.actions?.map((action, index) => {
              const IconComponent = getActionIcon(action);
              const colors = ['teal', 'blue', 'violet', 'orange', 'green', 'indigo'];
              return (
                <Card 
                  key={index} 
                  withBorder 
                  p="md" 
                  radius="md"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: `3px solid ${colors[index % colors.length] === 'teal' ? '#10b981' : 
                      colors[index % colors.length] === 'blue' ? '#0ea5e9' :
                      colors[index % colors.length] === 'violet' ? '#8b5cf6' :
                      colors[index % colors.length] === 'orange' ? '#f59e0b' :
                      colors[index % colors.length] === 'green' ? '#22c55e' : '#6366f1'}`,
                    background: colorScheme === 'dark' 
                      ? 'rgba(30, 30, 40, 0.7)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: colorScheme === 'dark' 
                      ? '1px solid rgba(55, 65, 81, 0.6)'
                      : '1px solid rgba(226, 232, 240, 0.6)'
                  }}
                  className="medical-card hover-lift"
                >
                  <Group>
                    <ThemeIcon 
                      size="lg" 
                      variant="light" 
                      color={colors[index % colors.length]} 
                      radius="md"
                    >
                      <IconComponent size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="sm">
                        {action}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {getActionDescription(action)}
                      </Text>
                    </div>
                  </Group>
                  
                  <MedicalButton 
                    variant="light" 
                    color={colors[index % colors.length]} 
                    size="xs" 
                    mt="sm"
                    fullWidth
                    rippleEffect={true}
                    heartbeatHover={true}
                    morphOnClick={true}
                  >
                    Comenzar
                  </MedicalButton>
                </Card>
              );
            })}
          </SimpleGrid>
        </Card>

        {/* Quick Info & Today's Plan */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <ThemeIcon size="lg" variant="light" color="teal" radius="xl" mx="auto" mb="sm">
              <IconAward size={24} />
            </ThemeIcon>
            <Text fw={500} size="sm" c="dimmed" mb="xs">
              Nivel de Acceso
            </Text>
            <Text 
              size="lg" 
              fw={700}
              style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {dashboardData?.accessLevel}
            </Text>
          </Card>
          
          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <ThemeIcon size="lg" variant="light" color="blue" radius="xl" mx="auto" mb="sm">
              <IconCalendar size={24} />
            </ThemeIcon>
            <Text fw={500} size="sm" c="dimmed" mb="xs">
              Próxima Meta
            </Text>
            <Text size="sm" fw={600}>
              Simulacro Medicina Interna
            </Text>
            <Text size="xs" c="dimmed">
              Mañana 10:00 AM
            </Text>
          </Card>

          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            style={{
              background: colorScheme === 'dark' 
                ? 'rgba(30, 30, 40, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <ThemeIcon size="lg" variant="light" color="orange" radius="xl" mx="auto" mb="sm">
              <IconTrendingUp size={24} />
            </ThemeIcon>
            <Text fw={500} size="sm" c="dimmed" mb="xs">
              Tendencia
            </Text>
            <Text size="sm" fw={600} c="teal">
              ↗ Mejorando +5%
            </Text>
            <Text size="xs" c="dimmed">
              Última semana
            </Text>
          </Card>
        </SimpleGrid>
      </Container>
      
      {/* Professional Footer - Full Width */}
      <div 
        style={{
          width: '100%',
          background: colorScheme === 'dark' 
            ? 'rgba(30, 30, 40, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: `2px solid #10b981`,
          border: colorScheme === 'dark' 
            ? '1px solid rgba(55, 65, 81, 0.6)'
            : '1px solid rgba(226, 232, 240, 0.6)',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          padding: '2rem',
          marginTop: '2rem'
        }}
      >
        <Container size="lg">
          <Stack gap="sm" align="center">
            <Group align="center" gap="md">
              <ThemeIcon size="lg" radius="xl" variant="gradient" gradient={{ from: 'teal', to: 'green' }}>
                <IconMedicalCross size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg" style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ENARM360
                </Text>
                <Text size="sm" c="dimmed">Tu Compañero de Estudio</Text>
              </div>
            </Group>
            
            <Text size="xs" c="dimmed" ta="center" style={{ marginTop: '0.5rem' }}>
              © 2024 ENARM360. Tu plataforma personalizada de preparación para el Examen Nacional de Aspirantes a Residencias Médicas.
            </Text>
            
            <Group gap="xs">
              <Text size="xs" c="dimmed">Versión 1.0.0</Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">Panel Estudiantil</Text>
            </Group>
          </Stack>
        </Container>
      </div>
      </AppShell>
      </Box>
    </PageTransition>
  );
};

export default EstudianteDashboard;
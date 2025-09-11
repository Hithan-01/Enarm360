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
  Menu
} from '@mantine/core';
import CountUpNumber from '../components/animations/CountUpNumber';
import TypewriterText from '../components/animations/TypewriterText';
import MedicalButton from '../components/animations/MedicalButton';
import MedicalLoader from '../components/animations/MedicalLoader';
import PageTransition from '../components/animations/PageTransition';
import { 
  IconUsers, 
  IconStethoscope, 
  IconChartBar, 
  IconSchool,
  IconMedicalCross,
  IconReportAnalytics,
  IconSettings,
  IconClipboardData,
  IconLogout,
  IconUserCheck,
  IconAlertCircle,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import authService from '../services/authService';
import { AdminDashboardData, UsuarioInfo } from '../types/auth';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
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

      // Datos estáticos de ejemplo para el dashboard de admin
      setDashboardData({
        message: 'Panel de Control ENARM360',
        stats: {
          usuariosActivos: 342,
          preguntasTotales: 2847,
          examenesCreados: 156
        },
        actions: [
          'Gestionar Estudiantes',
          'Banco de Reactivos', 
          'Estadísticas Avanzadas',
          'Configurar Exámenes',
          'Reportes de Rendimiento'
        ],
        accessLevel: 'ADMINISTRADOR'
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

  const handleLogoutAll = async () => {
    try {
      await authService.logoutAll();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout all:', error);
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
            text="Cargando panel médico..." 
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
      case 'Gestionar Estudiantes': return IconUsers;
      case 'Banco de Reactivos': return IconMedicalCross;
      case 'Estadísticas Avanzadas': return IconChartBar;
      case 'Configurar Exámenes': return IconStethoscope;
      case 'Reportes de Rendimiento': return IconReportAnalytics;
      default: return IconSettings;
    }
  };
  
  const getActionDescription = (actionName: string) => {
    switch(actionName) {
      case 'Gestionar Estudiantes': return 'Administrar usuarios y permisos';
      case 'Banco de Reactivos': return 'Crear y editar preguntas del ENARM';
      case 'Estadísticas Avanzadas': return 'Análisis detallado de rendimiento';
      case 'Configurar Exámenes': return 'Configurar simulacros y cronogramas';
      case 'Reportes de Rendimiento': return 'Generar reportes de progreso';
      default: return 'Funcionalidad administrativa';
    }
  };

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
      {/* Header */}
      <Card 
        withBorder 
        mb="lg" 
        p="lg"
        style={{
          background: colorScheme === 'dark' 
            ? 'rgba(30, 30, 40, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '3px solid #0ea5e9',
          border: colorScheme === 'dark' 
            ? '1px solid rgba(55, 65, 81, 0.6)'
            : '1px solid rgba(226, 232, 240, 0.6)'
        }}
      >
        <Group justify="space-between" align="center">
          <Group align="center">
            <ThemeIcon size="xl" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'teal' }}>
              <IconStethoscope size={28} />
            </ThemeIcon>
            <div>
              <Title order={2} size="h1" style={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700
              }}>
                ENARM360
              </Title>
              <Badge 
                size="lg" 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan' }}
                style={{ textTransform: 'none' }}
              >
                Administrador
              </Badge>
            </div>
          </Group>
          
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Stack gap={0} align="flex-end">
                  <Text fw={600} size="sm">{user?.username}</Text>
                  <Text size="xs" c="dimmed">{user?.email}</Text>
                </Stack>
                
                <Avatar 
                  color="blue" 
                  radius="xl"
                  size="md"
                >
                  <IconUserCheck size={18} />
                </Avatar>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Configuración</Menu.Label>
              <Menu.Item
                leftSection={colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
                onClick={toggleColorScheme}
              >
                Cambiar a modo {colorScheme === 'dark' ? 'claro' : 'oscuro'}
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Label>Cuenta</Menu.Label>
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={handleLogoutAll}
              >
                Cerrar Todas las Sesiones
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card>

      <Container size="lg" style={{ paddingBottom: '2rem' }}>
        {/* Welcome Section */}
        <Stack gap="lg" mb="xl">
          <Center>
            <Stack gap="xs" align="center">
              <TypewriterText
                text={dashboardData?.message || "Panel de Control ENARM360"}
                component="title"
                order={1}
                size="h2"
                speed={80}
                delay={300}
                cursor={false}
                style={{ textAlign: 'center' }}
              />
              <TypewriterText
                text="Plataforma de simulación para el Examen Nacional de Aspirantes a Residencias Médicas"
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

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
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
                <IconUsers size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.usuariosActivos || 0}
                  duration={2500}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Estudiantes Activos
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
              borderLeft: '4px solid #10b981',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)'
            }}
          >
            <Group>
              <ThemeIcon size="xl" variant="light" color="teal" radius="xl">
                <IconStethoscope size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.preguntasTotales || 0}
                  duration={3000}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Reactivos ENARM
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
                <IconClipboardData size={28} />
              </ThemeIcon>
              <div>
                <CountUpNumber 
                  value={dashboardData?.stats?.examenesCreados || 0}
                  duration={2000}
                  style={{ 
                    color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                  }}
                />
                <Text size="sm" c="dimmed" fw={500}>
                  Simulacros Creados
                </Text>
              </div>
            </Group>
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
            Herramientas Administrativas
          </Title>
          
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {dashboardData?.actions?.map((action, index) => {
              const IconComponent = getActionIcon(action);
              return (
                <Card 
                  key={index} 
                  withBorder 
                  p="md" 
                  radius="md"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: '3px solid #0ea5e9',
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
                      color="blue" 
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
                    color="blue" 
                    size="xs" 
                    mt="sm"
                    fullWidth
                    rippleEffect={true}
                    heartbeatHover={true}
                    morphOnClick={true}
                  >
                    Acceder
                  </MedicalButton>
                </Card>
              );
            })}
          </SimpleGrid>
        </Card>

        {/* Quick Info */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
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
            <Text fw={500} size="sm" c="dimmed" mb="xs">
              Nivel de Acceso
            </Text>
            <Text 
              size="lg" 
              fw={700}
              style={{ 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
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
            <Text fw={500} size="sm" c="dimmed" mb="xs">
              Última Conexión
            </Text>
            <Text size="sm" fw={600}>
              {new Date().toLocaleString()}
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
          borderTop: `2px solid #0ea5e9`,
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
              <ThemeIcon size="lg" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'teal' }}>
                <IconStethoscope size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="lg" style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ENARM360
                </Text>
                <Text size="sm" c="dimmed">Simulador Médico Profesional</Text>
              </div>
            </Group>
            
            <Text size="xs" c="dimmed" ta="center" style={{ marginTop: '0.5rem' }}>
              © 2024 ENARM360. Plataforma especializada en simulacros para el Examen Nacional de Aspirantes a Residencias Médicas.
            </Text>
            
            <Group gap="xs">
              <Text size="xs" c="dimmed">Versión 1.0.0</Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">Panel Administrativo</Text>
            </Group>
          </Stack>
        </Container>
      </div>
      </AppShell>
      </Box>
    </PageTransition>
  );
};

export default AdminDashboard;
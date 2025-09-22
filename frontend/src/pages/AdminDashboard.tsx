import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Group,
  Stack,
  Alert,
  useMantineColorScheme,
  Box,
  SimpleGrid,
  Card,
  ThemeIcon,
  Button,
} from '@mantine/core';
import CountUpNumber from '../components/animations/CountUpNumber';
import MedicalLoader from '../components/animations/MedicalLoader';
import PageTransition from '../components/animations/PageTransition';
import {
  IconUsers,
  IconClipboardList,
  IconCreditCard,
  IconDatabase,
  IconStethoscope,
  IconAlertCircle,
  IconCoin,
} from '@tabler/icons-react';
import { authService } from '../services/authService';
import { AdminDashboardData, UsuarioInfo } from '../types/auth';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [user, setUser] = useState<UsuarioInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!authService.isAuthenticated()) {
        setError('You are not authenticated');
        return;
      }

      const user = authService.getCurrentUserFromStorage();
      if (user) {
        setUser(user);
      }

      // Datos estáticos para el dashboard de admin
      setDashboardData({
        message: 'Admin Control Panel',
        stats: {
          usuariosActivos: 342,
          preguntasTotales: 2847,
          examenesCreados: 156,
          preguntasPendientes: 23,
          suscripcionesActivas: 156,
          ingresosMensuales: 45000
        },
        actions: [],
        accessLevel: 'ADMINISTRATOR'
      });

    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error in logout:', error);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <MedicalLoader
          type="heartbeat"
          size="lg"
          text="Loading admin panel..."
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
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


  return (
    <PageTransition type="medical" duration={800}>
      {/* Main Content */}
      <Box
        style={{
          flex: 1,
          padding: '32px',
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      >

              {/* Main Stats Cards */}
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                      <IconUsers size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.usuariosActivos || 0}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Active Students
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="orange" radius="xl">
                      <IconClipboardList size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.preguntasPendientes || 0}
                        duration={2000}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Pending Reviews
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="green" radius="xl">
                      <IconCoin size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.ingresosMensuales || 0}
                        duration={3000}
                        prefix="$"
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Monthly Revenue
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="teal" radius="xl">
                      <IconDatabase size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.preguntasTotales || 0}
                        duration={3000}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Total Questions
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                      <IconCreditCard size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.suscripcionesActivas || 0}
                        duration={2000}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Active Subscriptions
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="red" radius="xl">
                      <IconStethoscope size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={dashboardData?.stats?.examenesCreados || 0}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b'
                        }}
                      >
                        Clinical Cases
                      </Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>


              {/* Quick Actions */}
              <Card
                radius="xl"
                p="xl"
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
                }}
              >
                <Group justify="space-between" align="center">
                  <div>
                    <Text
                      fw={600}
                      size="lg"
                      mb="xs"
                      style={{
                        color: colorScheme === 'dark' ? '#ffffff' : '#1e293b'
                      }}
                    >
                      Priority Actions
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b'
                      }}
                    >
                      {dashboardData?.stats?.preguntasPendientes} questions awaiting review
                    </Text>
                  </div>
                  <Button
                    leftSection={<IconClipboardList size={16} />}
                    onClick={() => window.location.href = '/admin/question-reviews'}
                  >
                    Review Questions
                  </Button>
                </Group>
              </Card>
        </Box>
      </PageTransition>
  );
};

export default AdminDashboard;
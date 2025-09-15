import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  useMantineColorScheme,
  Box,
  SimpleGrid,
  Card,
  Group,
  RingProgress,
  Progress,
  Tabs,
} from '@mantine/core';
import {
  IconChartBar,
  IconClock,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconBookmark,
  IconChecks,
} from '@tabler/icons-react';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { authService } from '../services/authService';

const EstadisticasPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [user] = useState(authService.getCurrentUserFromStorage());
  const [activeTab, setActiveTab] = useState<string>('general');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };

  // Datos simulados para especialidades
  const especialidades = [
    {
      id: 'general',
      nombre: 'Tabla General',
      leccionesAprobadas: 45,
      leccionesTotales: 60,
      tiempoPromedio: '1h 15min',
      precision: 70,
      tiempoReactivo: '3 min',
      resultadoUsuario: 80,
      resultadoPromedio: 73,
      tiempoPromedioGeneral: '2 min',
      color: '#0ea5e9',
      icon: IconChartBar
    },
    {
      id: 'pediatria',
      nombre: 'Pediatría',
      leccionesAprobadas: 12,
      leccionesTotales: 20,
      tiempoPromedio: '58min',
      precision: 85,
      tiempoReactivo: '2.5 min',
      resultadoUsuario: 88,
      resultadoPromedio: 76,
      tiempoPromedioGeneral: '2.2 min',
      color: '#10b981',
      icon: IconTarget
    },
    {
      id: 'cardiologia',
      nombre: 'Cardiología',
      leccionesAprobadas: 8,
      leccionesTotales: 15,
      tiempoPromedio: '1h 32min',
      precision: 65,
      tiempoReactivo: '4 min',
      resultadoUsuario: 72,
      resultadoPromedio: 68,
      tiempoPromedioGeneral: '2.8 min',
      color: '#f59e0b',
      icon: IconTrendingUp
    },
    {
      id: 'neurologia',
      nombre: 'Neurología',
      leccionesAprobadas: 6,
      leccionesTotales: 18,
      tiempoPromedio: '1h 45min',
      precision: 60,
      tiempoReactivo: '4.5 min',
      resultadoUsuario: 68,
      resultadoPromedio: 64,
      tiempoPromedioGeneral: '3 min',
      color: '#8b5cf6',
      icon: IconBookmark
    }
  ];

  // Estadísticas generales
  const estadisticasGenerales = [
    {
      label: 'Tiempo Promedio',
      value: '1h 15min',
      icon: IconClock,
      color: '#0ea5e9',
      description: 'Tiempo promedio de estudio por sesión'
    },
    {
      label: 'Precisión General',
      value: '75%',
      icon: IconTarget,
      color: '#10b981',
      description: 'Porcentaje de respuestas correctas'
    },
    {
      label: 'Progreso vs Media',
      value: '+7%',
      icon: IconTrendingUp,
      color: '#f59e0b',
      description: 'Tu resultado vs promedio general'
    },
    {
      label: 'Lecciones Completadas',
      value: '71/113',
      icon: IconChecks,
      color: '#8b5cf6',
      description: 'Total de lecciones completadas'
    }
  ];

  return (
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
            sidebarWidth={sidebarCollapsed ? 80 : 280}
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
          {/* Estadísticas Generales */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
            {estadisticasGenerales.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  padding="lg"
                  radius="md"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.5)'
                      : 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = colorScheme === 'dark'
                      ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                      : '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Group gap="md" align="flex-start">
                    <Box
                      style={{
                        backgroundColor: `${stat.color}20`,
                        padding: '12px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={24} style={{ color: stat.color }} />
                    </Box>
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Text
                        size="sm"
                        fw={500}
                        style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {stat.label}
                      </Text>
                      <Text
                        size="xl"
                        fw={700}
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                          fontFamily: 'Space Grotesk, Inter, sans-serif',
                        }}
                      >
                        {stat.value}
                      </Text>
                      <Text
                        size="xs"
                        style={{
                          color: colorScheme === 'dark' ? '#64748b' : '#94a3b8',
                          lineHeight: 1.4,
                        }}
                      >
                        {stat.description}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              );
            })}
          </SimpleGrid>

          {/* Tabs por Especialidades */}
          <Card
            padding="xl"
            radius="md"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || 'general')}
              variant="pills"
              radius="xl"
            >
              <Tabs.List mb="xl">
                {especialidades.map((especialidad) => (
                  <Tabs.Tab key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {especialidades.map((especialidad) => (
                <Tabs.Panel key={especialidad.id} value={especialidad.id}>
                  <Stack gap="xl">
                    {/* Header de la especialidad */}
                    <Group gap="md" align="center">
                      <Box
                        style={{
                          backgroundColor: `${especialidad.color}20`,
                          padding: '16px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <especialidad.icon size={32} style={{ color: especialidad.color }} />
                      </Box>
                      <Stack gap={4}>
                        <Title
                          order={2}
                          size="1.8rem"
                          fw={700}
                          style={{
                            color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                            fontFamily: 'Space Grotesk, Inter, sans-serif',
                          }}
                        >
                          {especialidad.nombre}
                        </Title>
                      </Stack>
                    </Group>

                    {/* Progreso de lecciones */}
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                      <Stack gap="md">
                        <Group justify="space-between" align="center">
                          <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                            Lecciones Aprobadas
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                            {especialidad.leccionesAprobadas} / {especialidad.leccionesTotales}
                          </Text>
                        </Group>
                        <Progress
                          value={(especialidad.leccionesAprobadas / especialidad.leccionesTotales) * 100}
                          size="xl"
                          radius="xl"
                          color={especialidad.color}
                          style={{
                            transition: 'all 0.5s ease',
                          }}
                        />
                      </Stack>

                      <Stack gap="md">
                        <Group justify="space-between" align="center">
                          <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                            Lecciones por Consultar
                          </Text>
                        </Group>
                        <Box
                          style={{
                            backgroundColor: colorScheme === 'dark'
                              ? 'rgba(55, 65, 81, 0.3)'
                              : 'rgba(248, 250, 252, 0.8)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                          }}
                        >
                          <Text
                            size="2rem"
                            fw={700}
                            style={{
                              color: especialidad.color,
                              fontFamily: 'Space Grotesk, Inter, sans-serif',
                            }}
                          >
                            {especialidad.leccionesTotales - especialidad.leccionesAprobadas}
                          </Text>
                        </Box>
                      </Stack>
                    </SimpleGrid>

                    {/* Observaciones detalladas */}
                    <Box>
                      <Title
                        order={3}
                        mb="md"
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                          fontFamily: 'Space Grotesk, Inter, sans-serif',
                        }}
                      >
                        Observaciones:
                      </Title>
                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        <Group gap="md" align="center">
                          <RingProgress
                            size={60}
                            thickness={6}
                            sections={[{ value: especialidad.precision, color: especialidad.color }]}
                            label={
                              <Text ta="center" fw={700} size="sm" style={{ color: especialidad.color }}>
                                {especialidad.precision}%
                              </Text>
                            }
                          />
                          <Stack gap={4}>
                            <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                              {especialidad.precision}% de tus respuestas son correctas
                            </Text>
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                              en cada intento
                            </Text>
                          </Stack>
                        </Group>

                        <Group gap="md" align="center">
                          <Box
                            style={{
                              backgroundColor: `${especialidad.color}20`,
                              padding: '12px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconClock size={24} style={{ color: especialidad.color }} />
                          </Box>
                          <Stack gap={4}>
                            <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                              {especialidad.tiempoPromedio} tiempo promedio de estudio
                            </Text>
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                              por sesión en esta especialidad
                            </Text>
                          </Stack>
                        </Group>

                        <Group gap="md" align="center">
                          <Box
                            style={{
                              backgroundColor: `${especialidad.color}20`,
                              padding: '12px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconTarget size={24} style={{ color: especialidad.color }} />
                          </Box>
                          <Stack gap={4}>
                            <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                              {especialidad.tiempoReactivo} es el tiempo promedio
                            </Text>
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                              de respuesta de cada reactivo
                            </Text>
                          </Stack>
                        </Group>

                        <Group gap="md" align="center">
                          <Box
                            style={{
                              backgroundColor: `${especialidad.color}20`,
                              padding: '12px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconTrendingUp size={24} style={{ color: especialidad.color }} />
                          </Box>
                          <Stack gap={4}>
                            <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                              Tu resultado es superior a la media: {especialidad.resultadoUsuario}%
                            </Text>
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                              vs {especialidad.resultadoPromedio}% promedio general
                            </Text>
                          </Stack>
                        </Group>
                      </SimpleGrid>

                      <Box
                        mt="lg"
                        p="md"
                        style={{
                          backgroundColor: colorScheme === 'dark'
                            ? 'rgba(14, 165, 233, 0.1)'
                            : 'rgba(14, 165, 233, 0.05)',
                          border: `1px solid ${colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)'}`,
                          borderRadius: '12px',
                        }}
                      >
                        <Group gap="md" align="center">
                          <Box
                            style={{
                              backgroundColor: 'rgba(14, 165, 233, 0.2)',
                              padding: '8px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconUsers size={20} style={{ color: '#0ea5e9' }} />
                          </Box>
                          <Text
                            size="sm"
                            style={{
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Al usuario general le lleva <strong>{especialidad.tiempoPromedioGeneral}</strong> responder cada reactivo
                            y el resultado promedio de esta prueba es de <strong>{especialidad.resultadoPromedio}%</strong>
                          </Text>
                        </Group>
                      </Box>
                    </Box>
                  </Stack>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Card>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default EstadisticasPage;
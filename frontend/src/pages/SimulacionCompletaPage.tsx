import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  Box,
  Button,
  useMantineColorScheme,
  Alert,
} from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { authService } from '../services/authService';

const SimulacionCompletaPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [user] = useState(authService.getCurrentUserFromStorage());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };

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
            sidebarWidth={0}
          />

          {/* Main Content */}
          <Box
            style={{
              flex: 1,
              padding: '16px 48px',
              overflow: 'hidden',
              overflowY: 'auto',
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
                Simulación Completa
              </Title>
              <Text
                size="sm"
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Experiencia real del ENARM con condiciones oficiales
              </Text>
            </Box>

            {/* Back Button */}
            <Button
              variant="subtle"
              onClick={() => navigate('/estudiante/simulador')}
              mb="md"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              }}
            >
              ← Volver a Simuladores
            </Button>

            {/* Coming Soon Card */}
            <Box
              style={{
                maxWidth: '800px',
              }}
            >
              <Alert
                color="green"
                variant="light"
                style={{
                  backgroundColor: '#e8f5e8',
                  border: '2px solid #81c784',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <Stack gap="md" align="center" ta="center">
                  <Title
                    order={3}
                    style={{
                      color: '#15803d',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    🚧 En Desarrollo
                  </Title>

                  <Text
                    size="lg"
                    style={{
                      color: '#166534',
                      marginBottom: '16px',
                    }}
                  >
                    Simulación Completa del ENARM
                  </Text>

                  <Stack gap="sm" ta="left" style={{ width: '100%', maxWidth: '500px' }}>
                    <Text size="sm" style={{ color: '#166534' }}>
                      <strong>Características del simulacro completo:</strong>
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • 450 preguntas oficiales del ENARM
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • Tiempo límite de 9 horas (igual al examen real)
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • Distribución por especialidades oficial
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • Interfaz idéntica al examen real
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • Análisis detallado de resultados
                    </Text>
                    <Text size="sm" style={{ color: '#166534' }}>
                      • Predicción de puntaje ENARM
                    </Text>
                  </Stack>

                  <Box mt="lg">
                    <Text
                      size="sm"
                      style={{
                        color: '#166534',
                        fontStyle: 'italic',
                      }}
                    >
                      Esta será la experiencia más cercana al examen real del ENARM
                    </Text>
                  </Box>
                </Stack>
              </Alert>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default SimulacionCompletaPage;
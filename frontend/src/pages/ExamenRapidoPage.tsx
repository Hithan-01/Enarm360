import React from 'react';
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

const ExamenRapidoPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

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
                Quiz Express
              </Title>
              <Text
                size="sm"
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Exámenes rápidos de 10 preguntas al azar
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
                color="blue"
                variant="light"
                style={{
                  backgroundColor: '#e0f2fe',
                  border: '2px solid #29b6f6',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <Stack gap="md" align="center" ta="center">
                  <Title
                    order={3}
                    style={{
                      color: '#1565c0',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    ⚡ Próximamente Disponible
                  </Title>

                  <Text
                    size="lg"
                    style={{
                      color: '#0d47a1',
                      marginBottom: '16px',
                    }}
                  >
                    Quiz Express - Exámenes Rápidos
                  </Text>

                  <Stack gap="sm" ta="left" style={{ width: '100%', maxWidth: '500px' }}>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      <strong>Características planeadas:</strong>
                    </Text>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      • 10 preguntas seleccionadas aleatoriamente
                    </Text>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      • Tiempo límite de 15 minutos
                    </Text>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      • Preguntas de todas las especialidades mezcladas
                    </Text>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      • Resultados inmediatos al finalizar
                    </Text>
                    <Text size="sm" style={{ color: '#0d47a1' }}>
                      • Historial de exámenes rápidos completados
                    </Text>
                  </Stack>

                  <Box mt="lg">
                    <Text
                      size="sm"
                      style={{
                        color: '#0d47a1',
                        fontStyle: 'italic',
                      }}
                    >
                      Esta funcionalidad estará disponible en futuras actualizaciones
                    </Text>
                  </Box>
                </Stack>
              </Alert>
            </Box>
      </Box>
    </Box>
  );
};

export default ExamenRapidoPage;
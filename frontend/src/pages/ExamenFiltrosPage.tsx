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

const ExamenFiltrosPage: React.FC = () => {
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
                Examen con Filtros
              </Title>
              <Text
                size="sm"
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Practica con criterios específicos y filtros avanzados
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
                color="orange"
                variant="light"
                style={{
                  backgroundColor: '#fff3e0',
                  border: '2px solid #ffcc02',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <Stack gap="md" align="center" ta="center">
                  <Title
                    order={3}
                    style={{
                      color: '#ea580c',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    🚧 Próximamente Disponible
                  </Title>

                  <Text
                    size="lg"
                    style={{
                      color: '#9a3412',
                      marginBottom: '16px',
                    }}
                  >
                    Examen con Filtros Avanzados
                  </Text>

                  <Stack gap="sm" ta="left" style={{ width: '100%', maxWidth: '500px' }}>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      <strong>Funcionalidades planeadas:</strong>
                    </Text>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      • Filtrar por preguntas contestadas previamente
                    </Text>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      • Seleccionar por nivel de dificultad
                    </Text>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      • Filtrar por resultados anteriores (correctas/incorrectas)
                    </Text>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      • Búsqueda por palabras clave en preguntas
                    </Text>
                    <Text size="sm" style={{ color: '#9a3412' }}>
                      • Filtros por fecha de última respuesta
                    </Text>
                  </Stack>

                  <Box mt="lg">
                    <Text
                      size="sm"
                      style={{
                        color: '#9a3412',
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

export default ExamenFiltrosPage;
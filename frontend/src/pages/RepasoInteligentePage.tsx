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
import PageTransition from '../components/animations/PageTransition';

const RepasoInteligentePage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  return (
    <PageTransition type="medical" duration={800}>
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
                Repaso Inteligente
              </Title>
              <Text
                size="sm"
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                IA personalizada que identifica y refuerza tus áreas de oportunidad
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
                color="violet"
                variant="light"
                style={{
                  backgroundColor: '#f3e5f5',
                  border: '2px solid #ce93d8',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <Stack gap="md" align="center" ta="center">
                  <Title
                    order={3}
                    style={{
                      color: '#7c3aed',
                      fontFamily: 'Space Grotesk, Inter, sans-serif',
                    }}
                  >
                    🧠 Innovación en Desarrollo
                  </Title>

                  <Text
                    size="lg"
                    style={{
                      color: '#6b46c1',
                      marginBottom: '16px',
                    }}
                  >
                    Sistema de Repaso Inteligente con IA
                  </Text>

                  <Stack gap="sm" ta="left" style={{ width: '100%', maxWidth: '500px' }}>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      <strong>Tecnología de inteligencia artificial:</strong>
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Análisis de patrones de respuesta individuales
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Identificación automática de áreas débiles
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Generación de exámenes personalizados
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Algoritmos adaptativos de dificultad
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Predicciones de rendimiento en tiempo real
                    </Text>
                    <Text size="sm" style={{ color: '#6b46c1' }}>
                      • Recomendaciones de estudio personalizadas
                    </Text>
                  </Stack>

                  <Box mt="lg">
                    <Text
                      size="sm"
                      style={{
                        color: '#6b46c1',
                        fontStyle: 'italic',
                      }}
                    >
                      La próxima generación en preparación médica personalizada
                    </Text>
                  </Box>
                </Stack>
              </Alert>
            </Box>
      </Box>
    </PageTransition>
  );
};

export default RepasoInteligentePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  useMantineColorScheme,
  Box,
} from '@mantine/core';
import {
  IconPlus,
} from '@tabler/icons-react';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import { authService } from '../services/authService';

const CrearPreguntasPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [user, setUser] = useState(authService.getCurrentUserFromStorage());

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
        <Sidebar user={user || { username: '', email: '' }} onLogout={handleLogout} />

        <Box
          style={{
            marginLeft: '280px',
            flex: 1,
            padding: '32px',
          }}
        >
          {/* Header */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <Box
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(236, 72, 153, 0.2)'
                  : 'rgba(236, 72, 153, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconPlus
                size={32}
                style={{ color: '#ec4899' }}
              />
            </Box>
            <Stack gap={4}>
              <Title
                order={1}
                style={{
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                }}
              >
                Crear Preguntas
              </Title>
              <Text
                size="lg"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Contribuye con nuevas preguntas
              </Text>
            </Stack>
          </Box>

          {/* Contenido principal - Próximamente */}
          <Box
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`,
            }}
          >
            <Title
              order={2}
              mb="md"
              style={{
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              }}
            >
              ➕ Próximamente
            </Title>
            <Text
              size="lg"
              mb="xl"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Herramienta especial para usuarios con permisos de creación. Podrás contribuir al banco de preguntas
              del ENARM con reactivos validados y de alta calidad.
            </Text>
            <Stack gap="md" align="center">
              <Text
                size="sm"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                }}
              >
                Características que incluirá:
              </Text>
              <Box
                style={{
                  display: 'flex',
                  gap: '48px',
                  justifyContent: 'center',
                }}
              >
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  ✓ Editor de preguntas
                </Text>
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  ✓ Sistema de validación
                </Text>
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  ✓ Gestión de imágenes
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default CrearPreguntasPage;
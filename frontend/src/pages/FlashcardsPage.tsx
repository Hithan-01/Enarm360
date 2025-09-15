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
  IconBrain,
} from '@tabler/icons-react';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { authService } from '../services/authService';

const FlashcardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [user, setUser] = useState(authService.getCurrentUserFromStorage());
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
        <Sidebar
          user={user || { username: '', email: '' }}
          onLogout={handleLogout}
          onCollapseChange={setSidebarCollapsed}
        />

        <Box
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            transition: 'margin-left 0.3s ease',
            flex: 1,
            minHeight: '100vh',
          }}
        >
          {/* TopHeader */}
          <TopHeader
            user={{
              username: user?.username || '',
              email: user?.email || '',
              roles: user?.roles || [],
            }}
            onLogout={handleLogout}
            sidebarWidth={sidebarCollapsed ? 80 : 280}
          />

          {/* Content Area */}
          <Box style={{ padding: '32px' }}>
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
                  ? 'rgba(139, 92, 246, 0.2)'
                  : 'rgba(139, 92, 246, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconBrain
                size={32}
                style={{ color: '#8b5cf6' }}
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
                Flashcards
              </Title>
              <Text
                size="lg"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Repasa conceptos con tarjetas inteligentes
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
              🧠 Próximamente
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
              El sistema de flashcards estará disponible pronto. Podrás crear mazos personalizados,
              utilizar repetición espaciada y repasar conceptos clave de cada especialidad médica.
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
                  ✓ Mazos por especialidad
                </Text>
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  ✓ Repetición espaciada
                </Text>
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  ✓ Progreso de aprendizaje
                </Text>
              </Box>
            </Stack>
          </Box>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default FlashcardsPage;
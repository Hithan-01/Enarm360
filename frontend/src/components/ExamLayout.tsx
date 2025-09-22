import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Group, Text, Button, Avatar, Menu, useMantineColorScheme } from '@mantine/core';
import { IconLogout, IconUser, IconHome, IconX } from '@tabler/icons-react';
import { authService } from '../services/authService';

const ExamLayout: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [user] = useState(authService.getCurrentUserFromStorage());

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };

  const handleExitExam = () => {
    if (window.confirm('¿Estás seguro de que quieres salir del examen? Se perderá el progreso actual.')) {
      navigate('/estudiante/dashboard');
    }
  };

  const getUserName = () => {
    if (user?.nombre && user?.apellidos) {
      return `${user.nombre} ${user.apellidos}`;
    }
    return user?.username || 'Usuario';
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Minimal Top Bar for Exam */}
      <Box
        style={{
          height: '60px',
          background: colorScheme === 'dark'
            ? 'rgba(15, 23, 42, 0.9)'
            : 'rgba(247, 243, 238, 0.9)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${
            colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
          }`,
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left - Logo/Brand */}
        <Group gap="sm">
          <Text
            size="lg"
            fw={700}
            style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
            }}
          >
            ENARM360
          </Text>
          <Box
            style={{
              padding: '4px 8px',
              backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '4px',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
          >
            <Text
              size="xs"
              fw={600}
              style={{
                color: colorScheme === 'dark' ? '#fca5a5' : '#dc2626',
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              EXAMEN EN CURSO
            </Text>
          </Box>
        </Group>

        {/* Center - Current User Info */}
        <Group gap="sm">
          <Text
            size="sm"
            style={{
              color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Estudiante:
          </Text>
          <Text
            size="sm"
            fw={600}
            style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {getUserName()}
          </Text>
        </Group>

        {/* Right - Exit and Profile */}
        <Group gap="sm">
          {/* Exit Exam Button */}
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconX size={16} />}
            onClick={handleExitExam}
            style={{
              color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Salir del Examen
          </Button>

          {/* Profile Menu */}
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <Avatar
                size="sm"
                style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(160, 142, 115, 0.3)',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  cursor: 'pointer',
                }}
              >
                <IconUser size={16} />
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(247, 243, 238, 0.9)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Menu.Label
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {getUserName()}
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconHome size={16} />}
                onClick={() => handleExitExam()}
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Ir al Dashboard
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
                style={{
                  color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Cerrar Sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>

      {/* Main Exam Content - Full Screen */}
      <Box
        style={{
          flex: 1,
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>

      {/* Optional: Minimal Footer with Warning */}
      <Box
        style={{
          padding: '8px 24px',
          background: colorScheme === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(247, 243, 238, 0.8)',
          borderTop: `1px solid ${
            colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'
          }`,
          textAlign: 'center',
        }}
      >
        <Text
          size="xs"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          ⚠️ Modo Examen Activo - Evita salir de esta página para no perder el progreso
        </Text>
      </Box>
    </Box>
  );
};

export default ExamLayout;
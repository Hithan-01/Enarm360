import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Text,
  Group,
  Box,
  Title,
  useMantineColorScheme,
  UnstyledButton,
} from '@mantine/core';
import {
  IconUser,
  IconChartBar,
  IconCreditCard,
  IconBell,
  IconShield,
  IconSettings,
  IconChevronRight,
} from '@tabler/icons-react';
import ProfileContent from '../components/profile/ProfileContent';

interface SettingSectionProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  description: string;
  section: string;
  isActive: boolean;
  onClick: (section: string) => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  icon: Icon,
  label,
  description,
  section,
  isActive,
  onClick,
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box
      p="md"
      style={{
        backgroundColor: isActive
          ? (colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(160, 142, 115, 0.3)')
          : 'transparent',
        border: isActive
          ? `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(160, 142, 115, 0.5)'}`
          : '1px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={() => onClick(section)}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = colorScheme === 'dark'
            ? 'rgba(55, 65, 81, 0.3)'
            : 'rgba(242, 237, 230, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group justify="flex-start" align="center" gap="sm" wrap="nowrap">
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#5a5550'),
          flexShrink: 0
        }}>
          <Icon size={20} />
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={500}
            size="sm"
            style={{
              color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'),
              fontFamily: 'Outfit, Inter, sans-serif',
              lineHeight: 1.3,
              textAlign: 'left',
            }}
          >
            {label}
          </Text>
          <Text
            size="xs"
            style={{
              color: isActive ? '#e0e7ff' : (colorScheme === 'dark' ? '#94a3b8' : '#5a5550'),
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2,
              textAlign: 'left',
            }}
          >
            {description}
          </Text>
        </Box>
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#94a3b8' : '#5a5550'),
          flexShrink: 0
        }}>
          <IconChevronRight size={16} />
        </Box>
      </Group>
    </Box>
  );
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const { colorScheme } = useMantineColorScheme();

  // Determinar la sección activa desde los parámetros de la URL
  const getCurrentSection = () => {
    return section || 'profile'; // default
  };

  const [activeSection, setActiveSection] = useState(getCurrentSection());

  // Sincronizar el estado con los parámetros de la URL
  useEffect(() => {
    setActiveSection(getCurrentSection());
  }, [section]);

  const settingSections = [
    {
      icon: IconUser,
      label: 'Perfil',
      description: 'Información personal',
      section: 'profile',
    },
    {
      icon: IconChartBar,
      label: 'Estadísticas',
      description: 'Rendimiento',
      section: 'stats',
    },
    {
      icon: IconCreditCard,
      label: 'Suscripción',
      description: 'Plan y facturación',
      section: 'subscription',
    },
    {
      icon: IconBell,
      label: 'Notificaciones',
      description: 'Alertas y avisos',
      section: 'notifications',
    },
    {
      icon: IconShield,
      label: 'Privacidad',
      description: 'Seguridad',
      section: 'privacy',
    },
    {
      icon: IconSettings,
      label: 'Cuenta',
      description: 'Configuraciones',
      section: 'account',
    },
  ];

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (section === 'profile') {
      navigate('/settings');
    } else {
      navigate(`/settings/${section}`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileContent />;
      case 'stats':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Estadísticas
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Gráficos de rendimiento y progreso
            </Text>
          </Box>
        );
      case 'subscription':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Suscripción
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Gestión de plan y facturación
            </Text>
          </Box>
        );
      case 'notifications':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Notificaciones
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuración de alertas
            </Text>
          </Box>
        );
      case 'privacy':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Privacidad
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuración de privacidad
            </Text>
          </Box>
        );
      case 'account':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Cuenta
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuraciones de cuenta
            </Text>
          </Box>
        );
      default:
        return <ProfileContent />;
    }
  };

  return (
    <Container size="xl" py="md" style={{ paddingTop: '2rem' }}>
      <Box
        style={{
          display: 'flex',
          gap: '2rem',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Settings Sidebar */}
        <Box
          style={{
            width: '300px',
            flexShrink: 0,
          }}
        >
          <Box
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
              position: 'sticky',
              top: '2rem',
              height: 'fit-content',
            }}
          >
            <Box p="lg">
              <Text
                size="lg"
                fw={700}
                mb="lg"
                style={{
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                }}
              >
                Configuración
              </Text>

              <Stack gap="sm">
                {settingSections.map((section) => (
                  <SettingSection
                    key={section.section}
                    icon={section.icon}
                    label={section.label}
                    description={section.description}
                    section={section.section}
                    isActive={activeSection === section.section}
                    onClick={handleSectionClick}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Contenido Principal */}
        <Box style={{ flex: 1 }}>
          {renderContent()}
        </Box>
      </Box>

      {/* Mini footer */}
      <Box
        style={{
          marginTop: '3rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
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
          © 2024 ENARM360. Todos los derechos reservados.
        </Text>
      </Box>
    </Container>
  );
};

export default SettingsPage;
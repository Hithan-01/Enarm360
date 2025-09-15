import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import PageTransition from '../components/animations/PageTransition';
import ProfileContent from '../components/profile/ProfileContent';
import { authService } from '../services/authService';

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
          ? (colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)')
          : 'transparent',
        backdropFilter: isActive ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isActive ? 'blur(20px) saturate(180%)' : 'none',
        border: isActive
          ? `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`
          : '1px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isActive
          ? (colorScheme === 'dark'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(59, 130, 246, 0.2)'
            : '0 4px 12px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)')
          : 'none',
      }}
      onClick={() => onClick(section)}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = colorScheme === 'dark'
            ? 'rgba(55, 65, 81, 0.3)'
            : 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
          (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.backdropFilter = 'none';
          (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
        }
      }}
    >
      <Group justify="flex-start" align="center" gap="sm" wrap="nowrap">
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#64748b'),
          flexShrink: 0
        }}>
          <Icon size={20} />
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={500}
            size="sm"
            style={{
              color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'),
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
              color: isActive ? '#e0e7ff' : (colorScheme === 'dark' ? '#94a3b8' : '#64748b'),
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2,
              textAlign: 'left',
            }}
          >
            {description}
          </Text>
        </Box>
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#94a3b8' : '#94a3b8'),
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

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userInfo = authService.getCurrentUserFromStorage();
  const userRole = authService.isAdmin() ? 'admin' : 'student';

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
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }}>
              Estadísticas
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
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
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }}>
              Suscripción
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
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
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }}>
              Notificaciones
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
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
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }}>
              Privacidad
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
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
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
              borderRadius: '16px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }}>
              Cuenta
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Próximamente: Configuraciones de cuenta
            </Text>
          </Box>
        );
      default:
        return <ProfileContent />;
    }
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Forzar colapso del sidebar al cargar la página
  useEffect(() => {
    setSidebarCollapsed(true);
  }, []);

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
      }}
    >
      {/* Textura de fondo */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: colorScheme === 'dark'
            ? `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23374151" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`
            : `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23e2e8f0" stroke-width="0.5" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        user={{
          username: userInfo?.username || '',
          email: userInfo?.email || '',
          roles: userRole === 'admin' ? ['ADMIN'] : ['ESTUDIANTE'],
        }}
        onLogout={handleLogout}
        onCollapseChange={setSidebarCollapsed}
        initialCollapsed={true}
      />

      {/* Container principal con TopHeader y contenido */}
      <Box
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '280px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* TopHeader */}
        <TopHeader
          user={{
            username: userInfo?.username || '',
            email: userInfo?.email || '',
            roles: userRole === 'admin' ? ['ADMIN'] : ['ESTUDIANTE'],
          }}
          onLogout={handleLogout}
          sidebarWidth={sidebarCollapsed ? 80 : 280}
        />

        {/* Contenido principal */}
        <Container size="xl" py="md">
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
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                  borderRadius: '16px',
                  boxShadow: colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
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
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
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
        </Container>
      </Box>
    </Box>
  );
};

export default SettingsPage;
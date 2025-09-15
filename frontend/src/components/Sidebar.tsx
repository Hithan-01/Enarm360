import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Text,
  Group,
  useMantineColorScheme,
  UnstyledButton,
  Avatar,
  Divider,
  ActionIcon,
  Image,
  Tooltip,
} from '@mantine/core';
import enarmLogo from '../assets/enarm_logo.png';
import {
  IconDashboard,
  IconClipboardList,
  IconBrain,
  IconChartBar,
  IconTrophy,
  IconPlus,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconChevronLeft,
  IconUsers,
  IconStethoscope,
  IconCreditCard,
  IconDatabase,
  IconShieldCheck,
  IconReportAnalytics,
} from '@tabler/icons-react';

interface SidebarProps {
  user: {
    username: string;
    email: string;
    roles?: string[];
  };
  onLogout: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  initialCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onCollapseChange, initialCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);


  const handleCollapseChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
  };

  // Notificar el estado inicial
  useEffect(() => {
    onCollapseChange?.(initialCollapsed);
  }, [initialCollapsed, onCollapseChange]);

  // Determinar si el usuario es admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');

  // Menús para administrador
  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: IconDashboard,
      path: '/admin/dashboard',
    },
    {
      id: 'clinical-cases',
      label: 'Clinical Cases',
      icon: IconStethoscope,
      path: '/admin/clinical-cases',
    },
    {
      id: 'question-reviews',
      label: 'Question Reviews',
      icon: IconClipboardList,
      path: '/admin/question-reviews',
    },
    {
      id: 'statistics',
      label: 'User Statistics',
      icon: IconChartBar,
      path: '/admin/statistics',
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions & Finance',
      icon: IconCreditCard,
      path: '/admin/subscriptions',
    },
    {
      id: 'question-database',
      label: 'Question Database',
      icon: IconDatabase,
      path: '/admin/question-database',
    },
    {
      id: 'permissions',
      label: 'User Permissions',
      icon: IconShieldCheck,
      path: '/admin/permissions',
    },
  ];

  // Menús para estudiante
  const studentMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: IconDashboard,
      path: '/estudiante/dashboard',
    },
    {
      id: 'simulador',
      label: 'Simulador',
      icon: IconClipboardList,
      path: '/estudiante/simulador',
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: IconBrain,
      path: '/estudiante/flashcards',
    },
    {
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: IconChartBar,
      path: '/estudiante/estadisticas',
    },
    {
      id: 'rankings',
      label: 'Rankings',
      icon: IconTrophy,
      path: '/estudiante/rankings',
    },
  ];

  // Agregar "Crear Preguntas" si el usuario tiene permisos de creator
  if (user?.roles?.includes('ROLE_CREATOR') || user?.roles?.includes('CREATOR')) {
    studentMenuItems.push({
      id: 'preguntas',
      label: 'Crear Preguntas',
      icon: IconPlus,
      path: '/estudiante/preguntas',
    });
  }

  // Usar el menú correspondiente según el rol
  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const settingsItems = [
    {
      id: 'settings',
      label: 'Configuración',
      icon: IconSettings,
      path: '/settings',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const MenuItem: React.FC<{
    item: {
      id: string;
      label: string;
      icon: React.ComponentType<any>;
      path: string;
    };
  }> = ({ item }) => {
    const IconComponent = item.icon;
    const active = isActive(item.path);

    if (isCollapsed) {
      return (
        <Tooltip label={item.label} position="right" withArrow>
          <UnstyledButton
            onClick={() => navigate(item.path)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '25px',
              backgroundColor: active
                ? colorScheme === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(255, 255, 255, 0.6)'
                : 'transparent',
              backdropFilter: active ? 'blur(20px) saturate(180%)' : 'none',
              WebkitBackdropFilter: active ? 'blur(20px) saturate(180%)' : 'none',
              border: active
                ? `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)'}`
                : '1px solid transparent',
              boxShadow: active
                ? colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 4px 12px rgba(0, 0, 0, 0.08)'
                : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                  ? 'rgba(55, 65, 81, 0.4)'
                  : 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.backdropFilter = 'none';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
              }
            }}
          >
            <IconComponent
              size={20}
              style={{
                color: active
                  ? colorScheme === 'dark'
                    ? '#e2e8f0'
                    : '#1e293b'
                  : colorScheme === 'dark'
                  ? '#94a3b8'
                  : '#64748b',
              }}
            />
          </UnstyledButton>
        </Tooltip>
      );
    }

    return (
      <UnstyledButton
        onClick={() => navigate(item.path)}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '25px',
          backgroundColor: active
            ? colorScheme === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.6)'
            : 'transparent',
          backdropFilter: active ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: active ? 'blur(20px) saturate(180%)' : 'none',
          border: active
            ? `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)'}`
            : '1px solid transparent',
          boxShadow: active
            ? colorScheme === 'dark'
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 4px 12px rgba(0, 0, 0, 0.08)'
            : 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = colorScheme === 'dark'
              ? 'rgba(55, 65, 81, 0.4)'
              : 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
            (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
            e.currentTarget.style.boxShadow = colorScheme === 'dark'
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)'
              : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.backdropFilter = 'none';
            (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0px)';
          }
        }}
      >
        <Group gap="sm">
          <IconComponent
            size={20}
            style={{
              color: active
                ? colorScheme === 'dark'
                  ? '#e2e8f0'
                  : '#1e293b'
                : colorScheme === 'dark'
                ? '#94a3b8'
                : '#64748b',
            }}
          />
          <Text
            size="sm"
            fw={active ? 600 : 400}
            style={{
              color: active
                ? colorScheme === 'dark'
                  ? '#e2e8f0'
                  : '#1e293b'
                : colorScheme === 'dark'
                ? '#94a3b8'
                : '#64748b',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {item.label}
          </Text>
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <Box
      style={{
        width: isCollapsed ? '80px' : '280px',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: colorScheme === 'dark'
          ? 'rgba(30, 41, 59, 0.7)'
          : 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderRight: `1px solid ${
          colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
        }`,
        padding: isCollapsed ? '24px 16px' : '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 900,
        transition: 'all 0.3s ease',
        boxShadow: colorScheme === 'dark'
          ? 'inset 1px 0 0 rgba(255, 255, 255, 0.05), 4px 0 20px rgba(0, 0, 0, 0.1)'
          : 'inset 1px 0 0 rgba(255, 255, 255, 0.8), 4px 0 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header with Logo and Collapse Button */}
      <Box mb="xl" style={{ position: 'relative' }}>
        {isCollapsed ? (
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {/* Logo compacto */}
            <Box
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '25px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src={enarmLogo}
                alt="ENARM360"
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            {/* Botón expandir */}
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={() => handleCollapseChange(false)}
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${
                  colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                }`,
                borderRadius: '25px',
                width: '32px',
                height: '32px',
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 2px 0 rgba(255, 255, 255, 0.15), 0 6px 20px rgba(0, 0, 0, 0.15)'
                  : '0 6px 20px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
              }}
            >
              <IconMenu2 size={16} />
            </ActionIcon>
          </Box>
        ) : (
          <Box>
            {/* Logo expandido */}
            <Group justify="center" mb="md">
              <Box
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={enarmLogo}
                  alt="ENARM360"
                  style={{
                    width: '56px',
                    height: '56px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Group>
            {/* Botón colapsar */}
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={() => handleCollapseChange(true)}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${
                  colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                }`,
                borderRadius: '25px',
                width: '32px',
                height: '32px',
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 2px 0 rgba(255, 255, 255, 0.15), 0 6px 20px rgba(0, 0, 0, 0.15)'
                  : '0 6px 20px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
              }}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
          </Box>
        )}
      </Box>


      {/* Main Navigation */}
      <Stack gap="xs" style={{ flex: 1, minHeight: 0, overflow: 'visible' }}>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </Stack>

      {/* Bottom Section */}
      <Box style={{ flexShrink: 0, marginTop: 'auto' }}>
        <Divider
          my="md"
          color={colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
        />
        <Stack gap="xs">
          {settingsItems.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
          {isCollapsed ? (
            <Tooltip label="Cerrar Sesión" position="right" withArrow>
              <UnstyledButton
                onClick={onLogout}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '25px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
                  (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
                  e.currentTarget.style.boxShadow = colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(239, 68, 68, 0.1)'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.backdropFilter = 'none';
                  (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                }}
              >
                <IconLogout
                  size={20}
                  style={{
                    color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                  }}
                />
              </UnstyledButton>
            </Tooltip>
          ) : (
            <UnstyledButton
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '25px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(239, 68, 68, 0.1)'
                  : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px rgba(239, 68, 68, 0.08)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.backdropFilter = 'none';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Group gap="sm">
                <IconLogout
                  size={20}
                  style={{
                    color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                  }}
                />
                <Text
                  size="sm"
                  style={{
                    color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cerrar Sesión
                </Text>
              </Group>
            </UnstyledButton>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;
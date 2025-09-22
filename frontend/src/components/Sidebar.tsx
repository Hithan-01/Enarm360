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
  Menu,
} from '@mantine/core';
import enarmLogo from '../assets/enarm_logo.png';
import {
  IconDashboard,
  IconClipboardList,
  IconChartBar,
  IconTrophy,
  IconPlus,
  IconSettings,
  IconChevronDown,
  IconUser,
  IconSun,
  IconMoon,
  IconLogout,
  IconChevronLeft,
  IconStethoscope,
  IconCreditCard,
  IconDatabase,
  IconShieldCheck,
  IconMessages,
  IconMailbox,
  IconBell,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
} from '@tabler/icons-react';

interface SidebarProps {
  user: {
    username: string;
    email: string;
    roles?: string[];
    nombre?: string;
    apellidos?: string;
  };
  onLogout: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
  initialCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onCollapseChange, initialCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);


  const handleCollapseChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
  };

  // Notificar el estado inicial
  useEffect(() => {
    onCollapseChange?.(initialCollapsed);
  }, [initialCollapsed, onCollapseChange]);

  // Actualizar estado cuando initialCollapsed cambie
  useEffect(() => {
    setIsCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  // Determinar si el usuario es admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');

  // Menús para administrador
  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: IconDashboard,
      path: '/admin/dashboard',
    },
    {
      id: 'clinical-cases',
      label: 'Casos Clínicos',
      icon: IconStethoscope,
      path: '/admin/clinical-cases',
    },
    {
      id: 'question-reviews',
      label: 'Revisión de Preguntas',
      icon: IconClipboardList,
      path: '/admin/question-reviews',
    },
    {
      id: 'statistics',
      label: 'Estadísticas',
      icon: IconChartBar,
      path: '/admin/statistics',
    },
    {
      id: 'subscriptions',
      label: 'Finanzas',
      icon: IconCreditCard,
      path: '/admin/subscriptions',
    },
    {
      id: 'question-database',
      label: 'Reactivos',
      icon: IconDatabase,
      path: '/admin/question-database',
    },
    {
      id: 'permissions',
      label: 'Permisos de Usuario',
      icon: IconShieldCheck,
      path: '/admin/permissions',
    },
  ];

  // Menús de comunidad para administradores
  const adminCommunityItems = [
    {
      id: 'forum',
      label: 'Foro',
      icon: IconMessages,
      path: '/admin/forum',
    },
    {
      id: 'requests',
      label: 'Solicitudes',
      icon: IconMailbox,
      path: '/admin/solicitudes',
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: IconBell,
      path: '/admin/notificaciones',
    },
  ];

  // Menús para estudiante
  const studentMenuItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
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

  // Menús de comunidad para estudiantes
  const studentCommunityItems = [
    {
      id: 'forum',
      label: 'Foro',
      icon: IconMessages,
      path: '/estudiante/forum',
    },
    {
      id: 'requests',
      label: 'Solicitudes',
      icon: IconMailbox,
      path: '/estudiante/solicitudes',
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: IconBell,
      path: '/estudiante/notificaciones',
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
  const communityItems = isAdmin ? adminCommunityItems : studentCommunityItems;


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
              border: active
                ? `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)'}`
                : '1px solid transparent',
              boxShadow: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                  ? 'rgba(55, 65, 81, 0.4)'
                  : 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
              }
            }}
          >
            <IconComponent
              size={18}
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
          padding: '8px 12px',
          borderRadius: '25px',
          backgroundColor: active
            ? colorScheme === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.6)'
            : 'transparent',
          border: active
            ? `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)'}`
            : '1px solid transparent',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = colorScheme === 'dark'
              ? 'rgba(55, 65, 81, 0.4)'
              : 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0px)';
          }
        }}
      >
        <Group gap="xs">
          <IconComponent
            size={18}
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
            size="xs"
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
              opacity: isCollapsed ? 0 : 1,
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isCollapsed ? '0s' : '0.1s',
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
        width: isCollapsed ? '60px' : '220px',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: colorScheme === 'dark'
          ? 'rgba(30, 41, 59, 0.7)'
          : 'rgba(247, 243, 238, 0.8)',
        borderRight: `1px solid ${
          colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
        }`,
        padding: isCollapsed ? '16px 12px' : '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 900,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Header with Logo and Collapse Button */}
      <Box mb="xl" style={{ position: 'relative', height: '70px', display: 'flex', alignItems: 'flex-start' }}>
        {/* Container con altura fija para evitar saltos */}
        <Box style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          alignItems: isCollapsed ? 'center' : 'flex-start',
          justifyContent: isCollapsed ? 'flex-start' : 'space-between',
          gap: isCollapsed ? '8px' : '0px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Logo con tamaño fijo para transición suave */}
          <Box
            style={{
              width: isCollapsed ? '40px' : '60px',
              height: isCollapsed ? '40px' : '60px',
              borderRadius: isCollapsed ? '25px' : '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
            }}
          >
            <Image
              src={enarmLogo}
              alt="ENARM360"
              style={{
                width: isCollapsed ? '36px' : '56px',
                height: isCollapsed ? '36px' : '56px',
                objectFit: 'contain',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </Box>

          {/* Botón de colapso/expansión con posición fija */}
          <Box
            onClick={() => handleCollapseChange(!isCollapsed)}
            style={{
              position: isCollapsed ? 'static' : 'absolute',
              top: isCollapsed ? 'auto' : '0px',
              right: isCollapsed ? 'auto' : '0px',
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {isCollapsed ? (
              <IconLayoutSidebarRightCollapse size={18} />
            ) : (
              <IconLayoutSidebarLeftCollapse size={18} />
            )}
          </Box>
        </Box>
      </Box>


      {/* Main Navigation */}
      <Stack gap="xs" style={{ flex: 1, minHeight: 0, overflow: 'visible', alignItems: isCollapsed ? 'center' : 'stretch' }}>
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}

        <Divider
          my="md"
          color={colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
        />

        {communityItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </Stack>

      {/* Bottom Section */}
      <Box style={{ flexShrink: 0, marginTop: 'auto' }}>
        <Divider
          my="md"
          color={colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
        />
        <Stack gap="xs" style={{ alignItems: isCollapsed ? 'center' : 'stretch' }}>
          {isCollapsed ? (
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Menu shadow="md" width={200} position="top" withArrow zIndex={1000}>
                <Menu.Target>
                  <Tooltip label="Perfil" position="right" withArrow>
                    <UnstyledButton
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '25px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(30, 41, 59, 0.7)'
                          : 'rgba(255, 255, 255, 0.25)',
                        border: `1px solid ${
                          colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                        }`,
                        boxShadow: colorScheme === 'dark'
                          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                          : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      <Avatar
                        size={28}
                        style={{
                          backgroundColor: colorScheme === 'dark' ? '#374151' : '#e2e8f0',
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {user.nombre && user.apellidos
                          ? `${user.nombre.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()
                          : user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    </UnstyledButton>
                  </Tooltip>
                </Menu.Target>

                <Menu.Dropdown
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: `2px solid ${
                      colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'
                    }`,
                    borderRadius: '12px',
                    boxShadow: colorScheme === 'dark'
                      ? '0 10px 40px rgba(0, 0, 0, 0.4)'
                      : '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 4px 0 rgba(255, 255, 255, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2), 0 2px 8px rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Menu.Item
                    leftSection={<IconUser size={16} />}
                    onClick={() => window.location.href = '/settings'}
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Mi Perfil
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<IconSettings size={16} />}
                    onClick={() => window.location.href = '/settings'}
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Configuración
                  </Menu.Item>

                  <Menu.Item
                    leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                    onClick={toggleColorScheme}
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {colorScheme === 'dark' ? 'Tema Claro' : 'Tema Oscuro'}
                  </Menu.Item>

                  <Menu.Divider style={{
                    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }} />

                  <Menu.Item
                    leftSection={<IconLogout size={16} />}
                    onClick={onLogout}
                    style={{
                      color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Cerrar Sesión
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Box>
          ) : (
            <Menu shadow="md" width={200} position="top" withArrow zIndex={1000}>
              <Menu.Target>
                <UnstyledButton
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '25px',
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    border: `1px solid ${
                      colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                    }`,
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                      ? 'rgba(55, 65, 81, 0.4)'
                      : 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.boxShadow = colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.08)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  <Group gap="xs">
                    <Avatar
                      size={24}
                      style={{
                        backgroundColor: colorScheme === 'dark' ? '#374151' : '#e2e8f0',
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {user.nombre && user.apellidos
                        ? `${user.nombre.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase()
                        : user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="xs"
                        fw={600}
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user.nombre && user.apellidos
                          ? `${user.nombre} ${user.apellidos}`
                          : user.username}
                      </Text>
                      <Text
                        size="10px"
                        style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                          fontFamily: 'Inter, sans-serif',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ADMIN')
                          ? 'Administrador'
                          : user.roles?.includes('ROLE_CREATOR') || user.roles?.includes('CREATOR')
                          ? 'Creador'
                          : 'Estudiante'}
                      </Text>
                    </Box>
                    <IconChevronDown
                      size={14}
                      style={{
                        color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                        flexShrink: 0,
                      }}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${
                    colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'
                  }`,
                  borderRadius: '12px',
                  boxShadow: 'none',
                }}
              >
                <Menu.Item
                  leftSection={<IconUser size={16} />}
                  onClick={() => window.location.href = '/settings'}
                  style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Mi Perfil
                </Menu.Item>

                <Menu.Item
                  leftSection={<IconSettings size={16} />}
                  onClick={() => window.location.href = '/settings'}
                  style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Configuración
                </Menu.Item>

                <Menu.Item
                  leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                  onClick={toggleColorScheme}
                  style={{
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {colorScheme === 'dark' ? 'Tema Claro' : 'Tema Oscuro'}
                </Menu.Item>

                <Menu.Divider style={{
                  borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }} />

                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  onClick={onLogout}
                  style={{
                    color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cerrar Sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;
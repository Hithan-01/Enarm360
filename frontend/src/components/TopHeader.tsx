import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Group,
  Avatar,
  Stack,
  Text,
  UnstyledButton,
  TextInput,
  ActionIcon,
  useMantineColorScheme,
  Menu,
  Divider,
  Title,
} from '@mantine/core';
import {
  IconSearch,
  IconBell,
  IconChevronDown,
  IconUser,
  IconMoon,
  IconSun,
  IconLogout,
} from '@tabler/icons-react';

interface TopHeaderProps {
  user: {
    username: string;
    email: string;
    roles?: string[];
    nombre?: string;
    apellidos?: string;
  };
  onLogout: () => void;
  sidebarWidth?: number;
}

const TopHeader: React.FC<TopHeaderProps> = ({ user, onLogout, sidebarWidth = 280 }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();

  // Función para obtener el título de la página actual
  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/simulador')) return 'Simulador';
    if (path.includes('/flashcards')) return 'Flashcards';
    if (path.includes('/estadisticas')) return 'Estadísticas';
    if (path.includes('/rankings')) return 'Rankings';
    if (path.includes('/preguntas')) return 'Crear Preguntas';
    if (path.includes('/settings')) return 'Configuración';

    return 'Dashboard';
  };

  const userRole = user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ADMIN')
    ? 'Administrador'
    : user.roles?.includes('ROLE_CREATOR') || user.roles?.includes('CREATOR')
    ? 'Creador'
    : 'Estudiante';

  // Obtener el nombre completo del usuario
  const displayName = (user.nombre && user.apellidos)
    ? `${user.nombre} ${user.apellidos}`
    : user.username;

  // Obtener las iniciales para el avatar
  const getInitials = () => {
    if (user.nombre && user.apellidos) {
      return `${user.nombre.charAt(0)}${user.apellidos.charAt(0)}`.toUpperCase();
    }
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <Box
      style={{
        position: 'static',
        height: '70px',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))'
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.6), rgba(226, 232, 240, 0.4))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
      }}
    >
      {/* Left side - Page Title */}
      <Title
        order={2}
        size="1.75rem"
        fw={700}
        style={{
          color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
          fontFamily: 'Space Grotesk, Inter, sans-serif',
          letterSpacing: '-0.02em',
          margin: 0,
          paddingLeft: '32px',
        }}
      >
        {getPageTitle()}
      </Title>

      {/* Spacer */}
      <Box style={{ flex: 1 }} />

      {/* Right side - Search, Notifications and Profile */}
      <Group gap="sm" align="center">
        {/* Search */}
        <Box style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Search Input Container */}
          <Box
            style={{
              width: searchExpanded ? '300px' : '0px',
              opacity: searchExpanded ? 1 : 0,
              transform: searchExpanded ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.9)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pointerEvents: searchExpanded ? 'auto' : 'none',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '50px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
              }`,
              borderRadius: '25px',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              paddingLeft: '45px',
              paddingRight: '45px',
            }}
          >
            <IconSearch
              size={16}
              style={{
                position: 'absolute',
                left: '16px',
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                flexShrink: 0
              }}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onBlur={() => {
                if (!searchValue) {
                  setSearchExpanded(false);
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                fontSize: '14px',
                width: '100%',
                height: '100%',
                fontFamily: 'Inter, sans-serif',
                paddingLeft: '0px',
              }}
              {...(searchExpanded && { autoFocus: true })}
            />
            <ActionIcon
              size={20}
              variant="subtle"
              onClick={() => {
                setSearchValue('');
                setSearchExpanded(false);
              }}
              style={{
                position: 'absolute',
                right: '16px',
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                background: 'transparent',
                '&:hover': {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              ✕
            </ActionIcon>
          </Box>

          {/* Search Button */}
          <ActionIcon
            variant="subtle"
            size={50}
            onClick={() => setSearchExpanded(true)}
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
              }`,
              borderRadius: '50%',
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: searchExpanded ? 'scale(0) rotate(90deg)' : 'scale(1) rotate(0deg)',
              opacity: searchExpanded ? 0 : 1,
              pointerEvents: searchExpanded ? 'none' : 'auto',
              position: searchExpanded ? 'absolute' : 'relative',
              right: searchExpanded ? '0' : 'auto',
            }}
          >
            <IconSearch size={20} />
          </ActionIcon>
        </Box>
        {/* Notifications */}
        <ActionIcon
          variant="subtle"
          size={50}
          style={{
            backgroundColor: colorScheme === 'dark'
              ? 'rgba(30, 41, 59, 0.7)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: `1px solid ${
              colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
            }`,
            borderRadius: '50%',
            color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
            boxShadow: colorScheme === 'dark'
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
        >
          <IconBell size={20} />
        </ActionIcon>

        {/* Profile Section */}
        <Menu shadow="md" width={200} position="bottom-end" withArrow>
          <Menu.Target>
            <UnstyledButton
              style={{
                padding: '8px 16px 8px 50px', // Left padding for avatar
                borderRadius: '25px',
                height: '50px',
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${
                  colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
                }`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 25px rgba(0, 0, 0, 0.4)'
                  : '0 6px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                e.currentTarget.style.boxShadow = colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
              }}
            >
              <Avatar
                size={34}
                style={{
                  backgroundColor: colorScheme === 'dark' ? '#374151' : '#e2e8f0',
                  border: `2px solid ${
                    colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                  }`,
                  boxShadow: colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {getInitials()}
              </Avatar>

              <Group gap="xs" align="center" style={{ flex: 1 }}>
                <Stack gap={1} style={{ minWidth: 0, maxWidth: '100px' }}>
                  <Text
                    size="sm"
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
                    {displayName}
                  </Text>
                  <Text
                    size="xs"
                    style={{
                      color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userRole}
                  </Text>
                </Stack>
                <IconChevronDown
                  size={16}
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
              backdropFilter: 'blur(60px) saturate(180%) brightness(110%)',
              WebkitBackdropFilter: 'blur(60px) saturate(180%) brightness(110%)',
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
      </Group>
    </Box>
  );
};

export default TopHeader;
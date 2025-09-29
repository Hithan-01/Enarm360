import React, { useState, useRef, useEffect } from 'react';
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
  IconHelp,
} from '@tabler/icons-react';
import NotificationDropdown from './NotificationDropdown';

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
  const { colorScheme } = useMantineColorScheme();
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Función para obtener el nombre del usuario
  const getUserName = () => {
    if (user.nombre && user.apellidos) {
      return `${user.nombre} ${user.apellidos}`;
    }
    return user.username;
  };

  // Shortcut para enfocar el buscador con ⌘K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <Box
      style={{
        position: 'static',
        height: '70px',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))'
          : 'linear-gradient(135deg, rgba(247, 243, 238, 0.8), rgba(242, 237, 230, 0.6))',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
        borderBottom: `1px solid ${
          colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
        }`,
      }}
    >
      {/* Left side - Welcome Message */}
      <Box>
        <Text
          size="xs"
          ta="left"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Bienvenido,
        </Text>
        <Text
          size="sm"
          fw={700}
          ta="left"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {getUserName()}
        </Text>
      </Box>

      {/* Center - Search Bar */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <Box
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '500px',
            height: '36px',
            backgroundColor: colorScheme === 'dark'
              ? 'rgba(30, 41, 59, 0.7)'
              : 'rgba(247, 243, 238, 0.8)',
            border: `1px solid ${
              colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
            }`,
            borderRadius: '18px',
            paddingLeft: '40px',
            paddingRight: '50px',
          }}
        >
          <IconSearch
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
              fontSize: '14px',
              width: '100%',
              height: '100%',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '2px 6px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(221, 216, 209, 0.5)',
              borderRadius: '4px',
              fontSize: '11px',
              color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}
          >
            ⌘K
          </Box>
        </Box>
      </Box>

      {/* Right side - Notifications and Profile */}
      <Group gap="sm" align="center">
        {/* Notifications */}
        <NotificationDropdown />

        {/* Help Button */}
        <ActionIcon
          variant="subtle"
          size={36}
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
          <IconHelp size={18} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default TopHeader;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Group,
  Button,
  Image,
  useMantineColorScheme,
  Menu,
  Avatar,
  Text,
  Stack,
  Switch
} from '@mantine/core';
import { IconSun, IconMoon, IconUserCheck, IconLogout, IconUser, IconSettings } from '@tabler/icons-react';
import enarmLogo from '../assets/enarm_logo.png';

interface NavbarProps {
  showAuthButtons?: boolean;
  showThemeToggle?: boolean;
  onLogout?: () => void;
  userRole?: 'student' | 'admin' | null;
  userInfo?: {
    username?: string;
    email?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({
  showAuthButtons = true,
  showThemeToggle = true,
  onLogout,
  userRole,
  userInfo
}) => {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (userRole === 'student') {
      navigate('/estudiante/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Card
      withBorder={false}
      mb="xl"
      p="lg"
      radius={0}
      style={{
        background: scrolled
          ? colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(255, 255, 255, 0.25)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(40px) saturate(200%)' : 'none',
        borderBottom: scrolled
          ? `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`
          : 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        boxShadow: scrolled
          ? colorScheme === 'dark'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          : 'none',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        padding: '0 2rem'
      }}>
        <Group align="center" gap="xs">
          <Image
            src={enarmLogo}
            alt="ENARM360 Logo"
            height={50}
            fit="contain"
            style={{
              borderRadius: '8px',
              maxWidth: '200px',
              cursor: 'pointer'
            }}
            onClick={handleLogoClick}
          />
        </Group>
        
        <Group gap="md">
          {showThemeToggle && !userRole && (
            <Button
              variant="subtle"
              leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
              onClick={toggleColorScheme}
              size="sm"
            >
              {colorScheme === 'dark' ? 'Claro' : 'Oscuro'}
            </Button>
          )}
          
          {showAuthButtons && !userRole && (
            <>
              <Button
                variant="outline"
                style={{
                  borderColor: 'white',
                  color: 'white',
                  backgroundColor: 'transparent'
                }}
                onClick={() => navigate('/login')}
                size="sm"
              >
                Iniciar Sesión
              </Button>
              
              <Button 
                style={{
                  background: 'rgb(196, 213, 70)',
                  color: 'rgb(54, 71, 91)',
                  border: 'none'
                }}
                onClick={() => navigate('/register')}
                size="sm"
              >
                Registrarse
              </Button>
            </>
          )}

          {userRole && onLogout && userInfo && (
            <Menu shadow="md" width={250} position="bottom-end">
              <Menu.Target>
                <Group style={{ cursor: 'pointer' }}>
                  <Stack gap={0} align="flex-end">
                    <Text fw={600} size="sm">{userInfo.username}</Text>
                    <Text size="xs" c="dimmed">{userInfo.email}</Text>
                  </Stack>
                  
                  <Avatar 
                    color={userRole === 'student' ? 'teal' : 'blue'}
                    radius="xl"
                    size="md"
                  >
                    <IconUserCheck size={18} />
                  </Avatar>
                </Group>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Configuración</Menu.Label>
                <Menu.Item closeMenuOnClick={false}>
                  <Group justify="space-between" align="center" w="100%">
                    <Group gap="xs">
                      {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                      <Text size="sm">
                        Modo {colorScheme === 'dark' ? 'Claro' : 'Oscuro'}
                      </Text>
                    </Group>
                    <Switch
                      checked={colorScheme === 'dark'}
                      onChange={toggleColorScheme}
                      size="sm"
                      onLabel={<IconMoon size={12} />}
                      offLabel={<IconSun size={12} />}
                    />
                  </Group>
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Label>Cuenta</Menu.Label>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate('/settings')}
                >
                  Configuración
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={onLogout}
                  color="red"
                >
                  Cerrar Sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </div>
    </Card>
  );
};

export default Navbar;
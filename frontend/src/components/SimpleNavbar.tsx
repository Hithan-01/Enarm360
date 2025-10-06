import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Group,
  Button,
  Image,
  useMantineColorScheme,
  Menu,
  Avatar,
  Text,
  Switch
} from '@mantine/core';
import { IconSun, IconMoon, IconUserCheck, IconLogout, IconSettings, IconDashboard } from '@tabler/icons-react';
import { profileService } from '../services/profileService';
import enarmLogo from '../assets/enarm_logo_noletter.png';

interface SimpleNavbarProps {
  showAuthButtons?: boolean;
  showThemeToggle?: boolean;
  showDropdownTheme?: boolean;
  onLogout?: () => void;
  userRole?: 'student' | 'admin' | null;
  userInfo?: {
    username?: string;
    email?: string;
    avatar?: string;
    nombre?: string;
    apellido?: string;
  };
}

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  showAuthButtons = true,
  showThemeToggle = true,
  showDropdownTheme = true,
  onLogout,
  userRole,
  userInfo
}) => {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
    <div style={{
      background: 'transparent',
      padding: '24px',
      // Sin position, sin z-index, sin nada - completamente normal
    }}>
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
                  borderColor: 'rgb(54, 71, 91)',
                  color: 'rgb(54, 71, 91)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600
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
                <Avatar
                  src={userInfo.avatar ? profileService.getAvatarUrl(userInfo.avatar) : null}
                  color={userRole === 'student' ? 'teal' : 'blue'}
                  radius="xl"
                  size="md"
                  style={{ cursor: 'pointer' }}
                >
                  {!userInfo.avatar && (
                    userInfo.nombre && userInfo.apellido
                      ? `${userInfo.nombre.charAt(0)}${userInfo.apellido.charAt(0)}`.toUpperCase()
                      : userInfo.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </Avatar>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{userInfo.username}</Menu.Label>
                <Text size="xs" c="dimmed" px="sm" pb="xs">{userInfo.email}</Text>
                
                <Menu.Divider />
                
                {/* Navegación */}
                <Menu.Label>Navegación</Menu.Label>
                <Menu.Item
                  leftSection={<IconDashboard size={14} />}
                  onClick={() => {
                    if (userRole === 'admin') {
                      navigate('/admin/dashboard');
                    } else if (userRole === 'student') {
                      navigate('/estudiante/dashboard');
                    }
                  }}
                >
                  Ir al Dashboard
                </Menu.Item>
                
                <Menu.Divider />
                
                {/* Configuración - solo mostrar tema si showDropdownTheme es true */}
                {showDropdownTheme && (
                  <>
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
                  </>
                )}
                
                {/* Cuenta */}
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
    </div>
  );
};

export default SimpleNavbar;
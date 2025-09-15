import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  TextInput, 
  PasswordInput, 
  Button, 
  Title, 
  Text, 
  Container,
  Alert,
  Stack,
  Center,
  Group,
  ThemeIcon,
  useMantineColorScheme,
  Box,
  Image,
  ActionIcon
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconStethoscope, IconUser, IconLock, IconAlertCircle, IconSun, IconMoon, IconBrandGoogle, IconBrandFacebook, IconBrandApple } from '@tabler/icons-react';
import authService from '../services/authService';
import { LoginRequest, UserRole } from '../types/auth';
import enarmLogo from '../assets/enarm_logo.png';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginRequest>({
    login: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // No hacer redirección automática al cargar - solo al hacer login

  const handleThemeToggle = () => {
    setIsTransitioning(true);

    // Cambiar tema con transición CSS suave simple
    setTimeout(() => {
      toggleColorScheme();
    }, 150);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(credentials);
      console.log('Login exitoso:', response);
      console.log('Response completa:', JSON.stringify(response, null, 2));
      
      notifications.show({
        title: 'Login Successful',
        message: 'Redirecting to dashboard...',
        color: 'blue',
        autoClose: 2000,
      });
      
      // Redirigir basado en el rol del usuario de la respuesta
      const { usuario } = response;
      console.log('Usuario objeto:', usuario);
      console.log('Usuario roles:', usuario?.roles);
      console.log('Tipo de roles:', Array.isArray(usuario?.roles) ? 'array' : typeof usuario?.roles);
      
      if (usuario?.roles) {
        console.log('Roles individuales:');
        if (Array.isArray(usuario.roles)) {
          usuario.roles.forEach((role, index) => {
            console.log(`Rol ${index}:`, role, `(tipo: ${typeof role})`);
          });
        } else {
          console.log('Roles no es un array:', usuario.roles);
        }
      }
      
      // Redirigir usando navigate con lógica mejorada
      const hasAdminRole = usuario?.roles?.includes(UserRole.ADMIN) || 
                          usuario?.roles?.includes('ADMIN');
      const hasEstudianteRole = usuario?.roles?.includes(UserRole.ESTUDIANTE) || 
                               usuario?.roles?.includes('ESTUDIANTE');
      
      console.log('hasAdminRole:', hasAdminRole);
      console.log('hasEstudianteRole:', hasEstudianteRole);
      console.log('UserRole.ADMIN:', UserRole.ADMIN);
      console.log('UserRole.ESTUDIANTE:', UserRole.ESTUDIANTE);
      
      if (hasAdminRole) {
        console.log('✅ Cumple condición ADMIN - Redirigiendo a admin dashboard');
        navigate('/admin/dashboard');
      } else if (hasEstudianteRole) {
        console.log('✅ Cumple condición ESTUDIANTE - Redirigiendo a estudiante dashboard');
        navigate('/estudiante/dashboard');
      } else {
        console.log('❌ No cumple ninguna condición específica - Redirigiendo a dashboard general');
        console.log('Roles recibidos:', usuario?.roles);
        navigate('/dashboard');
      }
      
    } catch (err: any) {
      console.error('Error en login:', err);
      
      let errorMessage = 'Server error. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (err.response?.status === 423) {
        errorMessage = 'User blocked';
      } else if (err.response?.status === 403) {
        errorMessage = 'User disabled';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      notifications.show({
        title: 'Authentication Error',
        message: errorMessage,
        color: 'red',
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          /* Smooth theme transitions */
          * {
            transition: background-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        backdrop-filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          }

          /* Theme toggle button animations */
          [data-theme-toggle] {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          [data-theme-toggle]:hover {
            transform: scale(1.08) rotate(15deg);
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
          }

          [data-theme-toggle]:active {
            transform: scale(0.95) rotate(30deg);
          }
        `}
      </style>
      <Box
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden'
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

      {/* Dark Mode Toggle */}
      <ActionIcon
        onClick={handleThemeToggle}
        variant="light"
        size="lg"
        radius="xl"
        data-theme-toggle
        disabled={isTransitioning}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 10,
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
          boxShadow: colorScheme === 'dark'
            ? '0 4px 16px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'inherit',
        }}
      >
        {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
      </ActionIcon>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}>
        <Container size={420} style={{ width: '100%', maxWidth: '420px' }}>
        <Paper
          radius="xl"
          p="xl"
          withBorder
          style={{
            width: '100%',
            backgroundColor: colorScheme === 'dark'
              ? 'rgba(30, 41, 59, 0.7)'
              : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
            boxShadow: colorScheme === 'dark'
              ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
              : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}
        >
          <Stack gap="lg">
            <Center>
              <Stack align="center" gap="sm">
                <Image 
                  src={enarmLogo} 
                  alt="ENARM360 Logo" 
                  height={80}
                  fit="contain"
                  style={{ 
                    borderRadius: '12px',
                    maxWidth: '250px',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/')}
                />
                <Text size="sm" c="dimmed" ta="center">
                  Simulador Médico Profesional
                </Text>
              </Stack>
            </Center>

            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  placeholder="Email"
                  name="login"
                  value={credentials.login}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  leftSection={<IconUser size={16} />}
                  radius="xl"
                  size="lg"
                  styles={{
                    input: {
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(30, 41, 59, 0.6)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(40px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)'}`,
                      boxShadow: colorScheme === 'dark'
                        ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.2)'
                        : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                    }
                  }}
                />

                <PasswordInput
                  placeholder="Password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  leftSection={<IconLock size={16} />}
                  radius="xl"
                  size="lg"
                  styles={{
                    input: {
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(30, 41, 59, 0.6)'
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(40px) saturate(200%)',
                      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)'}`,
                      boxShadow: colorScheme === 'dark'
                        ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.2)'
                        : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Inter, sans-serif',
                    }
                  }}
                />

                <Group justify="flex-end">
                  <Text
                    size="sm"
                    style={{
                      color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onClick={() => {
                      // TODO: Implement password recovery logic
                      console.log('Recover password');
                    }}
                  >
                    Forgot password?
                  </Text>
                </Group>

                {error && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    radius="xl"
                    variant="light"
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(239, 68, 68, 0.05)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      border: `1px solid rgba(239, 68, 68, 0.2)`,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={!credentials.login || !credentials.password}
                  size="lg"
                  radius="xl"
                  variant="light"
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.8)'
                      : 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                    fontFamily: 'Space Grotesk, Inter, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.025em',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </form>

            {/* Divider */}
            <Group justify="center" gap="md" my="lg">
              <Box style={{
                flex: 1,
                height: '1px',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }} />
              <Text size="sm" c="dimmed" style={{ fontFamily: 'Inter, sans-serif' }}>
                or continue with
              </Text>
              <Box style={{
                flex: 1,
                height: '1px',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }} />
            </Group>

            {/* Social Login Buttons */}
            <Group justify="center" gap="md" mb="lg">
              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(219, 68, 55, 0.1)'
                    : 'rgba(219, 68, 55, 0.05)',
                  color: '#db4437',
                  border: `1px solid rgba(219, 68, 55, 0.2)`,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
                onClick={() => {
                  // TODO: Implement Google OAuth
                  console.log('Login with Google');
                }}
              >
                <IconBrandGoogle size={20} />
              </ActionIcon>

              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(59, 89, 152, 0.1)'
                    : 'rgba(59, 89, 152, 0.05)',
                  color: '#3b5998',
                  border: `1px solid rgba(59, 89, 152, 0.2)`,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
                onClick={() => {
                  // TODO: Implement Facebook OAuth
                  console.log('Login with Facebook');
                }}
              >
                <IconBrandFacebook size={20} />
              </ActionIcon>

              <ActionIcon
                size="xl"
                radius="xl"
                variant="light"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                }}
                onClick={() => {
                  // TODO: Implement Apple OAuth
                  console.log('Login with Apple');
                }}
              >
                <IconBrandApple size={20} />
              </ActionIcon>
            </Group>

            <Center>
              <Text size="sm" c="dimmed">
                Don't have an account?{' '}
                <Text
                  component="span"
                  size="sm"
                  c="blue"
                  style={{ cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => navigate('/register')}
                >
                  Sign up here
                </Text>
              </Text>
            </Center>
          </Stack>
        </Paper>
        </Container>
      </div>
    </Box>
    </>
  );
};

export default Login;
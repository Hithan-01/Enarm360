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
import { IconStethoscope, IconUser, IconLock, IconAlertCircle, IconSun, IconMoon } from '@tabler/icons-react';
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
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // No hacer redirección automática al cargar - solo al hacer login

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
        title: 'Login Exitoso',
        message: 'Redirigiendo al panel de control...',
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
      
      let errorMessage = 'Error del servidor. Inténtalo de nuevo.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Credenciales inválidas';
      } else if (err.response?.status === 423) {
        errorMessage = 'Usuario bloqueado';
      } else if (err.response?.status === 403) {
        errorMessage = 'Usuario deshabilitado';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      notifications.show({
        title: 'Error de Autenticación',
        message: errorMessage,
        color: 'red',
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: colorScheme === 'dark' 
          ? 'linear-gradient(135deg, #1a1b23 0%, #2d3142 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: colorScheme === 'dark'
          ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23374151' stroke-width='0.5' opacity='0.2'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`
          : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e2e8f0' stroke-width='0.5' opacity='0.3'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Dark Mode Toggle */}
      <ActionIcon
        onClick={toggleColorScheme}
        variant="light"
        size="lg"
        radius="xl"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 10
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
            background: colorScheme === 'dark' 
              ? 'rgba(30, 30, 40, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: colorScheme === 'dark' 
              ? '1px solid rgba(55, 65, 81, 0.6)'
              : '1px solid rgba(226, 232, 240, 0.6)',
            boxShadow: colorScheme === 'dark'
              ? '0 25px 50px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)'
              : '0 25px 50px rgba(15, 23, 42, 0.1), 0 8px 16px rgba(15, 23, 42, 0.05)'
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
                  label="Usuario o Email"
                  placeholder="Ingresa tu usuario o email"
                  name="login"
                  value={credentials.login}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  leftSection={<IconUser size={16} />}
                  radius="md"
                  size="md"
                />

                <PasswordInput
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  leftSection={<IconLock size={16} />}
                  radius="md"
                  size="md"
                />

                {error && (
                  <Alert 
                    icon={<IconAlertCircle size={16} />} 
                    color="red" 
                    radius="md"
                    variant="light"
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={!credentials.login || !credentials.password}
                  size="md"
                  radius="md"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  variant="gradient"
                  style={{ marginTop: '0.5rem' }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </form>

            <Center>
              <Text size="sm" c="dimmed">
                ¿No tienes una cuenta?{' '}
                <Text component="span" size="sm" c="blue" style={{ cursor: 'pointer', fontWeight: 500 }}>
                  Contacta al administrador
                </Text>
              </Text>
            </Center>
          </Stack>
        </Paper>
        </Container>
      </div>
    </Box>
  );
};

export default Login;
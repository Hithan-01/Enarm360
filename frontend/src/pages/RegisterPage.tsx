import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Paper,
  TextInput,
  PasswordInput,
  Select,
  Alert,
  LoadingOverlay,
  Divider,
  useMantineColorScheme,
  Box,
  ActionIcon,
  Center,
  Image,
  Grid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconMail,
  IconLock,
  IconSchool,
  IconCalendar,
  IconCheck,
  IconAlertCircle,
  IconArrowLeft,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/animations/PageTransition';
import { registroService } from '../services/registroService';
import { authService } from '../services/authService';
import { RegistroRequest } from '../types/registro';
import enarmLogo from '../assets/enarm_logo.png';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  // Verificar si el usuario ya está autenticado y mostrar alerta
  const [existingSession, setExistingSession] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setExistingSession(true);
      const user = authService.getCurrentUserFromStorage();
      setCurrentUser(user?.username || user?.email || 'Usuario desconocido');
    }
  }, []);

  // Easter egg: detectar cuando se completen campos importantes
  const handleLogoutExistingSession = async () => {
    try {
      await authService.logout();
      setExistingSession(false);
      setCurrentUser('');
      notifications.show({
        title: 'Sesión cerrada',
        message: 'La sesión anterior ha sido cerrada exitosamente',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar limpieza local incluso si falla la petición al servidor
      authService.clearTokens();
      setExistingSession(false);
      setCurrentUser('');
      notifications.show({
        title: 'Sesión cerrada',
        message: 'La sesión anterior ha sido eliminada localmente',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />
      });
    }
  };

  const checkEasterEgg = () => {
    const { nombre, apellido, email, password } = form.values;
    if (nombre && apellido && email && password && !easterEggTriggered) {
      const messages = [
        "¡Vas genial! 🩺 El futuro médico está tomando forma...",
        "¡Excelente progreso! 🏥 Tu camino hacia el ENARM se ve prometedor...",
        "¡Increíble dedicación! ⚕️ Los pacientes del futuro te lo agradecerán...",
        "¡Bien hecho! 💊 Cada campo completado es un paso hacia tu especialización...",
        "¡Fantástico! 🧬 Tu perfil médico está cobrando vida..."
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMotivationalMessage(randomMessage);
      setEasterEggTriggered(true);

      // Limpiar mensaje después de 4 segundos
      setTimeout(() => {
        setMotivationalMessage('');
      }, 4000);
    }
  };

  const form = useForm<RegistroRequest>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      universidad: '',
      anioGraduacion: new Date().getFullYear(),
      especialidadInteres: '',
      terminosAceptados: false
    },
    validate: {
      username: (value: string) => {
        if (!value || value.length < 3) return 'El nombre de usuario debe tener al menos 3 caracteres';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo letras, números y guiones bajos';
        return null;
      },
      email: (value: string) => {
        if (!value) return 'El correo electrónico es obligatorio';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Correo electrónico inválido';
        return null;
      },
      password: (value: string) => {
        if (!value || value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return null;
      },
      confirmPassword: (value: string, values) => {
        if (value !== values.password) return 'Las contraseñas no coinciden';
        return null;
      },
      nombre: (value: string) => (!value || value.length < 2 ? 'El nombre es obligatorio' : null),
      apellido: (value: string) => (!value || value.length < 2 ? 'El apellido es obligatorio' : null),
      anioGraduacion: (value: number | undefined) => {
        if (value) {
          const currentYear = new Date().getFullYear();
          if (value < 1950 || value > currentYear + 10) {
            return 'Año de graduación inválido';
          }
        }
        return null;
      }
    }
  });

  const checkEmailAvailability = async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return;
    
    try {
      setCheckingEmail(true);
      const result = await registroService.checkEmailAvailability(email);
      if (!result.available) {
        form.setFieldError('email', 'Este correo ya está registrado');
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setCheckingEmail(false);
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) return;
    
    try {
      setCheckingUsername(true);
      const result = await registroService.checkUsernameAvailability(username);
      if (!result.available) {
        form.setFieldError('username', 'Este nombre de usuario no está disponible');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Crear cuenta - mapear campos según el backend RegistroRequest.java
      const registroData = {
        username: values.username,
        email: values.email,
        nombre: values.nombre,
        apellidos: values.apellido, // backend espera "apellidos" no "apellido"
        contrasena: values.password, // backend espera "contrasena" no "rawPassword"
        confirmarContrasena: values.confirmPassword, // backend espera "confirmarContrasena"
        telefono: values.telefono || '',
        pais: values.universidad || '' // mapear universidad a pais por ahora
      };
      
      // Debug: verificar qué se está enviando
      console.log('Datos enviados al backend (mapeados):', registroData);
      
      const response = await registroService.crearCuenta(registroData as any);
      
      notifications.show({
        title: 'Cuenta creada exitosamente',
        message: 'Ahora puedes iniciar sesión con tu cuenta',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      // Redirigir al login
      navigate('/login');
      
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear la cuenta',
        message: error.response?.data?.message || 'An unexpected error occurred',
        color: 'red',
        icon: <IconAlertCircle size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  // Si está redirigiendo, mostrar una página de carga
  if (redirecting) {
    return (
      <PageTransition type="medical" duration={800}>
        <Box
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: colorScheme === 'dark'
              ? 'linear-gradient(135deg, #1a1b23 0%, #2d3142 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}
        >
          <Stack align="center" gap="md">
            <LoadingOverlay visible={true} />
            <Text size="lg" c="dimmed">
              Redirigiendo al panel...
            </Text>
          </Stack>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          width: '100vw',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Keyframes para la animación */}
        <style>
          {`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
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
          }}
        >
          {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>

        {/* Back to Landing Button */}
        <ActionIcon
          onClick={() => navigate('/')}
          variant="light"
          size="lg"
          radius="xl"
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
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
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>

        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          padding: '2rem 1rem'
        }}>
          <Container size={580} style={{ width: '100%', maxWidth: '580px' }}>
            <Paper
              radius="xl"
              p="lg"
              withBorder
              style={{
                width: '100%',
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(247, 243, 238, 0.6)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                boxShadow: colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                  : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              <LoadingOverlay visible={loading} />

              <Stack gap="lg">
                <Center mb="md">
                  <Stack align="center" gap="sm">
                    <Image
                      src={enarmLogo}
                      alt="ENARM360 Logo"
                      height={50}
                      fit="contain"
                      style={{
                        borderRadius: '12px',
                        maxWidth: '180px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, filter 0.3s ease',
                        filter: easterEggTriggered ? 'brightness(1.1) saturate(1.2)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      }}
                      onClick={() => navigate('/')}
                    />
                    <Title order={2} size="h3" ta="center">
                      Crear Cuenta
                    </Title>
                    <Text c="dimmed" ta="center" size="sm">
                      Simulador Médico Profesional
                    </Text>

                    {/* Alerta de sesión existente */}
                    {existingSession && (
                      <Alert
                        color="yellow"
                        variant="light"
                        radius="md"
                        style={{
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          background: colorScheme === 'dark'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(245, 158, 11, 0.05)'
                        }}
                      >
                        <Stack gap="sm">
                          <Text size="sm" fw={500} ta="center">
                             Ya tienes una sesión activa como: <strong>{currentUser}</strong>
                          </Text>
                          <Group justify="center" gap="sm">
                            <Button
                              size="xs"
                              variant="outline"
                              color="orange"
                              onClick={handleLogoutExistingSession}
                            >
                              Cerrar sesión anterior
                            </Button>
                            <Button
                              size="xs"
                              variant="filled"
                              color="blue"
                              onClick={() => {
                                const userRole = authService.isAdmin() ? 'admin' : 'estudiante';
                                navigate(`/${userRole}/dashboard`);
                              }}
                            >
                              Ir al dashboard
                            </Button>
                          </Group>
                        </Stack>
                      </Alert>
                    )}

                    {/* Easter Egg: Mensaje motivacional */}
                    {motivationalMessage && (
                      <Alert
                        color="green"
                        variant="light"
                        radius="md"
                        style={{
                          animation: 'fadeInUp 0.5s ease-out',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          background: colorScheme === 'dark'
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(34, 197, 94, 0.05)'
                        }}
                      >
                        <Text size="sm" fw={500} ta="center">
                          {motivationalMessage}
                        </Text>
                      </Alert>
                    )}
                  </Stack>
                </Center>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Grid>
                    {/* Columna Izquierda - Información Personal */}
                    <Grid.Col span={6}>
                      <Stack gap="md">
                        <Text fw={600} size="md" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                          Información Personal
                        </Text>

                        <TextInput
                          placeholder="Nombre"
                          leftSection={<IconUser size={16} />}
                          required
                          {...form.getInputProps('nombre')}
                          onChange={(e) => {
                            form.setFieldValue('nombre', e.target.value);
                            checkEasterEgg();
                          }}
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
                            }
                          }}
                        />

                        <TextInput
                          placeholder="Apellido"
                          leftSection={<IconUser size={16} />}
                          required
                          {...form.getInputProps('apellido')}
                          onChange={(e) => {
                            form.setFieldValue('apellido', e.target.value);
                            checkEasterEgg();
                          }}
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
                            }
                          }}
                        />

                        <TextInput
                          placeholder="Nombre de usuario"
                          leftSection={<IconUser size={16} />}
                          required
                          rightSection={checkingUsername ? <div>...</div> : undefined}
                          {...form.getInputProps('username')}
                          onBlur={(e) => checkUsernameAvailability(e.target.value)}
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
                            }
                          }}
                        />

                        <TextInput
                          placeholder="correo@ejemplo.com"
                          leftSection={<IconMail size={16} />}
                          required
                          rightSection={checkingEmail ? <div>...</div> : undefined}
                          {...form.getInputProps('email')}
                          onChange={(e) => {
                            form.setFieldValue('email', e.target.value);
                            checkEasterEgg();
                          }}
                          onBlur={(e) => checkEmailAvailability(e.target.value)}
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
                            }
                          }}
                        />

                        <PasswordInput
                          placeholder="Contraseña"
                          leftSection={<IconLock size={16} />}
                          required
                          {...form.getInputProps('password')}
                          onChange={(e) => {
                            form.setFieldValue('password', e.target.value);
                            checkEasterEgg();
                          }}
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
                            }
                          }}
                        />

                        <PasswordInput
                          placeholder="Confirmar Contraseña"
                          leftSection={<IconLock size={16} />}
                          required
                          {...form.getInputProps('confirmPassword')}
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
                            }
                          }}
                        />
                      </Stack>
                    </Grid.Col>

                    {/* Columna Derecha - Información Académica */}
                    <Grid.Col span={6}>
                      <Stack gap="md">
                        <Text fw={600} size="md" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                          Información Académica
                        </Text>

                        <TextInput
                          placeholder="Universidad (opcional)"
                          leftSection={<IconSchool size={16} />}
                          {...form.getInputProps('universidad')}
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
                            }
                          }}
                        />

                        <TextInput
                          placeholder="Año de Graduación"
                          leftSection={<IconCalendar size={16} />}
                          type="number"
                          {...form.getInputProps('anioGraduacion')}
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
                            }
                          }}
                        />

                        <TextInput
                          placeholder="Especialidad de Interés"
                          leftSection={<IconSchool size={16} />}
                          {...form.getInputProps('especialidadInteres')}
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
                            }
                          }}
                        />
                      </Stack>
                    </Grid.Col>

                    {/* Fila completa para términos y botón */}
                    <Grid.Col span={12}>
                      <Stack gap="md" mt="lg">
                        <Alert
                          icon={<IconAlertCircle size={16} />}
                          color="blue"
                          variant="light"
                          style={{
                            backgroundColor: colorScheme === 'dark'
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'rgba(59, 130, 246, 0.05)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            border: `1px solid rgba(59, 130, 246, 0.2)`,
                          }}
                        >
                          Al crear tu cuenta, aceptas nuestros términos de servicio y política de privacidad.
                        </Alert>

                        <Button
                          type="submit"
                          fullWidth
                          size="lg"
                          radius="xl"
                          loading={loading}
                          variant="light"
                          style={{
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
                          {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                        </Button>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </form>

                <Center mt="md">
                  <Text size="sm" c="dimmed">
                    ¿Ya tienes una cuenta?{' '}
                    <Text
                      component="span"
                      size="sm"
                      c="blue"
                      style={{ cursor: 'pointer', fontWeight: 500 }}
                      onClick={() => navigate('/login')}
                    >
                      Inicia sesión aquí
                    </Text>
                  </Text>
                </Center>
              </Stack>
            </Paper>
          </Container>
        </div>
      </Box>
    </PageTransition>
  );
};

export default RegisterPage;
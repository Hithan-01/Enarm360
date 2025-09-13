import React, { useState } from 'react';
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
  Divider
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
  IconArrowLeft
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/animations/PageTransition';
import { registroService } from '../services/registroService';
import { authService } from '../services/authService';
import { RegistroRequest } from '../types/registro';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

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
        if (!value) return 'El email es obligatorio';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido';
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
        form.setFieldError('email', 'Este email ya está registrado');
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
        message: 'Ya puedes iniciar sesión con tu cuenta',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      // Redirigir al login
      navigate('/login');
      
    } catch (error: any) {
      notifications.show({
        title: 'Error al crear cuenta',
        message: error.response?.data?.message || 'Ocurrió un error inesperado',
        color: 'red',
        icon: <IconAlertCircle size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  if (authService.isAuthenticated()) {
    const userRole = authService.isAdmin() ? 'admin' : 'estudiante';
    navigate(`/${userRole}/dashboard`);
    return null;
  }

  return (
    <PageTransition type="medical" duration={800}>
      <div style={{ minHeight: '100vh', background: 'rgb(248, 250, 252)' }}>
        <Navbar showAuthButtons={false} />
        
        <Container size="sm" py="xl">
          <Stack gap="xl" align="center">
            <Group>
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate(-1)}
                size="sm"
              >
                Volver
              </Button>
            </Group>

            <Paper shadow="md" p="xl" radius="lg" style={{ width: '100%', maxWidth: 500 }}>
              <LoadingOverlay visible={loading} />
              
              <Stack gap="lg">
                <Stack gap="xs" align="center">
                  <Title order={2} size="h1" ta="center" c="rgb(54, 71, 91)">
                    Crear Cuenta
                  </Title>
                  <Text c="dimmed" ta="center">
                    Únete a ENARM360 y prepárate para el éxito
                  </Text>
                </Stack>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="md">
                    <Group grow>
                      <TextInput
                        label="Nombre"
                        placeholder="Tu nombre"
                        leftSection={<IconUser size={16} />}
                        required
                        {...form.getInputProps('nombre')}
                      />
                      <TextInput
                        label="Apellido"
                        placeholder="Tu apellido"
                        leftSection={<IconUser size={16} />}
                        required
                        {...form.getInputProps('apellido')}
                      />
                    </Group>

                    <TextInput
                      label="Nombre de usuario"
                      placeholder="usuario123"
                      leftSection={<IconUser size={16} />}
                      required
                      rightSection={checkingUsername ? <div>...</div> : undefined}
                      {...form.getInputProps('username')}
                      onBlur={(e) => checkUsernameAvailability(e.target.value)}
                    />

                    <TextInput
                      label="Email"
                      placeholder="tu@email.com"
                      leftSection={<IconMail size={16} />}
                      required
                      rightSection={checkingEmail ? <div>...</div> : undefined}
                      {...form.getInputProps('email')}
                      onBlur={(e) => checkEmailAvailability(e.target.value)}
                    />

                    <Group grow>
                      <PasswordInput
                        label="Contraseña"
                        placeholder="Tu contraseña"
                        leftSection={<IconLock size={16} />}
                        required
                        {...form.getInputProps('password')}
                      />
                      <PasswordInput
                        label="Confirmar contraseña"
                        placeholder="Repite tu contraseña"
                        leftSection={<IconLock size={16} />}
                        required
                        {...form.getInputProps('confirmPassword')}
                      />
                    </Group>

                    <Divider label="Información académica" labelPosition="center" />

                    <TextInput
                      label="Universidad"
                      placeholder="Tu universidad"
                      leftSection={<IconSchool size={16} />}
                      {...form.getInputProps('universidad')}
                    />

                    <Group grow>
                      <TextInput
                        label="Año de graduación"
                        placeholder="2024"
                        leftSection={<IconCalendar size={16} />}
                        type="number"
                        {...form.getInputProps('anioGraduacion')}
                      />
                      <TextInput
                        label="Especialidad de interés"
                        placeholder="Medicina interna"
                        leftSection={<IconSchool size={16} />}
                        {...form.getInputProps('especialidadInteres')}
                      />
                    </Group>

                    <Alert 
                      icon={<IconAlertCircle size={16} />} 
                      color="blue" 
                      variant="light"
                    >
                      Al crear tu cuenta, aceptas nuestros términos de servicio y política de privacidad.
                    </Alert>

                    <Button 
                      type="submit" 
                      fullWidth 
                      size="md"
                      loading={loading}
                      style={{
                        background: 'rgb(196, 213, 70)',
                        color: 'rgb(54, 71, 91)',
                        border: 'none'
                      }}
                    >
                      Crear Cuenta
                    </Button>
                  </Stack>
                </form>

                <Stack gap="xs" align="center">
                  <Text c="dimmed" size="sm">
                    ¿Ya tienes cuenta?
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    to="/login"
                    size="sm"
                  >
                    Iniciar Sesión
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
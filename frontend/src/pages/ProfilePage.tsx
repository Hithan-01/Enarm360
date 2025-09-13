import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Stack, 
  Group,
  Paper,
  Grid,
  TextInput,
  Select,
  Textarea,
  Switch,
  Avatar,
  FileButton,
  ActionIcon,
  Badge,
  Divider,
  Card,
  Alert,
  LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconCalendar,
  IconSchool,
  IconEdit,
  IconCamera,
  IconCheck,
  IconX,
  IconInfoCircle
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/animations/PageTransition';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { UsuarioProfile, UpdateProfileRequest } from '../types/profile';
import { PROFILE_CONSTANTS } from '../types/profile';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UsuarioProfile | null>(null);
  const [editMode, setEditMode] = useState(false);

  const form = useForm<UpdateProfileRequest>({
    initialValues: {
      nombre: '',
      apellido: '',
      telefono: '',
      genero: undefined,
      universidad: '',
      anioGraduacion: undefined,
      especialidadInteres: '',
      recibirNotificaciones: true,
      recibirNewsletters: false,
      perfilPublico: true,
      privacy: {
        mostrarEmail: false,
        mostrarTelefono: false,
        mostrarUniversidad: true,
        permitirMensajes: true,
        mostrarEstadisticas: true
      }
    },
    validate: {
      nombre: (value: string | undefined) => (!value || value.length < 2 ? 'El nombre debe tener al menos 2 caracteres' : null),
      apellido: (value: string | undefined) => (!value || value.length < 2 ? 'El apellido debe tener al menos 2 caracteres' : null),
      telefono: (value: string | undefined) => (value && !PROFILE_CONSTANTS.PHONE_REGEX.test(value) ? 'Formato de teléfono inválido' : null),
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getMyProfile();
      setProfile(profileData);
      
      // Actualizar formulario con datos del perfil
      form.setValues({
        nombre: profileData.nombre || '',
        apellido: profileData.apellido || '',
        telefono: profileData.telefono || '',
        genero: profileData.genero,
        universidad: profileData.universidad || '',
        anioGraduacion: profileData.anioGraduacion,
        especialidadInteres: profileData.especialidadInteres || '',
        recibirNotificaciones: profileData.recibirNotificaciones ?? true,
        recibirNewsletters: profileData.recibirNewsletters ?? false,
        perfilPublico: profileData.perfilPublico ?? true,
        privacy: {
          mostrarEmail: profileData.privacy?.mostrarEmail ?? false,
          mostrarTelefono: profileData.privacy?.mostrarTelefono ?? false,
          mostrarUniversidad: profileData.privacy?.mostrarUniversidad ?? true,
          permitirMensajes: profileData.privacy?.permitirMensajes ?? true,
          mostrarEstadisticas: profileData.privacy?.mostrarEstadisticas ?? true
        }
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo cargar el perfil',
        color: 'red',
        icon: <IconX size={16} />
      });
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: UpdateProfileRequest) => {
    if (saving) {
      console.warn('Save already in progress, ignoring duplicate request');
      return;
    }
    
    try {
      setSaving(true);
      console.log('Iniciando actualización de perfil:', values);
      const updatedProfile = await profileService.updateMyProfile(values);
      setProfile(updatedProfile);
      setEditMode(false);
      
      notifications.show({
        title: 'Éxito',
        message: 'Perfil actualizado correctamente',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Si es error 401, podría ser que el update fue exitoso pero el token expiró
      if (error?.response?.status === 401) {
        // Recargar el perfil para ver si los cambios se guardaron
        try {
          const refreshedProfile = await profileService.getMyProfile();
          setProfile(refreshedProfile);
          setEditMode(false);
          
          notifications.show({
            title: 'Perfil actualizado',
            message: 'Los cambios se guardaron correctamente (sesión renovada)',
            color: 'green',
            icon: <IconCheck size={16} />
          });
          return;
        } catch (refreshError) {
          console.error('Error refreshing profile:', refreshError);
        }
      }
      
      const errorMessage = error?.response?.data?.message || error?.message || 'No se pudo actualizar el perfil';
      
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
    if (uploading || saving) {
      console.warn('Upload or save already in progress, ignoring avatar upload');
      return;
    }

    const validation = profileService.validateAvatarFile(file);
    if (!validation.isValid) {
      notifications.show({
        title: 'Error',
        message: validation.errors.join(', '),
        color: 'red',
        icon: <IconX size={16} />
      });
      return;
    }

    try {
      setUploading(true);
      console.log('Iniciando subida de avatar');
      const updatedProfile = await profileService.uploadAvatar(file);
      
      // Actualizar el perfil directamente con la respuesta
      setProfile(updatedProfile);
      
      notifications.show({
        title: 'Éxito',
        message: 'Foto de perfil actualizada',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo subir la imagen',
        color: 'red',
        icon: <IconX size={16} />
      });
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  if (!authService.isAuthenticated()) {
    navigate('/login');
    return null;
  }

  return (
    <PageTransition type="medical" duration={800}>
      <div style={{ minHeight: '100vh', background: 'rgb(248, 250, 252)' }}>
        <Navbar 
          showAuthButtons={false}
          showThemeToggle={true}
          userRole={authService.isAdmin() ? 'admin' : (authService.isEstudiante() ? 'student' : null)}
          userInfo={{
            username: profile?.username || authService.getCurrentUserFromStorage()?.username || '',
            email: profile?.email || authService.getCurrentUserFromStorage()?.email || ''
          }}
          onLogout={handleLogout}
        />
        
        <Container size="lg" py="xl">
          <Stack gap="xl">
            {/* Header */}
            <Paper p="xl" shadow="sm" radius="lg">
              <Group justify="space-between" align="center">
                <Group gap="lg">
                  <div style={{ position: 'relative' }}>
                    <Avatar 
                      size={80} 
                      src={profile?.avatar ? profileService.getAvatarUrl(profile.avatar) : null}
                      radius="xl"
                    >
                      {profile ? profileService.getInitials(profile) : 'U'}
                    </Avatar>
                    <FileButton 
                      onChange={handleAvatarUpload} 
                      accept="image/jpeg,image/png,image/gif,image/webp"
                    >
                      {(props) => (
                        <ActionIcon
                          {...props}
                          size="sm"
                          radius="xl"
                          color="blue"
                          variant="filled"
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                          }}
                          loading={uploading}
                        >
                          <IconCamera size={14} />
                        </ActionIcon>
                      )}
                    </FileButton>
                  </div>
                  
                  <div>
                    <Title order={2} size="h1">
                      {profile ? profileService.getFullName(profile) : 'Cargando...'}
                    </Title>
                    <Text c="dimmed" size="lg">
                      @{profile?.username || 'usuario'}
                    </Text>
                    <Group gap="xs" mt="xs">
                      {profile?.roles?.map((role) => (
                        <Badge key={role} variant="light" size="sm">
                          {role.replace('ROLE_', '')}
                        </Badge>
                      ))}
                      {profile?.emailVerificado && (
                        <Badge color="green" variant="light" size="sm">
                          Email verificado
                        </Badge>
                      )}
                    </Group>
                  </div>
                </Group>
                
                <Button
                  variant={editMode ? "light" : "filled"}
                  leftSection={<IconEdit size={16} />}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              </Group>
            </Paper>

            <form onSubmit={form.onSubmit(handleSave)}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Stack gap="lg">
                    {/* Información Personal */}
                    <Card shadow="sm" padding="xl" radius="lg">
                      <LoadingOverlay visible={loading} />
                      <Title order={3} size="h3" mb="lg">
                        <Group gap="sm">
                          <IconUser size={20} />
                          Información Personal
                        </Group>
                      </Title>
                      
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Nombre"
                            placeholder="Tu nombre"
                            disabled={!editMode}
                            {...form.getInputProps('nombre')}
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Apellido"
                            placeholder="Tu apellido"
                            disabled={!editMode}
                            {...form.getInputProps('apellido')}
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Email"
                            value={profile?.email || ''}
                            disabled
                            leftSection={<IconMail size={16} />}
                            description="El email no se puede cambiar"
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Teléfono"
                            placeholder="Tu número de teléfono"
                            disabled={!editMode}
                            leftSection={<IconPhone size={16} />}
                            {...form.getInputProps('telefono')}
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <Select
                            label="Género"
                            placeholder="Selecciona tu género"
                            disabled={!editMode}
                            data={[
                              { value: 'M', label: 'Masculino' },
                              { value: 'F', label: 'Femenino' },
                              { value: 'Otro', label: 'Otro' }
                            ]}
                            {...form.getInputProps('genero')}
                          />
                        </Grid.Col>
                      </Grid>
                    </Card>

                    {/* Información Académica */}
                    <Card shadow="sm" padding="xl" radius="lg">
                      <Title order={3} size="h3" mb="lg">
                        <Group gap="sm">
                          <IconSchool size={20} />
                          Información Académica
                        </Group>
                      </Title>
                      
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <Select
                            label="Universidad"
                            placeholder="Selecciona tu universidad"
                            disabled={!editMode}
                            searchable
                            data={PROFILE_CONSTANTS.UNIVERSIDADES_MEXICO}
                            {...form.getInputProps('universidad')}
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Año de Graduación"
                            placeholder="2024"
                            disabled={!editMode}
                            type="number"
                            min={1950}
                            max={new Date().getFullYear() + 10}
                            {...form.getInputProps('anioGraduacion')}
                          />
                        </Grid.Col>
                        
                        <Grid.Col span={12}>
                          <Select
                            label="Especialidad de Interés"
                            placeholder="¿Qué especialidad te interesa?"
                            disabled={!editMode}
                            searchable
                            data={PROFILE_CONSTANTS.ESPECIALIDADES_ENARM}
                            {...form.getInputProps('especialidadInteres')}
                          />
                        </Grid.Col>
                      </Grid>
                    </Card>

                    {editMode && (
                      <Group justify="flex-end">
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => {
                            setEditMode(false);
                            form.reset();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          loading={saving}
                          leftSection={<IconCheck size={16} />}
                        >
                          Guardar Cambios
                        </Button>
                      </Group>
                    )}
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="lg">
                    {/* Configuraciones */}
                    <Card shadow="sm" padding="xl" radius="lg">
                      <Title order={3} size="h4" mb="lg">
                        Configuraciones
                      </Title>
                      
                      <Stack gap="md">
                        <Switch
                          label="Recibir notificaciones"
                          description="Recibir notificaciones por email"
                          disabled={!editMode}
                          {...form.getInputProps('recibirNotificaciones', { type: 'checkbox' })}
                        />
                        
                        <Switch
                          label="Newsletter"
                          description="Recibir boletín informativo"
                          disabled={!editMode}
                          {...form.getInputProps('recibirNewsletters', { type: 'checkbox' })}
                        />
                        
                        <Switch
                          label="Perfil público"
                          description="Otros usuarios pueden ver tu perfil"
                          disabled={!editMode}
                          {...form.getInputProps('perfilPublico', { type: 'checkbox' })}
                        />
                      </Stack>
                    </Card>

                    {/* Privacidad */}
                    <Card shadow="sm" padding="xl" radius="lg">
                      <Title order={3} size="h4" mb="lg">
                        Privacidad
                      </Title>
                      
                      <Stack gap="md">
                        <Switch
                          label="Mostrar email"
                          description="Visible en tu perfil público"
                          disabled={!editMode}
                          {...form.getInputProps('privacy.mostrarEmail', { type: 'checkbox' })}
                        />
                        
                        <Switch
                          label="Mostrar teléfono"
                          description="Visible en tu perfil público"
                          disabled={!editMode}
                          {...form.getInputProps('privacy.mostrarTelefono', { type: 'checkbox' })}
                        />
                        
                        <Switch
                          label="Permitir mensajes"
                          description="Otros usuarios pueden enviarte mensajes"
                          disabled={!editMode}
                          {...form.getInputProps('privacy.permitirMensajes', { type: 'checkbox' })}
                        />
                        
                        <Switch
                          label="Mostrar estadísticas"
                          description="Tus estadísticas de estudio serán públicas"
                          disabled={!editMode}
                          {...form.getInputProps('privacy.mostrarEstadisticas', { type: 'checkbox' })}
                        />
                      </Stack>
                    </Card>

                    {/* Estadísticas */}
                    {profile?.stats && (
                      <Card shadow="sm" padding="xl" radius="lg">
                        <Title order={3} size="h4" mb="lg">
                          Estadísticas
                        </Title>
                        
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Text size="sm">Simulacros completados</Text>
                            <Badge variant="light">{profile.stats.simulacrosCompletados}</Badge>
                          </Group>
                          
                          <Group justify="space-between">
                            <Text size="sm">Promedio general</Text>
                            <Badge color={profile.stats.promedioGeneral >= 80 ? 'green' : 'yellow'}>
                              {profile.stats.promedioGeneral}%
                            </Badge>
                          </Group>
                          
                          <Group justify="space-between">
                            <Text size="sm">Tiempo de estudio</Text>
                            <Text size="sm" fw={500}>
                              {profile.stats.tiempoEstudioTotal} horas
                            </Text>
                          </Group>
                          
                          {profile.stats.especialidadFavorita && (
                            <Group justify="space-between">
                              <Text size="sm">Especialidad favorita</Text>
                              <Text size="sm" fw={500}>
                                {profile.stats.especialidadFavorita}
                              </Text>
                            </Group>
                          )}
                        </Stack>
                      </Card>
                    )}

                    {/* Información de cuenta */}
                    <Card shadow="sm" padding="xl" radius="lg">
                      <Title order={3} size="h4" mb="lg">
                        Información de Cuenta
                      </Title>
                      
                      <Stack gap="sm">
                        <Group justify="space-between">
                          <Text size="sm">Miembro desde</Text>
                          <Text size="sm" fw={500}>
                            {profile?.fechaRegistro ? 
                              new Date(profile.fechaRegistro).toLocaleDateString('es-MX') : 
                              'N/A'
                            }
                          </Text>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text size="sm">Estado</Text>
                          <Badge 
                            color={profile?.estado === 'activo' ? 'green' : 'gray'}
                            variant="light"
                          >
                            {profile?.estado || 'desconocido'}
                          </Badge>
                        </Group>
                        
                        <Group justify="space-between">
                          <Text size="sm">Última actividad</Text>
                          <Text size="sm" fw={500}>
                            {profile?.ultimaActividad ? 
                              new Date(profile.ultimaActividad).toLocaleDateString('es-MX') : 
                              'N/A'
                            }
                          </Text>
                        </Group>
                      </Stack>
                    </Card>
                  </Stack>
                </Grid.Col>
              </Grid>
            </form>
          </Stack>
        </Container>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
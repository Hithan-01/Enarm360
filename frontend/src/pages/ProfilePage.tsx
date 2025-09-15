import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stack,
  Grid,
  Group,
  LoadingOverlay,
  Box,
  Divider,
  Transition,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconSchool,
  IconCheck,
  IconX,
  IconLock,
  IconSettings,
  IconShield,
} from '@tabler/icons-react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/animations/PageTransition';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { UsuarioProfile, UpdateProfileRequest } from '../types/profile';
import { PROFILE_CONSTANTS } from '../types/profile';

// Custom Components
import GradientCard from '../components/ui/GradientCard';
import ElegantButton from '../components/ui/ElegantButton';
import FormSection from '../components/ui/FormSection';
import { ElegantTextInput, ElegantSelect, ElegantPasswordInput } from '../components/ui/ElegantInput';
import ElegantSwitch from '../components/ui/ElegantSwitch';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsGrid from '../components/profile/StatsGrid';
import { useProfileAnimation } from '../hooks/useProfileAnimation';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UsuarioProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { isVisible } = useProfileAnimation();

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

      if (error?.response?.status === 401) {
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
      <Box
        style={{
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: colorScheme === 'dark' ? '#1a1b23' : '#f8fafc',
        }}
      >
        {/* Background Pattern */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            pointerEvents: 'none',
            backgroundImage: colorScheme === 'dark'
              ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23374151' stroke-width='0.5' opacity='0.3'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`
              : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e2e8f0' stroke-width='0.5' opacity='0.3'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`,
          }}
        />

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

        <Container size="xl" py="xl" style={{ position: 'relative', zIndex: 10 }}>
          <LoadingOverlay visible={loading} overlayProps={{ backgroundOpacity: 0.3, blur: 2 }} />

          <Transition mounted={isVisible} transition="slide-up" duration={600}>
            {(styles) => (
              <Stack gap="xl" style={styles}>
                {/* Profile Header */}
                <ProfileHeader
                  profile={profile}
                  editMode={editMode}
                  uploading={uploading}
                  onEditToggle={() => setEditMode(!editMode)}
                  onAvatarUpload={handleAvatarUpload}
                />

                {/* Statistics Grid */}
                {profile?.stats && (
                  <Box>
                    <Title
                      order={2}
                      mb="lg"
                      style={{
                        fontFamily: 'Space Grotesk, Inter, sans-serif',
                        textAlign: 'center',
                        color: '#1e293b',
                      }}
                    >
                      Tu Progreso
                    </Title>
                    <StatsGrid stats={profile.stats} />
                  </Box>
                )}

                <Divider variant="dashed" style={{ opacity: 0.6 }} />

                {/* Form Sections */}
                <form onSubmit={form.onSubmit(handleSave)}>
                  <Stack gap="xl">
                    {/* Personal Information */}
                    <FormSection
                      title="Información Personal"
                      icon={<IconUser size={20} />}
                      gradientFrom="#0ea5e9"
                      gradientTo="#10b981"
                    >
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantTextInput
                            label="Nombre"
                            placeholder="Tu nombre"
                            readOnly={!editMode}
                            {...form.getInputProps('nombre')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantTextInput
                            label="Apellido"
                            placeholder="Tu apellido"
                            readOnly={!editMode}
                            {...form.getInputProps('apellido')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantTextInput
                            label="Email"
                            value={profile?.email || ''}
                            readOnly
                            leftSection={<IconMail size={16} />}
                            description="El email no se puede cambiar"
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantTextInput
                            label="Teléfono"
                            placeholder="Tu número de teléfono"
                            readOnly={!editMode}
                            leftSection={<IconPhone size={16} />}
                            {...form.getInputProps('telefono')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantSelect
                            label="Universidad"
                            placeholder="Selecciona tu universidad"
                            readOnly={!editMode}
                            searchable={editMode}
                            data={PROFILE_CONSTANTS.UNIVERSIDADES_MEXICO}
                            {...form.getInputProps('universidad')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantSelect
                            label="Género"
                            placeholder="Selecciona tu género"
                            readOnly={!editMode}
                            data={[
                              { value: 'M', label: 'Masculino' },
                              { value: 'F', label: 'Femenino' },
                              { value: 'Otro', label: 'Otro' }
                            ]}
                            {...form.getInputProps('genero')}
                          />
                        </Grid.Col>
                      </Grid>
                    </FormSection>

                    {/* Academic Information */}
                    <FormSection
                      title="Información Académica"
                      icon={<IconSchool size={20} />}
                      gradientFrom="#8b5cf6"
                      gradientTo="#ec4899"
                    >
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantTextInput
                            label="Año de Graduación"
                            placeholder="2024"
                            readOnly={!editMode}
                            type="number"
                            min={1950}
                            max={new Date().getFullYear() + 10}
                            {...form.getInputProps('anioGraduacion')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <ElegantSelect
                            label="Especialidad de Interés"
                            placeholder="¿Qué especialidad te interesa?"
                            readOnly={!editMode}
                            searchable={editMode}
                            data={PROFILE_CONSTANTS.ESPECIALIDADES_ENARM}
                            {...form.getInputProps('especialidadInteres')}
                          />
                        </Grid.Col>
                      </Grid>
                    </FormSection>

                    {/* Security Section */}
                    {editMode && (
                      <FormSection
                        title="Seguridad"
                        icon={<IconLock size={20} />}
                        gradientFrom="#f59e0b"
                        gradientTo="#ef4444"
                      >
                        <Grid gutter="lg">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <ElegantPasswordInput
                              label="Nueva Contraseña"
                              placeholder="Dejar vacío para no cambiar"
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <ElegantPasswordInput
                              label="Confirmar Contraseña"
                              placeholder="Confirma la nueva contraseña"
                            />
                          </Grid.Col>
                        </Grid>
                      </FormSection>
                    )}

                    {/* Settings and Privacy */}
                    <Grid gutter="xl">
                      <Grid.Col span={{ base: 12, lg: 6 }}>
                        <FormSection
                          title="Configuración"
                          icon={<IconSettings size={20} />}
                          gradientFrom="#10b981"
                          gradientTo="#059669"
                        >
                          <Stack gap="md">
                            <ElegantSwitch
                              label="Recibir notificaciones"
                              description="Recibir notificaciones por email"
                              disabled={!editMode}
                              checked={form.values.recibirNotificaciones}
                              onChange={(event) =>
                                form.setFieldValue('recibirNotificaciones', event.currentTarget.checked)
                              }
                            />
                            <ElegantSwitch
                              label="Newsletter"
                              description="Recibir boletín informativo"
                              disabled={!editMode}
                              checked={form.values.recibirNewsletters}
                              onChange={(event) =>
                                form.setFieldValue('recibirNewsletters', event.currentTarget.checked)
                              }
                            />
                            <ElegantSwitch
                              label="Perfil público"
                              description="Otros usuarios pueden ver tu perfil"
                              disabled={!editMode}
                              checked={form.values.perfilPublico}
                              onChange={(event) =>
                                form.setFieldValue('perfilPublico', event.currentTarget.checked)
                              }
                            />
                          </Stack>
                        </FormSection>
                      </Grid.Col>

                      <Grid.Col span={{ base: 12, lg: 6 }}>
                        <FormSection
                          title="Privacidad"
                          icon={<IconShield size={20} />}
                          gradientFrom="#6366f1"
                          gradientTo="#3b82f6"
                        >
                          <Stack gap="md">
                            <ElegantSwitch
                              label="Mostrar email"
                              description="Visible en tu perfil público"
                              disabled={!editMode}
                              checked={form.values.privacy?.mostrarEmail}
                              onChange={(event) =>
                                form.setFieldValue('privacy.mostrarEmail', event.currentTarget.checked)
                              }
                            />
                            <ElegantSwitch
                              label="Mostrar teléfono"
                              description="Visible en tu perfil público"
                              disabled={!editMode}
                              checked={form.values.privacy?.mostrarTelefono}
                              onChange={(event) =>
                                form.setFieldValue('privacy.mostrarTelefono', event.currentTarget.checked)
                              }
                            />
                            <ElegantSwitch
                              label="Permitir mensajes"
                              description="Otros usuarios pueden enviarte mensajes"
                              disabled={!editMode}
                              checked={form.values.privacy?.permitirMensajes}
                              onChange={(event) =>
                                form.setFieldValue('privacy.permitirMensajes', event.currentTarget.checked)
                              }
                            />
                            <ElegantSwitch
                              label="Mostrar estadísticas"
                              description="Tus estadísticas serán públicas"
                              disabled={!editMode}
                              checked={form.values.privacy?.mostrarEstadisticas}
                              onChange={(event) =>
                                form.setFieldValue('privacy.mostrarEstadisticas', event.currentTarget.checked)
                              }
                            />
                          </Stack>
                        </FormSection>
                      </Grid.Col>
                    </Grid>

                    {/* Action Buttons */}
                    {editMode && (
                      <GradientCard p="lg" radius="xl">
                        <Group justify="flex-end" gap="lg">
                          <ElegantButton
                            variant="secondary"
                            onClick={() => {
                              setEditMode(false);
                              form.reset();
                            }}
                          >
                            Cancelar
                          </ElegantButton>
                          <ElegantButton
                            variant="primary"
                            type="submit"
                            loading={saving}
                            leftSection={<IconCheck size={16} />}
                          >
                            Guardar Cambios
                          </ElegantButton>
                        </Group>
                      </GradientCard>
                    )}
                  </Stack>
                </form>
              </Stack>
            )}
          </Transition>
        </Container>
      </Box>
    </PageTransition>
  );
};

export default ProfilePage;
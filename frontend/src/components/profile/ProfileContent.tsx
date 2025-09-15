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
  Text,
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
import { profileService } from '../../services/profileService';
import { authService } from '../../services/authService';
import { UsuarioProfile, UpdateProfileRequest } from '../../types/profile';
import { PROFILE_CONSTANTS } from '../../types/profile';

// Custom Components
import GradientCard from '../ui/GradientCard';
import ElegantButton from '../ui/ElegantButton';
import FormSection from '../ui/FormSection';
import { ElegantTextInput, ElegantSelect, ElegantPasswordInput } from '../ui/ElegantInput';
import ElegantSwitch from '../ui/ElegantSwitch';
import ProfileHeader from './ProfileHeader';
import StatsGrid from './StatsGrid';
import { useProfileAnimation } from '../../hooks/useProfileAnimation';

const ProfileContent: React.FC = () => {
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
    },
    validate: {
      nombre: (value) => (!value ? 'El nombre es requerido' : null),
      apellido: (value) => (!value ? 'El apellido es requerido' : null),
      telefono: (value) => {
        if (!value) return 'El teléfono es requerido';
        if (!/^[0-9+\-\s()]+$/.test(value)) return 'Formato de teléfono inválido';
        return null;
      },
      universidad: (value) => (!value ? 'La universidad es requerida' : null),
      anioGraduacion: (value) => {
        if (!value) return 'El año de graduación es requerido';
        const currentYear = new Date().getFullYear();
        if (value < 1900 || value > currentYear + 10) {
          return `El año debe estar entre 1900 y ${currentYear + 10}`;
        }
        return null;
      },
    },
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
        genero: profileData.genero as any,
        universidad: profileData.universidad || '',
        anioGraduacion: profileData.anioGraduacion || undefined,
        especialidadInteres: profileData.especialidadInteres || '',
        recibirNotificaciones: profileData.recibirNotificaciones ?? true,
        recibirNewsletters: profileData.recibirNewsletters ?? false,
      });
    } catch (error) {
      console.error('Error cargando perfil:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo cargar el perfil',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setUploading(true);
      await profileService.uploadAvatar(file);
      await loadProfile();
      notifications.show({
        title: 'Éxito',
        message: 'Avatar actualizado correctamente',
        color: 'green',
      });
    } catch (error) {
      console.error('Error subiendo avatar:', error);
      notifications.show({
        title: 'Error',
        message: 'No se pudo actualizar el avatar',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: UpdateProfileRequest) => {
    try {
      setSaving(true);
      await profileService.updateMyProfile(values);
      await loadProfile();
      setEditMode(false);
      notifications.show({
        title: 'Éxito',
        message: 'Perfil actualizado correctamente',
        color: 'green',
      });
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'No se pudo actualizar el perfil',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      form.reset();
      if (profile) {
        form.setValues({
          nombre: profile.nombre || '',
          apellido: profile.apellido || '',
          telefono: profile.telefono || '',
          genero: profile.genero as any,
          universidad: profile.universidad || '',
          anioGraduacion: profile.anioGraduacion || undefined,
          especialidadInteres: profile.especialidadInteres || '',
          recibirNotificaciones: profile.recibirNotificaciones ?? true,
          recibirNewsletters: profile.recibirNewsletters ?? false,
        });
      }
    }
    setEditMode(!editMode);
  };

  if (loading) {
    return (
      <Box style={{ position: 'relative', minHeight: '400px' }}>
        <LoadingOverlay visible={true} />
      </Box>
    );
  }

  return (
    <Container fluid p={0}>
      <Stack gap="xl">
        {/* Header del Perfil */}
        <ProfileHeader
          profile={profile}
          editMode={editMode}
          uploading={uploading}
          onEditToggle={toggleEditMode}
          onAvatarUpload={handleAvatarUpload}
        />

        {/* Grid de Estadísticas */}
        {profile?.stats && (
          <Transition mounted={isVisible} transition="slide-up" duration={600} timingFunction="ease">
            {(styles) => (
              <div style={styles}>
                <StatsGrid stats={profile.stats} />
              </div>
            )}
          </Transition>
        )}

        {/* Información del Perfil en modo vista */}
        {!editMode && profile && (
          <Transition mounted={!editMode} transition="slide-up" duration={400} timingFunction="ease">
            {(styles) => (
              <div style={styles}>
                <Stack gap="xl">
                  {/* Información Personal */}
                  <FormSection
                    icon={<IconUser size={20} />}
                    title="Información Personal"
                    gradientFrom="#0ea5e9"
                    gradientTo="#10b981"
                  >
                    <Grid gutter="lg">
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <ElegantTextInput
                          label="Nombre"
                          value={profile.nombre}
                          readOnly={true}
                          leftSection={<IconUser size={18} />}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <ElegantTextInput
                          label="Apellido"
                          value={profile.apellido}
                          readOnly={true}
                          leftSection={<IconUser size={18} />}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <ElegantTextInput
                          label="Email"
                          value={profile.email}
                          readOnly={true}
                          leftSection={<IconMail size={18} />}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <ElegantTextInput
                          label="Teléfono"
                          value={profile.telefono || ''}
                          placeholder="No especificado"
                          readOnly={true}
                          leftSection={<IconPhone size={18} />}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                    </Grid>
                  </FormSection>

                  {/* Información Académica */}
                  <FormSection
                    icon={<IconSchool size={20} />}
                    title="Información Académica"
                    gradientFrom="#8b5cf6"
                    gradientTo="#ec4899"
                  >
                    <Grid gutter="lg">
                      <Grid.Col span={{ base: 12, md: 8 }}>
                        <ElegantTextInput
                          label="Universidad"
                          value={profile.universidad || ''}
                          placeholder="No especificado"
                          readOnly={true}
                          leftSection={<IconSchool size={18} />}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <ElegantTextInput
                          label="Año de Graduación"
                          value={profile.anioGraduacion?.toString() || ''}
                          placeholder="No especificado"
                          readOnly={true}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <ElegantTextInput
                          label="Especialidad de Interés"
                          value={profile.especialidadInteres || ''}
                          placeholder="No especificado"
                          readOnly={true}
                          styles={{
                            input: {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.8)',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#374151',
                              cursor: 'default',
                            }
                          }}
                        />
                      </Grid.Col>
                    </Grid>
                  </FormSection>

                  {/* Configuración de Notificaciones */}
                  <FormSection
                    icon={<IconSettings size={20} />}
                    title="Preferencias de Comunicación"
                    gradientFrom="#f59e0b"
                    gradientTo="#ef4444"
                  >
                    <Stack gap="lg">
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Text size="md" fw={500} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#374151' }}>
                            Recibir Notificaciones
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                            Notificaciones sobre tus simulacros y progreso
                          </Text>
                        </Box>
                        <ElegantSwitch
                          checked={profile.recibirNotificaciones}
                          disabled={true}
                        />
                      </Group>
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Text size="md" fw={500} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#374151' }}>
                            Recibir Newsletter
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                            Boletines con noticias y actualizaciones del ENARM
                          </Text>
                        </Box>
                        <ElegantSwitch
                          checked={profile.recibirNewsletters}
                          disabled={true}
                        />
                      </Group>
                    </Stack>
                  </FormSection>
                </Stack>
              </div>
            )}
          </Transition>
        )}

        {/* Formulario de Perfil */}
        {editMode && (
          <Transition mounted={editMode} transition="slide-up" duration={400} timingFunction="ease">
            {(styles) => (
              <div style={styles}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="xl">
                    {/* Información Personal */}
                    <FormSection
                      icon={<IconUser size={20} />}
                      title="Información Personal"
                      gradientFrom="#0ea5e9"
                      gradientTo="#10b981"
                    >
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <ElegantTextInput
                            label="Nombre"
                            placeholder="Tu nombre"
                            required
                            {...form.getInputProps('nombre')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <ElegantTextInput
                            label="Apellido"
                            placeholder="Tu apellido"
                            required
                            {...form.getInputProps('apellido')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <ElegantTextInput
                            label="Teléfono"
                            placeholder="+52 123 456 7890"
                            required
                            {...form.getInputProps('telefono')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <ElegantSelect
                            label="Género"
                            placeholder="Selecciona tu género"
                            data={[
                              { value: 'MASCULINO', label: 'Masculino' },
                              { value: 'FEMENINO', label: 'Femenino' },
                              { value: 'OTRO', label: 'Otro' },
                            ]}
                            {...form.getInputProps('genero')}
                          />
                        </Grid.Col>
                      </Grid>
                    </FormSection>

                    {/* Información Académica */}
                    <FormSection
                      icon={<IconSchool size={20} />}
                      title="Información Académica"
                      gradientFrom="#8b5cf6"
                      gradientTo="#ec4899"
                    >
                      <Grid gutter="lg">
                        <Grid.Col span={{ base: 12, md: 8 }}>
                          <ElegantTextInput
                            label="Universidad"
                            placeholder="Nombre de tu universidad"
                            required
                            {...form.getInputProps('universidad')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                          <ElegantTextInput
                            label="Año de Graduación"
                            placeholder="2024"
                            type="number"
                            required
                            {...form.getInputProps('anioGraduacion')}
                          />
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <ElegantSelect
                            label="Especialidad de Interés"
                            placeholder="Selecciona tu especialidad"
                            searchable
                            data={PROFILE_CONSTANTS.ESPECIALIDADES_ENARM}
                            {...form.getInputProps('especialidadInteres')}
                          />
                        </Grid.Col>
                      </Grid>
                    </FormSection>

                    {/* Configuración de Notificaciones */}
                    <FormSection
                      icon={<IconSettings size={20} />}
                      title="Preferencias de Comunicación"
                      gradientFrom="#f59e0b"
                      gradientTo="#ef4444"
                    >
                      <Stack gap="md">
                        <ElegantSwitch
                          label="Recibir Notificaciones"
                          description="Notificaciones sobre tus simulacros y progreso"
                          {...form.getInputProps('recibirNotificaciones', { type: 'checkbox' })}
                        />
                        <ElegantSwitch
                          label="Recibir Newsletter"
                          description="Boletines con noticias y actualizaciones del ENARM"
                          {...form.getInputProps('recibirNewsletters', { type: 'checkbox' })}
                        />
                      </Stack>
                    </FormSection>

                    {/* Botones de Acción */}
                    <Group justify="flex-end" mt="xl">
                      <ElegantButton
                        variant="secondary"
                        onClick={toggleEditMode}
                        leftSection={<IconX size={18} />}
                      >
                        Cancelar
                      </ElegantButton>
                      <ElegantButton
                        type="submit"
                        loading={saving}
                        leftSection={<IconCheck size={18} />}
                      >
                        Guardar Cambios
                      </ElegantButton>
                    </Group>
                  </Stack>
                </form>
              </div>
            )}
          </Transition>
        )}
      </Stack>
    </Container>
  );
};

export default ProfileContent;
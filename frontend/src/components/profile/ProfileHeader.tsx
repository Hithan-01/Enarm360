import React from 'react';
import {
  Group,
  Avatar,
  Title,
  Text,
  Badge,
  FileButton,
  ActionIcon,
  Box,
  Stack,
  ThemeIcon,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCamera,
  IconCheck,
  IconStar,
  IconTrendingUp,
} from '@tabler/icons-react';
import { UsuarioProfile } from '../../types/profile';
import { profileService } from '../../services/profileService';
import GradientCard from '../ui/GradientCard';
import ElegantButton from '../ui/ElegantButton';

interface ProfileHeaderProps {
  profile: UsuarioProfile | null;
  editMode: boolean;
  uploading: boolean;
  onEditToggle: () => void;
  onAvatarUpload: (file: File | null) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  editMode,
  uploading,
  onEditToggle,
  onAvatarUpload,
}) => {
  const { colorScheme } = useMantineColorScheme();

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: { bg: '#3b82f6', text: '#ffffff' },
      ESTUDIANTE: { bg: '#10b981', text: '#ffffff' },
      PROFESOR: { bg: '#8b5cf6', text: '#ffffff' },
    };
    return colors[role as keyof typeof colors] || colors.ESTUDIANTE;
  };

  return (
    <GradientCard
      p="xl"
      radius="xl"
      borderGradient={false}
      glowEffect={false}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'linear-gradient(45deg, rgba(14, 165, 233, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)',
          borderRadius: '50%',
          transform: 'translate(50px, -50px)',
        }}
      />

      <Group justify="space-between" align="flex-start">
        <Group gap="xs" align="flex-start" style={{ flex: 1 }}>
          {/* Avatar Section */}
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'relative',
                padding: '4px',
                backgroundColor: '#0ea5e9',
                borderRadius: '50%',
              }}
            >
              <Avatar
                size={100}
                src={profile?.avatar ? profileService.getAvatarUrl(profile.avatar) : null}
                radius="50%"
                style={{
                  border: '4px solid white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Text
                  size="xl"
                  fw={700}
                  style={{
                    fontFamily: 'Space Grotesk, Inter, sans-serif',
                    fontSize: '2rem',
                  }}
                >
                  {profile ? profileService.getInitials(profile) : 'U'}
                </Text>
              </Avatar>
            </Box>

            <FileButton
              onChange={onAvatarUpload}
              accept="image/jpeg,image/png,image/gif,image/webp"
            >
              {(props) => (
                <ActionIcon
                  {...props}
                  size="lg"
                  radius="xl"
                  loading={uploading}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#0ea5e9',
                    color: 'white',
                    border: '3px solid white',
                  }}
                >
                  <IconCamera size={18} />
                </ActionIcon>
              )}
            </FileButton>
          </Box>

          {/* Profile Info */}
          <Stack gap={0} style={{ flex: 1 }}>
            <Box>
              <Title
                order={2}
                style={{
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.75rem',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {profile ? profileService.getFullName(profile) : 'Cargando...'}
              </Title>

              <Text
                size="md"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontSize: '0.95rem',
                  margin: 0,
                }}
              >
                {profile?.email || 'email@ejemplo.com'}
              </Text>

              {profile?.fechaRegistro && (
                <Text
                  size="sm"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    color: colorScheme === 'dark' ? '#6b7280' : '#9ca3af',
                    fontSize: '0.8rem',
                  }}
                >
                  Miembro desde {new Date(profile.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </Text>
              )}
            </Box>

            {/* Badge de Verificado */}
            {profile?.emailVerificado && (
              <Group gap="sm" mt="sm">
                <Badge
                  size="lg"
                  leftSection={<IconCheck size={16} />}
                  style={{
                    fontFamily: 'Outfit, Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Verificado
                </Badge>
              </Group>
            )}

            {/* Quick Stats */}
            {profile?.stats && (
              <Group gap="xl" mt="lg">
                <Box style={{ textAlign: 'center' }}>
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    style={{
                      backgroundColor: '#3b82f6',
                      margin: '0 auto 0.5rem',
                    }}
                  >
                    <IconTrendingUp size={24} />
                  </ThemeIcon>
                  <Text
                    size="xl"
                    fw={700}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {profile.stats.simulacrosCompletados}
                  </Text>
                  <Text size="sm" c="dimmed" fw={500}>
                    Simulacros
                  </Text>
                </Box>

                <Box style={{ textAlign: 'center' }}>
                  <ThemeIcon
                    size="xl"
                    radius="xl"
                    style={{
                      backgroundColor: '#10b981',
                      margin: '0 auto 0.5rem',
                    }}
                  >
                    <IconStar size={24} />
                  </ThemeIcon>
                  <Text
                    size="xl"
                    fw={700}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {profile.stats.promedioGeneral}%
                  </Text>
                  <Text size="sm" c="dimmed" fw={500}>
                    Promedio
                  </Text>
                </Box>
              </Group>
            )}
          </Stack>
        </Group>

        {/* Edit Button */}
        <ElegantButton
          variant={editMode ? 'secondary' : 'primary'}
          leftSection={<IconCamera size={18} />}
          onClick={onEditToggle}
          style={{ alignSelf: 'flex-start' }}
        >
          {editMode ? 'Cancelar Edición' : 'Editar Perfil'}
        </ElegantButton>
      </Group>
    </GradientCard>
  );
};

export default ProfileHeader;
import React, { useState } from 'react';
import {
  Text,
  Title,
  Stack,
  useMantineColorScheme,
  Box,
  Card,
  SimpleGrid,
  Group,
  ScrollArea,
  Tabs,
  Badge,
  Select,
} from '@mantine/core';
import {
  IconTrophy,
  IconUser,
  IconChartBar,
  IconCalendar,
  IconFlame,
  IconFilter,
  IconBolt,
  IconTarget,
} from '@tabler/icons-react';
import RankingBadge from '../components/RankingBadge';
import { AchievementGrid, ACHIEVEMENTS } from '../components/gaming/AchievementSystem';
import { CURRENT_SEASON } from '../components/gaming/SeasonSystem';

// Datos de ejemplo gaming para el ranking
const MOCK_GAMING_DATA = [
  { position: 1, name: 'Ana Martínez', score: 98.5, streak: 28, specialty: 'Medicina Interna', xp: 12500, league: 'legend', division: 1, achievements: ['champion', 'perfect_score', 'unstoppable'], avatar: '👩‍⚕️' },
  { position: 2, name: 'Carlos López', score: 96.8, streak: 22, specialty: 'Cirugía General', xp: 11800, league: 'legend', division: 1, achievements: ['specialist', 'fire_streak', 'perfect_score'], avatar: '👨‍⚕️' },
  { position: 3, name: 'María Rodríguez', score: 95.2, streak: 19, specialty: 'Pediatría', xp: 11200, league: 'legend', division: 1, achievements: ['fire_streak', 'specialist', 'mentor'], avatar: '👩‍⚕️' },
  { position: 4, name: 'Diego Hernández', score: 94.1, streak: 15, specialty: 'Ginecología', xp: 9800, league: 'master', division: 1, achievements: ['specialist', 'improvement'], avatar: '👨‍⚕️' },
  { position: 5, name: 'Laura García', score: 93.7, streak: 18, specialty: 'Medicina Familiar', xp: 9500, league: 'master', division: 1, achievements: ['fire_streak', 'team_player'], avatar: '👩‍⚕️' },
  { position: 6, name: 'Roberto Silva', score: 92.9, streak: 12, specialty: 'Medicina Interna', xp: 9200, league: 'master', division: 2, achievements: ['specialist', 'rapid_fire'], avatar: '👨‍⚕️' },
  { position: 7, name: 'Patricia González', score: 92.3, streak: 14, specialty: 'Neurología', xp: 8900, league: 'master', division: 2, achievements: ['fire_streak', 'early_bird'], avatar: '👩‍⚕️' },
  { position: 8, name: 'Miguel Torres', score: 91.8, streak: 11, specialty: 'Cardiología', xp: 8600, league: 'master', division: 2, achievements: ['specialist', 'night_owl'], avatar: '👨‍⚕️' },
  { position: 9, name: 'Sandra Morales', score: 91.5, streak: 13, specialty: 'Dermatología', xp: 8300, league: 'master', division: 3, achievements: ['fire_streak', 'improvement'], avatar: '👩‍⚕️' },
  { position: 10, name: 'Fernando Cruz', score: 90.7, streak: 9, specialty: 'Ortopedia', xp: 8000, league: 'master', division: 3, achievements: ['specialist', 'marathon'], avatar: '👨‍⚕️' },
  { position: 11, name: 'Elena Vázquez', score: 90.2, streak: 16, specialty: 'Psiquiatría', xp: 7200, league: 'diamond', division: 1, achievements: ['fire_streak', 'mentor'], avatar: '👩‍⚕️' },
  { position: 12, name: 'Ricardo Jiménez', score: 89.8, streak: 7, specialty: 'Radiología', xp: 6900, league: 'diamond', division: 1, achievements: ['specialist', 'team_player'], avatar: '👨‍⚕️' },
  { position: 13, name: 'Carmen Ruiz', score: 89.5, streak: 10, specialty: 'Medicina Interna', xp: 6600, league: 'diamond', division: 2, achievements: ['fire_streak', 'improvement'], avatar: '👩‍⚕️' },
  { position: 14, name: 'José Mendoza', score: 89.1, streak: 8, specialty: 'Anestesiología', xp: 6300, league: 'diamond', division: 2, achievements: ['specialist', 'rapid_fire'], avatar: '👨‍⚕️' },
  { position: 15, name: 'Liliana Castro', score: 88.9, streak: 12, specialty: 'Pediatría', xp: 6000, league: 'diamond', division: 3, achievements: ['fire_streak', 'early_bird'], avatar: '👩‍⚕️' },
  { position: 16, name: 'Andrés Romero', score: 88.6, streak: 6, specialty: 'Urología', xp: 5700, league: 'diamond', division: 3, achievements: ['specialist', 'night_owl'], avatar: '👨‍⚕️' },
  { position: 17, name: 'Gloria Flores', score: 88.3, streak: 9, specialty: 'Medicina Familiar', xp: 5400, league: 'diamond', division: 4, achievements: ['fire_streak', 'team_player'], avatar: '👩‍⚕️' },
  { position: 18, name: 'Héctor Vargas', score: 88.0, streak: 5, specialty: 'Oftalmología', xp: 5100, league: 'diamond', division: 4, achievements: ['specialist', 'improvement'], avatar: '👨‍⚕️' },
  { position: 19, name: 'Mónica Delgado', score: 87.7, streak: 11, specialty: 'Ginecología', xp: 4800, league: 'platinum', division: 1, achievements: ['fire_streak', 'mentor'], avatar: '👩‍⚕️' },
  { position: 20, name: 'Raúl Aguilar', score: 87.5, streak: 4, specialty: 'Cirugía General', xp: 4500, league: 'platinum', division: 1, achievements: ['specialist', 'rapid_fire'], avatar: '👨‍⚕️' },
  { position: 21, name: 'Cristina Peña', score: 87.2, streak: 8, specialty: 'Medicina Interna', xp: 4200, league: 'platinum', division: 2, achievements: ['fire_streak', 'team_player'], avatar: '👩‍⚕️' },
  { position: 22, name: 'Alberto Sánchez', score: 86.9, streak: 3, specialty: 'Medicina Familiar', xp: 3900, league: 'platinum', division: 2, achievements: ['specialist', 'improvement'], avatar: '👨‍⚕️' },
  { position: 23, name: 'Tú', score: 86.7, streak: 7, specialty: 'Medicina General', xp: 3650, league: 'platinum', division: 3, achievements: ['fire_streak', 'first_session', 'early_bird'], isCurrentUser: true, avatar: '🧑‍⚕️' },
  { position: 24, name: 'Verónica Ortiz', score: 86.4, streak: 6, specialty: 'Dermatología', xp: 3400, league: 'platinum', division: 3, achievements: ['specialist', 'team_player'], avatar: '👩‍⚕️' },
  { position: 25, name: 'Óscar Luna', score: 86.1, streak: 2, specialty: 'Neurología', xp: 3100, league: 'platinum', division: 4, achievements: ['first_session', 'improvement'], avatar: '👨‍⚕️' },
];

const MAIN_TABS = [
  { value: 'mi-posicion', label: 'Mi Posición', icon: IconUser },
  { value: 'leaderboard', label: 'Leaderboard', icon: IconTrophy },
  { value: 'logros', label: 'Logros', icon: IconTarget },
];

const RankingsPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState('mi-posicion');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>('all');

  // Datos del usuario actual simulados
  const currentUserData = MOCK_GAMING_DATA.find(player => player.isCurrentUser);
  const currentUserXP = currentUserData?.xp || 3650;
  const unlockedAchievements = currentUserData?.achievements || ['fire_streak', 'first_session', 'early_bird'];

  // Render functions for different sections
  const renderMiPosicion = () => (
    <Stack gap="xl">
      {/* Tu posición actual destacada */}
      <Card padding="lg" radius="md" style={{
        backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        border: `2px solid #3b82f6`,
      }}>
        <Stack gap="md" align="center">
          <Title order={3} ta="center" style={{ color: '#3b82f6', fontFamily: 'Space Grotesk' }}>
            Tu Posición Actual
          </Title>

          <Group gap="md" align="center">
            <Box style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.5)',
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconUser size={30} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }} />
            </Box>

            <RankingBadge
              position={currentUserData?.position || 23}
              size="lg"
              showDescription={false}
              showPosition={true}
              showBadgeName={false}
              animated={true}
            />
          </Group>

          <Stack gap="xs" align="center">
            <Text size="lg" fw={700} ta="center" style={{ fontFamily: 'Space Grotesk' }}>
              {currentUserData?.name || 'Tu Usuario'}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Posición #{currentUserData?.position || 23} Nacional
            </Text>
            <Badge size="sm" color="blue">{currentUserData?.specialty || 'Medicina General'}</Badge>
          </Stack>

          <SimpleGrid cols={3} spacing="md" w="100%">
            <Stack gap={2} align="center">
              <IconTrophy size={24} style={{ color: '#f59e0b' }} />
              <Text size="lg" fw={700}>{currentUserData?.score || 86.7}%</Text>
              <Text size="xs" c="dimmed">Puntuación Promedio</Text>
            </Stack>
            <Stack gap={2} align="center">
              <IconFlame size={24} style={{ color: '#ef4444' }} />
              <Text size="lg" fw={700}>{currentUserData?.streak || 7}</Text>
              <Text size="xs" c="dimmed">Días de Racha</Text>
            </Stack>
            <Stack gap={2} align="center">
              <IconBolt size={24} style={{ color: '#3b82f6' }} />
              <Text size="lg" fw={700}>{currentUserXP.toLocaleString()}</Text>
              <Text size="xs" c="dimmed">Puntos XP</Text>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Estadísticas Personales */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Progreso Temporal */}
        <Card padding="md" radius="md" style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}>
          <Stack gap="sm">
            <Group gap="sm">
              <IconChartBar size={20} style={{ color: '#10b981' }} />
              <Title order={5} style={{ fontFamily: 'Space Grotesk' }}>
                Progreso Reciente
              </Title>
            </Group>

            <SimpleGrid cols={2} spacing="md">
              <Stack gap={4} align="center">
                <Text fw={600} style={{ color: '#10b981' }}>+5 posiciones</Text>
                <Text size="sm" c="dimmed">Esta semana</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Text fw={600} style={{ color: '#10b981' }}>+12 posiciones</Text>
                <Text size="sm" c="dimmed">Este mes</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Text fw={600} style={{ color: '#3b82f6' }}>87.2%</Text>
                <Text size="sm" c="dimmed">Promedio general</Text>
              </Stack>
              <Stack gap={4} align="center">
                <Text fw={600} style={{ color: '#f59e0b' }}>142 hrs</Text>
                <Text size="sm" c="dimmed">Tiempo total</Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Especialidades Más Fuertes/Débiles */}
        <Card padding="md" radius="md" style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}>
          <Stack gap="sm">
            <Group gap="sm">
              <IconTarget size={20} style={{ color: '#8b5cf6' }} />
              <Title order={5} style={{ fontFamily: 'Space Grotesk' }}>
                Por Especialidad
              </Title>
            </Group>

            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Medicina Interna</Text>
                <Badge color="green" size="sm">94%</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Cardiología</Text>
                <Badge color="green" size="sm">91%</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Cirugía General</Text>
                <Badge color="yellow" size="sm">78%</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Pediatría</Text>
                <Badge color="red" size="sm">72%</Badge>
              </Group>
            </Stack>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Insights Personalizados */}
      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="sm">
        {/* Mejor Rendimiento */}
        <Card padding="sm" radius="md" style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}>
          <Stack gap="sm" align="center">
            <IconCalendar size={24} style={{ color: '#06b6d4' }} />
            <Title order={6} ta="center" style={{ fontFamily: 'Space Grotesk' }}>
              Mejor Rendimiento
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Martes y jueves por la mañana (8-10 AM)
            </Text>
            <Text ta="center" fw={600} style={{ color: '#06b6d4' }}>
              +15% mejor que tu promedio
            </Text>
          </Stack>
        </Card>

        {/* Área de Oportunidad */}
        <Card padding="sm" radius="md" style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}>
          <Stack gap="sm" align="center">
            <IconBolt size={24} style={{ color: '#f59e0b' }} />
            <Title order={6} ta="center" style={{ fontFamily: 'Space Grotesk' }}>
              Oportunidad de Mejora
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Enfócate en Pediatría para subir más rápido
            </Text>
            <Text ta="center" fw={600} style={{ color: '#f59e0b' }}>
              +8 posiciones potenciales
            </Text>
          </Stack>
        </Card>

        {/* Tendencia */}
        <Card padding="sm" radius="md" style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}>
          <Stack gap="sm" align="center">
            <IconFlame size={24} style={{ color: '#10b981' }} />
            <Title order={6} ta="center" style={{ fontFamily: 'Space Grotesk' }}>
              Tendencia
            </Title>
            <Text ta="center" c="dimmed" size="sm">
              Mejorando consistentemente
            </Text>
            <Text ta="center" fw={600} style={{ color: '#10b981' }}>
              +2.3% últimas 2 semanas
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );

  const renderLeaderboard = () => (
    <Stack gap="xl">
      {/* Podium épico del top 3 con insignias especiales */}
      <Card padding="lg" radius="md" style={{
        backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #fbbf24, #dc2626, #06b6d4)',
        }} />

        <Stack gap="md">
          <Title order={3} ta="center" style={{ fontFamily: 'Space Grotesk' }}>
            Podium Nacional
          </Title>
          <Text ta="center" c="dimmed" size="sm">Los únicos 3 con insignias especiales</Text>

          <Group justify="center" align="end" gap="md">
            {MOCK_GAMING_DATA.slice(0, 3).map((player, index) => {
              const positions = [1, 0, 2]; // 2nd, 1st, 3rd for visual arrangement
              const actualIndex = positions[index];
              const actualPlayer = MOCK_GAMING_DATA[actualIndex];
              const isFirst = actualIndex === 0;

              return (
                <Stack key={actualPlayer.position} align="center" gap="md">
                  <Box style={{
                    backgroundColor: isFirst ? 'rgba(251, 191, 36, 0.2)' : colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                    borderRadius: '50%',
                    width: isFirst ? 60 : 45,
                    height: isFirst ? 60 : 45,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isFirst ? '3px solid #fbbf24' : '2px solid transparent',
                    filter: isFirst ? 'drop-shadow(0 0 20px #fbbf24)' : undefined,
                  }}>
                    <IconUser size={isFirst ? 30 : 22} style={{
                      color: isFirst ? '#fbbf24' : colorScheme === 'dark' ? '#94a3b8' : '#64748b'
                    }} />
                  </Box>

                  <RankingBadge
                    position={actualPlayer.position}
                    size={isFirst ? 'lg' : 'md'}
                    showDescription={false}
                    showPosition={false}
                    showBadgeName={false}
                    animated={true}
                  />

                  <Stack gap={2} align="center">
                    <Text fw={700} ta="center" style={{
                      fontSize: isFirst ? '1rem' : '0.9rem',
                      color: isFirst ? '#fbbf24' : colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                      fontFamily: 'Space Grotesk',
                    }}>
                      {actualPlayer.name}
                    </Text>
                    <Badge color="blue" size="xs">{actualPlayer.specialty}</Badge>
                    <Group gap="xs">
                      <Text size="sm" fw={600} style={{ color: '#10b981' }}>
                        {actualPlayer.score}%
                      </Text>
                      <Text size="sm" c="dimmed">
                        {actualPlayer.xp.toLocaleString()} XP
                      </Text>
                    </Group>
                  </Stack>
                </Stack>
              );
            })}
          </Group>
        </Stack>
      </Card>

      {/* Ranking completo */}
      <Card padding="lg" radius="md" style={{
        backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Title order={4} style={{ fontFamily: 'Space Grotesk' }}>
              Ranking Completo
            </Title>
            <Group gap="sm">
              <Select
                placeholder="Filtrar por especialidad"
                data={[
                  { value: 'all', label: 'Todas las especialidades' },
                  { value: 'medicina_interna', label: 'Medicina Interna' },
                  { value: 'cirugia_general', label: 'Cirugía General' },
                  { value: 'pediatria', label: 'Pediatría' },
                  { value: 'ginecologia', label: 'Ginecología' },
                ]}
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                leftSection={<IconFilter size={16} />}
                style={{ minWidth: 160 }}
              />
            </Group>
          </Group>

          <ScrollArea h={400}>
            <Stack gap="sm">
              {MOCK_GAMING_DATA.map((player) => (
                <Box key={player.position} style={{
                  backgroundColor: player.isCurrentUser
                    ? colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
                    : colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(255, 255, 255, 0.6)',
                  border: player.isCurrentUser ? `2px solid #3b82f6` : `1px solid ${colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                }}>
                  <Group justify="space-between" align="center">
                    <Group gap="md" align="center">
                      <Box style={{
                        backgroundColor: player.isCurrentUser ? 'rgba(59, 130, 246, 0.2)' : colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: player.isCurrentUser ? '2px solid #3b82f6' : '1px solid transparent',
                      }}>
                        <IconUser size={20} style={{
                          color: player.isCurrentUser ? '#3b82f6' : colorScheme === 'dark' ? '#94a3b8' : '#64748b'
                        }} />
                      </Box>
                      <Stack gap={1}>
                        <Group gap="xs" align="center">
                          <Text fw={player.isCurrentUser ? 700 : 600} style={{
                            color: player.isCurrentUser ? '#3b82f6' : colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                            fontFamily: 'Space Grotesk',
                          }}>
                            #{player.position} {player.name}
                          </Text>
                          {player.position <= 3 && (
                            <Badge size="xs" color={player.position === 1 ? 'yellow' : player.position === 2 ? 'red' : 'cyan'}>
                              ESPECIAL
                            </Badge>
                          )}
                        </Group>
                        <Group gap="xs">
                          <Badge size="xs" color="blue">{player.specialty}</Badge>
                          <Text size="xs" c="dimmed">{player.xp.toLocaleString()} XP</Text>
                        </Group>
                      </Stack>
                    </Group>

                    <Group gap="md" align="center">
                      {player.position <= 3 && (
                        <RankingBadge
                          position={player.position}
                          size="sm"
                          showDescription={false}
                          showPosition={false}
                          showBadgeName={false}
                          animated={true}
                        />
                      )}
                      <Text fw={600} style={{ color: '#10b981', fontSize: '1rem' }}>
                        {player.score}%
                      </Text>
                    </Group>
                  </Group>
                </Box>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Card>
    </Stack>
  );

  const renderLogros = () => (
    <AchievementGrid
      achievements={ACHIEVEMENTS}
      unlockedIds={unlockedAchievements}
      filterCategory={undefined}
    />
  );

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
            50% { box-shadow: 0 0 40px rgba(245, 158, 11, 0.6); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          style={{
            padding: '16px 32px',
            overflow: 'hidden',
            overflowY: 'auto',
            flex: 1,
            width: '100%',
          }}
        >
            {/* Page Header */}
            <Box mb="xs" ta="left">
              <Title
                order={3}
                size="1.1rem"
                fw={600}
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  marginBottom: '2px',
                }}
              >
                Rankings y Competencia
              </Title>
              <Text
                size="xs"
                ta="left"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '11px',
                }}
              >
                Compite con otros estudiantes y alcanza la cima del leaderboard ENARM
              </Text>
            </Box>

        {/* Navigation Tabs */}
        <Box
          mb="sm"
          style={{
            padding: '6px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value || 'mi-posicion')}
            variant="pills"
            radius="xl"
          >
            <Tabs.List
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                borderRadius: '25px',
                gap: '4px',
                padding: '6px',
                boxShadow: 'none',
              }}
            >
              {MAIN_TABS.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    leftSection={<IconComponent size={16} />}
                    style={{
                      backgroundColor: activeTab === tab.value
                        ? (tab.value === 'mi-posicion' ? '#3b82f6' :
                           tab.value === 'leaderboard' ? '#10b981' : '#8b5cf6')
                        : 'transparent',
                      color: activeTab === tab.value
                        ? 'white'
                        : (colorScheme === 'dark' ? '#94a3b8' : '#64748b'),
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 12px',
                      fontWeight: activeTab === tab.value ? 600 : 500,
                      fontSize: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: activeTab === tab.value
                        ? (tab.value === 'mi-posicion' ? '0 4px 12px rgba(59, 130, 246, 0.3)' :
                           tab.value === 'leaderboard' ? '0 4px 12px rgba(16, 185, 129, 0.3)' :
                           '0 4px 12px rgba(139, 92, 246, 0.3)')
                        : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.value) {
                        e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.value) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {tab.label}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs>
        </Box>

        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || 'mi-posicion')}>

          {/* Tab Content */}
          <Tabs.Panel value="mi-posicion">
            {renderMiPosicion()}
          </Tabs.Panel>

          <Tabs.Panel value="leaderboard">
            {renderLeaderboard()}
          </Tabs.Panel>

          <Tabs.Panel value="logros">
            {renderLogros()}
          </Tabs.Panel>
        </Tabs>
        </Box>

        {/* Sticky Footer */}
        <Box
          style={{
            borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: colorScheme === 'dark'
              ? 'rgba(15, 23, 42, 0.8)'
              : 'rgba(247, 243, 238, 0.8)',
            marginTop: 'auto',
          }}
        >
          <Text
            size="xs"
            style={{
              color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            © 2024 ENARM360. Todos los derechos reservados.
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default RankingsPage;
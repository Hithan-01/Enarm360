import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Title, 
  Text, 
  Group, 
  Stack, 
  useMantineColorScheme, 
  Select, 
  Badge, 
  Button, 
  Switch, 
  Divider, 
  Card,
  SimpleGrid,
  TextInput,
  Paper,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Avatar,
  ThemeIcon,
  Loader,
  Center,
  Tabs,
  Grid,
  Container,
  Transition,
  UnstyledButton,
  Indicator,
  rem,
  Flex,
  SegmentedControl,
  Anchor,
  Chip
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { userService, type UserMinDTO } from '../../services/userService';
import { adminPermissionsService, type PermisoDTO, type UsuarioPermisosDTO, type UsuarioPermisoLogDTO } from '../../services/adminPermissionsService';
import PageTransition from '../../components/animations/PageTransition';
import {
  IconUser,
  IconSearch,
  IconShield,
  IconUserCheck,
  IconUserX,
  IconPlus,
  IconX,
  IconFilter,
  IconRefresh,
  IconKey,
  IconLock,
  IconLockOpen,
  IconSettings,
  IconUsersGroup,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconUserPlus,
  IconUserMinus,
  IconCrown,
  IconSchool,
  IconSparkles,
  IconChevronRight,
  IconActivity,
  IconShieldCheck,
  IconTrash,
  IconAdjustments,
  IconClock,
  IconHistory,
  IconTrendingUp,
  IconUserShield
} from '@tabler/icons-react';

const PermissionsAdminPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();

  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [info, setInfo] = useState<UsuarioPermisosDTO | null>(null);
  const [permisos, setPermisos] = useState<PermisoDTO[]>([]);
  const [permToAdd, setPermToAdd] = useState<string | null>(null);
  const [loadingPermisos, setLoadingPermisos] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('search');
  const [logs, setLogs] = useState<UsuarioPermisoLogDTO[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // filtros avanzados
  const [filterRol, setFilterRol] = useState<string | null>(null);
  const [filterActivo, setFilterActivo] = useState<string | null>(null);
  const [filterPermiso, setFilterPermiso] = useState<string | null>(null);
  const [filterEffective, setFilterEffective] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; label: string; user?: UserMinDTO }[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPermisos(true);
        const list = await adminPermissionsService.listPermisos();
        setPermisos(list);
      } catch (e) {
        console.error('Error cargando permisos', e);
      } finally {
        setLoadingPermisos(false);
      }
    })();

    // Cargar todos los usuarios por defecto al iniciar
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      setSearchLoading(true);
      const res: UserMinDTO[] = await userService.adminSearchUsers({
        page: 0,
        size: 100,
      });
      setFilteredUsers(res.map(u => ({
        id: u.id,
        label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username}`,
        user: u
      })));
    } catch (e) {
      console.error('Error cargando usuarios', e);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchUsers = async (q: string) => {
    if (!q || q.trim().length < 2) {
      setOptions([]);
      // Si no hay búsqueda, mostrar todos los usuarios
      loadAllUsers();
      return;
    }
    try {
      setSearchLoading(true);
      const users: UserMinDTO[] = await userService.searchUsers(q.trim(), 0, 8);
      setOptions(users.map(u => ({
        value: String(u.id),
        label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username} <${u.email}>`.trim()
      })));
      // Limpiar la lista filtrada cuando se usa la búsqueda rápida
      setFilteredUsers(null);
    } catch (e) {
      console.error('Error buscando usuarios:', e);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadUserInfo = async (id: number) => {
    try {
      setLoadingInfo(true);
      const data = await adminPermissionsService.getUsuarioPermisos(id);
      setInfo(data);
      // Cargar logs al mismo tiempo
      loadUserLogs(id);
    } catch (e) {
      console.error('Error cargando info de usuario', e);
    } finally {
      setLoadingInfo(false);
    }
  };

  const loadUserLogs = async (id: number) => {
    try {
      setLoadingLogs(true);
      const logsData = await adminPermissionsService.getLogs(id, 20);
      setLogs(logsData);
    } catch (e) {
      console.error('Error cargando logs', e);
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    notifications.show({
      color: 'blue',
      title: 'Historial limpiado',
      message: 'El historial local ha sido limpiado',
      icon: <IconTrash />
    });
  };

  const onToggleActivo = async (checked: boolean) => {
    if (!selectedUserId) return;
    try {
      setSaving(true);
      const data = await adminPermissionsService.setActivo(selectedUserId, checked);
      setInfo(data);
      // Recargar logs después del cambio
      loadUserLogs(selectedUserId);
      notifications.show({
        color: 'green',
        title: 'Estado actualizado',
        message: `Usuario ${checked ? 'activado' : 'desactivado'} exitosamente`,
        icon: checked ? <IconUserCheck /> : <IconUserX />
      });
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: e?.response?.data?.message || 'No se pudo actualizar'
      });
    } finally {
      setSaving(false);
    }
  };

  const onGrant = async () => {
    if (!selectedUserId || !permToAdd) return;
    try {
      setSaving(true);
      const data = await adminPermissionsService.grant(selectedUserId, permToAdd);
      setInfo(data);
      setPermToAdd(null);
      // Recargar logs después del cambio
      loadUserLogs(selectedUserId);
      notifications.show({
        color: 'green',
        title: 'Permiso otorgado',
        message: `El permiso ${permToAdd} fue agregado exitosamente`,
        icon: <IconShieldCheck />
      });
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: e?.response?.data?.message || 'No se pudo otorgar'
      });
    } finally {
      setSaving(false);
    }
  };

  const onRevoke = async (codigo: string) => {
    if (!selectedUserId) return;
    try {
      setSaving(true);
      const data = await adminPermissionsService.revoke(selectedUserId, codigo);
      setInfo(data);
      // Recargar logs después del cambio
      loadUserLogs(selectedUserId);
      notifications.show({
        color: 'orange',
        title: 'Permiso revocado',
        message: `El permiso ${codigo} fue removido`,
        icon: <IconShieldCheck />
      });
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: e?.response?.data?.message || 'No se pudo revocar'
      });
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = (name: string | undefined, username: string | undefined) => {
    if (name) {
      const parts = name.split(' ');
      return parts.length >= 2 
        ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
    }
    return username?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <PageTransition type="fade" duration={400}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? '#0a0a0a'
            : '#fafafa',
        }}
      >
        <Container size="xl" py="md">
          {/* Header */}
          <Stack gap="lg" mb="xl">
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={1} size="h2" fw={600} style={{
                  color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                  letterSpacing: '-0.5px'
                }}>
                  Gestión de Permisos
                </Title>
                <Text size="sm" c="dimmed" mt={4}>
                  Administra roles y permisos de usuarios
                </Text>
              </div>

              <Group gap="sm">
                {permisos.length > 0 && (
                  <Badge size="lg" variant="light" color="gray">
                    {permisos.length} permisos disponibles
                  </Badge>
                )}
                {permisos.length === 0 && (
                  <Button
                    variant="light"
                    color="blue"
                    size="sm"
                    leftSection={<IconPlus size={16} />}
                    onClick={async () => {
                      try {
                        setLoadingPermisos(true);
                        const seeded = await adminPermissionsService.seedPermisos();
                        setPermisos(seeded);
                        notifications.show({
                          color: 'green',
                          title: 'Permisos inicializados',
                          message: `${seeded.length} permisos creados exitosamente`,
                          icon: <IconShieldCheck />
                        });
                      } catch (e: any) {
                        notifications.show({
                          color: 'red',
                          title: 'Error',
                          message: 'No se pudieron inicializar los permisos'
                        });
                      } finally {
                        setLoadingPermisos(false);
                      }
                    }}
                    loading={loadingPermisos}
                  >
                    Inicializar Permisos
                  </Button>
                )}
              </Group>
            </Group>

            {/* Search Bar with Filters */}
            <Paper
              p="md"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: colorScheme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.15)'
                  : '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: colorScheme === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <Stack gap="md">
                <TextInput
                  placeholder="Buscar por nombre, email o username..."
                  leftSection={<IconSearch size={18} style={{ opacity: 0.5 }} />}
                  rightSection={
                    <Group gap="xs">
                      {searchLoading && <Loader size={16} />}
                      {searchValue && (
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            setSearchValue('');
                            setOptions([]);
                            loadAllUsers();
                          }}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      )}
                      <ActionIcon
                        variant={activeTab === 'filters' ? 'filled' : 'subtle'}
                        color={activeTab === 'filters' ? 'blue' : 'gray'}
                        onClick={() => setActiveTab(activeTab === 'filters' ? null : 'filters')}
                      >
                        <IconAdjustments size={18} />
                      </ActionIcon>
                    </Group>
                  }
                  value={searchValue}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    setSearchValue(val);
                    clearTimeout((window as any).__pSearchTimer);
                    (window as any).__pSearchTimer = setTimeout(() => fetchUsers(val), 300);
                  }}
                  size="md"
                  styles={{
                    input: {
                      border: 'none',
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                      '&:focus': {
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.03)',
                      }
                    }
                  }}
                />

                {/* Collapsible Filters */}
                <Transition
                  mounted={activeTab === 'filters'}
                  transition="fade"
                  duration={200}
                  timingFunction="ease"
                >
                  {(styles) => (
                    <div style={styles}>
                      <Divider label="Filtros avanzados" labelPosition="center" my="xs" />
                      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
                        <Select
                          placeholder="Filtrar por rol"
                          data={[
                            { value: 'ADMIN', label: 'Administrador' },
                            { value: 'ESTUDIANTE', label: 'Estudiante' }
                          ]}
                          value={filterRol}
                          onChange={setFilterRol}
                          clearable
                          size="sm"
                          leftSection={<IconUserShield size={16} />}
                          styles={{
                            input: {
                              backgroundColor: 'transparent',
                              border: '1px solid ' + (colorScheme === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)'),
                            }
                          }}
                        />
                        <Select
                          placeholder="Filtrar por estado"
                          data={[
                            { value: 'true', label: 'Activo' },
                            { value: 'false', label: 'Inactivo' }
                          ]}
                          value={filterActivo}
                          onChange={setFilterActivo}
                          clearable
                          size="sm"
                          leftSection={<IconActivity size={16} />}
                          styles={{
                            input: {
                              backgroundColor: 'transparent',
                              border: '1px solid ' + (colorScheme === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)'),
                            }
                          }}
                        />
                        <Select
                          placeholder="Filtrar por permiso"
                          data={permisos.map(p => ({
                            value: p.codigo,
                            label: p.codigo
                          }))}
                          value={filterPermiso}
                          onChange={setFilterPermiso}
                          searchable
                          clearable
                          size="sm"
                          leftSection={<IconKey size={16} />}
                          styles={{
                            input: {
                              backgroundColor: 'transparent',
                              border: '1px solid ' + (colorScheme === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)'),
                            }
                          }}
                        />
                      </SimpleGrid>

                      <Group justify="flex-end" mt="sm">
                        <Button
                          size="sm"
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            setFilterRol(null);
                            setFilterActivo(null);
                            setFilterPermiso(null);
                            setFilteredUsers(null);
                          }}
                        >
                          Limpiar
                        </Button>

                        <Button
                          size="sm"
                          variant="filled"
                          color="blue"
                          leftSection={<IconSearch size={16} />}
                          onClick={async () => {
                            try {
                              const res: UserMinDTO[] = await userService.adminSearchUsers({
                                query: searchValue || undefined,
                                rol: filterRol || undefined,
                                activo: filterActivo == null ? undefined : filterActivo === 'true',
                                permiso: filterPermiso || undefined,
                                effective: filterEffective,
                                page: 0,
                                size: 50,
                              });
                              setFilteredUsers(res.map(u => ({
                                id: u.id,
                                label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username}`,
                                user: u
                              })));
                              notifications.show({
                                color: 'blue',
                                message: `${res.length} usuario${res.length !== 1 ? 's' : ''} encontrado${res.length !== 1 ? 's' : ''}`,
                                icon: <IconSearch />
                              });
                            } catch (e) {
                              notifications.show({
                                color: 'red',
                                title: 'Error',
                                message: 'No se pudo realizar la búsqueda'
                              });
                            }
                          }}
                        >
                          Buscar
                        </Button>
                      </Group>
                    </div>
                  )}
                </Transition>
              </Stack>
            </Paper>
          </Stack>

          {/* Search Results or Filtered Users */}
          {!selectedUserId && (options.length > 0 || (filteredUsers && filteredUsers.length > 0)) && (
            <Paper
              mt="md"
              p="xs"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: colorScheme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: colorScheme === 'dark'
                  ? '0 4px 24px rgba(0, 0, 0, 0.25)'
                  : '0 4px 24px rgba(0, 0, 0, 0.06)',
              }}
            >
              {filteredUsers && filteredUsers.length > 0 && (
                <Group gap="xs" p="xs" mb="xs">
                  <Badge variant="light" color="blue" size="sm">
                    {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
                  </Badge>
                </Group>
              )}
              <ScrollArea h={400}>
                <Stack gap={4}>
                  {(options.length > 0 ? options.map(opt => ({
                    id: Number(opt.value),
                    label: opt.label,
                    user: undefined
                  })) : filteredUsers || []).map(opt => {
                    const userId = opt.id;
                    const user = opt.user;
                    const parts = opt.label.split(' — ');
                    const namePart = parts[0] || user?.nombre || '';
                    const usernamePart = parts[1] || user?.username || '';

                    return (
                      <UnstyledButton
                        key={userId}
                        onClick={() => {
                          setSelectedUserId(userId);
                          setInfo(null);
                          loadUserInfo(userId);
                          setOptions([]);
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '12px',
                          borderRadius: '12px',
                          backgroundColor: selectedUserId === userId
                            ? colorScheme === 'dark'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(59, 130, 246, 0.08)'
                            : 'transparent',
                          border: selectedUserId === userId
                            ? colorScheme === 'dark'
                              ? '1px solid rgba(59, 130, 246, 0.3)'
                              : '1px solid rgba(59, 130, 246, 0.2)'
                            : '1px solid transparent',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUserId !== userId) {
                            e.currentTarget.style.backgroundColor = colorScheme === 'dark'
                              ? 'rgba(255, 255, 255, 0.04)'
                              : 'rgba(0, 0, 0, 0.02)';
                            e.currentTarget.style.borderColor = colorScheme === 'dark'
                              ? 'rgba(255, 255, 255, 0.08)'
                              : 'rgba(0, 0, 0, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUserId !== userId) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }
                        }}
                      >
                        <Group gap="md" wrap="nowrap" align="flex-start">
                          {/* Avatar */}
                          <Avatar
                            size="lg"
                            radius="md"
                            color={user?.activo === false ? 'gray' : 'blue'}
                            variant="light"
                          >
                            {getUserInitials(user?.nombre || namePart, user?.username || usernamePart)}
                          </Avatar>

                          {/* User Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Group gap="xs" mb={4}>
                              <Text size="sm" fw={600} truncate>
                                {namePart}
                              </Text>
                              {user?.activo === false && (
                                <Badge size="xs" color="red" variant="filled">
                                  Inactivo
                                </Badge>
                              )}
                              {user?.activo !== false && user?.subscriptionStatus && (
                                <Badge
                                  size="xs"
                                  color={
                                    user.subscriptionStatus === 'ACTIVE' ? 'green' :
                                    user.subscriptionStatus === 'TRIAL' ? 'blue' :
                                    user.subscriptionStatus === 'EXPIRED' ? 'orange' : 'gray'
                                  }
                                  variant="light"
                                >
                                  {user.subscriptionStatus === 'ACTIVE' ? 'Premium' :
                                   user.subscriptionStatus === 'TRIAL' ? 'Trial' :
                                   user.subscriptionStatus === 'EXPIRED' ? 'Expirado' : 'Free'}
                                </Badge>
                              )}
                            </Group>

                            <Group gap="xs" mb={2}>
                              <Text size="xs" c="dimmed" truncate>
                                @{usernamePart}
                              </Text>
                              {user?.email && (
                                <>
                                  <Text size="xs" c="dimmed">•</Text>
                                  <Text size="xs" c="dimmed" truncate>
                                    {user.email}
                                  </Text>
                                </>
                              )}
                            </Group>

                            {user?.roles && user.roles.length > 0 && (
                              <Group gap={4} mt={4}>
                                {user.roles.slice(0, 3).map((role, idx) => (
                                  <Badge
                                    key={idx}
                                    size="xs"
                                    variant="dot"
                                    color={role === 'ADMIN' ? 'violet' : 'gray'}
                                  >
                                    {role === 'ADMIN' ? 'Admin' : 'Estudiante'}
                                  </Badge>
                                ))}
                                {user.roles.length > 3 && (
                                  <Text size="xs" c="dimmed">+{user.roles.length - 3}</Text>
                                )}
                              </Group>
                            )}
                          </div>

                          {/* Arrow Icon */}
                          <ThemeIcon
                            size="sm"
                            variant="subtle"
                            color={selectedUserId === userId ? 'blue' : 'gray'}
                          >
                            <IconChevronRight size={16} />
                          </ThemeIcon>
                        </Group>
                      </UnstyledButton>
                    );
                  })}
                </Stack>
              </ScrollArea>
            </Paper>
          )}

          {/* Loading State */}
          {loadingInfo && (
            <Center h={400}>
              <Stack align="center">
                <Loader size="md" color="gray" />
                <Text size="sm" c="dimmed">Cargando...</Text>
              </Stack>
            </Center>
          )}

          {/* Selected User Summary */}
          {selectedUserId && !info && !loadingInfo && (
            <Paper
              mt="md"
              p="md"
              radius="xl"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.08)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: colorScheme === 'dark'
                  ? '1px solid rgba(59, 130, 246, 0.2)'
                  : '1px solid rgba(59, 130, 246, 0.15)',
              }}
            >
              <Group justify="space-between">
                <Group gap="sm">
                  <IconUser size={20} />
                  <Text size="sm" fw={500}>
                    Usuario #{selectedUserId} seleccionado
                  </Text>
                </Group>
                <Button
                  variant="subtle"
                  size="xs"
                  color="gray"
                  leftSection={<IconX size={14} />}
                  onClick={() => {
                    setSelectedUserId(null);
                    setInfo(null);
                  }}
                >
                  Ver todos
                </Button>
              </Group>
            </Paper>
          )}

          {/* Empty State */}
          {!selectedUserId && !info && !loadingInfo && (
            <Center h={400}>
              <Stack align="center" gap="xs">
                <Text size="lg" c="dimmed">
                  Selecciona un usuario para ver sus permisos
                </Text>
              </Stack>
            </Center>
          )}

          {/* User Details */}
          {info && !loadingInfo && (
            <Stack gap="lg" mt="xl">
              {/* Quick Stats */}
              <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                <Tooltip
                  label="Roles asignados al usuario (ADMIN, ESTUDIANTE, etc.)"
                  position="bottom"
                  withArrow
                  multiline
                  w={200}
                >
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(59, 130, 246, 0.08)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: colorScheme === 'dark'
                        ? '1px solid rgba(59, 130, 246, 0.2)'
                        : '1px solid rgba(59, 130, 246, 0.15)',
                      cursor: 'help',
                    }}
                  >
                    <Group gap="xs" justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                          <IconUserShield size={20} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed" fw={500}>Roles</Text>
                          <Text size="xl" fw={700}>{info.roles.length}</Text>
                        </div>
                      </Group>
                      <IconInfoCircle size={16} style={{ opacity: 0.4 }} />
                    </Group>
                  </Paper>
                </Tooltip>

                <Tooltip
                  label="Permisos específicos otorgados directamente al usuario"
                  position="bottom"
                  withArrow
                  multiline
                  w={200}
                >
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(168, 85, 247, 0.1)'
                        : 'rgba(168, 85, 247, 0.08)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: colorScheme === 'dark'
                        ? '1px solid rgba(168, 85, 247, 0.2)'
                        : '1px solid rgba(168, 85, 247, 0.15)',
                      cursor: 'help',
                    }}
                  >
                    <Group gap="xs" justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="md" variant="light" color="violet">
                          <IconKey size={20} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed" fw={500}>Directos</Text>
                          <Text size="xl" fw={700}>{info.directPermisos.length}</Text>
                        </div>
                      </Group>
                      <IconInfoCircle size={16} style={{ opacity: 0.4 }} />
                    </Group>
                  </Paper>
                </Tooltip>

                <Tooltip
                  label="Total de permisos activos (incluye directos y heredados de roles)"
                  position="bottom"
                  withArrow
                  multiline
                  w={200}
                >
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(34, 197, 94, 0.08)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: colorScheme === 'dark'
                        ? '1px solid rgba(34, 197, 94, 0.2)'
                        : '1px solid rgba(34, 197, 94, 0.15)',
                      cursor: 'help',
                    }}
                  >
                    <Group gap="xs" justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="md" variant="light" color="green">
                          <IconShieldCheck size={20} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed" fw={500}>Efectivos</Text>
                          <Text size="xl" fw={700}>{info.effectivePermisos.length}</Text>
                        </div>
                      </Group>
                      <IconInfoCircle size={16} style={{ opacity: 0.4 }} />
                    </Group>
                  </Paper>
                </Tooltip>

                <Tooltip
                  label="Historial de cambios de permisos realizados sobre este usuario"
                  position="bottom"
                  withArrow
                  multiline
                  w={200}
                >
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark'
                        ? 'rgba(251, 146, 60, 0.1)'
                        : 'rgba(251, 146, 60, 0.08)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: colorScheme === 'dark'
                        ? '1px solid rgba(251, 146, 60, 0.2)'
                        : '1px solid rgba(251, 146, 60, 0.15)',
                      cursor: 'help',
                    }}
                  >
                    <Group gap="xs" justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="md" variant="light" color="orange">
                          <IconHistory size={20} />
                        </ThemeIcon>
                        <div>
                          <Text size="xs" c="dimmed" fw={500}>Cambios</Text>
                          <Text size="xl" fw={700}>{logs.length}</Text>
                        </div>
                      </Group>
                      <IconInfoCircle size={16} style={{ opacity: 0.4 }} />
                    </Group>
                  </Paper>
                </Tooltip>
              </SimpleGrid>

              {/* User Info Header */}
              <Paper
                p="lg"
                radius="xl"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: colorScheme === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <div>
                    <Text size="xl" fw={600}>
                      {`${info.nombre || ''} ${info.apellidos || ''}`.trim() || info.username}
                    </Text>
                    <Group gap="xs" mt="xs">
                      <Text size="sm" c="dimmed">
                        {info.username}
                      </Text>
                      <Text size="sm" c="dimmed">•</Text>
                      <Text size="sm" c="dimmed">
                        {info.email}
                      </Text>
                    </Group>
                  </div>

                  <Group gap="md">
                    <div style={{ textAlign: 'right' }}>
                      <Text size="xs" c="dimmed" mb={4}>
                        Estado de cuenta
                      </Text>
                      <Badge 
                        size="lg" 
                        variant="light"
                        color={info.activo ? 'green' : 'red'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => onToggleActivo(!info.activo)}
                      >
                        {info.activo ? 'ACTIVA' : 'INACTIVA'}
                      </Badge>
                    </div>
                  </Group>
                </Group>
              </Paper>

              {/* Permissions Grid */}
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                {/* Roles Card */}
                <Paper
                  p="lg"
                  radius="xl"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: colorScheme === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.15)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: colorScheme === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Text size="sm" fw={600} mb="md">
                    Roles • {info.roles.length}
                  </Text>
                  {info.roles.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      Sin roles asignados
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {info.roles.map(r => (
                        <Badge
                          key={r}
                          size="md"
                          variant="light"
                          color="gray"
                          fullWidth
                          styles={{ root: { textTransform: 'none' } }}
                        >
                          {r === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                        </Badge>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* Direct Permissions Card */}
                <Paper
                  p="lg"
                  radius="xl"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: colorScheme === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.15)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: colorScheme === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Text size="sm" fw={600} mb="md">
                    Permisos Directos • {info.directPermisos.length}
                  </Text>
                  
                  <Stack gap="sm">
                    {info.directPermisos.length > 0 && (
                      <ScrollArea h={120}>
                        <Group gap="xs">
                          {info.directPermisos.map(p => (
                            <Badge
                              key={p}
                              size="md"
                              variant="outline"
                              color="dark"
                              rightSection={
                                <ActionIcon
                                  size="xs"
                                  variant="transparent"
                                  onClick={() => onRevoke(p)}
                                  style={{ marginLeft: 4 }}
                                >
                                  <IconX size={10} />
                                </ActionIcon>
                              }
                              styles={{ root: { textTransform: 'none' } }}
                            >
                              {p}
                            </Badge>
                          ))}
                        </Group>
                      </ScrollArea>
                    )}

                    <Divider />
                    
                    <Group>
                      <Select
                        style={{ flex: 1 }}
                        size="sm"
                        placeholder="Agregar permiso..."
                        value={permToAdd}
                        onChange={setPermToAdd}
                        data={permisos
                          .filter(p => !info.directPermisos.includes(p.codigo))
                          .map(p => ({
                            value: p.codigo,
                            label: p.codigo,
                          }))}
                        searchable
                        styles={{
                          input: {
                            border: '1px solid ' + (colorScheme === 'dark' 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(0, 0, 0, 0.1)'),
                            backgroundColor: 'transparent'
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={onGrant}
                        disabled={!permToAdd || saving}
                        loading={saving}
                        variant="filled"
                        color="dark"
                      >
                        Agregar
                      </Button>
                    </Group>
                    
                    {info.directPermisos.length === 0 && (
                      <Text size="sm" c="dimmed">
                        Sin permisos directos
                      </Text>
                    )}
                  </Stack>
                </Paper>

                {/* Effective Permissions Card */}
                <Paper
                  p="lg"
                  radius="xl"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: colorScheme === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.15)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: colorScheme === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <Text size="sm" fw={600} mb="md">
                    Permisos Efectivos • {info.effectivePermisos.length}
                  </Text>

                  {info.effectivePermisos.length === 0 ? (
                    <Text size="sm" c="dimmed">
                      Sin permisos efectivos
                    </Text>
                  ) : (
                    <ScrollArea h={140}>
                      <Group gap="xs">
                        {info.effectivePermisos.map(p => {
                          const isDirect = info.directPermisos.includes(p);
                          return (
                            <Tooltip
                              key={p}
                              label={isDirect ? 'Permiso directo' : 'Heredado de roles'}
                              position="top"
                              withArrow
                            >
                              <Badge
                                size="sm"
                                variant={isDirect ? 'filled' : 'light'}
                                color={isDirect ? 'violet' : 'gray'}
                                styles={{ root: { textTransform: 'none' } }}
                                leftSection={
                                  isDirect ? <IconKey size={12} /> : <IconTrendingUp size={12} />
                                }
                              >
                                {p}
                              </Badge>
                            </Tooltip>
                          );
                        })}
                      </Group>
                    </ScrollArea>
                  )}

                  <Group gap="xs" mt="md">
                    <Badge size="xs" variant="light" color="violet" leftSection={<IconKey size={10} />}>
                      Directo
                    </Badge>
                    <Badge size="xs" variant="light" color="gray" leftSection={<IconTrendingUp size={10} />}>
                      Heredado
                    </Badge>
                  </Group>
                </Paper>
              </SimpleGrid>

              {/* Audit Logs Section */}
              <Paper
                p="lg"
                radius="xl"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: colorScheme === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                }}
              >
                <Group justify="space-between" mb="md">
                  <Group gap="xs">
                    <IconHistory size={20} />
                    <Text size="sm" fw={600}>
                      Historial de Cambios
                    </Text>
                  </Group>
                  <Group gap="xs">
                    {loadingLogs && <Loader size="sm" />}
                    {logs.length > 0 && (
                      <Tooltip label="Limpiar historial local" withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={clearLogs}
                          disabled={loadingLogs}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {selectedUserId && (
                      <Tooltip label="Recargar historial" withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => loadUserLogs(selectedUserId)}
                          disabled={loadingLogs}
                        >
                          <IconRefresh size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Group>

                {logs.length === 0 && !loadingLogs ? (
                  <Center py="xl">
                    <Stack align="center" gap="xs">
                      <IconHistory size={48} style={{ opacity: 0.3 }} />
                      <Text size="sm" c="dimmed">
                        No hay cambios registrados
                      </Text>
                    </Stack>
                  </Center>
                ) : (
                  <ScrollArea h={300}>
                    <Stack gap="xs">
                      {logs.map((log, idx) => (
                        <Paper
                          key={idx}
                          p="sm"
                          radius="md"
                          style={{
                            backgroundColor: colorScheme === 'dark'
                              ? 'rgba(255, 255, 255, 0.03)'
                              : 'rgba(0, 0, 0, 0.02)',
                            border: colorScheme === 'dark'
                              ? '1px solid rgba(255, 255, 255, 0.05)'
                              : '1px solid rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <Group justify="space-between" wrap="nowrap">
                            <Group gap="sm" style={{ flex: 1 }}>
                              <ThemeIcon
                                size="md"
                                radius="md"
                                variant="light"
                                color={log.accion === 'GRANT' ? 'green' : 'red'}
                              >
                                {log.accion === 'GRANT' ? (
                                  <IconPlus size={16} />
                                ) : (
                                  <IconX size={16} />
                                )}
                              </ThemeIcon>
                              <div style={{ flex: 1 }}>
                                <Group gap="xs">
                                  <Text size="sm" fw={500}>
                                    {log.accion === 'GRANT' ? 'Otorgó' : 'Revocó'}
                                  </Text>
                                  <Badge
                                    size="sm"
                                    variant="light"
                                    color="violet"
                                    styles={{ root: { textTransform: 'none' } }}
                                  >
                                    {log.permisoCodigo}
                                  </Badge>
                                </Group>
                                <Text size="xs" c="dimmed">
                                  por {log.actorUsername}
                                </Text>
                              </div>
                            </Group>
                            <Group gap="xs">
                              <IconClock size={14} style={{ opacity: 0.5 }} />
                              <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                                {new Date(log.creadoEn).toLocaleString('es-MX', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Text>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  </ScrollArea>
                )}
              </Paper>
            </Stack>
          )}
        </Container>
      </Box>
    </PageTransition>
  );
};

export default PermissionsAdminPage;
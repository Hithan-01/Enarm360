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
  Table,
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
  MultiSelect,
  Checkbox
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { userService, type UserMinDTO } from '../../services/userService';
import { adminPermissionsService, type PermisoDTO, type UsuarioPermisosDTO } from '../../services/adminPermissionsService';
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
  IconInfoCircle
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

  // filtros avanzados
  const [filterRol, setFilterRol] = useState<string | null>(null);
  const [filterActivo, setFilterActivo] = useState<string | null>(null); // 'true' | 'false' | null
  const [filterPermiso, setFilterPermiso] = useState<string | null>(null);
  const [filterEffective, setFilterEffective] = useState<boolean>(true);
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; label: string }[] | null>(null);

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
  }, []);

  const fetchUsers = async (q: string) => {
    if (!q || q.trim().length < 2) {
      setOptions([]);
      return;
    }
    try {
      setSearchLoading(true);
      const users: UserMinDTO[] = await userService.searchUsers(q.trim(), 0, 8);
      setOptions(users.map(u => ({ value: String(u.id), label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username} <${u.email}>`.trim() })));
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
      // cargar logs (opcional)
      try {
        const logs = await adminPermissionsService.getLogs(id, 20);
        // Mapear últimos grants por código si se desea mostrar cerca
        // De momento, solo podríamos usarlos como tooltip o más adelante en una tabla
      } catch (e) { /* opcional */ }
    } catch (e) {
      console.error('Error cargando info de usuario', e);
    } finally {
      setLoadingInfo(false);
    }
  };

  const onToggleActivo = async (checked: boolean) => {
    if (!selectedUserId) return;
    try {
      setSaving(true);
      const data = await adminPermissionsService.setActivo(selectedUserId, checked);
      setInfo(data);
      notifications.show({ color: 'green', title: 'Guardado', message: `Usuario ${checked ? 'activado' : 'desactivado'}` });
    } catch (e: any) {
      notifications.show({ color: 'red', title: 'Error', message: e?.response?.data?.message || 'No se pudo actualizar' });
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
      notifications.show({ color: 'green', title: 'Permiso otorgado', message: 'Se agregó el permiso al usuario' });
    } catch (e: any) {
      notifications.show({ color: 'red', title: 'Error', message: e?.response?.data?.message || 'No se pudo otorgar' });
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
      notifications.show({ color: 'green', title: 'Permiso revocado', message: 'Se quitó el permiso del usuario' });
    } catch (e: any) {
      notifications.show({ color: 'red', title: 'Error', message: e?.response?.data?.message || 'No se pudo revocar' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '32px',
        }}
      >
        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between" align="center">
            <div>
              <Title order={2} mb="xs" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                <Group gap="xs">
                  <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                    <IconShield size={28} />
                  </ThemeIcon>
                  Gestión de Permisos
                </Group>
              </Title>
              <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                Controla los permisos y roles de usuarios en la plataforma
              </Text>
            </div>
            {permisos.length === 0 && (
              <Button
                leftSection={<IconRefresh size={16} />}
                variant="light"
                onClick={async () => {
                  try {
                    setLoadingPermisos(true);
                    const seeded = await adminPermissionsService.seedPermisos();
                    setPermisos(seeded);
                    notifications.show({ color: 'green', message: `Se cargaron ${seeded.length} permisos base` });
                  } catch (e: any) {
                    notifications.show({ color: 'red', message: e?.response?.data?.message || 'Error al cargar permisos' });
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

          <Tabs defaultValue="search" variant="pills" radius="lg">
            <Tabs.List>
              <Tabs.Tab value="search" leftSection={<IconSearch size={16} />}>
                Búsqueda de Usuario
              </Tabs.Tab>
              <Tabs.Tab value="filter" leftSection={<IconFilter size={16} />}>
                Filtros Avanzados
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="search" pt="lg">
              <Card
                radius="xl"
                p="xl"
                style={{
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
                <Stack>
                  <Group align="center">
                    <ThemeIcon size="lg" variant="light" color="blue" radius="md">
                      <IconUser size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        Búsqueda Rápida de Usuario
                      </Text>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Buscar por correo, nombre de usuario, o nombre
                      </Text>
                    </div>
                  </Group>

                  <TextInput
                    size="lg"
                    placeholder="Escribe para buscar usuarios..."
                    leftSection={<IconSearch size={20} />}
                    rightSection={searchLoading ? <Loader size="xs" /> : null}
                    value={searchValue}
                    onChange={(e) => {
                      const val = e.currentTarget.value;
                      setSearchValue(val);
                      clearTimeout((window as any).__pSearchTimer);
                      (window as any).__pSearchTimer = setTimeout(() => fetchUsers(val), 300);
                    }}
                    radius="lg"
                    variant="filled"
                    styles={{
                      input: {
                        backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      }
                    }}
                  />

                  {options.length > 0 && (
                    <Paper
                      p="md"
                      radius="lg"
                      style={{
                        backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                      }}
                    >
                      <Text size="xs" mb="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#475569' }}>
                        Resultados de Búsqueda ({options.length})
                      </Text>
                      <ScrollArea h={200}>
                        <Stack gap="xs">
                          {options.map(opt => (
                            <Paper
                              key={opt.value}
                              p="sm"
                              radius="md"
                              onClick={() => {
                                const id = Number(opt.value);
                                setSelectedUserId(id);
                                setInfo(null);
                                loadUserInfo(id);
                              }}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: selectedUserId === Number(opt.value)
                                  ? colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                                  : 'transparent',
                                border: `1px solid ${selectedUserId === Number(opt.value)
                                  ? colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.3)'
                                  : 'transparent'}`,
                                transition: 'all 0.2s ease',
                              }}
                              withBorder={false}
                            >
                              <Group>
                                <Avatar color="indigo" radius="md">
                                  {opt.label.charAt(0).toUpperCase()}
                                </Avatar>
                                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                                  {opt.label}
                                </Text>
                              </Group>
                            </Paper>
                          ))}
                        </Stack>
                      </ScrollArea>
                    </Paper>
                  )}
                </Stack>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="filter" pt="lg">
              <Card
                radius="xl"
                p="xl"
                style={{
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
                <Stack>
                  <Group align="center" mb="md">
                    <ThemeIcon size="lg" variant="light" color="orange" radius="md">
                      <IconFilter size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        Opciones de Filtrado Avanzado
                      </Text>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Filtrar usuarios por rol, estado y permisos
                      </Text>
                    </div>
                  </Group>

                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <Select
                      label="Rol"
                      placeholder="Todos los roles"
                      data={[
                        { value: 'ADMIN', label: 'Administrador' },
                        { value: 'ESTUDIANTE', label: 'Estudiante' }
                      ]}
                      value={filterRol}
                      onChange={setFilterRol}
                      clearable
                      leftSection={<IconUsersGroup size={16} />}
                      radius="md"
                      variant="filled"
                    />
                    <Select
                      label="Estado"
                      placeholder="Todos los estados"
                      data={[
                        { value: 'true', label: 'Activo' },
                        { value: 'false', label: 'Inactivo' }
                      ]}
                      value={filterActivo}
                      onChange={setFilterActivo}
                      clearable
                      leftSection={filterActivo === 'true' ? <IconUserCheck size={16} /> : <IconUserX size={16} />}
                      radius="md"
                      variant="filled"
                    />
                  </SimpleGrid>

                  <Select
                    label="Permiso Requerido"
                    placeholder="Seleccionar permiso"
                    data={permisos.map(p => ({ 
                      value: p.codigo, 
                      label: `${p.codigo}${p.descripcion ? ` - ${p.descripcion}` : ''}` 
                    }))}
                    value={filterPermiso}
                    onChange={setFilterPermiso}
                    searchable
                    clearable
                    leftSection={<IconKey size={16} />}
                    radius="md"
                    variant="filled"
                  />

                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
                    }}
                  >
                    <Group justify="space-between">
                      <Group>
                        <ThemeIcon size="sm" variant="light" color="indigo" radius="md">
                          <IconInfoCircle size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                            Incluir Permisos Heredados
                          </Text>
                          <Text size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                            Buscar usuarios con permisos de sus roles y permisos directos
                          </Text>
                        </div>
                      </Group>
                      <Switch
                        checked={filterEffective}
                        onChange={(e) => setFilterEffective(e.currentTarget.checked)}
                        size="md"
                      />
                    </Group>
                  </Paper>

                  <Button
                    fullWidth
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
                          label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username} <${u.email}>` 
                        })));
                        notifications.show({ 
                          color: 'green', 
                          message: `Se encontraron ${res.length} usuarios` 
                        });
                      } catch (e) {
                        console.error(e);
                        notifications.show({ 
                          color: 'red', 
                          message: 'Error al buscar usuarios' 
                        });
                      }
                    }}
                    radius="md"
                    size="md"
                  >
                    Aplicar Filtros
                  </Button>
                </Stack>
              </Card>
            </Tabs.Panel>
          </Tabs>

          {filteredUsers && filteredUsers.length > 0 && (
            <Card
              radius="xl"
              p="lg"
              style={{
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
              <Group mb="md">
                <ThemeIcon size="sm" variant="light" color="teal" radius="md">
                  <IconCheck size={14} />
                </ThemeIcon>
                <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Resultados del Filtro ({filteredUsers.length} usuarios)
                </Text>
              </Group>
              <ScrollArea h={150}>
                <Group gap="xs">
                  {filteredUsers.map(u => (
                    <Badge
                      key={u.id}
                      size="lg"
                      variant={selectedUserId === u.id ? 'filled' : 'light'}
                      color="indigo"
                      radius="md"
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setInfo(null);
                        loadUserInfo(u.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {u.label}
                    </Badge>
                  ))}
                </Group>
              </ScrollArea>
            </Card>
          )}


          {loadingInfo && (
            <Center py="xl">
              <Loader size="lg" variant="dots" />
            </Center>
          )}

          {info && (
            <Card
              radius="xl"
              p="xl"
              style={{
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
                {/* User Header */}
                <Paper
                  p="lg"
                  radius="lg"
                  style={{
                    background: colorScheme === 'dark'
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
                  }}
                >
                  <Group justify="space-between">
                    <Group>
                      <Avatar size="lg" color="indigo" radius="xl">
                        {info.nombre?.charAt(0) || info.username?.charAt(0) || 'U'}
                      </Avatar>
                      <div>
                        <Text fw={700} size="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          {`${info.nombre || ''} ${info.apellidos || ''}`.trim() || info.username}
                        </Text>
                        <Group gap="xs">
                          <Badge variant="dot" color="blue">{info.username}</Badge>
                          <Badge variant="dot" color="gray">{info.email}</Badge>
                        </Group>
                      </div>
                    </Group>
                    <Paper
                      p="sm"
                      radius="lg"
                      style={{
                        backgroundColor: info.activo
                          ? colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                          : colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                        border: `1px solid ${info.activo
                          ? colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'
                          : colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`
                      }}
                    >
                      <Group gap="sm">
                        <ThemeIcon
                          size="md"
                          variant="light"
                          color={info.activo ? 'green' : 'red'}
                          radius="md"
                        >
                          {info.activo ? <IconLockOpen size={16} /> : <IconLock size={16} />}
                        </ThemeIcon>
                        <div>
                          <Text size="xs" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#475569' }}>
                            Estado de la Cuenta
                          </Text>
                          <Switch
                            checked={!!info.activo}
                            onChange={(e) => onToggleActivo(e.currentTarget.checked)}
                            disabled={saving}
                            label={info.activo ? 'Activo' : 'Inactivo'}
                            color={info.activo ? 'green' : 'red'}
                          />
                        </div>
                      </Group>
                    </Paper>
                  </Group>
                </Paper>

                {/* Roles Section */}
                <div>
                  <Group mb="sm">
                    <ThemeIcon size="sm" variant="light" color="cyan" radius="md">
                      <IconUsersGroup size={14} />
                    </ThemeIcon>
                    <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                      Roles del Usuario
                    </Text>
                  </Group>
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    }}
                  >
                    {info.roles.length === 0 ? (
                      <Text size="sm" c="dimmed">No hay roles asignados</Text>
                    ) : (
                      <Group gap="xs">
                        {info.roles.map(r => (
                          <Badge
                            key={r}
                            size="lg"
                            variant="light"
                            color="cyan"
                            radius="md"
                            leftSection={<IconShield size={14} />}
                          >
                            {r}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </Paper>
                </div>

                {/* Direct Permissions Section */}
                <div>
                  <Group mb="sm" justify="space-between">
                    <Group>
                      <ThemeIcon size="sm" variant="light" color="violet" radius="md">
                        <IconKey size={14} />
                      </ThemeIcon>
                      <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                        Permisos Directos
                      </Text>
                    </Group>
                    <Tooltip label="Permisos asignados directamente a este usuario">
                      <ThemeIcon size="xs" variant="subtle" color="gray" radius="md">
                        <IconInfoCircle size={12} />
                      </ThemeIcon>
                    </Tooltip>
                  </Group>
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                    }}
                  >
                    {info.directPermisos.length === 0 ? (
                      <Text size="sm" c="dimmed">No hay permisos directos asignados</Text>
                    ) : (
                      <Group gap="xs">
                        {info.directPermisos.map(p => (
                          <Badge
                            key={p}
                            size="lg"
                            variant="light"
                            color="violet"
                            radius="md"
                            rightSection={
                              <ActionIcon
                                size="xs"
                                variant="transparent"
                                onClick={() => onRevoke(p)}
                              >
                                <IconX size={12} />
                              </ActionIcon>
                            }
                          >
                            {p}
                          </Badge>
                        ))}
                      </Group>
                    )}

                    <Divider my="md" />

                    <Group>
                      <Select
                        style={{ flex: 1 }}
                        placeholder={loadingPermisos ? 'Cargando permisos...' : 'Seleccionar permiso para agregar'}
                        value={permToAdd}
                        onChange={setPermToAdd}
                        data={permisos.map(p => ({
                          value: p.codigo,
                          label: p.codigo,
                          description: p.descripcion
                        }))}
                        searchable
                        leftSection={<IconPlus size={16} />}
                        radius="md"
                        variant="filled"
                      />
                      <Button
                        onClick={onGrant}
                        disabled={!permToAdd || saving || permisos.length === 0}
                        loading={saving}
                        leftSection={<IconCheck size={16} />}
                        radius="md"
                      >
                        Otorgar Permiso
                      </Button>
                    </Group>
                  </Paper>
                </div>

                {/* Effective Permissions Section */}
                <div>
                  <Group mb="sm" justify="space-between">
                    <Group>
                      <ThemeIcon size="sm" variant="light" color="green" radius="md">
                        <IconShield size={14} />
                      </ThemeIcon>
                      <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                        Permisos Efectivos
                      </Text>
                    </Group>
                    <Tooltip label="Todos los permisos incluyendo los heredados de los roles">
                      <ThemeIcon size="xs" variant="subtle" color="gray" radius="md">
                        <IconInfoCircle size={12} />
                      </ThemeIcon>
                    </Tooltip>
                  </Group>
                  <Paper
                    p="md"
                    radius="lg"
                    style={{
                      backgroundColor: colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.03)',
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'}`,
                    }}
                  >
                    {info.effectivePermisos.length === 0 ? (
                      <Text size="sm" c="dimmed">No hay permisos efectivos</Text>
                    ) : (
                      <ScrollArea h={100}>
                        <Group gap="xs">
                          {info.effectivePermisos.map(p => (
                            <Badge
                              key={p}
                              size="md"
                              variant="dot"
                              color="green"
                              radius="md"
                            >
                              {p}
                            </Badge>
                          ))}
                        </Group>
                      </ScrollArea>
                    )}
                  </Paper>
                </div>
              </Stack>
            </Card>
          )}
        </Stack>
      </Box>
    </PageTransition>
  );
};

export default PermissionsAdminPage;

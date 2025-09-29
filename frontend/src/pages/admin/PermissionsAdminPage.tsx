import React, { useEffect, useState } from 'react';
import { Box, Title, Text, Group, Stack, useMantineColorScheme, Select, Badge, Button, Switch, Divider, Table } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { userService, type UserMinDTO } from '../../services/userService';
import { adminPermissionsService, type PermisoDTO, type UsuarioPermisosDTO } from '../../services/adminPermissionsService';

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
    <Box
      style={{
        flex: 1,
        padding: '16px 48px',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Box mb="xl" ta="left">
        <Title order={2} size="1.5rem" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b', fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
          Permisos de Usuario (Admin)
        </Title>
        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
          Selecciona un usuario, activa/desactiva y otorga/revoca permisos directos.
        </Text>
      </Box>

      <Stack gap="md">
        {/* Filtros avanzados */}
        <Group align="flex-end">
          <Select
            label="Rol"
            placeholder="Todos"
            data={[{ value: 'ADMIN', label: 'ADMIN' }, { value: 'ESTUDIANTE', label: 'ESTUDIANTE' }]}
            value={filterRol}
            onChange={setFilterRol}
            clearable
          />
          <Select
            label="Activo"
            placeholder="Todos"
            data={[{ value: 'true', label: 'Activo' }, { value: 'false', label: 'Inactivo' }]}
            value={filterActivo}
            onChange={setFilterActivo}
            clearable
          />
          <Select
            label="Permiso"
            placeholder="Todos"
            data={permisos.map(p => ({ value: p.codigo, label: p.codigo }))}
            value={filterPermiso}
            onChange={setFilterPermiso}
            searchable
            clearable
          />
          <Group gap="xs" align="center">
            <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Incluir heredados</Text>
            <Switch checked={filterEffective} onChange={(e) => setFilterEffective(e.currentTarget.checked)} />
          </Group>
          <Button onClick={async () => {
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
              setFilteredUsers(res.map(u => ({ id: u.id, label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username} <${u.email}>` })));
            } catch (e) { console.error(e); }
          }}>Buscar coincidencias</Button>
        </Group>

        {filteredUsers && (
          <Box p="sm" style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(30,41,59,0.4)' : 'rgba(247,243,238,0.7)', borderRadius: 12 }}>
            <Text size="xs" mb="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Coincidencias: {filteredUsers.length}</Text>
            <Group gap="xs">
              {filteredUsers.map(u => (
                <Badge key={u.id} onClick={() => { setSelectedUserId(u.id); setInfo(null); loadUserInfo(u.id); }} style={{ cursor: 'pointer' }} variant="outline">{u.label}</Badge>
              ))}
            </Group>
          </Box>
        )}

        <Select
          label="Usuario"
          placeholder="Buscar por email, username o nombre..."
          searchable
          nothingFoundMessage={searchLoading ? 'Buscando...' : 'Sin resultados'}
          data={options}
          searchValue={searchValue}
          onSearchChange={(val) => {
            setSearchValue(val);
            clearTimeout((window as any).__pSearchTimer);
            (window as any).__pSearchTimer = setTimeout(() => fetchUsers(val), 300);
          }}
          value={selectedUserId ? String(selectedUserId) : null}
          onChange={(val) => {
            const id = val ? Number(val) : null;
            setSelectedUserId(id);
            setInfo(null);
            if (id) loadUserInfo(id);
          }}
        />

        {info && (
          <Box
            p="lg"
            style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: 16,
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937' }}>
                  {`${info.nombre || ''} ${info.apellidos || ''} — ${info.username} <${info.email}>`}
                </Text>
                <Group gap="xs" align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Activo</Text>
                  <Switch checked={!!info.activo} onChange={(e) => onToggleActivo(e.currentTarget.checked)} disabled={saving} />
                </Group>
              </Group>

              <Divider label="Roles" />
              <Group gap="xs">
                {info.roles.length === 0 ? (
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Sin roles</Text>
                ) : (
                  info.roles.map(r => <Badge key={r} variant="light">{r}</Badge>)
                )}
              </Group>

              <Divider label="Permisos directos" />
              <Group gap="xs">
                {info.directPermisos.length === 0 ? (
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Sin permisos directos</Text>
                ) : (
                  info.directPermisos.map(p => (
                    <Badge key={p} rightSection={<span style={{ cursor: 'pointer' }} onClick={() => onRevoke(p)}>✕</span>} color="blue" variant="light" title={`Click ✕ para revocar`}>
                      {p}
                    </Badge>
                  ))
                )}
              </Group>

              <Group align="flex-end">
                <Select
                  label="Agregar permiso"
                  placeholder={loadingPermisos ? 'Cargando...' : (permisos.length ? 'Selecciona permiso' : 'No hay permisos en BD')}
                  value={permToAdd}
                  onChange={setPermToAdd}
                  data={permisos.map(p => ({ value: p.codigo, label: `${p.codigo} — ${p.descripcion || ''}` }))}
                  searchable
                />
                <Button onClick={onGrant} disabled={!permToAdd || saving || permisos.length === 0} loading={saving}>Agregar</Button>
                {permisos.length === 0 && (
                  <Button variant="outline" onClick={async () => {
                    try {
                      setLoadingPermisos(true);
                      const seeded = await adminPermissionsService.seedPermisos();
                      setPermisos(seeded);
                      notifications.show({ color: 'green', title: 'Permisos cargados', message: `Se crearon ${seeded.length} permisos base` });
                    } catch (e: any) {
                      notifications.show({ color: 'red', title: 'Error', message: e?.response?.data?.message || 'No se pudieron cargar permisos' });
                    } finally {
                      setLoadingPermisos(false);
                    }
                  }}>Cargar permisos base</Button>
                )}
              </Group>

              <Divider label="Permisos efectivos" />
              <Group gap="xs">
                {info.effectivePermisos.map(p => (
                  <Badge key={p} variant="outline">{p}</Badge>
                ))}
              </Group>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PermissionsAdminPage;

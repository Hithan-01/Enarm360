import React, { useMemo, useState } from 'react';
import { Box, Title, Text, Group, Stack, useMantineColorScheme, Badge, TextInput, Textarea, Select, NumberInput, Button, Divider } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell } from '@tabler/icons-react';
import { notificationService } from '../../services/notificationService';
import { authService } from '../../services/authService';
import { userService, type UserMinDTO } from '../../services/userService';

const tipos = [
  { value: 'SISTEMA', label: 'Sistema' },
  { value: 'FORO', label: 'Foro' },
  { value: 'EXAMEN', label: 'Examen' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'ALERTA', label: 'Alerta' },
];

const AdminNotificationsPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const currentUser = authService.getCurrentUserFromStorage();

  const [destinatarioId, setDestinatarioId] = useState<number | ''>('');
  const [destinatarioLabel, setDestinatarioLabel] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState<string>('SISTEMA');
  const [metadataRaw, setMetadataRaw] = useState<string>('');
  const [anuncioGeneral, setAnuncioGeneral] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  // Buscar usuarios por texto (email/username/nombre)
  const fetchUsers = async (q: string) => {
    if (!q || q.trim().length < 2) {
      setOptions([]);
      return;
    }
    try {
      setSearchLoading(true);
      const users: UserMinDTO[] = await userService.searchUsers(q.trim(), 0, 8);
      const opts = users.map(u => ({
        value: String(u.id),
        label: `${u.nombre || ''} ${u.apellidos || ''} — ${u.username} <${u.email}>`.trim(),
      }));
      setOptions(opts);
    } catch (e) {
      console.error('Error buscando usuarios:', e);
    } finally {
      setSearchLoading(false);
    }
  };

  const metadata = useMemo(() => {
    if (!metadataRaw.trim()) return undefined;
    try {
      return JSON.parse(metadataRaw);
    } catch {
      return undefined;
    }
  }, [metadataRaw]);

  const handleCrear = async () => {
    if (!titulo.trim() || !mensaje.trim() || !tipo) {
      notifications.show({ color: 'red', title: 'Campos requeridos', message: 'Completa título, mensaje y tipo.' });
      return;
    }
    if (!anuncioGeneral && !destinatarioId) {
      notifications.show({ color: 'red', title: 'Destinatario requerido', message: 'Selecciona un destinatario o activa Anuncio general.' });
      return;
    }
    // Validar JSON si se ingresó
    if (metadataRaw.trim()) {
      try {
        JSON.parse(metadataRaw);
      } catch (e) {
        notifications.show({ color: 'red', title: 'Metadata inválida', message: 'Proporciona un JSON válido en metadata.' });
        return;
      }
    }

    try {
      setSubmitting(true);
      if (anuncioGeneral) {
        const res = await notificationService.broadcast({
          titulo: titulo.trim(),
          mensaje: mensaje.trim(),
          tipo: tipo as any,
          metadata,
        });
        notifications.show({ color: 'green', title: 'Anuncio enviado', message: `Notificaciones creadas: ${res.created}` });
      } else {
        await notificationService.create({
          destinatarioId: Number(destinatarioId),
          titulo: titulo.trim(),
          mensaje: mensaje.trim(),
          tipo: tipo as any,
          metadata,
        });
        notifications.show({ color: 'green', title: 'Notificación enviada', message: 'Se creó y envió la notificación.' });
      }
      setTitulo('');
      setMensaje('');
      setMetadataRaw('');
    } catch (e: any) {
      notifications.show({ color: 'red', title: 'Error al crear', message: e?.response?.data?.message || 'No se pudo crear la notificación.' });
      console.error(e);
    } finally {
      setSubmitting(false);
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
      {/* Header */}
      <Box mb="xl" ta="left">
        <Group gap="sm" align="center">
          <Box
            style={{
              backgroundColor:
                colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.12)',
              padding: 12,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBell size={22} style={{ color: '#0ea5e9' }} />
          </Box>
          <Stack gap={2}>
            <Title
              order={2}
              size="1.5rem"
              fw={600}
              style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                marginBottom: 0,
              }}
            >
              Notificaciones (Admin)
            </Title>
            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Crea notificaciones hacia usuarios. Más adelante agregaremos listado y filtros.
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* Formulario de creación */}
      <Box
        p="xl"
        style={{
          backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${
            colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
          }`,
          borderRadius: 16,
        }}
      >
        <Stack gap="md">
          <Group align="center" mb="sm">
            <Select
              disabled={anuncioGeneral}
              style={{ flex: 1 }}
              label="Destinatario"
              placeholder="Buscar por email, username o nombre..."
              searchable
              nothingFoundMessage={searchLoading ? 'Buscando...' : 'Sin resultados'}
              data={options}
              searchValue={searchValue}
              onSearchChange={(val) => {
                setSearchValue(val);
                // debounce simple
                clearTimeout((window as any).__uSearchTimer);
                (window as any).__uSearchTimer = setTimeout(() => fetchUsers(val), 300);
              }}
              value={destinatarioId ? String(destinatarioId) : null}
              onChange={(val) => {
                const opt = options.find(o => o.value === val);
                setDestinatarioId(val ? Number(val) : '');
                setDestinatarioLabel(opt?.label || '');
              }}
            />
            <Select
              label="Tipo"
              data={tipos}
              value={tipo}
              onChange={(val) => setTipo(val || 'SISTEMA')}
            />
            <Group gap="xs" align="center">
              <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Anuncio general</Text>
              <input type="checkbox" checked={anuncioGeneral} onChange={(e) => setAnuncioGeneral(e.currentTarget.checked)} />
            </Group>
          </Group>

          {!anuncioGeneral && destinatarioId && (
            <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Seleccionado: {destinatarioLabel}
            </Text>
          )}

          <TextInput
            label="Título"
            placeholder="Título de la notificación"
            value={titulo}
            onChange={(e) => setTitulo(e.currentTarget.value)}
          />

          <Textarea
            label="Mensaje"
            placeholder="Contenido del mensaje"
            minRows={3}
            value={mensaje}
            onChange={(e) => setMensaje(e.currentTarget.value)}
          />

          <Textarea
            label="Metadata (JSON opcional)"
            placeholder='{"examenId": 123, "ruta": "/examenes/123"}'
            minRows={3}
            value={metadataRaw}
            onChange={(e) => setMetadataRaw(e.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button loading={submitting} onClick={handleCrear}>
              Crear notificación
            </Button>
          </Group>
        </Stack>
      </Box>

      {/* Leyenda de tipos */}
      <Box mt="xl">
        <Divider mb="sm" label="Tipos" />
        <Group gap="xs">
          <Badge variant="light" color="violet">Sistema</Badge>
          <Badge variant="light" color="blue">Foro</Badge>
          <Badge variant="light" color="green">Examen</Badge>
          <Badge variant="light" color="orange">Pago</Badge>
          <Badge variant="light" color="red">Alerta</Badge>
        </Group>
      </Box>
    </Box>
  );
};

export default AdminNotificationsPage;

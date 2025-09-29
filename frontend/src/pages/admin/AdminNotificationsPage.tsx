import React, { useMemo, useState } from 'react';
import { Box, Title, Text, Group, Stack, useMantineColorScheme, Badge, TextInput, Textarea, Select, NumberInput, Button, Divider, Card, ActionIcon, Tooltip, Switch, Paper, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell, IconSend, IconBroadcast, IconSparkles, IconUser, IconUsers, IconSettings } from '@tabler/icons-react';
import { notificationService } from '../../services/notificationService';
import { authService } from '../../services/authService';
import { userService, type UserMinDTO } from '../../services/userService';

const tipos = [
  { value: 'SISTEMA', label: 'Sistema', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea', icon: IconSettings },
  { value: 'FORO', label: 'Foro', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#4facfe', icon: IconUsers },
  { value: 'EXAMEN', label: 'Examen', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#43e97b', icon: IconSparkles },
  { value: 'PAGO', label: 'Pago', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: '#fa709a', icon: IconSend },
  { value: 'ALERTA', label: 'Alerta', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', color: '#ff9a9e', icon: IconBell },
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
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        padding: '2rem',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Animated Header */}
      <Paper
        mb="xl"
        p="xl"
        style={{
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          borderRadius: rem(20),
          boxShadow: colorScheme === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle animated background */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
            pointerEvents: 'none',
          }}
        />

        <Group gap="lg" align="center" style={{ position: 'relative', zIndex: 1 }}>
          <Box
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              padding: rem(16),
              borderRadius: rem(16),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px -8px rgba(139, 92, 246, 0.4)',
            }}
          >
            <IconBroadcast size={28} style={{ color: 'white' }} />
          </Box>
          <Stack gap={4} style={{ flex: 1 }}>
            <Title
              order={1}
              size="2rem"
              fw={700}
              style={{
                background: colorScheme === 'dark'
                  ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                marginBottom: 0,
              }}
            >
              Centro de Notificaciones
            </Title>
            <Text
              size="md"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                fontWeight: 500,
                fontSize: rem(16),
              }}
            >
              Crea y gestiona notificaciones para usuarios individuales o anuncios generales
            </Text>
          </Stack>
          <ActionIcon
            size="xl"
            variant="subtle"
            style={{
              background: colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
              borderRadius: rem(12),
            }}
          >
            <IconSparkles size={24} style={{ color: '#8b5cf6' }} />
          </ActionIcon>
        </Group>
      </Paper>

      {/* Formulario de creación */}
      <Card
        p="2rem"
        style={{
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          borderRadius: rem(20),
          boxShadow: colorScheme === 'dark'
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)',
          position: 'relative',
        }}
      >
        <Stack gap="xl">
          {/* Toggle anuncio general con mejor diseño */}
          <Group align="center" justify="space-between" mb="md">
            <Group align="center" gap="md">
              <ActionIcon
                size="lg"
                variant="subtle"
                style={{
                  background: anuncioGeneral
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
                    : colorScheme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.05)',
                  color: anuncioGeneral ? 'white' : (colorScheme === 'dark' ? '#94a3b8' : '#64748b'),
                  borderRadius: rem(12),
                  transition: 'all 0.3s ease',
                }}
              >
                {anuncioGeneral ? <IconUsers size={20} /> : <IconUser size={20} />}
              </ActionIcon>
              <Stack gap={2}>
                <Text fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  {anuncioGeneral ? 'Anuncio General' : 'Notificación Individual'}
                </Text>
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  {anuncioGeneral ? 'Enviar a todos los usuarios' : 'Seleccionar destinatario específico'}
                </Text>
              </Stack>
            </Group>
            <Switch
              size="lg"
              checked={anuncioGeneral}
              onChange={(e) => setAnuncioGeneral(e.currentTarget.checked)}
              styles={{
                track: {
                  backgroundColor: anuncioGeneral ? '#8b5cf6' : (colorScheme === 'dark' ? '#374151' : '#d1d5db'),
                  borderColor: 'transparent',
                  transition: 'all 0.3s ease',
                },
                thumb: {
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                }
              }}
            />
          </Group>

          <Group align="flex-start" grow>
            {/* Columna izquierda */}
            <Stack gap="md" style={{ flex: 1 }}>
              {!anuncioGeneral && (
                <Select
                  label="Destinatario"
                  placeholder="Buscar por email, username o nombre..."
                  description="Busca y selecciona el usuario que recibirá la notificación"
                  searchable
                  nothingFoundMessage={searchLoading ? 'Buscando...' : 'Sin resultados'}
                  data={options}
                  searchValue={searchValue}
                  onSearchChange={(val) => {
                    setSearchValue(val);
                    clearTimeout((window as any).__uSearchTimer);
                    (window as any).__uSearchTimer = setTimeout(() => fetchUsers(val), 300);
                  }}
                  value={destinatarioId ? String(destinatarioId) : null}
                  onChange={(val) => {
                    const opt = options.find(o => o.value === val);
                    setDestinatarioId(val ? Number(val) : '');
                    setDestinatarioLabel(opt?.label || '');
                  }}
                  styles={{
                    input: {
                      borderRadius: rem(12),
                      border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                      '&:focus': {
                        borderColor: '#8b5cf6',
                        boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                      }
                    }
                  }}
                />
              )}

              <Select
                label="Tipo de notificación"
                description="Selecciona la categoría que mejor describa esta notificación"
                data={tipos.map(t => ({ value: t.value, label: t.label }))}
                value={tipo}
                onChange={(val) => setTipo(val || 'SISTEMA')}
                styles={{
                  input: {
                    borderRadius: rem(12),
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    '&:focus': {
                      borderColor: tipos.find(t => t.value === tipo)?.color || '#8b5cf6',
                      boxShadow: `0 0 0 2px ${tipos.find(t => t.value === tipo)?.color || '#8b5cf6'}20`,
                    }
                  }
                }}
              />

              {!anuncioGeneral && destinatarioId && (
                <Paper
                  p="md"
                  style={{
                    background: colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                    borderRadius: rem(12),
                  }}
                >
                  <Text size="sm" fw={500} style={{ color: '#22c55e' }}>
                    ✓ Destinatario seleccionado
                  </Text>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    {destinatarioLabel}
                  </Text>
                </Paper>
              )}
            </Stack>

            {/* Columna derecha */}
            <Stack gap="md" style={{ flex: 1 }}>
              <TextInput
                label="Título"
                placeholder="Ej: Nueva actualización disponible"
                description="Un título claro y conciso para la notificación"
                value={titulo}
                onChange={(e) => setTitulo(e.currentTarget.value)}
                styles={{
                  input: {
                    borderRadius: rem(12),
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    '&:focus': {
                      borderColor: '#8b5cf6',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                    }
                  }
                }}
              />

              <Textarea
                label="Mensaje"
                placeholder="Describe el contenido de la notificación de manera clara y útil..."
                description="El contenido principal que verá el usuario"
                minRows={4}
                value={mensaje}
                onChange={(e) => setMensaje(e.currentTarget.value)}
                styles={{
                  input: {
                    borderRadius: rem(12),
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    '&:focus': {
                      borderColor: '#8b5cf6',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                    }
                  }
                }}
              />

              <Textarea
                label="Metadata (Opcional)"
                placeholder='{"examenId": 123, "ruta": "/examenes/123", "prioridad": "alta"}'
                description="Datos adicionales en formato JSON para funcionalidades avanzadas"
                minRows={3}
                value={metadataRaw}
                onChange={(e) => setMetadataRaw(e.currentTarget.value)}
                styles={{
                  input: {
                    borderRadius: rem(12),
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: rem(13),
                    '&:focus': {
                      borderColor: '#8b5cf6',
                      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
                    }
                  }
                }}
              />
            </Stack>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button
              size="lg"
              loading={submitting}
              onClick={handleCrear}
              leftSection={anuncioGeneral ? <IconBroadcast size={20} /> : <IconSend size={20} />}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: rem(12),
                padding: '0.75rem 2rem',
                fontSize: rem(16),
                fontWeight: 600,
                boxShadow: '0 8px 24px -8px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 12px 32px -8px rgba(139, 92, 246, 0.5)',
                }
              }}
            >
              {anuncioGeneral ? 'Enviar Anuncio General' : 'Crear Notificación'}
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Leyenda de tipos mejorada */}
      <Paper
        mt="xl"
        p="xl"
        style={{
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.7) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'}`,
          borderRadius: rem(16),
          boxShadow: colorScheme === 'dark'
            ? '0 8px 32px -8px rgba(0, 0, 0, 0.2)'
            : '0 8px 32px -8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Group align="center" mb="lg">
          <ActionIcon
            size="md"
            variant="subtle"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              borderRadius: rem(8),
            }}
          >
            <IconSparkles size={16} style={{ color: 'white' }} />
          </ActionIcon>
          <Text fw={600} size="lg" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
            Tipos de Notificación
          </Text>
        </Group>

        <Group gap="md">
          {tipos.map(({ value, label, gradient, color, icon: Icon }) => (
            <Tooltip key={value} label={`Tipo: ${label}`}>
              <Paper
                p="sm"
                style={{
                  background: colorScheme === 'dark'
                    ? `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
                    : `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  borderRadius: rem(12),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  minWidth: 120,
                  textAlign: 'center',
                  transform: tipo === value ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: tipo === value
                    ? `0 8px 25px -8px ${color}50, 0 0 0 2px ${color}30`
                    : 'none',
                  border: tipo === value
                    ? `2px solid ${color}`
                    : `1px solid ${color}30`,
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: `0 12px 32px -8px ${color}40`,
                    border: `1px solid ${color}60`,
                  }
                }}
                onClick={() => setTipo(value)}
              >
                <Group gap="xs" justify="center" align="center">
                  <Icon size={16} style={{ color }} />
                  <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                    {label}
                  </Text>
                </Group>
              </Paper>
            </Tooltip>
          ))}
        </Group>

        <Text size="xs" mt="md" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', textAlign: 'center' }}>
          Haz clic en cualquier tipo para seleccionarlo automáticamente
        </Text>
      </Paper>
    </Box>
  );
};

export default AdminNotificationsPage;

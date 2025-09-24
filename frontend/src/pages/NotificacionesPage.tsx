import React, { useEffect, useMemo, useState } from 'react';
import { Box, Title, Text, Group, Stack, Badge, Button, Switch, useMantineColorScheme, Loader } from '@mantine/core';
import { IconBell, IconCircleCheck, IconCircleDot, IconInfoCircle, IconMessage2 } from '@tabler/icons-react';
import { notificationService, type NotificationDTO } from '../services/notificationService';

interface UiNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'foro' | 'sistema' | 'examen' | 'sistema' | 'pago' | 'alerta';
  unread: boolean;
}

const mapDtoToUi = (dto: NotificationDTO): UiNotification => {
  const tipo = dto.tipo.toLowerCase() as UiNotification['type'];
  // time: por simplicidad usamos la fecha ISO y mostramos relativo simple
  const time = new Date(dto.creadoEn).toLocaleString();
  return {
    id: dto.id,
    title: dto.titulo,
    description: dto.mensaje,
    type: (['foro','examen','pago','alerta','sistema'].includes(tipo) ? tipo : 'sistema') as UiNotification['type'],
    time,
    unread: !dto.leida,
  };
};

const typeToBadge = (type: UiNotification['type']) => {
  switch (type) {
    case 'foro':
      return { label: 'Foro', color: 'blue', icon: <IconMessage2 size={12} /> };
    case 'examen':
      return { label: 'Examen', color: 'green', icon: <IconCircleCheck size={12} /> };
    case 'pago':
      return { label: 'Pago', color: 'orange', icon: <IconInfoCircle size={12} /> };
    case 'alerta':
      return { label: 'Alerta', color: 'red', icon: <IconInfoCircle size={12} /> };
    case 'sistema':
    default:
      return { label: 'Sistema', color: 'violet', icon: <IconInfoCircle size={12} /> };
  }
};

const NotificacionesPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [notifications, setNotifications] = useState<UiNotification[]>([]);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications(0, 50);
        if (mounted) setNotifications(data.map(mapDtoToUi));
      } catch (e) {
        console.error('Error cargando notificaciones:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(
    () => (onlyUnread ? notifications.filter((n) => n.unread) : notifications),
    [onlyUnread, notifications]
  );

  const markAllAsRead = async () => {
    try {
      // Optimista: marcar en UI y luego sincronizar (sin endpoint masivo por ahora)
      const unread = notifications.filter(n => n.unread);
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
    } catch (e) {
      console.error('Error al marcar todas:', e);
    }
  };

  const toggleRead = async (id: number) => {
    try {
      const target = notifications.find(n => n.id === id);
      if (!target) return;
      if (target.unread) {
        // Solo hacemos PATCH cuando pasamos a leída
        await notificationService.markAsRead(id);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
    } catch (e) {
      console.error('Error cambiando estado de notificación:', e);
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
                colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.12)',
              padding: 12,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBell size={22} style={{ color: '#3b82f6' }} />
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
              Notificaciones
            </Title>
            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              Mantente al día con lo más importante
            </Text>
          </Stack>
          <Box style={{ flex: 1 }} />
          <Button
            variant="light"
            onClick={markAllAsRead}
            styles={{ root: { borderRadius: 10 } }}
          >
            Marcar todas como leídas
          </Button>
        </Group>
      </Box>

      {/* Filtros */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap="xs">
          <Badge variant="light" color="blue">Foro</Badge>
          <Badge variant="light" color="green">Examen</Badge>
          <Badge variant="light" color="orange">Pago</Badge>
          <Badge variant="light" color="red">Alerta</Badge>
          <Badge variant="light" color="violet">Sistema</Badge>
        </Group>
        <Group gap="xs">
          <IconCircleDot size={14} style={{ color: onlyUnread ? '#10b981' : (colorScheme === 'dark' ? '#94a3b8' : '#64748b') }} />
          <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Solo no leídas</Text>
          <Switch size="sm" checked={onlyUnread} onChange={(e) => setOnlyUnread(e.currentTarget.checked)} />
        </Group>
      </Group>

      {/* Lista */}
      <Stack gap="sm">
        {loading && (
          <Group p="md" justify="center"><Loader size="sm" /></Group>
        )}
        {!loading && filtered.map((n) => {
          const meta = typeToBadge(n.type);
          return (
            <Group
              key={n.id}
              p="md"
              justify="space-between"
              align="flex-start"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
                border: `1px solid ${
                  colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
                }`,
                borderRadius: 16,
                boxShadow: n.unread ? (colorScheme === 'dark' ? '0 0 0 2px rgba(59,130,246,.25) inset' : '0 0 0 2px rgba(59,130,246,.15) inset') : undefined,
              }}
            >
              <Stack gap={6} style={{ minWidth: 0 }}>
                <Group gap={8} wrap="nowrap" align="center">
                  <Badge leftSection={meta.icon} color={meta.color} variant="light" radius="sm" size="xs">
                    {meta.label}
                  </Badge>
                  {n.unread && (
                    <Badge color="blue" variant="filled" size="xs" radius="sm">
                      Nuevo
                    </Badge>
                  )}
                </Group>
                <Text fw={600} size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937' }}>
                  {n.title}
                </Text>
                <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  {n.description}
                </Text>
                <Text size="10px" style={{ color: colorScheme === 'dark' ? '#64748b' : '#8b8b86' }}>
                  {n.time}
                </Text>
              </Stack>

              <Button
                variant={n.unread ? 'filled' : 'light'}
                color={n.unread ? 'blue' : 'gray'}
                size="xs"
                onClick={() => toggleRead(n.id)}
                styles={{ root: { borderRadius: 8 } }}
              >
                {n.unread ? 'Marcar como leída' : 'Marcar como no leída'}
              </Button>
            </Group>
          );
        })}

        {filtered.length === 0 && (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
              }`,
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              No tienes notificaciones {onlyUnread ? 'no leídas' : ''}.
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default NotificacionesPage;

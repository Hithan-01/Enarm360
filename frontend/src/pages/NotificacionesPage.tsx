import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Switch,
  useMantineColorScheme,
  Loader,
  Card,
  ActionIcon,
  Tooltip,
  Paper,
  ScrollArea,
  Center,
  ThemeIcon,
  UnstyledButton,
  Flex,
  Menu,
  Avatar,
  Anchor,
  Divider,
  SegmentedControl,
  TextInput,
  Select,
  Checkbox
} from '@mantine/core';
import {
  IconBell,
  IconCheck,
  IconDots,
  IconEye,
  IconEyeOff,
  IconRefresh,
  IconBellRinging,
  IconBellOff,
  IconMessage2,
  IconAlertTriangle,
  IconAlertCircle,
  IconSettings,
  IconCreditCard,
  IconCalendarEvent,
  IconSparkles,
  IconClock,
  IconPoint,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { notificationService, type NotificationDTO } from '../services/notificationService';

interface UiNotification {
  id: number;
  title: string;
  description: string;
  time: Date;
  type: 'foro' | 'sistema' | 'examen' | 'sistema' | 'pago' | 'alerta';
  unread: boolean;
  saved?: boolean;
  creador?: {
    id: number;
    username: string;
    nombre?: string;
    apellidos?: string;
    email: string;
  };
}

const mapDtoToUi = (dto: NotificationDTO): UiNotification => {
  const tipo = dto.tipo.toLowerCase() as UiNotification['type'];
  return {
    id: dto.id,
    title: dto.titulo,
    description: dto.mensaje,
    type: (['foro','examen','pago','alerta','sistema'].includes(tipo) ? tipo : 'sistema') as UiNotification['type'],
    time: new Date(dto.creadoEn),
    unread: !dto.leida,
    saved: dto.guardada ?? false,
    creador: dto.creador,
  };
};

const typeToBadge = (type: UiNotification['type']) => {
  switch (type) {
    case 'foro':
      return { label: 'Foro', color: 'blue', icon: <IconMessage2 size={12} /> };
    case 'examen':
      return { label: 'Examen', color: 'green', icon: <IconCalendarEvent size={12} /> };
    case 'pago':
      return { label: 'Pago', color: 'orange', icon: <IconCreditCard size={12} /> };
    case 'alerta':
      return { label: 'Alerta', color: 'red', icon: <IconAlertTriangle size={12} /> };
    case 'sistema':
    default:
      return { label: 'Sistema', color: 'violet', icon: <IconSettings size={12} /> };
  }
};

const NotificacionesPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [notifications, setNotifications] = useState<UiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // UI state
  const [tab, setTab] = useState<'all' | 'unread' | 'saved' | 'read'>('unread');
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'type'>('none');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sistema' | 'foro' | 'examen' | 'pago' | 'alerta'>('all');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications(0, 50);
        if (mounted) setNotifications(data.map(mapDtoToUi));
      } catch (e) {
        console.error('Error cargando notificaciones:', e);
        mantineNotifications.show({
          title: 'Error',
          message: 'No se pudieron cargar las notificaciones',
          color: 'red',
          icon: <IconAlertCircle size={16} />
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const filtered = useMemo(() => {
    let result = notifications;

    // Tabs
    if (tab === 'saved') result = result.filter(n => n.saved);
    if (tab === 'read') result = result.filter(n => !n.unread);
    if (tab === 'unread') result = result.filter(n => n.unread);


    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(n => n.type === typeFilter);
    }

    // Search
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    result = result.sort((a, b) => b.time.getTime() - a.time.getTime());
    return result;
  }, [notifications, query, tab, typeFilter]);

  const refreshNotifications = async () => {
    setRefreshing(true);
    try {
      const data = await notificationService.getMyNotifications(0, 50);
      setNotifications(data.map(mapDtoToUi));
      mantineNotifications.show({
        title: 'Actualizado',
        message: 'Notificaciones actualizadas correctamente',
        color: 'green',
        icon: <IconCheck size={16} />
      });
    } catch (e) {
      mantineNotifications.show({
        title: 'Error',
        message: 'Error al actualizar notificaciones',
        color: 'red'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const toggleRead = async (id: number) => {
    try {
      const target = notifications.find(n => n.id === id);
      if (!target) return;

      if (target.unread) {
        await notificationService.markAsRead(id);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
      // Feedback
      mantineNotifications.show({ title: 'Listo', message: target.unread ? 'Marcada como leída' : 'Marcada como no leída', color: 'green' });
    } catch (e) {
      console.error('Error cambiando estado de notificación:', e);
      mantineNotifications.show({
        title: 'Error',
        message: 'Error al actualizar la notificación',
        color: 'red'
      });
    }
  };

  const toggleSaved = async (id: number) => {
    try {
      const target = notifications.find(n => n.id === id);
      if (!target) return;
      const next = !(target.saved ?? false);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, saved: next } : n));
      await notificationService.setSaved(id, next);
    } catch (e) {
      console.error('Error guardando notificación:', e);
      mantineNotifications.show({ title: 'Error', message: 'No se pudo actualizar el estado de guardado', color: 'red' });
    }
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const bulkMarkAsRead = async () => {
    const ids = filtered.filter(n => selected.has(n.id) && n.unread).map(n => n.id);
    if (ids.length === 0) return;
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, unread: false } : n));
    try {
      await Promise.all(ids.map(id => notificationService.markAsRead(id)));
      mantineNotifications.show({ title: 'Listo', message: `${ids.length} marcadas como leídas`, color: 'green' });
    } catch {
      mantineNotifications.show({ title: 'Error', message: 'No se pudieron marcar como leídas', color: 'red' });
    } finally {
      clearSelection();
    }
  };

  const bulkSave = async (valor: boolean) => {
    const ids = filtered.filter(n => selected.has(n.id)).map(n => n.id);
    if (ids.length === 0) return;
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, saved: valor } : n));
    try {
      await Promise.all(ids.map(id => notificationService.setSaved(id, valor)));
      mantineNotifications.show({ title: 'Listo', message: valor ? 'Guardadas' : 'Quitadas de guardados', color: 'green' });
    } catch {
      mantineNotifications.show({ title: 'Error', message: 'No se pudo actualizar guardados', color: 'red' });
    } finally {
      clearSelection();
    }
  };

  const bulkMarkAsUnread = async () => {
    const ids = filtered.filter(n => selected.has(n.id) && !n.unread).map(n => n.id);
    if (ids.length === 0) return;
    // Solo cliente por ahora (no hay endpoint para marcar como no leída)
    setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, unread: true } : n));
    mantineNotifications.show({ title: 'Listo', message: `${ids.length} notificaciones marcadas como no leídas`, color: 'green' });
    clearSelection();
  };

  const allSelected = filtered.length > 0 && filtered.every(n => selected.has(n.id));

  return (
    <Box
      style={{
        flex: 1,
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : '#f7f3ee',
        padding: '1rem',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <Paper
        mb="md"
        p="md"
        radius="lg"
        style={{
          background: 'transparent',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap">
          <Box>
            <Title
              order={1}
              size="h3"
              fw={600}
              c={colorScheme === 'dark' ? 'white' : 'dark'}
            >
              Notificaciones
            </Title>
            <Text size="sm" c="dimmed">
              {notifications.length} anuncios • {unreadCount} nuevos
            </Text>
          </Box>
          <Group gap="sm" wrap="wrap">
            <TextInput
              placeholder="Buscar notificaciones..."
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              size="sm"
              radius="xl"
              styles={{
                input: {
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.3s ease',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937',
                  '&:focus': {
                    background: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)',
                  },
                  '&::placeholder': {
                    color: colorScheme === 'dark'
                      ? 'rgba(148, 163, 184, 0.8)'
                      : 'rgba(107, 114, 128, 0.8)',
                  }
                }
              }}
            />

            <Select
              value={groupBy}
              onChange={(v) => setGroupBy((v as any) ?? 'none')}
              data={[{ label: 'Agrupar: Ninguno', value: 'none' }, { label: 'Agrupar: Tipo', value: 'type' }]}
              size="sm"
              radius="xl"
              styles={{
                input: {
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  boxShadow: '0 4px 16px rgba(147, 51, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937',
                  '&:focus': {
                    background: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(147, 51, 234, 0.5)',
                    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
                  }
                },
                dropdown: {
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }
              }}
            />

            <Select
              value={typeFilter}
              onChange={(v) => setTypeFilter((v as any) ?? 'all')}
              data={[
                { label: 'Tipo: Todos', value: 'all' },
                { label: 'Alerta', value: 'alerta' },
                { label: 'Sistema', value: 'sistema' },
                { label: 'Examen', value: 'examen' },
                { label: 'Pago', value: 'pago' },
                { label: 'Foro', value: 'foro' },
              ]}
              size="sm"
              radius="xl"
              styles={{
                input: {
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.1)',
                  transition: 'all 0.3s ease',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937',
                  '&:focus': {
                    background: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(34, 197, 94, 0.5)',
                    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
                  }
                },
                dropdown: {
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }
              }}
            />

            <ActionIcon
              variant="filled"
              size="lg"
              radius="xl"
              onClick={refreshNotifications}
              loading={refreshing}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                }
              }}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      {/* Content Container */}
      <Box style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Tabs and bulk actions */}
        <Group justify="space-between" align="center" mb="sm">
          <SegmentedControl
            value={tab}
            onChange={(v) => { setTab(v as any); clearSelection(); }}
            data={[
              { label: 'Todas', value: 'all' },
              { label: 'No leídas', value: 'unread' },
              { label: 'Guardadas', value: 'saved' },
              { label: 'Leídas', value: 'read' }
            ]}
          />

          <Group gap="md" align="center">
            <Checkbox
              checked={allSelected}
              indeterminate={selected.size > 0 && !allSelected}
              onChange={() => {
                if (allSelected) {
                  clearSelection();
                } else {
                  setSelected(new Set(filtered.map(n => n.id)));
                }
              }}
              label="Seleccionar todo"
            />
          {selected.size > 0 && (
            <Group gap="xs">
              <Button
                size="xs"
                variant="light"
                onClick={bulkMarkAsRead}
                leftSection={<IconCheck size={14} />}
                disabled={notifications.filter(n => selected.has(n.id) && n.unread).length === 0}
              >
                Marcar como leídas
              </Button>
              <Button
                size="xs"
                variant="light"
                onClick={bulkMarkAsUnread}
                disabled={notifications.filter(n => selected.has(n.id) && !n.unread).length === 0}
              >
                Marcar como no leídas
              </Button>
              <Button size="xs" variant="light" onClick={() => bulkSave(true)} leftSection={<IconStar size={14} />}>Guardar</Button>
              <Button size="xs" variant="subtle" onClick={() => bulkSave(false)}>Quitar de guardados</Button>
              <Button size="xs" variant="default" onClick={clearSelection}>Limpiar selección</Button>
            </Group>
          )}
          </Group>
        </Group>

        {/* Lista compacta de notificaciones */}
        <ScrollArea h="calc(100vh - 220px)" scrollbarSize={4} style={{ background: 'transparent' }}>
        <Stack gap="sm">
          {loading ? (
            <Center py={60}>
              <Stack align="center" gap="md">
                <Loader size="lg" color="blue" />
                <Text c="dimmed">Cargando anuncios...</Text>
              </Stack>
            </Center>
          ) : filtered.length === 0 ? (
            <Paper
              p="md"
              radius="lg"
              style={{
                background: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.5)'
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
              }}
            >
              <Center>
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                    <IconBellOff size={30} />
                  </ThemeIcon>
                  <Box ta="center">
                    <Title order={3} c="dimmed" fw={600} mb="xs">
                      {tab === 'unread' ? 'Todo al día' : 'Sin anuncios'}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {tab === 'unread'
                        ? 'No tienes anuncios nuevos por revisar'
                        : 'Los nuevos anuncios aparecerán aquí'
                      }
                    </Text>
                  </Box>
                </Stack>
              </Center>
            </Paper>
          ) : (
            // Optional grouping by type
            (
              groupBy === 'type'
                ? (Object.entries(
                    filtered.reduce<Record<string, UiNotification[]>>((acc, n) => {
                      const key = n.type;
                      (acc[key] = acc[key] || []).push(n);
                      return acc;
                    }, {})
                  ) as [string, UiNotification[]][])
                : ([['all', filtered]] as [string, UiNotification[]][])
            ).map(([groupName, items]) => (
              <Stack key={groupName} gap="sm">
                {groupBy === 'type' && (
                  <Text size="sm" c="dimmed" pl="xs">{groupName.toUpperCase()}</Text>
                )}
                {items.map((notification: UiNotification) => {
                  const meta = typeToBadge(notification.type);
                  const timeAgo = notification.time.toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return (
                <Paper
                  key={notification.id}
                  p="md"
                  radius="lg"
                  style={{
                    background: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.6)'
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: notification.unread
                      ? `1px solid #3b82f6`
                      : `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(203, 213, 225, 0.3)'}`,
                    borderLeft: notification.unread ? '4px solid #3b82f6' : '4px solid transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: notification.unread
                      ? '0 4px 16px rgba(59, 130, 246, 0.15)'
                      : `0 2px 8px ${colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)'}`,
                  }}
                >
                  <Group justify="space-between" align="flex-start" gap="md">
                    <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
                      <Checkbox
                        checked={selected.has(notification.id)}
                        onChange={() => toggleSelect(notification.id)}
                        onClick={(e) => e.stopPropagation()}
                        styles={{ input: { cursor: 'pointer' } }}
                      />
                      <Avatar
                        size={40}
                        radius="md"
                        color={meta.color}
                        style={{
                          flexShrink: 0,
                        }}
                      >
                        {notification.creador?.nombre
                          ? notification.creador.nombre.charAt(0).toUpperCase()
                          : 'A'
                        }
                      </Avatar>
                      
                      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                        <Group gap="xs" align="center">
                          <Badge
                            size="xs"
                            variant="light"
                            color={meta.color}
                            leftSection={meta.icon}
                          >
                            {meta.label}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {notification.creador?.nombre
                              ? `${notification.creador.nombre}${notification.creador.apellidos ? ' ' + notification.creador.apellidos : ''}`
                              : 'Administrador'
                            }
                          </Text>
                          {notification.unread && (
                            <Badge size="xs" color="blue" variant="filled">
                              Nuevo
                            </Badge>
                          )}
                        </Group>
                        
                        <Text
                          fw={600}
                          size="sm"
                          c={colorScheme === 'dark' ? 'gray.1' : 'gray.9'}
                          style={{ lineHeight: 1.4 }}
                        >
                          {notification.title}
                        </Text>
                        
                        <Text
                          size="sm"
                          c={colorScheme === 'dark' ? 'gray.4' : 'gray.6'}
                          style={{
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {notification.description}
                        </Text>
                        
                        <Group gap="xs" align="center" mt="xs">
                          <IconClock size={12} color="gray" />
                          <Text size="xs" c="dimmed">
                            {timeAgo}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                    
                    <Group gap="xs" align="flex-start" style={{ flexShrink: 0 }}>
                      <ActionIcon
                        size="sm"
                        variant={notification.unread ? 'filled' : 'subtle'}
                        color={notification.unread ? 'blue' : 'gray'}
                        radius="xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRead(notification.id);
                        }}
                        title={notification.unread ? 'Marcar como leída' : 'Marcar como no leída'}
                      >
                        {notification.unread ? (
                          <IconPoint size={12} />
                        ) : (
                          <IconCheck size={12} />
                        )}
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant={notification.saved ? 'filled' : 'subtle'}
                        color={notification.saved ? 'yellow' : 'gray'}
                        radius="xl"
                        onClick={(e) => { e.stopPropagation(); toggleSaved(notification.id); }}
                        title={notification.saved ? 'Unsave' : 'Save'}
                      >
                        {notification.saved ? <IconStarFilled size={12} /> : <IconStar size={12} />}
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              );
            })}
              </Stack>
            ))
          )}
        </Stack>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default NotificacionesPage;

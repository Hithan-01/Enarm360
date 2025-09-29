import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ActionIcon,
  Badge,
  Text,
  Stack,
  Group,
  Paper,
  Divider,
  Button,
  ScrollArea,
  Indicator,
  ThemeIcon,
  Box,
  Tooltip,
  Center,
  Loader,
  UnstyledButton,
  rem,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconBell,
  IconBellRinging,
  IconCircleCheck,
  IconCircleDot,
  IconSettings,
  IconMessage2,
  IconAlertCircle,
  IconCreditCard,
  IconAlertTriangle,
  IconSparkles,
  IconCheck,
  IconRefresh,
  IconEye,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { notifications as mantineNotifications } from '@mantine/notifications';
import { notificationService, type NotificationDTO } from '../services/notificationService';

interface UiNotification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'foro' | 'sistema' | 'examen' | 'pago' | 'alerta';
  read: boolean;
  gradient: string;
  color: string;
  icon: React.ComponentType<{ size?: number }>;
  creador?: {
    id: number;
    username: string;
    nombre?: string;
    apellidos?: string;
    email: string;
  };
}

const NotificationDropdown: React.FC = () => {
  console.log('NotificationDropdown component rendering...');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [notifications, setNotifications] = useState<UiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  // Simple time formatting function
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'hace un momento';
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `hace ${diffInDays}d`;

    return date.toLocaleDateString();
  };

  const mapDtoToUi = (dto: NotificationDTO): UiNotification => {
    const typeMap = {
      SISTEMA: {
        type: 'sistema' as const,
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#667eea',
        icon: IconSettings
      },
      FORO: {
        type: 'foro' as const,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#4facfe',
        icon: IconMessage2
      },
      EXAMEN: {
        type: 'examen' as const,
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: '#43e97b',
        icon: IconSparkles
      },
      PAGO: {
        type: 'pago' as const,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        color: '#fa709a',
        icon: IconCreditCard
      },
      ALERTA: {
        type: 'alerta' as const,
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        color: '#ff9a9e',
        icon: IconAlertTriangle
      },
    };

    const mapped = typeMap[dto.tipo] || typeMap.SISTEMA;

    return {
      id: dto.id,
      title: dto.titulo,
      description: dto.mensaje,
      time: formatTimeAgo(dto.creadoEn),
      read: dto.leida,
      creador: dto.creador,
      ...mapped
    };
  };

  const loadNotifications = async () => {
    try {
      console.log('Loading notifications...');
      setLoading(true);
      const [notificationsData, countData] = await Promise.all([
        notificationService.getMyNotifications(0, 10),
        notificationService.getUnreadCount()
      ]);

      console.log('Notifications loaded:', notificationsData);
      console.log('Unread count:', countData);

      setNotifications(notificationsData.map(mapDtoToUi));
      setUnreadCount(countData);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      mantineNotifications.show({
        title: 'Error',
        message: 'No se pudieron cargar las notificaciones',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando como leída:', error);
      mantineNotifications.show({
        title: 'Error',
        message: 'Error al marcar la notificación como leída',
        color: 'red'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => notificationService.markAsRead(n.id))
      );

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      mantineNotifications.show({
        title: 'Completado',
        message: `${unreadNotifications.length} notificaciones marcadas como leídas`,
        color: 'green',
      });
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      mantineNotifications.show({
        title: 'Error',
        message: 'Error al marcar las notificaciones como leídas',
        color: 'red'
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const NotificationItem: React.FC<{ notification: UiNotification }> = ({ notification }) => {
    const Icon = notification.icon;

    return (
      <UnstyledButton
        onClick={() => {
          console.log('Notification clicked:', notification.id, 'read:', notification.read);
          if (!notification.read) {
            markAsRead(notification.id);
          }
        }}
        styles={{
          root: {
            width: '100%',
            padding: rem(12),
            borderRadius: rem(8),
            transition: 'all 0.2s ease',
            opacity: notification.read ? 0.7 : 1,
            '&:hover': {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            }
          }
        }}
      >
        <Group align="flex-start" gap="md" wrap="nowrap">
          <Indicator
            disabled={notification.read}
            color={notification.color}
            size={8}
            offset={-2}
          >
            <ThemeIcon
              size="lg"
              radius="md"
              style={{
                background: notification.gradient,
                border: 'none'
              }}
            >
              <Icon size={16} />
            </ThemeIcon>
          </Indicator>

          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Text
                fw={notification.read ? 400 : 600}
                size="sm"
                lineClamp={1}
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  flex: 1
                }}
              >
                {notification.title}
              </Text>
              <Text
                size="xs"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  whiteSpace: 'nowrap'
                }}
              >
                {notification.time}
              </Text>
            </Group>

            <Text
              size="xs"
              lineClamp={2}
              style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}
            >
              {notification.description}
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
    );
  };

  return (
    <Menu
      opened={opened}
      onChange={(isOpened) => {
        console.log('Menu toggled:', isOpened);
        setOpened(isOpened);
      }}
      position="bottom-end"
      width={380}
      shadow="xl"
      radius="md"
      offset={8}
      onOpen={() => {
        console.log('Menu opened, loading notifications...');
        loadNotifications();
      }}
    >
      <Menu.Target>
        <Indicator
          disabled={unreadCount === 0}
          label={unreadCount > 99 ? '99+' : unreadCount}
          size={16}
          color="red"
          offset={4}
        >
          <ActionIcon
            variant="subtle"
            size={36}
            onClick={() => {
              console.log('ActionIcon clicked - opening menu');
              setOpened(!opened);
            }}
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'
              }`,
              borderRadius: '50%',
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              boxShadow: colorScheme === 'dark'
                ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
          >
            {unreadCount > 0 ? (
              <IconBellRinging
                size={18}
                style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}
              />
            ) : (
              <IconBell
                size={18}
                style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}
              />
            )}
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))'
            : 'linear-gradient(135deg, rgba(247, 243, 238, 0.95), rgba(242, 237, 230, 0.9))',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          boxShadow: colorScheme === 'dark'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          padding: 0,
        }}
      >
        {/* Header */}
        <Box p="md" style={{ borderBottom: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}` }}>
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <ThemeIcon
                size="sm"
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                }}
              >
                <IconBell size={12} />
              </ThemeIcon>
              <Text fw={600} size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26' }}>
                Notificaciones
              </Text>
              {unreadCount > 0 && (
                <Badge size="xs" variant="filled" color="red">
                  {unreadCount}
                </Badge>
              )}
            </Group>

            <Group gap="xs">
              <Tooltip label="Actualizar">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={loadNotifications}
                  loading={loading}
                >
                  <IconRefresh size={14} />
                </ActionIcon>
              </Tooltip>

              {unreadCount > 0 && (
                <Tooltip label="Marcar todas como leídas">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={markAllAsRead}
                    style={{ color: '#22c55e' }}
                  >
                    <IconCheck size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>
        </Box>

        {/* Content */}
        {loading ? (
          <Center p="xl">
            <Loader size="sm" />
          </Center>
        ) : notifications.length === 0 ? (
          <Center p="xl">
            <Stack align="center" gap="xs">
              <ThemeIcon
                size={40}
                radius="xl"
                variant="light"
                color="gray"
              >
                <IconBell size={20} />
              </ThemeIcon>
              <Text size="sm" c="dimmed" ta="center">
                No tienes notificaciones
              </Text>
            </Stack>
          </Center>
        ) : (
          <ScrollArea h={400} type="scroll">
            <Stack gap={0} p="xs">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </Stack>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Divider />
            <Box p="md">
              <Button
                variant="subtle"
                fullWidth
                size="sm"
                onClick={() => {
                  setOpened(false);
                  // Navegar a la página completa de notificaciones del estudiante
                  navigate('/estudiante/notificaciones');
                }}
                leftSection={<IconEye size={14} />}
              >
                Ver todas las notificaciones
              </Button>
            </Box>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default NotificationDropdown;
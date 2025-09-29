import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Stack,
  Text,
  Group,
  Box,
  Title,
  useMantineColorScheme,
  UnstyledButton,
  Card,
  Table,
  Button,
  Badge,
  Modal,
} from '@mantine/core';
import {
  IconUser,
  IconChartBar,
  IconCreditCard,
  IconBell,
  IconShield,
  IconSettings,
  IconChevronRight,
} from '@tabler/icons-react';
import ProfileContent from '../components/profile/ProfileContent';
import { userSubscriptionService, UserSubscriptionDTO } from '../services/userSubscriptionService';
import { subscriptionPlanService, SubscriptionPlanDTO } from '../services/subscriptionPlanService';
import { authService } from '../services/authService';
import { paymentHistoryService, PaymentHistoryDTO } from '../services/paymentHistoryService';
import { notifications } from '@mantine/notifications';

interface SettingSectionProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  description: string;
  section: string;
  isActive: boolean;
  onClick: (section: string) => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  icon: Icon,
  label,
  description,
  section,
  isActive,
  onClick,
}) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box
      p="md"
      style={{
        backgroundColor: isActive
          ? (colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(160, 142, 115, 0.3)')
          : 'transparent',
        border: isActive
          ? `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(160, 142, 115, 0.5)'}`
          : '1px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onClick={() => onClick(section)}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = colorScheme === 'dark'
            ? 'rgba(55, 65, 81, 0.3)'
            : 'rgba(242, 237, 230, 0.5)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Group justify="flex-start" align="center" gap="sm" wrap="nowrap">
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#5a5550'),
          flexShrink: 0
        }}>
          <Icon size={20} />
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={500}
            size="sm"
            style={{
              color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'),
              fontFamily: 'Outfit, Inter, sans-serif',
              lineHeight: 1.3,
              textAlign: 'left',
            }}
          >
            {label}
          </Text>
          <Text
            size="xs"
            style={{
              color: isActive ? '#e0e7ff' : (colorScheme === 'dark' ? '#94a3b8' : '#5a5550'),
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.2,
              textAlign: 'left',
            }}
          >
            {description}
          </Text>
        </Box>
        <Box style={{
          color: isActive ? '#ffffff' : (colorScheme === 'dark' ? '#94a3b8' : '#5a5550'),
          flexShrink: 0
        }}>
          <IconChevronRight size={16} />
        </Box>
      </Group>
    </Box>
  );
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const { colorScheme } = useMantineColorScheme();

  // Determinar la sección activa desde los parámetros de la URL
  const getCurrentSection = () => {
    // Compatibilidad: si viene 'subscription', tratarlo como 'billing'
    if (section === 'subscription') return 'billing';
    return section || 'profile'; // default
  };

  const [activeSection, setActiveSection] = useState(getCurrentSection());

  // Estado para suscripción del usuario
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionDTO | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<UserSubscriptionDTO[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentHistoryDTO[]>([]);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [subError, setSubError] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlanDTO[]>([]);

  // Sincronizar el estado con los parámetros de la URL
  useEffect(() => {
    setActiveSection(getCurrentSection());
  }, [section]);

  // Cargar datos de suscripción cuando la sección activa es 'billing'
  useEffect(() => {
    const loadSubscription = async () => {
      if (activeSection !== 'billing') return;
      try {
        setSubLoading(true);
        setSubError(null);
        const [current, history, payments] = await Promise.all([
          userSubscriptionService.getCurrentSubscription().catch(() => null),
          userSubscriptionService.getHistory().catch(() => []),
          paymentHistoryService.getMyPayments().catch(() => []),
        ]);
        setCurrentSubscription(current);
        // cargar planes activos para upgrade
        const activePlans = await subscriptionPlanService.getAllActivePlans().catch(() => []);
        setAvailablePlans(activePlans);
        setSubscriptionHistory(history);
        setMyPayments(payments);
      } catch (e: any) {
        console.error(e);
        setSubError('No se pudo cargar tu suscripción.');
      } finally {
        setSubLoading(false);
      }
    };
    loadSubscription();
  }, [activeSection]);

  const settingSections = [
    {
      icon: IconUser,
      label: 'Perfil',
      description: 'Información personal',
      section: 'profile',
    },
    {
      icon: IconChartBar,
      label: 'Estadísticas',
      description: 'Rendimiento',
      section: 'stats',
    },
    {
      icon: IconCreditCard,
      label: 'Facturación',
      description: 'Plan y pagos',
      section: 'billing',
    },
    {
      icon: IconBell,
      label: 'Notificaciones',
      description: 'Alertas y avisos',
      section: 'notifications',
    },
    {
      icon: IconShield,
      label: 'Privacidad',
      description: 'Seguridad',
      section: 'privacy',
    },
    {
      icon: IconSettings,
      label: 'Cuenta',
      description: 'Configuraciones',
      section: 'account',
    },
  ];

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (section === 'profile') {
      navigate('/settings');
    } else {
      navigate(`/settings/${section}`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileContent />;
      case 'stats':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Estadísticas
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Gráficos de rendimiento y progreso
            </Text>
          </Box>
        );
      case 'subscription':
      case 'billing':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)'
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Facturación
            </Title>

            {subLoading && (
              <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
                Cargando tu suscripción...
              </Text>
            )}
            {subError && (
              <Text size="sm" c="red">
                {subError}
              </Text>
            )}

            {!subLoading && (
              <Stack gap="lg">
                {/* Card: Plan actual */}
                <Card withBorder radius="lg" p="lg" style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.95)'
                }}>
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                      {currentSubscription ? (
                        <>
                          <Text fw={700} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', textAlign: 'left' }}>
                            Plan {currentSubscription.plan?.name}
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#5a5550', textAlign: 'left' }}>
                            [{currentSubscription.plan?.billingInterval === 'YEARLY' ? 'Anual' : currentSubscription.plan?.billingInterval === 'MONTHLY' ? 'Mensual' : currentSubscription.plan?.billingInterval}]
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#5a5550', textAlign: 'left' }}>
                            Tu suscripción se renovará automáticamente el {new Date(currentSubscription.endDate).toLocaleDateString()}
                          </Text>
                          <Badge color={currentSubscription.isActive ? 'green' : 'gray'} variant="light" w="fit-content">
                            {currentSubscription.isActive ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </>
                      ) : (
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>No tienes una suscripción activa.</Text>
                      )}
                    </Stack>
                    <Group gap="sm">
                      <Button onClick={() => (window.location.href = '/mejorarplan')}>Ajustar plan</Button>
                    </Group>
                  </Group>
                </Card>

                {/* Card: Pago (estático) */}
                <Card withBorder radius="lg" p="lg" style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.95)'
                }}>
                  <Text fw={700} mb="xs" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', textAlign: 'left' }}>Pago</Text>
                  <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#5a5550', textAlign: 'left' }}>Método: Link by Stripe (placeholder)</Text>
                  <Group mt="sm">
                    <Button variant="light" disabled>Actualizar</Button>
                  </Group>
                </Card>

                {/* Card: Facturas */}
                <Card withBorder radius="lg" p="lg" style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.95)'
                }}>
                  <Text fw={700} mb="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', textAlign: 'left' }}>Facturas</Text>
                  {myPayments.length === 0 ? (
                    <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>Sin pagos registrados</Text>
                  ) : (
                    <Table striped highlightOnHover withRowBorders={false} verticalSpacing="sm">
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Fecha</Table.Th>
                          <Table.Th>Total</Table.Th>
                          <Table.Th>Estado</Table.Th>
                          <Table.Th>Acciones</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {myPayments.map((p) => (
                          <Table.Tr key={p.id}>
                            <Table.Td>{new Date(p.paymentDate).toLocaleDateString()}</Table.Td>
                            <Table.Td>${Number(p.amount)} {p.currency}</Table.Td>
                            <Table.Td><Badge color={p.status === 'COMPLETED' ? 'green' : 'gray'} variant="light">{p.status}</Badge></Table.Td>
                            <Table.Td><Button variant="light" size="xs">Ver</Button></Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Card>

                {/* Card: Cancelación (respaldo) */}
                <Card withBorder radius="lg" p="lg" style={{
                  backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.95)'
                }}>
                  <Group justify="space-between" align="center">
                    <Stack gap={2}>
                      <Text fw={700} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26' }}>Cancelación</Text>
                      <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>Cancelar plan</Text>
                    </Stack>
                    <Button color="red" variant="filled" disabled={!currentSubscription?.isActive} onClick={async () => {
                      if (!currentSubscription) return;
                      try {
                        const updated = await userSubscriptionService.cancelSubscription(currentSubscription.id);
                        setCurrentSubscription(updated);
                        notifications.show({ color: 'green', message: 'Suscripción cancelada' });
                      } catch (e: any) {
                        notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al cancelar' });
                      }
                    }}>Cancelar</Button>
                  </Group>
                </Card>
              </Stack>
            )}
          </Box>
        );
      case 'notifications':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Notificaciones
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuración de alertas
            </Text>
          </Box>
        );
      case 'privacy':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Privacidad
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuración de privacidad
            </Text>
          </Box>
        );
      case 'account':
        return (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
            }}
          >
            <Title order={2} mb="lg" style={{
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26'
            }}>
              Cuenta
            </Title>
            <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
              Próximamente: Configuraciones de cuenta
            </Text>
          </Box>
        );
      default:
        return <ProfileContent />;
    }
  };

  return (
    <Container size="xl" py="md" style={{ paddingTop: '2rem' }}>
      <Box
        style={{
          display: 'flex',
          gap: '2rem',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Settings Sidebar */}
        <Box
          style={{
            width: '240px',
            flexShrink: 0,
          }}
        >
          <Box
            style={{
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
              borderRadius: '16px',
              position: 'sticky',
              top: '2rem',
              height: 'fit-content',
            }}
          >
            <Box p="lg">
              <Text
                size="lg"
                fw={700}
                mb="lg"
                style={{
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                }}
              >
                Configuración
              </Text>

              <Stack gap="sm">
                {settingSections.map((section) => (
                  <SettingSection
                    key={section.section}
                    icon={section.icon}
                    label={section.label}
                    description={section.description}
                    section={section.section}
                    isActive={activeSection === section.section}
                    onClick={handleSectionClick}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Contenido Principal */}
        <Box style={{ flex: 1 }}>
          {/* Modal de cambio de plan */}
          <Modal opened={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} title="Cambiar plan">
            <Stack gap="sm">
              {availablePlans
                .filter((p) => !currentSubscription || p.id !== currentSubscription.plan?.id)
                .map((p) => (
                  <Group key={p.id} justify="space-between" align="center" style={{
                    padding: '8px 12px',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                  }}>
                    <Stack gap={0} style={{ flex: 1 }}>
                      <Text fw={600} size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26' }}>{p.name}</Text>
                      <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                        ${Number(p.price)} / {(p.billingInterval === 'YEARLY' ? 'año' : p.billingInterval === 'MONTHLY' ? 'mes' : p.billingInterval?.toLowerCase())}
                      </Text>
                    </Stack>
                    <UnstyledButton
                      onClick={async () => {
                        try {
                          const updated = await userSubscriptionService.createSubscription({ planId: p.id });
                          setCurrentSubscription(updated);
                          const history = await userSubscriptionService.getHistory().catch(() => []);
                          setSubscriptionHistory(history);
                          notifications.show({ color: 'green', message: `Plan cambiado a ${p.name}` });
                          setUpgradeModalOpen(false);
                        } catch (e: any) {
                          notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al cambiar de plan' });
                        }
                      }}
                      style={{
                        backgroundColor: colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: '#10b981'
                      }}
                    >
                      Elegir
                    </UnstyledButton>
                  </Group>
                ))}
              {availablePlans.length === 0 && (
                <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550' }}>
                  No hay planes disponibles por ahora.
                </Text>
              )}
            </Stack>
          </Modal>
          {renderContent()}
        </Box>
      </Box>

      {/* Mini footer */}
      <Box
        style={{
          marginTop: '3rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
          textAlign: 'center',
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
    </Container>
  );
};

export default SettingsPage;
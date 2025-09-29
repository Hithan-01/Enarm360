import React, { useEffect, useState } from 'react';
import {
  Text,
  Title,
  Group,
  Stack,
  useMantineColorScheme,
  Box,
  Card,
  SimpleGrid,
  ThemeIcon,
  Button,
  Badge,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Switch,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { subscriptionPlanService, SubscriptionPlanDTO, CreateSubscriptionPlanDTO } from '../../services/subscriptionPlanService';
import { IconPower, IconCircleOff } from '@tabler/icons-react';
import { subscriptionDashboardService, SubscriptionSummaryDTO } from '../../services/subscriptionDashboardService';
import PageTransition from '../../components/animations/PageTransition';
import CountUpNumber from '../../components/animations/CountUpNumber';
import {
  IconCreditCard,
  IconCoin,
  IconTrendingUp,
  IconUsers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconGift,
  IconChartBar,
  IconCalendar,
  IconPercentage,
} from '@tabler/icons-react';

const SubscriptionsPage: React.FC = () => {
  const [planModalOpen, setPlanModalOpen] = useState<boolean>(false);
  const [couponModalOpen, setCouponModalOpen] = useState<boolean>(false);
  const { colorScheme } = useMantineColorScheme();

  // Modo edición/creación
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);

  // Estado de datos reales
  const [plans, setPlans] = useState<SubscriptionPlanDTO[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummaryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del modal de Plan
  const [planName, setPlanName] = useState<string>('');
  const [planPrice, setPlanPrice] = useState<number | ''>('');
  const [planPeriod, setPlanPeriod] = useState<string>('month');
  const [planFeatures, setPlanFeatures] = useState<string>('');
  const [planActive, setPlanActive] = useState<boolean>(true); // se mantiene en UI, no se usa aún en API

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [plansData, summaryData] = await Promise.all([
          subscriptionPlanService.getAllPlans(),
          subscriptionDashboardService.getSummary(),
        ]);
        setPlans(plansData);
        setSummary(summaryData);
      } catch (e: any) {
        console.error(e);
        setError('Error al cargar datos de suscripciones');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreatePlan = async () => {
    try {
      if (!planName || planPrice === '' || planPrice == null) {
        notifications.show({ color: 'red', message: 'Nombre y precio son obligatorios' });
        return;
      }
      const billingInterval = planPeriod === 'year' ? 'YEARLY' : 'MONTHLY';
      const features = planFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload: CreateSubscriptionPlanDTO = {
        name: planName,
        price: Number(planPrice),
        currency: 'USD',
        billingInterval: billingInterval as any,
        features,
      };

      const created = await subscriptionPlanService.createPlan(payload);
      notifications.show({ color: 'green', message: `Plan "${created.name}" creado` });
      setPlanModalOpen(false);
      // limpiar campos
      setPlanName('');
      setPlanPrice('');
      setPlanPeriod('month');
      setPlanFeatures('');
      setPlanActive(true);
      // recargar planes
      const updated = await subscriptionPlanService.getAllPlans();
      setPlans(updated);
    } catch (e: any) {
      console.error(e);
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al crear plan' });
    }
  };

  // Helpers acciones de plan
  const reloadPlans = async () => {
    try {
      const updated = await subscriptionPlanService.getAllPlans();
      setPlans(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await subscriptionPlanService.activatePlan(id);
      notifications.show({ color: 'green', message: 'Plan activado' });
      reloadPlans();
    } catch (e: any) {
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al activar' });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await subscriptionPlanService.deactivatePlan(id);
      notifications.show({ color: 'green', message: 'Plan desactivado' });
      reloadPlans();
    } catch (e: any) {
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al desactivar' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await subscriptionPlanService.deletePlan(id);
      notifications.show({ color: 'green', message: 'Plan eliminado' });
      reloadPlans();
    } catch (e: any) {
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al eliminar' });
    }
  };

  const handleOpenEdit = (plan: SubscriptionPlanDTO) => {
    setIsEditMode(true);
    setEditingPlanId(plan.id);
    setPlanName(plan.name || '');
    setPlanPrice(Number(plan.price) || 0);
    const period = plan.billingInterval === 'YEARLY' ? 'year' : plan.billingInterval === 'MONTHLY' ? 'month' : (plan.billingInterval?.toLowerCase() || 'month');
    setPlanPeriod(period);
    setPlanFeatures((plan.features || []).join('\n'));
    setPlanActive(!!plan.isActive);
    setPlanModalOpen(true);
  };

  const handleUpdatePlan = async () => {
    try {
      if (!editingPlanId) return;
      if (!planName || planPrice === '' || planPrice == null) {
        notifications.show({ color: 'red', message: 'Nombre y precio son obligatorios' });
        return;
      }
      const billingInterval = planPeriod === 'year' ? 'YEARLY' : 'MONTHLY';
      const features = planFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload: CreateSubscriptionPlanDTO = {
        name: planName,
        price: Number(planPrice),
        currency: 'USD',
        billingInterval: billingInterval as any,
        features,
      };

      const updated = await subscriptionPlanService.updatePlan(editingPlanId, payload);
      notifications.show({ color: 'green', message: `Plan "${updated.name}" actualizado` });
      setPlanModalOpen(false);
      setIsEditMode(false);
      setEditingPlanId(null);
      await reloadPlans();
    } catch (e: any) {
      console.error(e);
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al actualizar plan' });
    }
  };

  // Datos de ejemplo para cupones
  const coupons = [
    {
      id: 1,
      code: 'STUDENT20',
      discount: 20,
      type: 'percentage',
      uses: 156,
      maxUses: 1000,
      expiresAt: '2024-06-30',
      status: 'Active'
    },
    {
      id: 2,
      code: 'WELCOME50',
      discount: 50,
      type: 'percentage',
      uses: 89,
      maxUses: 500,
      expiresAt: '2024-05-15',
      status: 'Active'
    },
  ];

  return (
    <PageTransition type="medical" duration={800}>
      <>
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
                    Subscriptions & Finance
                  </Title>
                  <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                    Manage subscription plans, pricing, and promotional coupons
                  </Text>
                </div>
                <Group>
                  <Button
                    leftSection={<IconGift size={16} />}
                    variant="light"
                    onClick={() => setCouponModalOpen(true)}
                  >
                    Create Coupon
                  </Button>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => {
                      // Reset para creación
                      setIsEditMode(false);
                      setEditingPlanId(null);
                      setPlanName('');
                      setPlanPrice('');
                      setPlanPeriod('month');
                      setPlanFeatures('');
                      setPlanActive(true);
                      setPlanModalOpen(true);
                    }}
                  >
                    New Plan
                  </Button>
                </Group>
              </Group>

              {/* Revenue Stats */}
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="green" radius="xl">
                      <IconCoin size={28} />
                    </ThemeIcon>
                    <div>
<CountUpNumber
                        value={Number(summary?.monthlyRevenue ?? 0)}
                        duration={2500}
                        prefix="$"
                        decimals={2}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Monthly Revenue
                      </Text>
                    </div>
                  </Group>
                </Card>

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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                      <IconCreditCard size={28} />
                    </ThemeIcon>
                    <div>
<CountUpNumber
                        value={Number(summary?.activeSubscriptions ?? 0)}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Active Subscriptions
                      </Text>
                    </div>
                  </Group>
                </Card>

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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="orange" radius="xl">
                      <IconTrendingUp size={28} />
                    </ThemeIcon>
                    <div>
<Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        {typeof summary?.growthRate === 'number' ? `${summary?.growthRate}%` : '+0%'}
                      </Text>
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Growth Rate
                      </Text>
                    </div>
                  </Group>
                </Card>

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
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                      <IconPercentage size={28} />
                    </ThemeIcon>
                    <div>
<Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        {typeof summary?.retentionRate === 'number' ? `${summary?.retentionRate}%` : '0%'}
                      </Text>
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Retention Rate
                      </Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>

              {/* Subscription Plans */}
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
                <Title order={4} mb="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                  Subscription Plans
                </Title>

                <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
{plans.map((plan) => (
                    <Card
                      key={plan.id}
                      radius="lg"
                      p="lg"
                      style={{
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(30, 41, 59, 0.5)'
                          : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                      }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Text fw={600} size="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                            {plan.name}
                          </Text>
<Badge color={plan.isActive ? 'green' : 'gray'} variant="light">
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Group>

                        <Group align="end" gap="xs">
                          <Text size="2xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
${Number(plan.price)}
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
/{(plan.billingInterval === 'YEARLY' ? 'year' : plan.billingInterval === 'MONTHLY' ? 'month' : plan.billingInterval?.toLowerCase() || 'month')}
                          </Text>
                        </Group>

                        <Stack gap="sm">
                          <Group>
                            <IconUsers size={16} />
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
{plan.subscribersCount ?? 0} subscribers
                            </Text>
                          </Group>
                          <Group>
                            <IconCoin size={16} />
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
${Number(plan.totalRevenue ?? 0).toLocaleString()} revenue
                            </Text>
                          </Group>
                        </Stack>

                        <Stack gap="xs">
                          <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                            Features:
                          </Text>
{(plan.features || []).map((feature, index) => (
                            <Text key={index} size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                              • {feature}
                            </Text>
                          ))}
                        </Stack>

<Group gap="xs" mt="md">
                          <Button variant="light" size="sm" leftSection={<IconEdit size={14} />} fullWidth onClick={() => handleOpenEdit(plan)}>
                            Edit
                          </Button>
                          {plan.isActive ? (
                            <Button variant="light" color="orange" size="sm" leftSection={<IconCircleOff size={14} />} onClick={() => handleDeactivate(plan.id)}>
                              Deactivate
                            </Button>
                          ) : (
                            <Button variant="light" color="teal" size="sm" leftSection={<IconPower size={14} />} onClick={() => handleActivate(plan.id)}>
                              Activate
                            </Button>
                          )}
                          <Button variant="light" color="red" size="sm" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(plan.id)}>
                            Delete
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              </Card>

              {/* Active Coupons */}
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
                <Title order={4} mb="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                  Active Coupons
                </Title>

                <Table.ScrollContainer minWidth={500}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Code</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Discount</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Usage</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Expires</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Status</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {coupons.map((coupon) => (
                        <Table.Tr key={coupon.id}>
                          <Table.Td>
                            <Text fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                              {coupon.code}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              {coupon.discount}%
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              {coupon.uses}/{coupon.maxUses}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              {coupon.expiresAt}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={coupon.status === 'Active' ? 'green' : 'gray'} variant="light">
                              {coupon.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Button variant="light" size="xs" leftSection={<IconEdit size={12} />}>
                                Edit
                              </Button>
                              <Button variant="light" color="red" size="xs" leftSection={<IconTrash size={12} />}>
                                Delete
                              </Button>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Card>
            </Stack>
        </Box>

        {/* Plan Modal */}
        <Modal
          opened={planModalOpen}
          onClose={() => setPlanModalOpen(false)}
          title={isEditMode ? 'Edit Plan' : 'Create New Plan'}
          size="lg"
        >
          <Stack gap="md">
<TextInput label="Plan Name" placeholder="Enter plan name" value={planName} onChange={(e) => setPlanName(e.currentTarget.value)} />
            <Group grow>
<NumberInput label="Price" placeholder="0.00" prefix="$" value={planPrice} onChange={(val) => setPlanPrice(typeof val === 'number' ? val : Number(val) || '' )} />
<Select
                label="Billing Period"
                data={[
                  { value: 'month', label: 'Monthly' },
                  { value: 'year', label: 'Yearly' }
                ]}
                value={planPeriod}
                onChange={(val) => setPlanPeriod(val || 'month')}
              />
            </Group>
<Textarea label="Features" placeholder="Enter features (one per line)" rows={4} value={planFeatures} onChange={(e) => setPlanFeatures(e.currentTarget.value)} />
<Switch label="Active" checked={planActive} onChange={(e) => setPlanActive(e.currentTarget.checked)} />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setPlanModalOpen(false)}>Cancel</Button>
              {isEditMode ? (
                <Button onClick={handleUpdatePlan}>Save Changes</Button>
              ) : (
                <Button onClick={handleCreatePlan}>Create Plan</Button>
              )}
            </Group>
          </Stack>
        </Modal>

        {/* Coupon Modal */}
        <Modal
          opened={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          title="Create New Coupon"
          size="md"
        >
          <Stack gap="md">
            <TextInput label="Coupon Code" placeholder="DISCOUNT20" />
            <Group grow>
              <NumberInput label="Discount %" placeholder="20" max={100} />
              <NumberInput label="Max Uses" placeholder="100" />
            </Group>
            <TextInput label="Expires At" placeholder="YYYY-MM-DD" />
            <Switch label="Active" />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setCouponModalOpen(false)}>Cancel</Button>
              <Button>Create Coupon</Button>
            </Group>
          </Stack>
        </Modal>
      </>
    </PageTransition>
  );
};

export default SubscriptionsPage;
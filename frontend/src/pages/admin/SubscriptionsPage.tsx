import React, { useState } from 'react';
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

  // Datos de ejemplo para planes de suscripción
  const subscriptionPlans = [
    {
      id: 1,
      name: 'Free Trial',
      price: 0,
      period: 'month',
      features: ['Basic questions', 'Limited attempts', 'Basic statistics'],
      subscribers: 714,
      status: 'Active',
      revenue: 0
    },
    {
      id: 2,
      name: 'Standard',
      price: 29.99,
      period: 'month',
      features: ['All questions', 'Unlimited attempts', 'Detailed analytics', 'Progress tracking'],
      subscribers: 854,
      status: 'Active',
      revenue: 25598.46
    },
    {
      id: 3,
      name: 'Premium',
      price: 49.99,
      period: 'month',
      features: ['Everything in Standard', 'Clinical cases', 'Expert explanations', 'Priority support'],
      subscribers: 1279,
      status: 'Active',
      revenue: 63948.21
    },
  ];

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
                    onClick={() => setPlanModalOpen(true)}
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
                        value={89546.67}
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
                        value={2133}
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
                        +24.3%
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
                        87.2%
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
                  {subscriptionPlans.map((plan) => (
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
                          <Badge color={plan.status === 'Active' ? 'green' : 'gray'} variant="light">
                            {plan.status}
                          </Badge>
                        </Group>

                        <Group align="end" gap="xs">
                          <Text size="2xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                            ${plan.price}
                          </Text>
                          <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                            /{plan.period}
                          </Text>
                        </Group>

                        <Stack gap="sm">
                          <Group>
                            <IconUsers size={16} />
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              {plan.subscribers} subscribers
                            </Text>
                          </Group>
                          <Group>
                            <IconCoin size={16} />
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              ${plan.revenue.toLocaleString()} revenue
                            </Text>
                          </Group>
                        </Stack>

                        <Stack gap="xs">
                          <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                            Features:
                          </Text>
                          {plan.features.map((feature, index) => (
                            <Text key={index} size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                              • {feature}
                            </Text>
                          ))}
                        </Stack>

                        <Group gap="xs" mt="md">
                          <Button variant="light" size="sm" leftSection={<IconEdit size={14} />} fullWidth>
                            Edit
                          </Button>
                          <Button variant="light" color="red" size="sm" leftSection={<IconTrash size={14} />}>
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
          title="Create New Plan"
          size="lg"
        >
          <Stack gap="md">
            <TextInput label="Plan Name" placeholder="Enter plan name" />
            <Group grow>
              <NumberInput label="Price" placeholder="0.00" prefix="$" />
              <Select
                label="Billing Period"
                data={[
                  { value: 'month', label: 'Monthly' },
                  { value: 'year', label: 'Yearly' }
                ]}
              />
            </Group>
            <Textarea label="Features" placeholder="Enter features (one per line)" rows={4} />
            <Switch label="Active" />
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setPlanModalOpen(false)}>Cancel</Button>
              <Button>Create Plan</Button>
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
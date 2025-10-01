import React, { useEffect, useState } from 'react';
import { Box, Title, Text, useMantineColorScheme, Card, SimpleGrid, Stack, Group, Badge, Button, Container, Center } from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import { subscriptionPlanService, SubscriptionPlanDTO } from '../services/subscriptionPlanService';
import { userSubscriptionService, UserSubscriptionDTO } from '../services/userSubscriptionService';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { IconCheck } from '@tabler/icons-react';

const MejorarPlanPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlanDTO[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscriptionDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [plansData, subscription] = await Promise.all([
          subscriptionPlanService.getAllActivePlans(),
          userSubscriptionService.getCurrentSubscription().catch(() => null)
        ]);
        setPlans(plansData);
        setCurrentSubscription(subscription);
      } catch (e: any) {
        console.error(e);
        setError('No se pudieron cargar los planes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choosePlan = (planId: number) => {
    navigate(`/checkout/${planId}`);
  };

  const isCurrentPlan = (planId: number) => {
    return currentSubscription?.plan?.id === planId && currentSubscription?.status === 'ACTIVE';
  };

  return (
    <PageTransition type="medical" duration={600}>
      <Container size="lg" py="xl">
        <Center mb="xl">
          <Stack gap="xs" align="center">
            <Title
              order={1}
              size="h1"
              style={{
                color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                fontSize: '2.5rem',
                fontWeight: 600
              }}
            >
              Planes que crecen contigo
            </Title>
          </Stack>
        </Center>

        {loading && (
          <Text ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Cargando planes...</Text>
        )}
        {error && (
          <Text c="red" ta="center">{error}</Text>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan.id);
            return (
              <Card
                key={plan.id}
                radius="xl"
                p="xl"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.4)'
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)'}`,
                  boxShadow: colorScheme === 'dark'
                    ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Stack gap="md" style={{ flex: 1 }}>
                  {/* Icon placeholder - you can add custom icons here */}
                  <Center>
                    <Box
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(96, 165, 250, 0.2)'
                          : 'rgba(96, 165, 250, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colorScheme === 'dark' ? '#60a5fa' : '#3b82f6'} strokeWidth="2">
                        <circle cx="12" cy="8" r="3"/>
                        <circle cx="8" cy="16" r="2"/>
                        <circle cx="16" cy="16" r="2"/>
                        <line x1="12" y1="11" x2="12" y2="13"/>
                        <line x1="12" y1="13" x2="8" y2="14"/>
                        <line x1="12" y1="13" x2="16" y2="14"/>
                      </svg>
                    </Box>
                  </Center>

                  <Stack gap={4} align="center">
                    <Text
                      fw={700}
                      size="xl"
                      style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      size="sm"
                      c={colorScheme === 'dark' ? 'blue.4' : 'blue.6'}
                      style={{ fontWeight: 500 }}
                    >
                      {plan.description || 'Investiga, programa y organiza'}
                    </Text>
                  </Stack>

                  <Group justify="center" align="end" gap={4}>
                    <Text
                      size="2.5rem"
                      fw={700}
                      style={{
                        color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                        lineHeight: 1,
                      }}
                    >
                      ${Number(plan.price)}
                    </Text>
                    <Text
                      size="sm"
                      style={{
                        color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b',
                        paddingBottom: '0.3rem',
                      }}
                    >
                      /{plan.billingInterval === 'YEARLY' ? 'año' : plan.billingInterval === 'MONTHLY' ? 'mes' : plan.billingInterval?.toLowerCase()} facturado {plan.billingInterval === 'YEARLY' ? 'anualmente' : 'mensualmente'}
                    </Text>
                  </Group>

                  {/* Features */}
                  <Stack gap="xs" mt="md" style={{ flex: 1 }}>
                    <Text
                      size="xs"
                      fw={600}
                      tt="uppercase"
                      style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}
                    >
                      {isCurrent ? 'Todo lo incluido en tu plan:' : 'Características incluidas:'}
                    </Text>
                    {(plan.features || []).map((f, idx) => (
                      <Group key={idx} gap="xs" wrap="nowrap">
                        <IconCheck
                          size={16}
                          style={{
                            color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                            flexShrink: 0,
                          }}
                        />
                        <Text
                          size="sm"
                          style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}
                        >
                          {f}
                        </Text>
                      </Group>
                    ))}
                  </Stack>

                  {/* Button - always at bottom */}
                  <Button
                    size="md"
                    fullWidth
                    variant={isCurrent ? 'outline' : 'filled'}
                    color={isCurrent ? 'gray' : 'blue'}
                    onClick={() => isCurrent ? null : choosePlan(plan.id)}
                    disabled={isCurrent}
                    style={{
                      marginTop: 'auto',
                      backgroundColor: isCurrent
                        ? 'transparent'
                        : colorScheme === 'dark' ? '#60a5fa' : '#3b82f6',
                      borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {isCurrent ? `Permanecer en el plan ${plan.name}` : `Obtener plan ${plan.name}`}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    </PageTransition>
  );
};

export default MejorarPlanPage;
import React, { useEffect, useState } from 'react';
import { Box, Title, Text, useMantineColorScheme, Card, SimpleGrid, Stack, Group, Badge, Button, Container, Center, useMantineTheme, ActionIcon } from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import { subscriptionPlanService, SubscriptionPlanDTO } from '../services/subscriptionPlanService';
import { userSubscriptionService, UserSubscriptionDTO } from '../services/userSubscriptionService';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';

const MejorarPlanPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      transition: 'background-color 0.2s ease',
    }}>
      <PageTransition type="medical" duration={600}>
        {/* Botón de navegación hacia atrás - posición absoluta */}
        <Box 
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            zIndex: 10,
          }}
        >
          <ActionIcon
            variant="subtle"
            size="lg"
            color={colorScheme === 'dark' ? 'gray.4' : 'gray.6'}
            onClick={() => navigate('/settings/billing')}
            style={{
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
          >
            <IconArrowLeft size={20} />
          </ActionIcon>
        </Box>
        
        <Container size="lg" py="xl">
        
        <Center mb="xl">
          <Stack gap="xs" align="center">
            <Title
              order={1}
              size="2.5rem"
              fw={600}
              c={colorScheme === 'dark' ? 'white' : 'dark.6'}
            >
              Planes que crecen contigo
            </Title>
          </Stack>
        </Center>

        {loading && (
          <Text ta="center" c={colorScheme === 'dark' ? 'gray.4' : 'gray.6'}>Cargando planes...</Text>
        )}
        {error && (
          <Text c="red" ta="center">{error}</Text>
        )}

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {plans.map((plan) => {
            const isCurrent = isCurrentPlan(plan.id);
            return (
              <Card
                key={plan.id}
                radius="lg"
                p="md"
                bg={colorScheme === 'dark' ? 'gray.9' : 'white'}
                withBorder
                shadow={colorScheme === 'dark' ? 'sm' : 'md'}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderColor: colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2],
                  transform: 'scale(0.8)',
                  minHeight: '400px',
                }}
              >
                <Stack gap="sm" style={{ flex: 1 }}>
                  {/* Icon placeholder - smaller */}
                  <Center>
                    <Box
                      w={48}
                      h={48}
                      style={{
                        borderRadius: '50%',
                        backgroundColor: colorScheme === 'dark' 
                          ? theme.colors.blue[9] + '40'
                          : theme.colors.blue[0],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.blue[colorScheme === 'dark' ? 4 : 6]} strokeWidth="2">
                        <circle cx="12" cy="8" r="3"/>
                        <circle cx="8" cy="16" r="2"/>
                        <circle cx="16" cy="16" r="2"/>
                        <line x1="12" y1="11" x2="12" y2="13"/>
                        <line x1="12" y1="13" x2="8" y2="14"/>
                        <line x1="12" y1="13" x2="16" y2="14"/>
                      </svg>
                    </Box>
                  </Center>

                  <Stack gap={2} align="center">
                    <Text
                      fw={700}
                      size="lg"
                      c={colorScheme === 'dark' ? 'white' : 'gray.9'}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      size="xs"
                      c={colorScheme === 'dark' ? 'blue.4' : 'blue.6'}
                      fw={500}
                      ta="center"
                    >
                      {plan.description || 'Investiga, programa y organiza'}
                    </Text>
                  </Stack>

                  <Group justify="center" align="end" gap={2}>
                    <Text
                      size="2rem"
                      fw={700}
                      c={colorScheme === 'dark' ? 'white' : 'gray.9'}
                      lh={1}
                    >
                      ${Number(plan.price)}
                    </Text>
                    <Text
                      size="xs"
                      c={colorScheme === 'dark' ? 'gray.3' : 'gray.6'}
                      pb="0.2rem"
                    >
                      /{plan.billingInterval === 'YEARLY' ? 'año' : plan.billingInterval === 'MONTHLY' ? 'mes' : plan.billingInterval?.toLowerCase()} facturado {plan.billingInterval === 'YEARLY' ? 'anualmente' : 'mensualmente'}
                    </Text>
                  </Group>

                  {/* Features */}
                  <Stack gap="xs" mt="xs" style={{ flex: 1 }}>
                    <Text
                      size="xs"
                      fw={600}
                      tt="uppercase"
                      c={colorScheme === 'dark' ? 'gray.4' : 'gray.6'}
                    >
                      {isCurrent ? 'Todo lo incluido en tu plan:' : 'Características incluidas:'}
                    </Text>
                    {(plan.features || []).map((f, idx) => (
                      <Group key={idx} gap="xs" wrap="nowrap">
                        <IconCheck
                          size={14}
                          color={theme.colors.gray[colorScheme === 'dark' ? 4 : 6]}
                          style={{ flexShrink: 0 }}
                        />
                        <Text
                          size="xs"
                          c={colorScheme === 'dark' ? 'gray.3' : 'gray.6'}
                        >
                          {f}
                        </Text>
                      </Group>
                    ))}
                  </Stack>

                  {/* Button - always at bottom */}
                  <Button
                    size="sm"
                    fullWidth
                    variant={isCurrent ? 'outline' : 'filled'}
                    color={isCurrent ? 'gray' : 'blue'}
                    onClick={() => isCurrent ? null : choosePlan(plan.id)}
                    disabled={isCurrent}
                    style={{ marginTop: 'auto' }}
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
    </div>
  );
};

export default MejorarPlanPage;
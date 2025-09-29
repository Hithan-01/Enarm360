import React, { useEffect, useState } from 'react';
import { Box, Title, Text, useMantineColorScheme, Card, SimpleGrid, Stack, Group, Badge, Button } from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import { subscriptionPlanService, SubscriptionPlanDTO } from '../services/subscriptionPlanService';
import { userSubscriptionService } from '../services/userSubscriptionService';
import { notifications } from '@mantine/notifications';

const MejorarPlanPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [plans, setPlans] = useState<SubscriptionPlanDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await subscriptionPlanService.getAllActivePlans();
        setPlans(data);
      } catch (e: any) {
        console.error(e);
        setError('No se pudieron cargar los planes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const choosePlan = async (planId: number) => {
    try {
      await userSubscriptionService.createSubscription({ planId });
      notifications.show({ color: 'green', message: 'Suscripción actualizada' });
      // Opcional: redirigir a facturación
      window.location.href = '/settings/billing';
    } catch (e: any) {
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'No se pudo actualizar la suscripción' });
    }
  };

  return (
    <PageTransition type="medical" duration={600}>
      <Box p="lg">
        <Title order={2} mb="xs" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
          Mejora tu plan
        </Title>
        <Text mb="lg" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
          Elige el plan que mejor se adapte a tus necesidades
        </Text>

        {loading && (
          <Text style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>Cargando planes...</Text>
        )}
        {error && (
          <Text c="red">{error}</Text>
        )}

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              radius="lg"
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.6)'
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}
            >
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={600} size="lg" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>{plan.name}</Text>
                  <Badge color={plan.isActive ? 'green' : 'gray'} variant="light">
                    {plan.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Group>

                <Group align="end" gap="xs">
                  <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                    ${Number(plan.price)}
                  </Text>
                  <Text size="sm" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                    /{(plan.billingInterval === 'YEARLY' ? 'año' : plan.billingInterval === 'MONTHLY' ? 'mes' : plan.billingInterval?.toLowerCase())}
                  </Text>
                </Group>

                <Stack gap={4}>
                  {(plan.features || []).map((f, idx) => (
                    <Text key={idx} size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>• {f}</Text>
                  ))}
                </Stack>

                <Button onClick={() => choosePlan(plan.id)}>Elegir plan</Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </PageTransition>
  );
};

export default MejorarPlanPage;
import React, { useEffect, useState } from 'react';
import {
  Box,
  Title,
  Text,
  useMantineColorScheme,
  Card,
  Stack,
  Group,
  Button,
  TextInput,
  Container,
  Divider,
  LoadingOverlay,
} from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import { subscriptionPlanService, SubscriptionPlanDTO } from '../services/subscriptionPlanService';
import { userSubscriptionService } from '../services/userSubscriptionService';
import { discountCouponService, type CouponValidationResultDTO } from '../services/discountCouponService';
import { notifications } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { IconCheck, IconX } from '@tabler/icons-react';

const CheckoutPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<SubscriptionPlanDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponValidationResultDTO | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadPlan = async () => {
      if (!planId) {
        navigate('/mejorarplan');
        return;
      }
      try {
        setLoading(true);
        const plans = await subscriptionPlanService.getAllActivePlans();
        const selectedPlan = plans.find((p) => p.id === Number(planId));
        if (!selectedPlan) {
          notifications.show({ color: 'red', message: 'Plan no encontrado' });
          navigate('/mejorarplan');
          return;
        }
        setPlan(selectedPlan);
      } catch (e: any) {
        console.error(e);
        notifications.show({ color: 'red', message: 'Error al cargar el plan' });
        navigate('/mejorarplan');
      } finally {
        setLoading(false);
      }
    };
    loadPlan();
  }, [planId, navigate]);

  const applyCoupon = async () => {
    if (!couponCode.trim() || !plan) return;
    const amount = Number(plan.price);
    if (!Number.isFinite(amount)) {
      notifications.show({ color: 'red', message: 'Precio del plan inválido' });
      return;
    }
    try {
      setApplyingCoupon(true);
      const result = await discountCouponService.validate({
        couponCode: couponCode.trim(),
        planId: plan.id,
        amount,
      });
      setCouponResult(result);
      if (result.isValid) {
        notifications.show({ color: 'green', message: result.message || 'Cupón aplicado' });
      } else {
        notifications.show({ color: 'orange', message: result.message || 'Cupón inválido' });
      }
    } catch (e: any) {
      console.error(e);
      notifications.show({ color: 'red', message: e?.response?.data?.error || 'Error al validar el cupón' });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponResult(null);
  };

  const handleSubmit = async () => {
    if (!plan) return;

    // Validation
    if (!fullName.trim() || !email.trim() || !cardNumber.trim() || !expiryDate || !cvv.trim() || !billingAddress.trim()) {
      notifications.show({ color: 'yellow', message: 'Por favor completa todos los campos' });
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        planId: plan.id,
        couponCode: couponResult?.isValid ? couponCode.trim() : undefined,
        paymentMethod: 'CARD',
        paymentReference: `card-${cardNumber.slice(-4)}`,
      };
      await userSubscriptionService.createSubscription(payload);
      notifications.show({ color: 'green', message: 'Suscripción creada exitosamente' });
      navigate('/settings/billing');
    } catch (e: any) {
      notifications.show({
        color: 'red',
        message: e?.response?.data?.error || 'No se pudo procesar el pago',
      });
    } finally {
      setProcessing(false);
    }
  };

  const finalPrice = couponResult?.isValid ? Number(couponResult.finalAmount) : Number(plan?.price ?? 0);

  return (
    <PageTransition type="medical" duration={600}>
      <Container size="md" py="xl">
        <LoadingOverlay visible={loading} />

        <Title
          order={1}
          mb="xl"
          style={{
            color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
            fontSize: '2rem',
          }}
        >
          Checkout
        </Title>

        {plan && (
          <Stack gap="lg">
            {/* Plan Summary Card */}
            <Card
              radius="lg"
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={700} size="lg" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                      {plan.name}
                    </Text>
                    <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      {plan.description || 'Plan de suscripción'}
                    </Text>
                  </div>
                  <Stack gap={0} align="flex-end">
                    {couponResult?.isValid && (
                      <Text
                        size="sm"
                        fw={600}
                        style={{
                          color: colorScheme === 'dark' ? '#94a3b8' : '#94a3b8',
                          textDecoration: 'line-through',
                        }}
                      >
                        ${Number(plan.price)}
                      </Text>
                    )}
                    <Text fw={700} size="xl" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                      ${finalPrice}
                    </Text>
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                      /{plan.billingInterval === 'YEARLY' ? 'año' : 'mes'}
                    </Text>
                  </Stack>
                </Group>

                <Divider color={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.08)'} />

                {/* Coupon Section */}
                <Stack gap="xs">
                  <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                    Código de descuento
                  </Text>
                  <Group align="flex-end">
                    <TextInput
                      placeholder="Ingresa tu código"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.currentTarget.value)}
                      disabled={!!couponResult?.isValid}
                      style={{ flex: 1 }}
                    />
                    {couponResult?.isValid ? (
                      <Button variant="light" color="gray" onClick={removeCoupon}>
                        Quitar
                      </Button>
                    ) : (
                      <Button variant="light" onClick={applyCoupon} loading={applyingCoupon}>
                        Aplicar
                      </Button>
                    )}
                  </Group>
                  {couponResult && (
                    <Group gap="xs">
                      {couponResult.isValid ? (
                        <IconCheck size={16} color="#10b981" />
                      ) : (
                        <IconX size={16} color="#ef4444" />
                      )}
                      <Text size="sm" c={couponResult.isValid ? 'teal' : 'red'}>
                        {couponResult.message || (couponResult.isValid ? 'Cupón aplicado' : 'Cupón inválido')}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Stack>
            </Card>

            {/* Payment Form Card */}
            <Card
              radius="lg"
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.4)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Stack gap="md">
                <Text fw={700} size="lg" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Información de pago
                </Text>

                <TextInput
                  label="Nombre completo"
                  placeholder="Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.currentTarget.value)}
                  required
                />

                <TextInput
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  required
                />

                <TextInput
                  label="Número de tarjeta"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.currentTarget.value)}
                  maxLength={19}
                  required
                />

                <Group grow>
                  <TextInput
                    label="Fecha de vencimiento"
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.currentTarget.value)}
                    maxLength={5}
                    required
                  />

                  <TextInput
                    label="CVV"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.currentTarget.value)}
                    maxLength={4}
                    required
                  />
                </Group>

                <TextInput
                  label="Dirección de facturación"
                  placeholder="Calle, Ciudad, Estado, CP"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.currentTarget.value)}
                  required
                />
              </Stack>
            </Card>

            {/* Action Buttons */}
            <Group justify="space-between">
              <Button variant="subtle" onClick={() => navigate('/mejorarplan')}>
                Volver a planes
              </Button>
              <Button
                size="md"
                onClick={handleSubmit}
                loading={processing}
                style={{
                  backgroundColor: colorScheme === 'dark' ? '#60a5fa' : '#3b82f6',
                }}
              >
                Confirmar pago - ${finalPrice}
              </Button>
            </Group>
          </Stack>
        )}
      </Container>
    </PageTransition>
  );
};

export default CheckoutPage;

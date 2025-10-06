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
  Progress,
  RingProgress,
  Select,
} from '@mantine/core';
import PageTransition from '../../components/animations/PageTransition';
import CountUpNumber from '../../components/animations/CountUpNumber';
import {
  IconUsers,
  IconUserCheck,
  IconUserPlus,
  IconChartLine,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconTarget,
  IconCalendar,
  IconDeviceAnalytics,
} from '@tabler/icons-react';

const UserStatisticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30');
  const { colorScheme } = useMantineColorScheme();

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '25.6px', /* 80% of 32px */
        }}
      >
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <div>
                  <Title order={2} mb="xs" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                    User Statistics
                  </Title>
                  <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                    Comprehensive analytics and user engagement metrics
                  </Text>
                </div>
                <Select
                  value={timeRange}
                  onChange={(value) => setTimeRange(value || '30')}
                  data={[
                    { value: '7', label: 'Last 7 days' },
                    { value: '30', label: 'Last 30 days' },
                    { value: '90', label: 'Last 3 months' },
                    { value: '365', label: 'Last year' }
                  ]}
                  style={{ width: '150px' }}
                />
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
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
                      <IconUsers size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={2847}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Total Users
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
                    <ThemeIcon size="xl" variant="light" color="green" radius="xl">
                      <IconUserCheck size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={1923}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Active Users
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
                      <IconUserPlus size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={247}
                        duration={2000}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        New This Month
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
                      <IconTrendingUp size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        +18.5%
                      </Text>
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Growth Rate
                      </Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                {/* User Engagement */}
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
                    User Engagement
                  </Title>

                  <Stack gap="lg">
                    <div>
                      <Group justify="space-between" mb="sm">
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Daily Active Users
                        </Text>
                        <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          89%
                        </Text>
                      </Group>
                      <Progress value={89} color="blue" size="md" radius="xl" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="sm">
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Session Duration
                        </Text>
                        <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          76%
                        </Text>
                      </Group>
                      <Progress value={76} color="teal" size="md" radius="xl" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="sm">
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Feature Adoption
                        </Text>
                        <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          64%
                        </Text>
                      </Group>
                      <Progress value={64} color="orange" size="md" radius="xl" />
                    </div>

                    <div>
                      <Group justify="space-between" mb="sm">
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Retention Rate
                        </Text>
                        <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          82%
                        </Text>
                      </Group>
                      <Progress value={82} color="green" size="md" radius="xl" />
                    </div>
                  </Stack>
                </Card>

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
                    Subscription Distribution
                  </Title>

                  <Group justify="center" mb="lg">
                    <RingProgress
                      size={200}
                      thickness={20}
                      sections={[
                        { value: 45, color: 'blue', tooltip: 'Premium - 45%' },
                        { value: 30, color: 'teal', tooltip: 'Standard - 30%' },
                        { value: 25, color: 'orange', tooltip: 'Free Trial - 25%' }
                      ]}
                      label={
                        <Text ta="center" fw={700} size="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                          Active
                        </Text>
                      }
                    />
                  </Group>

                  <Stack gap="md">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Box w={12} h={12} style={{ backgroundColor: '#339af0', borderRadius: '50%' }} />
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Premium
                        </Text>
                      </Group>
                      <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        1,279 users (45%)
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Group gap="xs">
                        <Box w={12} h={12} style={{ backgroundColor: '#20c997', borderRadius: '50%' }} />
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Standard
                        </Text>
                      </Group>
                      <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        854 users (30%)
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Group gap="xs">
                        <Box w={12} h={12} style={{ backgroundColor: '#fd7e14', borderRadius: '50%' }} />
                        <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                          Free Trial
                        </Text>
                      </Group>
                      <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        714 users (25%)
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </SimpleGrid>

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
                  Performance Metrics
                </Title>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
                  <Stack align="center" gap="sm">
                    <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                      <IconClock size={28} />
                    </ThemeIcon>
                    <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                      24.3 min
                    </Text>
                    <Text size="sm" ta="center" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                      Avg Session Time
                    </Text>
                  </Stack>

                  <Stack align="center" gap="sm">
                    <ThemeIcon size="xl" variant="light" color="teal" radius="xl">
                      <IconTarget size={28} />
                    </ThemeIcon>
                    <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                      78.9%
                    </Text>
                    <Text size="sm" ta="center" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                      Goal Completion
                    </Text>
                  </Stack>

                  <Stack align="center" gap="sm">
                    <ThemeIcon size="xl" variant="light" color="orange" radius="xl">
                      <IconDeviceAnalytics size={28} />
                    </ThemeIcon>
                    <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                      4.7/5
                    </Text>
                    <Text size="sm" ta="center" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                      User Satisfaction
                    </Text>
                  </Stack>

                  <Stack align="center" gap="sm">
                    <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                      <IconChartLine size={28} />
                    </ThemeIcon>
                    <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                      +23.4%
                    </Text>
                    <Text size="sm" ta="center" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                      Performance Gain
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Card>
            </Stack>
      </Box>
    </PageTransition>
  );
};

export default UserStatisticsPage;
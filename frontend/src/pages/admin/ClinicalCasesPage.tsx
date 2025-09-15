import React, { useState } from 'react';
import {
  Container,
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
  Progress,
} from '@mantine/core';
import PageTransition from '../../components/animations/PageTransition';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import {
  IconStethoscope,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconChartBar,
  IconUsers,
} from '@tabler/icons-react';
import { authService } from '../../services/authService';

const ClinicalCasesPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const { colorScheme } = useMantineColorScheme();
  const user = authService.getCurrentUserFromStorage();

  const handleLogout = () => {
    authService.logout();
  };

  // Datos de ejemplo para casos clínicos
  const clinicalCases = [
    {
      id: 1,
      title: 'Cardiovascular Emergency',
      category: 'Cardiology',
      questions: 12,
      difficulty: 'Advanced',
      status: 'Published',
      lastModified: '2024-01-15'
    },
    {
      id: 2,
      title: 'Pediatric Respiratory Case',
      category: 'Pediatrics',
      questions: 8,
      difficulty: 'Intermediate',
      status: 'Draft',
      lastModified: '2024-01-14'
    },
    {
      id: 3,
      title: 'Neurological Assessment',
      category: 'Neurology',
      questions: 15,
      difficulty: 'Expert',
      status: 'Published',
      lastModified: '2024-01-13'
    },
  ];

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Sidebar
          user={{
            username: user?.username || '',
            email: user?.email || '',
            roles: user?.roles || []
          }}
          onLogout={handleLogout}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Right Side Container */}
        <Box
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            flex: 1,
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          {/* Top Header */}
          <TopHeader
            user={{
              username: user?.username || '',
              email: user?.email || '',
              roles: user?.roles || [],
              nombre: user?.nombre,
              apellidos: user?.apellidos,
            }}
            onLogout={handleLogout}
            sidebarWidth={0}
          />

          {/* Main Content */}
          <Box
            style={{
              flex: 1,
              padding: '32px',
              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
            <Stack gap="xl">
              {/* Header */}
              <Group justify="space-between" align="center">
                <div>
                  <Title order={2} mb="xs">Clinical Cases Management</Title>
                  <Text c="dimmed">Manage clinical scenarios and their associated questions</Text>
                </div>
                <Button
                  leftSection={<IconPlus size={16} />}
                  size="md"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(59, 130, 246, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1px solid rgba(59, 130, 246, 0.2)`,
                  }}
                >
                  New Clinical Case
                </Button>
              </Group>

              {/* Stats Cards */}
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
                    <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                      <IconStethoscope size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>24</Text>
                      <Text size="sm" c="dimmed">Total Cases</Text>
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
                      <IconChartBar size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>187</Text>
                      <Text size="sm" c="dimmed">Total Questions</Text>
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
                      <IconUsers size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>1,234</Text>
                      <Text size="sm" c="dimmed">Student Attempts</Text>
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
                      <IconChartBar size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>78%</Text>
                      <Text size="sm" c="dimmed">Avg Success Rate</Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>

              {/* Clinical Cases List */}
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
                <Title order={3} mb="lg">Recent Clinical Cases</Title>

                <Stack gap="md">
                  {clinicalCases.map((clinicalCase) => (
                    <Card
                      key={clinicalCase.id}
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
                      <Group justify="space-between" align="flex-start">
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Group gap="md">
                            <Text fw={600} size="lg">{clinicalCase.title}</Text>
                            <Badge
                              color={clinicalCase.status === 'Published' ? 'green' : 'yellow'}
                              variant="light"
                            >
                              {clinicalCase.status}
                            </Badge>
                          </Group>

                          <Group gap="lg">
                            <Text size="sm" c="dimmed">
                              <strong>Category:</strong> {clinicalCase.category}
                            </Text>
                            <Text size="sm" c="dimmed">
                              <strong>Questions:</strong> {clinicalCase.questions}
                            </Text>
                            <Text size="sm" c="dimmed">
                              <strong>Difficulty:</strong> {clinicalCase.difficulty}
                            </Text>
                          </Group>

                          <Text size="xs" c="dimmed">
                            Last modified: {clinicalCase.lastModified}
                          </Text>
                        </Stack>

                        <Group gap="xs">
                          <Button variant="light" size="sm" leftSection={<IconEye size={14} />}>
                            View
                          </Button>
                          <Button variant="light" size="sm" leftSection={<IconEdit size={14} />}>
                            Edit
                          </Button>
                          <Button variant="light" color="red" size="sm" leftSection={<IconTrash size={14} />}>
                            Delete
                          </Button>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default ClinicalCasesPage;
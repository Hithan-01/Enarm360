import React, { useState } from 'react';
import { authService } from '../../services/authService';
import {
  Container,
  Paper,
  Text,
  Grid,
  Button,
  Table,
  Badge,
  Modal,
  TextInput,
  Select,
  Switch,
  Group,
  ActionIcon,
  Tooltip,
  Alert,
  Stack,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconUsers,
  IconShield,
  IconEdit,
  IconPlus,
  IconSearch,
  IconFilter,
  IconUserCheck,
  IconUserX,
  IconAlertCircle
} from '@tabler/icons-react';
import CountUpNumber from '../../components/animations/CountUpNumber';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  subscriptionType: string;
  canSubmitQuestions: boolean;
  canAccessClinicalCases: boolean;
  canViewStatistics: boolean;
  status: 'active' | 'suspended' | 'pending';
  lastActivity: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'submission' | 'access' | 'features';
}

const UserPermissionsPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const user = authService.getCurrentUserFromStorage();
  const [opened, setOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      role: 'student',
      subscriptionType: 'Premium',
      canSubmitQuestions: true,
      canAccessClinicalCases: true,
      canViewStatistics: false,
      status: 'active',
      lastActivity: '2024-01-15'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      role: 'student',
      subscriptionType: 'Basic',
      canSubmitQuestions: false,
      canAccessClinicalCases: false,
      canViewStatistics: false,
      status: 'active',
      lastActivity: '2024-01-14'
    },
    {
      id: 3,
      name: 'Ana Torres',
      email: 'ana.torres@email.com',
      role: 'instructor',
      subscriptionType: 'Professional',
      canSubmitQuestions: true,
      canAccessClinicalCases: true,
      canViewStatistics: true,
      status: 'active',
      lastActivity: '2024-01-15'
    }
  ];

  const permissions: Permission[] = [
    { id: 'submit_questions', name: 'Submit Questions', description: 'Allow user to submit questions for review', category: 'submission' },
    { id: 'access_clinical_cases', name: 'Clinical Cases Access', description: 'Access to clinical cases module', category: 'access' },
    { id: 'view_statistics', name: 'View Statistics', description: 'Access to personal statistics and analytics', category: 'features' }
  ];

  const stats = {
    totalUsers: 1247,
    activeUsers: 1089,
    usersWithSubmissionRights: 324,
    suspendedUsers: 23
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpened(true);
  };

  const handleSavePermissions = () => {
    console.log('Saving permissions for user:', selectedUser);
    setOpened(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'suspended': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorScheme === 'dark' ? '#1a1b23' : '#f8fafc'
      }}>
        <Container size="xl" style={{ flex: 1, paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Text
            size="xl"
            fw={700}
            mb="xl"
            style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
          >
            User Permissions Management
          </Text>

          <Grid mb="xl">
            <Grid.Col span={3}>
              <Paper
                p="md"
                style={{
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <Group justify="apart" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed">Total Users</Text>
                    <CountUpNumber
                      value={stats.totalUsers}
                      style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                      size="xl"
                      fw={700}
                    />
                  </div>
                  <IconUsers size={24} style={{ color: '#3b82f6' }} />
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={3}>
              <Paper
                p="md"
                style={{
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <Group justify="apart" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed">Active Users</Text>
                    <CountUpNumber
                      value={stats.activeUsers}
                      style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                      size="xl"
                      fw={700}
                    />
                  </div>
                  <IconUserCheck size={24} style={{ color: '#10b981' }} />
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={3}>
              <Paper
                p="md"
                style={{
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <Group justify="apart" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed">Submission Rights</Text>
                    <CountUpNumber
                      value={stats.usersWithSubmissionRights}
                      style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                      size="xl"
                      fw={700}
                    />
                  </div>
                  <IconShield size={24} style={{ color: '#8b5cf6' }} />
                </Group>
              </Paper>
            </Grid.Col>

            <Grid.Col span={3}>
              <Paper
                p="md"
                style={{
                  background: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: colorScheme === 'dark'
                    ? '1px solid rgba(148, 163, 184, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
              >
                <Group justify="apart" align="flex-start">
                  <div>
                    <Text size="sm" c="dimmed">Suspended</Text>
                    <CountUpNumber
                      value={stats.suspendedUsers}
                      style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                      size="xl"
                      fw={700}
                    />
                  </div>
                  <IconUserX size={24} style={{ color: '#ef4444' }} />
                </Group>
              </Paper>
            </Grid.Col>
          </Grid>

          <Paper
            p="md"
            style={{
              background: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: colorScheme === 'dark'
                ? '1px solid rgba(148, 163, 184, 0.2)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px'
            }}
          >
            <Group justify="space-between" mb="md">
              <Text fw={600} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>User Management</Text>
              <Group>
                <TextInput
                  placeholder="Search users..."
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.currentTarget.value)}
                />
                <Select
                  placeholder="Status"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'suspended', label: 'Suspended' },
                    { value: 'pending', label: 'Pending' }
                  ]}
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value || 'all')}
                />
                <Select
                  placeholder="Role"
                  data={[
                    { value: 'all', label: 'All Roles' },
                    { value: 'student', label: 'Student' },
                    { value: 'instructor', label: 'Instructor' }
                  ]}
                  value={filterRole}
                  onChange={(value) => setFilterRole(value || 'all')}
                />
              </Group>
            </Group>

            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Subscription</Table.Th>
                  <Table.Th>Permissions</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Last Activity</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredUsers.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td>
                      <div>
                        <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>{user.name}</Text>
                        <Text size="sm" c="dimmed">{user.email}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={user.role === 'instructor' ? 'blue' : 'gray'}>
                        {user.role}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={user.subscriptionType === 'Premium' ? 'gold' : user.subscriptionType === 'Professional' ? 'blue' : 'gray'}>
                        {user.subscriptionType}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {user.canSubmitQuestions && (
                          <Tooltip label="Can submit questions">
                            <Badge size="sm" variant="light" color="blue">Submit</Badge>
                          </Tooltip>
                        )}
                        {user.canAccessClinicalCases && (
                          <Tooltip label="Clinical cases access">
                            <Badge size="sm" variant="light" color="green">Cases</Badge>
                          </Tooltip>
                        )}
                        {user.canViewStatistics && (
                          <Tooltip label="Statistics access">
                            <Badge size="sm" variant="light" color="purple">Stats</Badge>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>{user.lastActivity}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Edit permissions">
                          <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => handleEditUser(user)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Container>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit User Permissions"
        size="md"
      >
        {selectedUser && (
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              Editing permissions for: <strong>{selectedUser.name}</strong>
            </Alert>

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Submission Permissions</Text>
            <Switch
              label="Allow question submissions"
              description="User can submit questions for admin review"
              checked={selectedUser.canSubmitQuestions}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canSubmitQuestions: event.currentTarget.checked
              })}
            />

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Access Permissions</Text>
            <Switch
              label="Clinical cases access"
              description="User can access clinical cases module"
              checked={selectedUser.canAccessClinicalCases}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canAccessClinicalCases: event.currentTarget.checked
              })}
            />

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Feature Permissions</Text>
            <Switch
              label="Statistics access"
              description="User can view personal statistics and analytics"
              checked={selectedUser.canViewStatistics}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canViewStatistics: event.currentTarget.checked
              })}
            />

            <Select
              label="User Status"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'pending', label: 'Pending' }
              ]}
              value={selectedUser.status}
              onChange={(value) => setSelectedUser({
                ...selectedUser,
                status: value as 'active' | 'suspended' | 'pending'
              })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePermissions}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default UserPermissionsPage;
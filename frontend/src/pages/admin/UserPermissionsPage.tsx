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
      subscriptionType: 'Básico',
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
      subscriptionType: 'Profesional',
      canSubmitQuestions: true,
      canAccessClinicalCases: true,
      canViewStatistics: true,
      status: 'active',
      lastActivity: '2024-01-15'
    }
  ];

  const permissions: Permission[] = [
    { id: 'submit_questions', name: 'Enviar Preguntas', description: 'Permitir al usuario enviar preguntas para revisión', category: 'submission' },
    { id: 'access_clinical_cases', name: 'Acceso a Casos Clínicos', description: 'Acceso al módulo de casos clínicos', category: 'access' },
    { id: 'view_statistics', name: 'Ver Estadísticas', description: 'Acceso a estadísticas personales y análisis', category: 'features' }
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
            Gestión de Permisos de Usuario
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
                    <Text size="sm" c="dimmed">Total de Usuarios</Text>
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
                    <Text size="sm" c="dimmed">Usuarios Activos</Text>
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
                    <Text size="sm" c="dimmed">Derechos de Envío</Text>
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
                    <Text size="sm" c="dimmed">Suspendidos</Text>
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
              <Text fw={600} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Gestión de Usuarios</Text>
              <Group>
                <TextInput
                  placeholder="Buscar usuarios..."
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.currentTarget.value)}
                />
                <Select
                  placeholder="Estado"
                  leftSection={<IconFilter size={16} />}
                  data={[
                    { value: 'all', label: 'Todos los Estados' },
                    { value: 'active', label: 'Activo' },
                    { value: 'suspended', label: 'Suspendido' },
                    { value: 'pending', label: 'Pendiente' }
                  ]}
                  value={filterStatus}
                  onChange={(value) => setFilterStatus(value || 'all')}
                />
                <Select
                  placeholder="Rol"
                  data={[
                    { value: 'all', label: 'Todos los Roles' },
                    { value: 'student', label: 'Estudiante' },
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
                  <Table.Th>Usuario</Table.Th>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th>Suscripción</Table.Th>
                  <Table.Th>Permisos</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Última Actividad</Table.Th>
                  <Table.Th>Acciones</Table.Th>
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
                        {user.role === 'student' ? 'Estudiante' : 'Instructor'}
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
                          <Tooltip label="Puede enviar preguntas">
                            <Badge size="sm" variant="light" color="blue">Enviar</Badge>
                          </Tooltip>
                        )}
                        {user.canAccessClinicalCases && (
                          <Tooltip label="Acceso a casos clínicos">
                            <Badge size="sm" variant="light" color="green">Casos</Badge>
                          </Tooltip>
                        )}
                        {user.canViewStatistics && (
                          <Tooltip label="Acceso a estadísticas">
                            <Badge size="sm" variant="light" color="purple">Estad.</Badge>
                          </Tooltip>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color={getStatusColor(user.status)}>
                        {user.status === 'active' ? 'Activo' : user.status === 'suspended' ? 'Suspendido' : 'Pendiente'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>{user.lastActivity}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label="Editar permisos">
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
        title="Editar Permisos de Usuario"
        size="md"
      >
        {selectedUser && (
          <Stack gap="md">
            <Alert icon={<IconAlertCircle size={16} />} color="blue">
              Editando permisos para: <strong>{selectedUser.name}</strong>
            </Alert>

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Permisos de Envío</Text>
            <Switch
              label="Permitir envío de preguntas"
              description="El usuario puede enviar preguntas para revisión del administrador"
              checked={selectedUser.canSubmitQuestions}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canSubmitQuestions: event.currentTarget.checked
              })}
            />

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Permisos de Acceso</Text>
            <Switch
              label="Acceso a casos clínicos"
              description="El usuario puede acceder al módulo de casos clínicos"
              checked={selectedUser.canAccessClinicalCases}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canAccessClinicalCases: event.currentTarget.checked
              })}
            />

            <Text fw={500} style={{ color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b' }}>Permisos de Funciones</Text>
            <Switch
              label="Acceso a estadísticas"
              description="El usuario puede ver estadísticas personales y análisis"
              checked={selectedUser.canViewStatistics}
              onChange={(event) => setSelectedUser({
                ...selectedUser,
                canViewStatistics: event.currentTarget.checked
              })}
            />

            <Select
              label="Estado del Usuario"
              data={[
                { value: 'active', label: 'Activo' },
                { value: 'suspended', label: 'Suspendido' },
                { value: 'pending', label: 'Pendiente' }
              ]}
              value={selectedUser.status}
              onChange={(value) => setSelectedUser({
                ...selectedUser,
                status: value as 'active' | 'suspended' | 'pending'
              })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setOpened(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePermissions}>
                Guardar Cambios
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default UserPermissionsPage;
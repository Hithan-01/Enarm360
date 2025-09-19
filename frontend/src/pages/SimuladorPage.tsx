import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  Box,
  Checkbox,
  Button,
  NumberInput,
  Group,
  Divider,
} from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import PageTransition from '../components/animations/PageTransition';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import { authService } from '../services/authService';
import { examenService } from '../services/examenService';

const SimuladorPage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState(authService.getCurrentUserFromStorage());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Estado de especialidades y configuración
  const [especialidades, setEspecialidades] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);
  const [numReactivos, setNumReactivos] = useState(10);

  // Cargar especialidades desde el backend
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch('/api/especialidades', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEspecialidades(data);
      } catch (error) {
        console.error('Error cargando especialidades', error);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };
const handleGenerarExamen = async () => {
  try {
    if (!user?.id) {
      alert("Usuario no autenticado");
      return;
    }
    if (selectedEspecialidades.length === 0) {
      alert("Selecciona al menos una especialidad");
      return;
    }

    const examen = await examenService.generarExamen(
      selectedEspecialidades,
      numReactivos,
      user.id
    );

    if (!examen || !examen.id) {
      alert("No se pudo generar el examen. Verifica que existan reactivos en la especialidad.");
      return;
    }

    navigate(`/examen/${examen.id}`);
  } catch (error) {
    console.error("Error generando examen:", error);
    alert("Ocurrió un error al generar el examen");
  }
};

  return (
    <PageTransition type="medical" duration={800}>
      <Box style={{ minHeight: '100vh', display: 'flex' }}>
        {/* Sidebar */}
        <Sidebar
          user={{
            username: user?.username || '',
            email: user?.email || '',
            roles: user?.roles || [],
          }}
          onLogout={handleLogout}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Main Content */}
        <Box
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            flex: 1,
            minHeight: '100vh',
          }}
        >
          {/* TopHeader */}
          <TopHeader
            user={{
              username: user?.username || '',
              email: user?.email || '',
              roles: user?.roles || [],
            }}
            onLogout={handleLogout}
            sidebarWidth={sidebarCollapsed ? 80 : 280}
          />

          {/* Content */}
          <Box style={{ padding: '32px' }}>
            {/* Header */}
            <Box mb="xl" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Box
                style={{
                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                }}
              >
                <IconClipboardList size={32} style={{ color: '#0ea5e9' }} />
              </Box>
              <Stack gap={4}>
                <Title order={1}>Simulador de Exámenes</Title>
                <Text size="lg" c="dimmed">
                  Selecciona especialidades y genera tu examen
                </Text>
              </Stack>
            </Box>

            {/* Selección de especialidades */}
            <Box
              p="lg"
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              <Title order={3} mb="md">
                Especialidades
              </Title>
              <Checkbox.Group
                value={selectedEspecialidades.map(String)}
                onChange={(values) => setSelectedEspecialidades(values.map(Number))}
              >
                <Stack>
                  {especialidades.map((esp) => (
                    <Checkbox key={esp.id} value={String(esp.id)} label={esp.nombre} />
                  ))}
                </Stack>
              </Checkbox.Group>

              <Divider my="lg" />

              {/* Configuración del examen */}
              <Group grow>
                <NumberInput
                  label="Número de Reactivos"
                  value={numReactivos}
                  onChange={(val) => setNumReactivos(Number(val) || 0)}
                  min={1}
                />
              </Group>

              <Button fullWidth mt="xl" onClick={handleGenerarExamen}>
                Generar Examen
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};

export default SimuladorPage;

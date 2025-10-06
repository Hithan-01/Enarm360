import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title,
  Stack,
  Box,
  Button,
  NumberInput,
  Group,
  useMantineColorScheme,
  Paper,
  Badge,
  SimpleGrid,
  Divider,
  Card,
  Accordion,
  Chip,
  Avatar,
  ActionIcon,
  Grid,
} from '@mantine/core';
import {
  IconStethoscope,
  IconHeartbeat,
  IconCut,
  IconBabyCarriage,
  IconShieldCheck,
  IconVaccine,
  IconChevronDown,
} from '@tabler/icons-react';
import { authService } from '../services/authService';
import { examenService } from '../services/examenService';

const ExamenFiltrosPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [user] = useState(authService.getCurrentUserFromStorage());

  // Estado de especialidades y configuración
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);
  const [numReactivos, setNumReactivos] = useState(10);
  const [accordionValue, setAccordionValue] = useState<string[]>(["medicina", "pediatria"]);

  // Lista completa de especialidades y subespecialidades organizadas
  const especialidadesCompletas = [
    // Pediatría y relacionadas
    { id: 1, nombre: "Pediatría", categoria: "pediatria" },
    { id: 2, nombre: "Neonatología", categoria: "pediatria" },
    { id: 3, nombre: "Desarrollo y Crecimiento", categoria: "pediatria" },

    // Medicina Interna y relacionadas
    { id: 4, nombre: "Medicina Interna", categoria: "medicina" },
    { id: 5, nombre: "Neurología", categoria: "medicina" },
    { id: 6, nombre: "Cardiología", categoria: "medicina" },
    { id: 7, nombre: "Neumología", categoria: "medicina" },
    { id: 8, nombre: "Gastroenterología", categoria: "medicina" },
    { id: 9, nombre: "Nefrología", categoria: "medicina" },
    { id: 10, nombre: "Infectología", categoria: "medicina" },
    { id: 11, nombre: "Endocrinología", categoria: "medicina" },
    { id: 12, nombre: "Reumatología", categoria: "medicina" },
    { id: 13, nombre: "Hematología", categoria: "medicina" },
    { id: 14, nombre: "Dermatología", categoria: "medicina" },
    { id: 15, nombre: "Geriatría", categoria: "medicina" },
    { id: 16, nombre: "Genética", categoria: "medicina" },
    { id: 17, nombre: "Oncología", categoria: "medicina" },
    { id: 18, nombre: "Psiquiatría", categoria: "medicina" },

    // Cirugía y relacionadas
    { id: 19, nombre: "Cirugía General", categoria: "cirugia" },
    { id: 20, nombre: "Otorrinolaringología", categoria: "cirugia" },
    { id: 21, nombre: "Urología", categoria: "cirugia" },
    { id: 22, nombre: "Oftalmología", categoria: "cirugia" },
    { id: 23, nombre: "Traumatología y Ortopedia", categoria: "cirugia" },
    { id: 24, nombre: "Coloproctología", categoria: "cirugia" },

    // Ginecología y Obstetricia
    { id: 25, nombre: "Ginecología y Obstetricia", categoria: "gineco" },
    { id: 26, nombre: "Ginecología", categoria: "gineco" },
    { id: 27, nombre: "Obstetricia", categoria: "gineco" },

    // Urgencias y Emergencias
    { id: 28, nombre: "Urgencias", categoria: "urgencias" },

    // Preventiva
    { id: 30, nombre: "Vacunas", categoria: "preventiva" },
  ];

  // Función para obtener especialidades por categoría
  const getEspecialidadesPorCategoria = (categoria: string) => {
    return especialidadesCompletas.filter(esp => esp.categoria === categoria);
  };

  // Configuración de categorías con iconos y metadatos
  const categorias = {
    pediatria: {
      nombre: "Pediatría y Desarrollo",
      icon: IconBabyCarriage,
      color: "#ffb3ba",
      descripcion: "Cuidado integral infantil"
    },
    medicina: {
      nombre: "Medicina Interna",
      icon: IconStethoscope,
      color: "#bae1ff",
      descripcion: "Especialidades médicas generales"
    },
    cirugia: {
      nombre: "Especialidades Quirúrgicas",
      icon: IconCut,
      color: "#ffdfba",
      descripcion: "Procedimientos y cirugías"
    },
    gineco: {
      nombre: "Ginecología y Obstetricia",
      icon: IconHeartbeat,
      color: "#ffffba",
      descripcion: "Salud femenina y reproductiva"
    },
    urgencias: {
      nombre: "Medicina de Urgencias",
      icon: IconShieldCheck,
      color: "#ffb3ff",
      descripcion: "Atención médica inmediata"
    },
    preventiva: {
      nombre: "Medicina Preventiva",
      icon: IconVaccine,
      color: "#d4bfff",
      descripcion: "Prevención y promoción de salud"
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
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        style={{
          padding: '20px 32px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
        }}
      >
      {/* Page Header */}
      <Group justify="space-between" align="flex-start" mb="md">
        <Box>
          <Title
            order={3}
            size="h4"
            fw={600}
            style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              marginBottom: '4px',
              textAlign: 'left',
            }}
          >
            Arma tu Examen
          </Title>
          <Text
            size="xs"
            style={{
              color: colorScheme === 'dark' ? '#64748b' : '#6b7280',
              fontFamily: 'Inter, sans-serif',
              opacity: 0.7,
              textAlign: 'left',
            }}
          >
            Configura tu examen personalizado seleccionando especialidades y número de preguntas
          </Text>
        </Box>

        {/* Back Button */}
        <Button
          variant="subtle"
          onClick={() => navigate('/estudiante/simulador')}
          size="sm"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            backgroundColor: 'transparent',
            fontSize: '16px',
            fontWeight: 400,
            padding: '8px',
            minWidth: 'auto',
          }}
        >
          ←
        </Button>
      </Group>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column - Especialidades (smaller) */}
        <Grid.Col span={6}>
          <Stack gap="md">
            {/* Título de Especialidades */}
            <Group justify="space-between" align="center">
              <Text
                size="md"
                fw={600}
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                Selecciona Especialidades
              </Text>
              <Group gap="xs">
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setAccordionValue(Object.keys(categorias))}
                  style={{
                    fontSize: '11px',
                    color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  }}
                >
                  Expandir Todo
                </Button>
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => setAccordionValue([])}
                  style={{
                    fontSize: '11px',
                    color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  }}
                >
                  Colapsar Todo
                </Button>
              </Group>
            </Group>

            {/* Accordion de Especialidades */}
            <Accordion
              multiple
              value={accordionValue}
              onChange={setAccordionValue}
              chevron={<IconChevronDown size={16} />}
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(247, 243, 238, 0.9)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                borderRadius: '12px',
              }}
              styles={{
                chevron: {
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  transition: 'transform 200ms ease',
                },
                control: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '12px 16px',
                  '&:hover': {
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(160, 142, 115, 0.1)',
                  },
                },
                panel: {
                  padding: '0 16px 16px 16px',
                },
                item: {
                  border: 'none',
                  borderBottom: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                },
              }}
            >
              {Object.entries(categorias).map(([categoriaKey, categoria]) => {
                const especialidadesCategoria = getEspecialidadesPorCategoria(categoriaKey);
                if (especialidadesCategoria.length === 0) return null;

                const Icon = categoria.icon;
                const selectedCount = especialidadesCategoria.filter(esp =>
                  selectedEspecialidades.includes(esp.id)
                ).length;

                return (
                  <Accordion.Item key={categoriaKey} value={categoriaKey}>
                    <Accordion.Control>
                      <Group justify="space-between" wrap="nowrap" style={{ width: '100%' }}>
                        <Group gap="sm" wrap="nowrap">
                          <Avatar
                            size="sm"
                            style={{
                              backgroundColor: colorScheme === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : categoria.color + '40',
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                            }}
                          >
                            <Icon size={16} />
                          </Avatar>
                          <Box style={{ flex: 1 }}>
                            <Text
                              size="sm"
                              fw={600}
                              style={{
                                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {categoria.nombre}
                            </Text>
                            <Text
                              size="xs"
                              style={{
                                color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                                fontFamily: 'Inter, sans-serif',
                              }}
                            >
                              {categoria.descripcion}
                            </Text>
                          </Box>
                        </Group>
                        <Badge
                          size="sm"
                          variant={selectedCount > 0 ? "filled" : "outline"}
                          style={{
                            backgroundColor: selectedCount > 0
                              ? colorScheme === 'dark' ? '#0ea5e9' : '#2563eb'
                              : 'transparent',
                            borderColor: colorScheme === 'dark' ? '#0ea5e9' : '#2563eb',
                            color: selectedCount > 0
                              ? '#ffffff'
                              : colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                          }}
                        >
                          {selectedCount}/{especialidadesCategoria.length}
                        </Badge>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Group gap="xs">
                        {especialidadesCategoria.map((esp) => {
                          const isSelected = selectedEspecialidades.includes(esp.id);
                          return (
                            <Button
                              key={esp.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedEspecialidades(prev => prev.filter(id => id !== esp.id));
                                } else {
                                  setSelectedEspecialidades(prev => [...prev, esp.id]);
                                }
                              }}
                              size="xs"
                              variant={isSelected ? "filled" : "outline"}
                              style={{
                                backgroundColor: isSelected
                                  ? colorScheme === 'dark' ? '#0ea5e9' : '#2563eb'
                                  : 'transparent',
                                borderColor: isSelected
                                  ? colorScheme === 'dark' ? '#0ea5e9' : '#2563eb'
                                  : colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.4)',
                                color: isSelected
                                  ? '#ffffff'
                                  : colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                                fontSize: '11px',
                                fontWeight: isSelected ? 600 : 500,
                                fontFamily: 'Inter, sans-serif',
                                borderRadius: '16px',
                                padding: '6px 12px',
                                minHeight: 'auto',
                                height: 'auto',
                              }}
                            >
                              {esp.nombre}
                            </Button>
                          );
                        })}
                      </Group>
                    </Accordion.Panel>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Stack>
        </Grid.Col>

        {/* Right Column - Configuration & Summary */}
        <Grid.Col span={6}>
          <Stack gap="md" style={{ marginTop: '46px' }}>
            {/* Configuration Card */}
            <Card
              padding="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(30, 41, 59, 0.7)'
                  : 'rgba(247, 243, 238, 0.9)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
                borderRadius: '12px',
              }}
            >
              <Text
                size="md"
                fw={600}
                mb="md"
                style={{
                  color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                Configuración
              </Text>

              <NumberInput
                label="Número de Reactivos"
                description="Entre 5 y 50 preguntas"
                value={numReactivos}
                onChange={(val) => setNumReactivos(Number(val) || 10)}
                min={5}
                max={50}
                size="md"
                styles={{
                  root: {
                    textAlign: 'left',
                  },
                  label: {
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    textAlign: 'left',
                  },
                  description: {
                    color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    textAlign: 'left',
                  },
                  input: {
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(242, 237, 230, 0.5)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                    textAlign: 'left',
                  },
                }}
              />
            </Card>

            {/* Summary Card */}
            <Card
              padding="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(14, 165, 233, 0.08)'
                  : 'rgba(160, 142, 115, 0.1)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(160, 142, 115, 0.3)'}`,
                borderRadius: '12px',
              }}
            >
              <Text
                size="md"
                fw={600}
                mb="md"
                style={{
                  color: colorScheme === 'dark' ? '#0ea5e9' : '#8b7355',
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                }}
              >
                Resumen
              </Text>

              <Stack gap="sm" style={{ textAlign: 'left' }}>
                <Group justify="space-between">
                  <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>
                    Especialidades:
                  </Text>
                  <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
                    {selectedEspecialidades.length}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>
                    Preguntas:
                  </Text>
                  <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
                    {numReactivos}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>
                    Tiempo estimado:
                  </Text>
                  <Text size="sm" fw={600} style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
                    {Math.ceil(numReactivos * 1.5)} min
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Generate Button */}
            <Button
              fullWidth
              size="lg"
              onClick={handleGenerarExamen}
              disabled={selectedEspecialidades.length === 0}
              style={{
                backgroundColor: selectedEspecialidades.length > 0
                  ? colorScheme === 'dark' ? '#0ea5e9' : '#8b7355'
                  : '#6b7280',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
                padding: '16px 24px',
              }}
            >
              Generar Examen Personalizado
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
      </Box>

      {/* Sticky Footer */}
      <Box
        style={{
          borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(247, 243, 238, 0.8)',
          marginTop: 'auto',
        }}
      >
        <Text
          size="xs"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          © 2024 ENARM360. Todos los derechos reservados.
        </Text>
      </Box>
    </Box>
  );
};

export default ExamenFiltrosPage;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Title,
  Text,
  Paper,
  Stack,
  Group,
  Badge,
  Button,
  useMantineColorScheme,
  Grid,
  Progress,
  Divider,
  Center,
  Flex,
} from "@mantine/core";
import { examenService } from "../services/examenService";

interface IntentoPregunta {
  id: number;
  orden: number;
  correcta: boolean;
  respondida: boolean;
  tiempoSeg: number;
  enunciadoSnap: string;
  explicacionSnap: string;
  respuestaSeleccionada: string; // a, b, c, d
  respuestaCorrecta: string;     // a, b, c, d
  opciones?: Record<string, string>; // { a: "...", b: "...", c: "...", d: "..." }
  numeroSecuencial?: number; // Numeración 1, 2, 3...
}

const ResultadosPage: React.FC = () => {
  const { intentoId } = useParams<{ intentoId: string }>();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const [respuestas, setRespuestas] = useState<IntentoPregunta[]>([]);

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const data = await examenService.getRespuestasDeIntento(Number(intentoId));

        // Eliminar duplicados basados en el ID de la pregunta
        const respuestasUnicas = data.filter((pregunta: IntentoPregunta, index: number, self: IntentoPregunta[]) =>
          index === self.findIndex((p: IntentoPregunta) => p.id === pregunta.id)
        );

        // Ordenar por orden original y agregar numeración secuencial
        const respuestasOrdenadas = respuestasUnicas
          .sort((a: IntentoPregunta, b: IntentoPregunta) => a.orden - b.orden)
          .map((pregunta: IntentoPregunta, index: number) => ({
            ...pregunta,
            numeroSecuencial: index + 1 // Agregar numeración 1, 2, 3...
          }));


        setRespuestas(respuestasOrdenadas);
      } catch (error) {
        console.error("Error cargando respuestas", error);
      }
    };
    fetchRespuestas();
  }, [intentoId]);

  if (!respuestas.length) return <Text>Cargando resultados del examen...</Text>;

  // === Resumen general ===
  const correctas = respuestas.filter((r) => r.correcta).length;
  const incorrectas = respuestas.filter((r) => r.respondida && !r.correcta).length;
  const enBlanco = respuestas.filter((r) => !r.respondida).length;
  const tiempoTotal = respuestas.reduce((acc, r) => acc + (r.tiempoSeg || 0), 0);


  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}m ${sec}s`;
  };

  const porcentajeCorrectas = respuestas.length > 0 ? (correctas / respuestas.length) * 100 : 0;
  const totalPreguntas = respuestas.length;

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
        padding: '32px',
      }}
    >
      {/* Header con título */}
      <Paper
        p="xl"
        mb="xl"
        style={{
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <Title
          order={1}
          mb="md"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Space Grotesk, Inter, sans-serif',
            fontSize: '32px',
          }}
        >
          📊 Resultados del Examen
        </Title>
        <Text
          size="lg"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Análisis detallado de tu desempeño
        </Text>
      </Paper>

      {/* Panel de estadísticas principales */}
      <Paper
        p="xl"
        mb="xl"
        style={{
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          borderRadius: '16px',
        }}
      >
        <Text
          size="xl"
          fw={700}
          mb="lg"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
          }}
        >
          Resumen General
        </Text>

        {/* Indicador circular de puntuación */}
        <Center mb="xl">
          <Box style={{ position: 'relative', width: '120px', height: '120px' }}>
            <Center
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: colorScheme === 'dark'
                  ? porcentajeCorrectas >= 70 ? 'rgba(34, 197, 94, 0.2)' : porcentajeCorrectas >= 50 ? 'rgba(251, 146, 60, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                  : porcentajeCorrectas >= 70 ? 'rgba(34, 197, 94, 0.1)' : porcentajeCorrectas >= 50 ? 'rgba(251, 146, 60, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `3px solid ${
                  porcentajeCorrectas >= 70
                    ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                    : porcentajeCorrectas >= 50
                    ? (colorScheme === 'dark' ? '#fb923c' : '#ea580c')
                    : (colorScheme === 'dark' ? '#ef4444' : '#dc2626')
                }`,
              }}
            >
              <Box style={{ textAlign: 'center' }}>
                <Text
                  size="xl"
                  fw={900}
                  style={{
                    color: porcentajeCorrectas >= 70
                      ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                      : porcentajeCorrectas >= 50
                      ? (colorScheme === 'dark' ? '#fb923c' : '#ea580c')
                      : (colorScheme === 'dark' ? '#ef4444' : '#dc2626'),
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '24px',
                  }}
                >
                  {Math.round(porcentajeCorrectas)}%
                </Text>
                <Text
                  size="xs"
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Aciertos
                </Text>
              </Box>
            </Center>
          </Box>
        </Center>

        {/* Estadísticas en grid */}
        <Grid>
          <Grid.Col span={6}>
            <Paper
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Text
                size="sm"
                mb="xs"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Correctas
              </Text>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: colorScheme === 'dark' ? '#22c55e' : '#16a34a',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {correctas}
              </Text>
              <Progress
                value={(correctas / totalPreguntas) * 100}
                color="green"
                size="sm"
                mt="xs"
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Text
                size="sm"
                mb="xs"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Incorrectas
              </Text>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: colorScheme === 'dark' ? '#ef4444' : '#dc2626',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {incorrectas}
              </Text>
              <Progress
                value={(incorrectas / totalPreguntas) * 100}
                color="red"
                size="sm"
                mt="xs"
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Text
                size="sm"
                mb="xs"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                En Blanco
              </Text>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {enBlanco}
              </Text>
              <Progress
                value={(enBlanco / totalPreguntas) * 100}
                color="gray"
                size="sm"
                mt="xs"
              />
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <Text
                size="sm"
                mb="xs"
                style={{
                  color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Total Preguntas
              </Text>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {totalPreguntas}
              </Text>
              {tiempoTotal > 0 && (
                <Text
                  size="xs"
                  mt="xs"
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {formatTime(tiempoTotal)}
                </Text>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Análisis detallado por pregunta */}
      <Paper
        p="xl"
        mb="xl"
        style={{
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          borderRadius: '16px',
        }}
      >
        <Text
          size="xl"
          fw={700}
          mb="lg"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          📝 Análisis Detallado
        </Text>

        <Stack gap="lg">
          {respuestas.map((r, index) => (
            <Paper
              key={r.id}
              p="lg"
              style={{
                backgroundColor: colorScheme === 'dark'
                  ? 'rgba(15, 23, 42, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
                border: `2px solid ${
                  r.correcta
                    ? (colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)')
                    : (colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')
                }`,
                borderRadius: '12px',
                position: 'relative',
              }}
            >
              {/* Indicador de número de pregunta */}
              <Center
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '16px',
                  width: '32px',
                  height: '24px',
                  backgroundColor: r.correcta
                    ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                    : (colorScheme === 'dark' ? '#ef4444' : '#dc2626'),
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {r.numeroSecuencial || (index + 1)}
              </Center>

              <Box mt="xs">
                <Group justify="space-between" mb="md">
                  <Text
                    fw={600}
                    size="lg"
                    style={{
                      color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.5,
                    }}
                  >
                    {r.enunciadoSnap}
                  </Text>
                  <Badge
                    size="lg"
                    style={{
                      backgroundColor: r.correcta
                        ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                        : (colorScheme === 'dark' ? '#ef4444' : '#dc2626'),
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  >
                    {r.correcta ? "✓ Correcta" : "✗ Incorrecta"}
                  </Badge>
                </Group>

                {/* Opciones de respuesta */}
                <Stack gap="sm" mb="md">
                  {r.opciones && Object.entries(r.opciones).map(([key, texto]) => {
                    const isSeleccionada = r.respuestaSeleccionada === key;
                    const isCorrecta = r.respuestaCorrecta === key;

                    return (
                      <Paper
                        key={key}
                        p="sm"
                        style={{
                          backgroundColor: isCorrecta
                            ? (colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)')
                            : isSeleccionada
                            ? (colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
                            : 'transparent',
                          border: isCorrecta
                            ? `1px solid ${colorScheme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
                            : isSeleccionada
                            ? `1px solid ${colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`
                            : `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.3)'}`,
                          borderRadius: '8px',
                        }}
                      >
                        <Flex align="center" gap="md">
                          <Center
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: isCorrecta
                                ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                                : isSeleccionada
                                ? (colorScheme === 'dark' ? '#ef4444' : '#dc2626')
                                : (colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                              color: isCorrecta || isSeleccionada ? '#ffffff' : (colorScheme === 'dark' ? '#9ca3af' : '#6b7280'),
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {key.toUpperCase()}
                          </Center>
                          <Text
                            style={{
                              color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                              fontFamily: 'Inter, sans-serif',
                              flex: 1,
                            }}
                          >
                            {texto}
                          </Text>
                          {isSeleccionada && (
                            <Badge size="sm" variant="outline" color={isCorrecta ? "green" : "red"}>
                              Tu elección
                            </Badge>
                          )}
                          {isCorrecta && (
                            <Badge size="sm" color="green">
                              Correcta
                            </Badge>
                          )}
                        </Flex>
                      </Paper>
                    );
                  })}
                </Stack>

                {/* Explicación */}
                {r.explicacionSnap && (
                  <>
                    <Divider my="md" />
                    <Box
                      p="md"
                      style={{
                        backgroundColor: colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
                        borderRadius: '8px',
                      }}
                    >
                      <Text
                        fw={600}
                        mb="xs"
                        style={{
                          color: colorScheme === 'dark' ? '#60a5fa' : '#3b82f6',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                        }}
                      >
                        💡 Explicación:
                      </Text>
                      <Text
                        style={{
                          color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: 1.5,
                        }}
                      >
                        {r.explicacionSnap}
                      </Text>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Botón para volver */}
      <Center>
        <Button
          onClick={() => navigate("/estudiante/simulador")}
          size="lg"
          style={{
            backgroundColor: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            padding: '16px 32px',
          }}
        >
          🏠 Volver al Simulador
        </Button>
      </Center>
    </Box>
  );
};

export default ResultadosPage;

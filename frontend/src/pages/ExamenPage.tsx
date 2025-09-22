import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Title,
  Text,
  Radio,
  Button,
  Stack,
  Group,
  Paper,
  Progress,
  Badge,
  useMantineColorScheme,
  Flex,
  Center,
} from "@mantine/core";
import { authService } from "../services/authService";
import { examenService } from "../services/examenService";

// =======================
// Tipos según ExamenDTO
// =======================
interface ExamenPregunta {
  id: number;
  orden: number;
  puntaje: number;
  reactivoId: number;
  reactivoTexto: string;
  respuestaA: string;
  respuestaB: string;
  respuestaC: string;
  respuestaD: string;
}

interface Examen {
  id: number;
  nombre: string;
  descripcion: string;
  preguntas: ExamenPregunta[];
}

const ExamenPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  const [examen, setExamen] = useState<Examen | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [intentoId, setIntentoId] = useState<number | null>(null);

  // índice de la pregunta actual
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Timer
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // =======================
  // Cargar examen e iniciar intento
  // =======================
  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const examenData = await examenService.getExamen(Number(id));
        setExamen(examenData);

        const intento = await examenService.iniciarIntento(
          Number(id),
          authService.getCurrentUserFromStorage()?.id!
        );
        setIntentoId(intento.id);

        setStartTime(Date.now());
        setIsRunning(true);
      } catch (error) {
        console.error("Error cargando examen", error);
      }
    };
    fetchExamen();
  }, [id]);

  // =======================
  // Temporizador
  // =======================
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // =======================
  // Responder reactivo
  // =======================
 const handleResponder = (reactivoId: number, respuesta: string) => {
  setRespuestas((prev) => ({ ...prev, [reactivoId]: respuesta }));
};

  // =======================
  // Navegación preguntas
  // =======================
  const handleNext = () => {
    if (!examen) return;
    if (currentIndex < examen.preguntas.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // =======================
  // Finalizar intento
  // =======================
 const handleFinalizar = async () => {
  if (!intentoId) return;
  setIsRunning(false);
  try {
   
    await examenService.enviarRespuestas(intentoId, respuestas);

    const res = await examenService.finalizarIntento(intentoId);

    alert(
      `Correctas: ${res.correctas}, Incorrectas: ${res.incorrectas}, Tiempo: ${formatTime(elapsed)}`
    );
   navigate(`/examenes/${intentoId}/resultado`);

  } catch (error) {
    console.error("Error al finalizar examen", error);
  }
};


  if (!examen) return <Text>Cargando examen...</Text>;

  if (!examen.preguntas || examen.preguntas.length === 0) {
    return <Text>No hay preguntas disponibles en este examen.</Text>;
  }

  const preguntaActual = examen.preguntas[currentIndex];

  if (!preguntaActual) {
    return <Text>Error: pregunta no encontrada.</Text>;
  }

  const respuestaSeleccionada = respuestas[preguntaActual.reactivoId] || "";
  const progressPercentage = ((currentIndex + 1) / examen.preguntas.length) * 100;
  const totalRespuestas = Object.keys(respuestas).length;

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
        padding: '16px',
      }}
    >
      {/* Header con información del examen */}
      <Paper
        p="md"
        mb="md"
        style={{
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          borderRadius: '12px',
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title
              order={2}
              mb="xs"
              style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                fontSize: '20px',
              }}
            >
              {examen.nombre}
            </Title>
            <Text
              size="xs"
              style={{
                color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {examen.descripcion}
            </Text>
          </Box>

          <Badge
            size="md"
            style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)',
              color: colorScheme === 'dark' ? '#38bdf8' : '#0369a1',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)'}`,
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ⏱ {formatTime(elapsed)}
          </Badge>
        </Group>
      </Paper>


      {/* Pregunta actual */}
      <Paper
        p="md"
        mb="md"
        style={{
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(30, 41, 59, 0.7)'
            : 'rgba(247, 243, 238, 0.9)',
          border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'}`,
          borderRadius: '12px',
        }}
      >
        <Text
          size="xs"
          mb="sm"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 600,
          }}
        >
          Pregunta {currentIndex + 1} de {examen.preguntas.length}
        </Text>

        <Text
          size="md"
          fw={600}
          mb="md"
          style={{
            color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {preguntaActual.reactivoTexto}
        </Text>

        <Radio.Group
          value={respuestas[preguntaActual.reactivoId] ?? null}
          onChange={(val) => {
            if (val) handleResponder(preguntaActual.reactivoId, val);
          }}
        >
          <Stack gap="sm">
            {[
              { value: 'a', text: preguntaActual.respuestaA },
              { value: 'b', text: preguntaActual.respuestaB },
              { value: 'c', text: preguntaActual.respuestaC },
              { value: 'd', text: preguntaActual.respuestaD }
            ].map((opcion) => (
              <Paper
                key={opcion.value}
                p="sm"
                style={{
                  backgroundColor: respuestas[preguntaActual.reactivoId] === opcion.value
                    ? (colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
                    : (colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)'),
                  border: respuestas[preguntaActual.reactivoId] === opcion.value
                    ? `2px solid ${colorScheme === 'dark' ? '#3b82f6' : '#2563eb'}`
                    : `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Radio
                  value={opcion.value}
                  label={
                    <Text
                      style={{
                        color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    >
                      <Text component="span" fw={700} mr="xs">
                        {opcion.value.toUpperCase()})
                      </Text>
                      {opcion.text}
                    </Text>
                  }
                  style={{ width: '100%' }}
                />
              </Paper>
            ))}
          </Stack>
        </Radio.Group>
      </Paper>

      {/* Botones de navegación */}
      <Group justify="space-between" mb="md">
        <Button
          variant="subtle"
          size="sm"
          disabled={currentIndex === 0}
          onClick={handlePrev}
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            backgroundColor: colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(209, 213, 219, 0.3)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          ← Anterior
        </Button>

        {currentIndex < examen.preguntas.length - 1 ? (
          <Button
            size="sm"
            onClick={handleNext}
            disabled={!respuestaSeleccionada}
            style={{
              backgroundColor: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            Siguiente →
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleFinalizar}
            disabled={!respuestaSeleccionada}
            style={{
              backgroundColor: colorScheme === 'dark' ? '#dc2626' : '#ef4444',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            Finalizar Examen ✓
          </Button>
        )}
      </Group>

      {/* Círculos indicadores de preguntas */}
      <Box mb="md">
        <Flex wrap="wrap" gap="xs" justify="center">
          {examen.preguntas.map((pregunta, index) => {
            const isAnswered = respuestas[pregunta.reactivoId];
            const isCurrent = index === currentIndex;

            return (
              <Center
                key={pregunta.id}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent
                    ? (colorScheme === 'dark' ? '#3b82f6' : '#2563eb')
                    : isAnswered
                    ? (colorScheme === 'dark' ? '#22c55e' : '#16a34a')
                    : (colorScheme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(209, 213, 219, 0.5)'),
                  color: (isCurrent || isAnswered) ? '#ffffff' : (colorScheme === 'dark' ? '#9ca3af' : '#6b7280'),
                  fontSize: '12px',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isCurrent ? '2px solid rgba(255, 255, 255, 0.8)' : '1px solid transparent',
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </Center>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default ExamenPage;

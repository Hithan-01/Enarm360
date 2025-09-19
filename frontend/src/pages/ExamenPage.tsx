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

  const preguntaActual = examen.preguntas[currentIndex];
  const respuestaSeleccionada = respuestas[preguntaActual.reactivoId] || "";

  return (
    <Box p="xl">
      {/* Encabezado */}
      <Group justify="space-between" mb="lg">
        <Title order={2}>{examen.nombre}</Title>
        <Text fw={600} c="blue">
          ⏱ Tiempo: {formatTime(elapsed)}
        </Text>
      </Group>

      {/* Indicador de progreso */}
      <Text mb="sm" fw={500}>
        Pregunta {currentIndex + 1} de {examen.preguntas.length}
      </Text>

      {/* Pregunta actual */}
    {/* Pregunta actual */}
<Paper key={preguntaActual.id} p="md" shadow="sm" withBorder>
  <Text fw={600}>
    {preguntaActual.orden}. {preguntaActual.reactivoTexto}
  </Text>
 <Radio.Group
  value={respuestas[preguntaActual.reactivoId] ?? null}
  onChange={(val) => {
    if (val) handleResponder(preguntaActual.reactivoId, val);
  }}
>
  <Stack mt="sm">
    <Radio value="a" label={`A) ${preguntaActual.respuestaA}`} />
    <Radio value="b" label={`B) ${preguntaActual.respuestaB}`} />
    <Radio value="c" label={`C) ${preguntaActual.respuestaC}`} />
    <Radio value="d" label={`D) ${preguntaActual.respuestaD}`} />
  </Stack>
</Radio.Group>
</Paper>


      {/* Botones navegación */}
      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          disabled={currentIndex === 0}
          onClick={handlePrev}
        >
          Anterior
        </Button>

        {currentIndex < examen.preguntas.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!respuestaSeleccionada} // ⛔ deshabilitado hasta que responda
          >
            Siguiente
          </Button>
        ) : (
          <Button
            color="red"
            onClick={handleFinalizar}
            disabled={!respuestaSeleccionada} // ⛔ igual en la última
          >
            Finalizar Examen
          </Button>
        )}
      </Group>
    </Box>
  );
};

export default ExamenPage;

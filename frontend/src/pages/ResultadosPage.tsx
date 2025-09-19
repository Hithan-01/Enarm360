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
}

const ResultadosPage: React.FC = () => {
  const { intentoId } = useParams<{ intentoId: string }>();
  const navigate = useNavigate();
  const [respuestas, setRespuestas] = useState<IntentoPregunta[]>([]);

  useEffect(() => {
    const fetchRespuestas = async () => {
      try {
        const data = await examenService.getRespuestasDeIntento(Number(intentoId));
        setRespuestas(data);
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

  return (
    <Box p="xl">
      <Title order={2} mb="lg">Resultados del Examen</Title>

      {/* Resumen */}
      <Group mb="xl" justify="center">
        <Badge color="green" size="lg">Correctas: {correctas}</Badge>
        <Badge color="red" size="lg">Incorrectas: {incorrectas}</Badge>
        <Badge color="gray" size="lg">En blanco: {enBlanco}</Badge>
        <Badge color="blue" size="lg">Tiempo total: {formatTime(tiempoTotal)}</Badge>
      </Group>

      {/* Repaso pregunta por pregunta */}
      <Stack>
        {respuestas.map((r) => (
          <Paper key={r.id} p="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="sm">
              <Text fw={600}>{r.orden}. {r.enunciadoSnap}</Text>
              <Badge color={r.correcta ? "green" : "red"}>
                {r.correcta ? "Correcta" : "Incorrecta"}
              </Badge>
            </Group>

            {/* Opciones */}
            <Stack>
              {r.opciones && Object.entries(r.opciones).map(([key, texto]) => {
                const isSeleccionada = r.respuestaSeleccionada === key;
                const isCorrecta = r.respuestaCorrecta === key;
                return (
                  <Text
                    key={key}
                    style={{
                      fontWeight: isCorrecta ? "bold" : "normal",
                      color: isCorrecta
                        ? "green"
                        : isSeleccionada
                        ? "red"
                        : "black",
                    }}
                  >
                    {key.toUpperCase()}) {texto}
                    {isSeleccionada && " ← Tu elección"}
                    {isCorrecta && " ✅ Correcta"}
                  </Text>
                );
              })}
            </Stack>

            {/* Explicación */}
            {r.explicacionSnap && (
              <Text size="sm" mt="xs">
                <b>Explicación:</b> {r.explicacionSnap}
              </Text>
            )}

            {/* Tiempo en esta pregunta */}
            <Text size="xs" c="dimmed" mt="xs">
              Tiempo en la pregunta: {r.tiempoSeg || 0}s
            </Text>
          </Paper>
        ))}
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button onClick={() => navigate("/estudiante/simulador")}>
          Volver al simulador
        </Button>
      </Group>
    </Box>
  );
};

export default ResultadosPage;

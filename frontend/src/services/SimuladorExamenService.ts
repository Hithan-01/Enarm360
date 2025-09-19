import axios from "axios";
import { authService } from "./authService";

const API_URL = "/api/examenes"; // con proxy en package.json va al backend

export const examenService = {
  generarExamen,
  iniciarIntento,
  responderPregunta,
  finalizarIntento,
};

// 1. Generar examen
async function generarExamen(
  especialidadIds: number[],
  numReactivos: number,
  numCasos: number,
  tiempoMin: number,
  usuarioId: number
) {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/generar`,
    { especialidadIds, numReactivos, numCasos, tiempoMin, usuarioId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// 2. Iniciar intento
async function iniciarIntento(examenId: number, usuarioId: number) {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/${examenId}/iniciar`,
    { usuarioId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// 3. Responder pregunta
async function responderPregunta(
  intentoId: number,
  preguntaId: number,
  opcionId: number
) {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/responder`,
    { intentoId, preguntaId, opcionId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// 4. Finalizar intento
async function finalizarIntento(intentoId: number) {
  const token = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_URL}/${intentoId}/finalizar`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

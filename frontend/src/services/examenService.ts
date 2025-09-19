// src/services/examenService.ts
import api from "./api";
import { Examen } from "../Models/examen";

const API_URL = "/examenes";

export const examenService = {
  generarExamen,
  getExamen,
  iniciarIntento,
  responderReactivo,
  finalizarIntento,
  getRespuestasDeIntento,
  enviarRespuestas,
};

// Generar examen
async function generarExamen(
  especialidades: number[],
  numReactivos: number,
  usuarioId: number
): Promise<Examen> {
  const res = await api.post(`${API_URL}/generar`, {
    especialidades,
    numReactivos,
    usuarioId,
  });
  return res.data;
}

// Obtener examen con reactivos
async function getExamen(examenId: number): Promise<Examen> {
  const res = await api.get(`${API_URL}/${examenId}`);
  return res.data;
}

// Iniciar intento
async function iniciarIntento(examenId: number, usuarioId: number) {
  const res = await api.post(`${API_URL}/${examenId}/iniciar?usuarioId=${usuarioId}`);
  return res.data;
}

// Responder reactivo (si lo necesitas en tiempo real)
async function responderReactivo(intentoId: number, reactivoId: number, respuesta: string) {
  const res = await api.post(
    `${API_URL}/intentos/${intentoId}/reactivo?reactivoId=${reactivoId}&respuesta=${respuesta}`
  );
  return res.data;
}

// Finalizar intento
async function finalizarIntento(intentoId: number) {
  const res = await api.post(`${API_URL}/intentos/${intentoId}/finalizar`);
  return res.data;
}

// Enviar todas las respuestas en lote
async function enviarRespuestas(intentoId: number, respuestas: Record<number, string>) {
 
  const res = await api.post(`/examenes/intentos/${intentoId}/respuestas`, respuestas);
  return res.data; 
}

// Obtener todas las respuestas de un intento
async function getRespuestasDeIntento(intentoId: number) {
  const res = await api.get(`${API_URL}/intentos/${intentoId}/respuestas`);
  return res.data;
}

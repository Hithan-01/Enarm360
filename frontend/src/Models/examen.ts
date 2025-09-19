// =============================
// ExamenPreguntaDTO
// =============================
export interface ExamenPregunta {
  id: number;
  orden: number;
  puntaje: number;
  examenId: number;
  reactivoId: number;
  reactivoTexto: string;

  // Opciones de respuesta
  respuestaA: string;
  respuestaB: string;
  respuestaC: string;
  respuestaD: string;
}

// =============================
// ExamenDTO
// =============================
export interface Examen {
  id: number;
  nombre: string;
  descripcion: string;
  creadoEn?: string; // LocalDateTime → llega como string en JSON
  tiempoLimiteMin?: number | null;
  preguntas: ExamenPregunta[];
}

// =============================
// IntentoExamenDTO
// =============================
export interface IntentoExamen {
  id: number;
  examenId: number;
  examenNombre: string;
  correctas: number;
  incorrectas: number;
  enBlanco: number;
  puntajeTotal: number;
  duracionSeg: number;
  iniciadoEn: string;
  finalizadoEn: string;
}

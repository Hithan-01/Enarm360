import axios from 'axios';

export interface NotificationDTO {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'SISTEMA' | 'FORO' | 'EXAMEN' | 'PAGO' | 'ALERTA';
  leida: boolean;
  guardada?: boolean;
  metadata?: Record<string, any>;
  creadoEn: string;
  creador?: {
    id: number;
    username: string;
    nombre?: string;
    apellidos?: string;
    email: string;
  };
}

const BASE = '/api/notificaciones';

class NotificationService {
  async getMyNotifications(page = 0, size = 20): Promise<NotificationDTO[]> {
    const { data } = await axios.get<NotificationDTO[]>(`${BASE}/mias`, {
      params: { page, size },
    });
    return data;
  }

  async getUnreadCount(): Promise<number> {
    const { data } = await axios.get<{ unread: number }>(`${BASE}/mias/count`);
    return data.unread ?? 0;
  }

  async markAsRead(id: number): Promise<void> {
    await axios.patch(`${BASE}/${id}/leer`);
  }

  // No-op mientras el backend no tiene soporte; deja la UI funcionando sin error
  async setSaved(_id: number, _valor: boolean): Promise<void> {
    return Promise.resolve();
  }

  // Crear notificación individual (ADMIN)
  async create(params: {
    destinatarioId: number;
    titulo: string;
    mensaje: string;
    tipo: NotificationDTO['tipo'];
    metadata?: Record<string, any>;
  }): Promise<NotificationDTO> {
    const { data } = await axios.post<NotificationDTO>(`${BASE}`, params);
    return data;
  }

  // Broadcast (ADMIN): crear para todos
  async broadcast(params: {
    titulo: string;
    mensaje: string;
    tipo: NotificationDTO['tipo'];
    metadata?: Record<string, any>;
  }): Promise<{ created: number }> {
    const { data } = await axios.post<{ created: number }>(`${BASE}/broadcast`, params);
    return data;
  }
}

export const notificationService = new NotificationService();
export default notificationService;

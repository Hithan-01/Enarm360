import axios from 'axios';

export interface UsuarioPermisosDTO {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  activo: boolean;
  roles: string[];
  directPermisos: string[];
  effectivePermisos: string[];
}

export interface PermisoDTO {
  id: number;
  codigo: string;
  descripcion?: string;
}

class AdminPermissionsService {
  async listPermisos(): Promise<PermisoDTO[]> {
    const { data } = await axios.get<PermisoDTO[]>(`/api/admin/permisos`);
    return data;
  }

  async seedPermisos(): Promise<PermisoDTO[]> {
    const { data } = await axios.post<PermisoDTO[]>(`/api/admin/permisos/seed`);
    return data;
  }

  async getUsuarioPermisos(userId: number): Promise<UsuarioPermisosDTO> {
    const { data } = await axios.get<UsuarioPermisosDTO>(`/api/admin/usuarios/${userId}/permisos`);
    return data;
  }

  async setActivo(userId: number, activo: boolean): Promise<UsuarioPermisosDTO> {
    const { data } = await axios.patch<UsuarioPermisosDTO>(`/api/admin/usuarios/${userId}/activo`, { activo });
    return data;
  }

  async grant(userId: number, codigo: string): Promise<UsuarioPermisosDTO> {
    const { data } = await axios.post<UsuarioPermisosDTO>(`/api/admin/usuarios/${userId}/permisos`, { codigo });
    return data;
  }

  async revoke(userId: number, codigo: string): Promise<UsuarioPermisosDTO> {
    const { data } = await axios.delete<UsuarioPermisosDTO>(`/api/admin/usuarios/${userId}/permisos/${codigo}`);
    return data;
  }
  async getLogs(userId: number, limit = 20): Promise<UsuarioPermisoLogDTO[]> {
    const { data } = await axios.get(`/api/admin/usuarios/${userId}/permisos/logs`, { params: { limit } });
    return data;
  }
}

export interface UsuarioPermisoLogDTO {
  permisoCodigo: string;
  accion: string;
  actorId: number;
  actorUsername: string;
  creadoEn: string;
}

export const adminPermissionsService = new AdminPermissionsService();
export default adminPermissionsService;

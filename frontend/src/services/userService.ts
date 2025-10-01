import axios from 'axios';

export interface UserMinDTO {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  activo?: boolean;
  subscriptionStatus?: string;
  roles?: string[];
}

class UserService {
  async searchUsers(query: string, page = 0, size = 10): Promise<UserMinDTO[]> {
    const { data } = await axios.get<UserMinDTO[]>(`/api/usuarios/search`, {
      params: { query, page, size },
    });
    return data;
  }

  async adminSearchUsers(params: { query?: string; rol?: string; activo?: boolean; permiso?: string; effective?: boolean; page?: number; size?: number; }): Promise<UserMinDTO[]> {
    const { data } = await axios.get<UserMinDTO>(`/api/usuarios/admin/search`, { params });
    return data as any;
  }
}

export const userService = new UserService();
export default userService;

import axios from 'axios';

export interface UserMinDTO {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
}

class UserService {
  async searchUsers(query: string, page = 0, size = 10): Promise<UserMinDTO[]> {
    const { data } = await axios.get<UserMinDTO[]>(`/api/usuarios/search`, {
      params: { query, page, size },
    });
    return data;
  }
}

export const userService = new UserService();
export default userService;

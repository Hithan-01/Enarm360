import axios from 'axios';
import {
  UsuarioProfile,
  UpdateProfileRequest,
  UploadAvatarResponse
} from '../types/profile';

const API_BASE = '/api/perfil';

// Los interceptors de axios están configurados en authService.ts

class ProfileService {
  // ==========================================================
  // PERFIL DE USUARIO
  // ==========================================================

  async getMyProfile(): Promise<UsuarioProfile> {
    try {
      const response = await axios.get<UsuarioProfile>(`${API_BASE}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateMyProfile(profileData: UpdateProfileRequest): Promise<UsuarioProfile> {
    try {
      const response = await axios.put<UsuarioProfile>(`${API_BASE}/me`, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId: number): Promise<UsuarioProfile> {
    try {
      const response = await axios.get<UsuarioProfile>(`${API_BASE}/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==========================================================
  // AVATAR/IMAGEN DE PERFIL
  // ==========================================================

  async uploadAvatar(file: File): Promise<UsuarioProfile> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UsuarioProfile>(`${API_BASE}/me/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ==========================================================
  // UTILIDADES DE VALIDACIÓN
  // ==========================================================

  validateProfileData(profileData: Partial<UpdateProfileRequest>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (profileData.nombre && profileData.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (profileData.apellido && profileData.apellido.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    if (profileData.telefono && !/^[0-9+\-\s()]{10,15}$/.test(profileData.telefono)) {
      errors.push('El teléfono debe tener un formato válido');
    }

    if (profileData.fechaNacimiento) {
      const birthDate = new Date(profileData.fechaNacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18) {
        errors.push('Debes ser mayor de 18 años');
      }
      
      if (age > 100) {
        errors.push('Fecha de nacimiento inválida');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateAvatarFile(file: File): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
    }

    if (file.size > maxSize) {
      errors.push('El archivo no debe superar los 5MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ==========================================================
  // UTILIDADES DE FORMATO
  // ==========================================================

  formatPhoneNumber(phone: string): string {
    // Remover caracteres no numéricos excepto +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Formato básico para números mexicanos
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  }

  getAvatarUrl(avatarPath: string | null): string {
    if (!avatarPath) {
      return '/default-avatar.png'; // Imagen por defecto
    }
    
    // Si ya es una URL completa
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }
    
    // Si es un path relativo, construir URL completa
    return `/api/uploads/avatars/${avatarPath}`;
  }

  getFullName(profile: UsuarioProfile): string {
    const parts = [];
    if (profile.nombre) parts.push(profile.nombre);
    if (profile.apellido) parts.push(profile.apellido);
    return parts.join(' ') || profile.username || 'Usuario';
  }

  getInitials(profile: UsuarioProfile): string {
    const name = this.getFullName(profile);
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}

export const profileService = new ProfileService();
export default profileService;
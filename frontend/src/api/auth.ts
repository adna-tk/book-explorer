import apiClient from './client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/token/', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me/');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

/**
 * Service de usuários - implementa todos os endpoints de users da documentação
 * Refatorado para usar httpClient centralizado com autenticação
 */

import { httpClient, ApiResponse } from '../httpClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  tenantId: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'User';
  tenantId: number;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string; // opcional
  role: 'Admin' | 'User';
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: string;
}

export class UsersService {
  /**
   * POST /api/users
   * Cria um novo usuário
   */
  static async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return httpClient.post<User>('/api/users', data);
  }

  /**
   * GET /api/users/{id}
   * Busca um usuário pelo ID
   */
  static async getUser(id: number): Promise<ApiResponse<User>> {
    return httpClient.get<User>(`/api/users/${id}`);
  }

  /**
   * GET /api/users
   * Lista todos os usuários de um tenant
   */
  static async getUsers(tenantId: number): Promise<ApiResponse<UserListItem[]>> {
    return httpClient.get<UserListItem[]>(`/api/users?tenantId=${tenantId}`);
  }

  /**
   * PUT /api/users/{id}
   * Atualiza um usuário existente
   */
  static async updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return httpClient.put<User>(`/api/users/${id}`, data);
  }

  /**
   * DELETE /api/users/{id}
   * Remove um usuário
   */
  static async deleteUser(id: number): Promise<ApiResponse<string>> {
    return httpClient.delete<string>(`/api/users/${id}`);
  }
}
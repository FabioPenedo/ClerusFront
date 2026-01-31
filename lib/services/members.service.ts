/**
 * Service de membros - implementa todos os endpoints de members da documentação
 * Refatorado para usar httpClient centralizado com autenticação
 */

import { httpClient, ApiResponse } from '../httpClient';

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // datetime
  groupMember: 'Adult' | 'Child' | 'Youth';
  locality: string;
  tenantId: number;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  phone: string;
  birthDate: string; // datetime
  groupMember: 'Adult' | 'Child' | 'Youth';
  locality: string;
  tenantId: number;
}

export interface UpdateMemberRequest {
  name: string;
  email: string;
  phone: string;
  birthDate: string; // datetime
  groupMember: 'Adult' | 'Child' | 'Youth';
  locality: string;
}

export interface MemberListItem {
  id: number;
  name: string;
  email: string;
  groupMember: string;
}

export class MembersService {
  /**
   * POST /api/members
   * Cria um novo membro
   */
  static async createMember(data: CreateMemberRequest): Promise<ApiResponse<Member>> {
    return httpClient.post<Member>('/api/members', data);
  }

  /**
   * GET /api/members/{id}
   * Busca um membro pelo ID
   */
  static async getMember(id: number): Promise<ApiResponse<Member>> {
    return httpClient.get<Member>(`/api/members/${id}`);
  }

  /**
   * GET /api/members
   * Lista todos os membros de um tenant
   */
  static async getMembers(tenantId: number): Promise<ApiResponse<MemberListItem[]>> {
    return httpClient.get<MemberListItem[]>(`/api/members?tenantId=${tenantId}`);
  }

  /**
   * PUT /api/members/{id}
   * Atualiza um membro existente
   */
  static async updateMember(id: number, data: UpdateMemberRequest): Promise<ApiResponse<Member>> {
    return httpClient.put<Member>(`/api/members/${id}`, data);
  }

  /**
   * DELETE /api/members/{id}
   * Remove um membro
   */
  static async deleteMember(id: number): Promise<ApiResponse<string>> {
    return httpClient.delete<string>(`/api/members/${id}`);
  }
}
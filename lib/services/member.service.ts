import { httpClient } from '@/lib/http-client';
import { sessionStore } from '../info.store';

/* =======================
   DTOs / Tipagens
   ======================= */

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface CreateMemberDTO {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateMemberDTO {
  name?: string;
  email?: string;
  phone?: string;
}

/* =======================
   Services
   ======================= */

// 🔹 Listar todos os membros
export async function getMembers(): Promise<Member[]> {
  const session = sessionStore.get();
  if (!session) throw new Error('Sessão não encontrada');
  const tenantId = session.tenant.id;
  return httpClient.get<Member[]>('/members'+`?tenantId=${tenantId}`);
}

// 🔹 Buscar membro por ID
export async function getMemberById(id: string): Promise<Member> {
  return httpClient.get<Member>(`/members/${id}`);
}

// 🔹 Criar novo membro
export async function createMember(
  data: CreateMemberDTO
): Promise<Member> {
  return httpClient.post<Member>('/members', data);
}

// 🔹 Atualizar membro
export async function updateMember(
  id: string,
  data: UpdateMemberDTO
): Promise<Member> {
  return httpClient.put<Member>(`/members/${id}`, data);
}

// 🔹 Remover membro
export async function deleteMember(id: string): Promise<void> {
  return httpClient.delete<void>(`/members/${id}`);
}

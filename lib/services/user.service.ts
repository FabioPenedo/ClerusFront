import { httpClient } from '@/lib/http-client';
import { sessionStore } from '../info.store';

/* =======================
   DTOs / Tipagens
   ======================= */

export type UserRole = "Administrador" | "Financeiro" | "Secretário";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  tenantId: number;
}

/* =======================
   Services
   ======================= */

// 🔹 Criar novo usuário
export async function createUser(data: CreateUserDTO): Promise<User> {
  return httpClient.post<User>('/users', data);
}

// 🔹 Listar todos os usuários do tenant
export async function getUsers(): Promise<User[]> {
  const session = sessionStore.get();
  if (!session) throw new Error('Sessão não encontrada');
  const tenantId = session.tenant.id;
  return httpClient.get<User[]>(`/users?tenantId=${tenantId}`);
}

// 🔹 Obter usuário por ID
export async function getUserById(userId: number): Promise<User> {
  return httpClient.get<User>(`/users/${userId}`);
}

// 🔹 Atualizar usuário
export async function updateUser(
  userId: number,
  data: Partial<CreateUserDTO>
): Promise<User> {
  return httpClient.put<User>(`/users/${userId}`, data);
}

// 🔹 Deletar usuário
export async function deleteUser(userId: number): Promise<void> {
  return httpClient.delete<void>(`/users/${userId}`);
}

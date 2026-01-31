/**
 * Service de transações - implementa todos os endpoints de transactions da documentação
 * Refatorado para usar httpClient centralizado com autenticação
 */

import { httpClient, ApiResponse } from '../httpClient';

export interface Transaction {
  id: number;
  description: string;
  amount: number; // decimal
  date: string; // datetime
  categoryId: number;
  memberId?: number;
  tenantId: number;
}

export interface CreateTransactionRequest {
  description: string;
  amount: number; // decimal
  date: string; // datetime
  categoryId: number;
  memberId?: number; // opcional
  tenantId: number;
}

export interface UpdateTransactionRequest {
  description: string;
  amount: number; // decimal
  date: string; // datetime
  categoryId: number;
  memberId?: number; // opcional
}

export interface TransactionDetails {
  id: number;
  description: string;
  amount: number; // decimal
  date: string; // datetime
  category: {
    id: number;
    name: string;
  };
  member?: {
    id: number;
    name: string;
  };
  tenantId: number;
}

export interface TransactionListItem {
  id: number;
  description: string;
  amount: number; // decimal
  date: string; // datetime
  categoryName: string;
}

export class TransactionsService {
  /**
   * POST /api/transactions
   * Cria uma nova transação
   */
  static async createTransaction(data: CreateTransactionRequest): Promise<ApiResponse<Transaction>> {
    return httpClient.post<Transaction>('/api/transactions', data);
  }

  /**
   * GET /api/transactions/{id}
   * Busca uma transação pelo ID
   */
  static async getTransaction(id: number): Promise<ApiResponse<TransactionDetails>> {
    return httpClient.get<TransactionDetails>(`/api/transactions/${id}`);
  }

  /**
   * GET /api/transactions
   * Lista todas as transações de um tenant
   */
  static async getTransactions(tenantId: number): Promise<ApiResponse<TransactionListItem[]>> {
    return httpClient.get<TransactionListItem[]>(`/api/transactions?tenantId=${tenantId}`);
  }

  /**
   * PUT /api/transactions/{id}
   * Atualiza uma transação existente
   */
  static async updateTransaction(id: number, data: UpdateTransactionRequest): Promise<ApiResponse<Transaction>> {
    return httpClient.put<Transaction>(`/api/transactions/${id}`, data);
  }

  /**
   * DELETE /api/transactions/{id}
   * Remove uma transação
   */
  static async deleteTransaction(id: number): Promise<ApiResponse<string>> {
    return httpClient.delete<string>(`/api/transactions/${id}`);
  }
}
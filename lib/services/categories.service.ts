/**
 * Service de categorias - implementa todos os endpoints de categories da documentação
 * Baseado nas especificações do README-ENDPOINTS.md
 */

import { httpClient, ApiResponse } from '../httpClient';

export interface Category {
  id: number;
  name: string;
  typeCategory: 'Income' | 'Expense';
  tenantId: number;
  transactions?: any[]; // Array de transações relacionadas
}

export interface CreateCategoryRequest {
  name: string;
  typeCategory: 'Income' | 'Expense';
  tenantId: number;
}

export interface UpdateCategoryRequest {
  name: string;
  typeCategory: 'Income' | 'Expense';
}

export interface CategoryListItem {
  id: number;
  name: string;
  typeCategory: string;
}

export class CategoriesService {
  /**
   * POST /api/categories
   * Cria uma nova categoria
   */
  static async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    return httpClient.post<Category>('/api/categories', data);
  }

  /**
   * GET /api/categories/{id}
   * Busca uma categoria pelo ID
   */
  static async getCategory(id: number): Promise<ApiResponse<Category>> {
    return httpClient.get<Category>(`/api/categories/${id}`);
  }

  /**
   * GET /api/categories
   * Lista todas as categorias de um tenant
   */
  static async getCategories(tenantId: number): Promise<ApiResponse<CategoryListItem[]>> {
    return httpClient.get<CategoryListItem[]>(`/api/categories?tenantId=${tenantId}`);
  }

  /**
   * PUT /api/categories/{id}
   * Atualiza uma categoria existente
   */
  static async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> {
    return httpClient.put<Category>(`/api/categories/${id}`, data);
  }

  /**
   * DELETE /api/categories/{id}
   * Remove uma categoria
   */
  static async deleteCategory(id: number): Promise<ApiResponse<string>> {
    return httpClient.delete<string>(`/api/categories/${id}`);
  }
}

// Export da instância singleton para uso direto
export const categoriesService = CategoriesService;
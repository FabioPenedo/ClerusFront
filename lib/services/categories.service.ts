import { httpClient } from "@/lib/http-client";
import { sessionStore } from "../info.store";

export type CategoryType = "Income" | "Expense";

export interface Category {
  id: number;
  name: string;
  description: string;
  tenantId: number;
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
  tenantId: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}

export class CategoriesService {
  static async getCategories(tenantId?: number): Promise<Category[]> {
    const session = sessionStore.get();
    const resolvedTenantId = tenantId ?? session?.tenant.id;
    if (!resolvedTenantId) throw new Error("Sessao nao encontrada");
    return httpClient.get<Category[]>(`/categories?tenantId=${resolvedTenantId}`);
  }

  static async getCategoryById(categoryId: number): Promise<Category> {
    return httpClient.get<Category>(`/categories/${categoryId}`);
  }

  static async createCategory(data: CreateCategoryDTO): Promise<Category> {
    return httpClient.post<Category>("/categories", data);
  }

  static async updateCategory(
    categoryId: number,
    data: UpdateCategoryDTO
  ): Promise<Category> {
    return httpClient.put<Category>(`/categories/${categoryId}`, data);
  }

  static async deleteCategory(categoryId: number): Promise<void> {
    return httpClient.delete<void>(`/categories/${categoryId}`);
  }
}

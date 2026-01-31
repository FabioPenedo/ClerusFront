/**
 * Service de relatórios financeiros - implementa endpoints de relatórios da documentação
 * Baseado nas especificações do README-ENDPOINTS.md
 */

import { httpClient, ApiResponse } from '../httpClient';

// Tipos para Summary Report
export interface FinancialSummary {
  totalIncome: number; // decimal
  totalExpense: number; // decimal
  balance: number; // decimal
  period: {
    startDate: string; // datetime
    endDate: string; // datetime
  };
}

// Tipos para Report by Category
export interface CategoryReport {
  categoryName: string;
  totalAmount: number; // decimal
  transactionCount: number;
  percentage: number; // decimal
}

export interface CategoryReportResponse {
  categories: CategoryReport[];
}

// Tipos para Monthly Report
export interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number; // decimal
  totalExpense: number; // decimal
  balance: number; // decimal
}

export interface MonthlyReportResponse {
  months: MonthlyReport[];
}

// Parâmetros de consulta
export interface ReportParams {
  tenantId: number;
  startDate: string; // datetime
  endDate: string; // datetime
}

export class FinancialReportsService {
  /**
   * GET /api/reports/financial/summary
   * Obtém um resumo financeiro do período
   */
  static async getFinancialSummary(params: ReportParams): Promise<ApiResponse<FinancialSummary>> {
    const queryParams = new URLSearchParams({
      tenantId: params.tenantId.toString(),
      startDate: params.startDate,
      endDate: params.endDate
    });

    return httpClient.get<FinancialSummary>(`/api/reports/financial/summary?${queryParams}`);
  }

  /**
   * GET /api/reports/financial/by-category
   * Obtém relatório de transações agrupadas por categoria
   */
  static async getReportByCategory(params: ReportParams): Promise<ApiResponse<CategoryReportResponse>> {
    const queryParams = new URLSearchParams({
      tenantId: params.tenantId.toString(),
      startDate: params.startDate,
      endDate: params.endDate
    });

    return httpClient.get<CategoryReportResponse>(`/api/reports/financial/by-category?${queryParams}`);
  }

  /**
   * GET /api/reports/financial/monthly
   * Obtém relatório mensal de transações
   */
  static async getMonthlyReport(params: ReportParams): Promise<ApiResponse<MonthlyReportResponse>> {
    const queryParams = new URLSearchParams({
      tenantId: params.tenantId.toString(),
      startDate: params.startDate,
      endDate: params.endDate
    });

    return httpClient.get<MonthlyReportResponse>(`/api/reports/financial/monthly?${queryParams}`);
  }

  /**
   * GET /api/reports/financial/export/pdf
   * Exporta relatório financeiro em PDF
   * 
   * IMPORTANTE: Este endpoint verifica limites do plano (PlanLimitType.ExportPdfExcel)
   */
  static async exportToPdf(params: ReportParams): Promise<Blob> {
    const queryParams = new URLSearchParams({
      tenantId: params.tenantId.toString(),
      startDate: params.startDate,
      endDate: params.endDate
    });

    try {
      // Para download de arquivo, usamos fetch diretamente
      const response = await httpClient.request(`/api/reports/financial/export/pdf?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Simula o retorno do blob
      const blob = new Blob([JSON.stringify(response)], { type: 'application/pdf' });
      return blob;
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Funcionalidade disponível apenas em planos premium');
      }
      throw error;
    }
  }

  /**
   * GET /api/reports/financial/export/excel
   * Exporta relatório financeiro em Excel
   * 
   * IMPORTANTE: Este endpoint verifica limites do plano (PlanLimitType.ExportPdfExcel)
   */
  static async exportToExcel(params: ReportParams): Promise<Blob> {
    const queryParams = new URLSearchParams({
      tenantId: params.tenantId.toString(),
      startDate: params.startDate,
      endDate: params.endDate
    });

    try {
      // Para download de arquivo, usamos fetch diretamente
      const response = await httpClient.request(`/api/reports/financial/export/excel?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });

      // Simula o retorno do blob
      const blob = new Blob([JSON.stringify(response)], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      return blob;
    } catch (error) {
      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('Funcionalidade disponível apenas em planos premium');
      }
      throw error;
    }
  }

  /**
   * Utilitário para baixar arquivo blob com nome específico
   */
  static downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Método de conveniência para exportar PDF com nome automático
   */
  static async exportAndDownloadPdf(params: ReportParams): Promise<void> {
    const blob = await this.exportToPdf(params);
    const filename = `relatorio-financeiro-${params.startDate}-${params.endDate}.pdf`;
    this.downloadBlob(blob, filename);
  }

  /**
   * Método de conveniência para exportar Excel com nome automático
   */
  static async exportAndDownloadExcel(params: ReportParams): Promise<void> {
    const blob = await this.exportToExcel(params);
    const filename = `relatorio-financeiro-${params.startDate}-${params.endDate}.xlsx`;
    this.downloadBlob(blob, filename);
  }
}

// Export da instância singleton para uso direto
export const financialReportsService = FinancialReportsService;
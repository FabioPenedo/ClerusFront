import { httpClient } from "@/lib/http-client";
import { tokenStore } from "../info.store";

export type CategoryReportItem = {
  categoryId: string;
  categoryName: string;
  total: number;
  TransactionCount: number;
};

export type FinancialByCategoryResponse = {
  incomeCategories: CategoryReportItem[];
  expenseCategories: CategoryReportItem[];
  startDate: string;
  endDate: string;
};

export type MonthlyReportItem = {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export type FinancialMonthlyResponse = {
  months: MonthlyReportItem[];
  startDate: string;
  endDate: string;
}

export type ReportQuery = {
  tenantId: number;
  startDate: string;
  endDate: string;
};

const API_BASE_URL = "https://localhost:7166/api";

const buildQuery = ({ tenantId, startDate, endDate }: ReportQuery) =>
  `?tenantId=${tenantId}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;


export async function getCategoryReportAsync(
  params: ReportQuery
): Promise<FinancialByCategoryResponse> {
  return httpClient.get<FinancialByCategoryResponse>(
    `/reports/financial/by-category${buildQuery(params)}`
  );
}

export async function getFinancialMonthly(
  params: ReportQuery
): Promise<FinancialMonthlyResponse> {
  return httpClient.get<FinancialMonthlyResponse>(
    `/reports/financial/monthly${buildQuery(params)}`
  );
}

export async function exportToPdf(
  params: ReportQuery
): Promise<Blob> {
  return httpClient.get<Blob>(
    `/reports/financial/export/pdf${buildQuery(params)}`,
    undefined,
    'blob'
  );
}

export async function exportToExcel(
  params: ReportQuery
): Promise<Blob> {
  return httpClient.get<Blob>(
    `/reports/financial/export/excel${buildQuery(params)}`,
    undefined,
    'blob'
  );
}

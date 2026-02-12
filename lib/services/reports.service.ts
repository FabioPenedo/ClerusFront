import { httpClient } from "@/lib/http-client";
import { tokenStore } from "../info.store";

export type CategoryBreakdown = {
  category: string;
  amount: number;
  percentage: number;
};

export type FinancialSummaryResponse = {
  totalIncome: number;
  totalExpenses: number;
  balance?: number;
};

export type FinancialByCategoryResponse = {
  incomeByCategory: CategoryBreakdown[];
  expensesByCategory: CategoryBreakdown[];
};

export type FinancialMonthlyItem = {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

export type FinancialMonthlyResponse = FinancialMonthlyItem[];

export type ReportQuery = {
  tenantId: number;
  startDate: string;
  endDate: string;
};

const API_BASE_URL = "https://localhost:7166/api";

const buildQuery = ({ tenantId, startDate, endDate }: ReportQuery) =>
  `?tenantId=${tenantId}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

export async function getFinancialSummary(
  params: ReportQuery
): Promise<FinancialSummaryResponse> {
  return httpClient.get<FinancialSummaryResponse>(
    `/reports/financial/summary${buildQuery(params)}`
  );
}

export async function getFinancialByCategory(
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

export async function exportFinancialReportPdf(
  params: ReportQuery
): Promise<Blob> {
  const token = tokenStore.get();
  const url = `${API_BASE_URL}/reports/financial/export/pdf${buildQuery(params)}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erro ao exportar relatorio");
  }

  return res.blob();
}

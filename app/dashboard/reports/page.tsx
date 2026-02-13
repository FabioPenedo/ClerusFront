"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, TrendingUp, TrendingDown, DollarSign, AlertCircle, Search } from "lucide-react";
import { dashboard } from "@/lib/content";
import { sessionStore } from "@/lib/info.store";
import {
  getCategoryReportAsync,
  exportToPdf,
  exportToExcel,
  type CategoryReportItem,
} from "@/lib/services/reports.service";

const reports = dashboard.reports;

type CategoryData = {
  category: string;
  amount: number;
  percentage: number;
};

type ReportData = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeByCategory: CategoryData[];
  expensesByCategory: CategoryData[];
};

export default function ReportsPage() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlanFree = sessionStore.get()?.tenant.plan === "free"

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const getMaxEndDate = () => {
    // A data final máxima sempre será hoje
    return today.toISOString().split('T')[0];
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    const maxEnd = getMaxEndDate();
    if (new Date(endDate) > new Date(maxEnd)) {
      setEndDate(maxEnd);
    }
  };

  const handleEndDateChange = (newEndDate: string) => {
    const maxEnd = getMaxEndDate();
    if (new Date(newEndDate) > new Date(maxEnd)) {
      setEndDate(maxEnd);
    } else {
      setEndDate(newEndDate);
    }
  };

  const handleSearch = () => {
    const session = sessionStore.get();
    if (!session) {
      setError("Sessão não encontrada. Faça login novamente.");
      return;
    }

    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    setIsLoading(true);
    setError(null);

    getCategoryReportAsync({
      tenantId: session.tenant.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    })
      .then((response) => {
        const calculateTotalAndPercentage = (items: CategoryReportItem[]) => {
          const total = items.reduce((sum, item) => sum + item.total, 0);
          return items.map(item => ({
            category: item.categoryName,
            amount: item.total,
            percentage: total > 0 ? Math.round((item.total / total) * 100) : 0,
          }));
        };

        const incomeByCategory = calculateTotalAndPercentage(response.incomeCategories);
        const expensesByCategory = calculateTotalAndPercentage(response.expenseCategories);

        const totalIncome = response.incomeCategories.reduce((sum, item) => sum + item.total, 0);
        const totalExpenses = response.expenseCategories.reduce((sum, item) => sum + item.total, 0);
        const balance = totalIncome - totalExpenses;

        setReportData({
          totalIncome,
          totalExpenses,
          balance,
          incomeByCategory,
          expensesByCategory,
        });
      })
      .catch((err) => {
        setError(err?.message || "Erro ao buscar relatórios. Tente novamente.");
        setReportData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleExportClick = (format: 'pdf' | 'excel') => {
    if (isPlanFree) return;

    const session = sessionStore.get();
    if (!session) return;

    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const exportFunction = format === 'pdf' ? exportToPdf : exportToExcel;
    const fileExtension = format === 'pdf' ? 'pdf' : 'xlsx';

    exportFunction({
      tenantId: session.tenant.id,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `relatorio-financeiro-${startDate}-${endDate}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        // Falha silenciosa por enquanto
      });
  };

  const formatDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{reports.title}</h1>
        <p className="text-muted-foreground mt-2">{reports.subtitle}</p>
      </div>

      {/* Aviso plano gratuito */}
      {isPlanFree && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900">{reports.freePlanNotice}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Selecione o período para visualizar os relatórios.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                max={today.toISOString().split('T')[0]}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={startDate}
                max={getMaxEndDate()}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-10"
            >
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de erro */}
      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado inicial */}
      {!reportData && !error && !isLoading && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900">Selecione o período e clique em Buscar para visualizar os relatórios.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards de resumo */}
      {reportData && (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {reports.types.financial} - Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.totalIncome)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              {reports.types.financial} - Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(reportData.totalExpenses)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Saldo do mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${reportData.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(reportData.balance)}
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Relatório: Entradas por categoria */}
      {reportData && (
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.incomeByCategory}</CardTitle>
          <CardDescription>
            Distribuição das entradas por categoria de {formatDateRange()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.incomeByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma entrada encontrada no período selecionado.
              </p>
            ) : (
              reportData.incomeByCategory.map((item: CategoryData) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Relatório: Saídas por categoria */}
      {reportData && (
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.expensesByCategory}</CardTitle>
          <CardDescription>
            Distribuição das saídas por categoria de {formatDateRange()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.expensesByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma saída encontrada no período selecionado.
              </p>
            ) : (
              reportData.expensesByCategory.map((item: CategoryData) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.amount)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Resumo geral */}
      {reportData && (
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.summary}</CardTitle>
          <CardDescription>
            Resumo financeiro de {formatDateRange()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-sm font-medium text-green-900">Total de entradas</span>
              <span className="text-lg font-bold text-green-700">
                {formatCurrency(reportData.totalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-sm font-medium text-red-900">Total de saídas</span>
              <span className="text-lg font-bold text-red-700">
                {formatCurrency(reportData.totalExpenses)}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              reportData.balance >= 0 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <span className={`text-sm font-medium ${
                reportData.balance >= 0 ? "text-green-900" : "text-red-900"
              }`}>
                Saldo do período
              </span>
              <span className={`text-lg font-bold ${
                reportData.balance >= 0 ? "text-green-700" : "text-red-700"
              }`}>
                {formatCurrency(reportData.balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Seção de exportação */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle>Exportar relatório</CardTitle>
          <CardDescription>
            {isPlanFree
              ? reports.upgradeText
              : "Exporte os relatórios em PDF ou Excel para análises externas."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handleExportClick('pdf')}
              disabled={isPlanFree || !reportData}
              variant={isPlanFree ? "outline" : "default"}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button
              onClick={() => handleExportClick('excel')}
              disabled={isPlanFree || !reportData}
              variant={isPlanFree ? "outline" : "default"}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

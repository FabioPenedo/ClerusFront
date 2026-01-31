"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanLimitModal } from "@/components/plan/plan-limit-modal";
import { usePlanCheck } from "@/hooks/use-plan-check";
import { Download, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { dashboard } from "@/lib/content";
import { mockReportsData } from "@/lib/mock-data";
import { mockFinancialEntries } from "@/lib/mock-data";

const reports = dashboard.reports;

export default function ReportsPage() {
  const { checkLimit, showModal, setShowModal, blockedFeature, plan } = usePlanCheck();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const data = useMemo(() => {
    // Em produção, filtrar dados baseado no período selecionado
    return mockReportsData.currentMonth;
  }, [selectedMonth, selectedYear]);

  const handleExportClick = () => {
    if (checkLimit("canExportReports")) {
      // Permitir exportação
      console.log("Exportando relatório...");
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[month - 1];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{reports.title}</h1>
        <p className="text-muted-foreground mt-2">{reports.subtitle}</p>
      </div>

      {/* Aviso plano gratuito */}
      {plan === "FREE" && (
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
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{reports.filters.month}</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{reports.filters.year}</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
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
              {formatCurrency(data.totalIncome)}
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
              {formatCurrency(data.totalExpenses)}
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
            <p className={`text-2xl font-bold ${data.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(data.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Relatório: Entradas por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.incomeByCategory}</CardTitle>
          <CardDescription>
            Distribuição das entradas por categoria em {getMonthName(selectedMonth)}/{selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.incomeByCategory.map((item) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relatório: Saídas por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.expensesByCategory}</CardTitle>
          <CardDescription>
            Distribuição das saídas por categoria em {getMonthName(selectedMonth)}/{selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.expensesByCategory.map((item) => (
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo geral */}
      <Card>
        <CardHeader>
          <CardTitle>{reports.types.summary}</CardTitle>
          <CardDescription>
            Resumo financeiro de {getMonthName(selectedMonth)}/{selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-sm font-medium text-green-900">Total de entradas</span>
              <span className="text-lg font-bold text-green-700">
                {formatCurrency(data.totalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-sm font-medium text-red-900">Total de saídas</span>
              <span className="text-lg font-bold text-red-700">
                {formatCurrency(data.totalExpenses)}
              </span>
            </div>
            <div className={`flex items-center justify-between p-3 rounded-lg border ${
              data.balance >= 0 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <span className={`text-sm font-medium ${
                data.balance >= 0 ? "text-green-900" : "text-red-900"
              }`}>
                Saldo do período
              </span>
              <span className={`text-lg font-bold ${
                data.balance >= 0 ? "text-green-700" : "text-red-700"
              }`}>
                {formatCurrency(data.balance)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção de exportação */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle>Exportar relatório</CardTitle>
          <CardDescription>
            {plan === "FREE" 
              ? reports.upgradeText
              : "Exporte os relatórios em PDF ou Excel para análises externas."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExportClick}
              disabled={plan === "FREE"}
              variant={plan === "FREE" ? "outline" : "default"}
            >
              <Download className="h-4 w-4 mr-2" />
              {reports.exportButton}
            </Button>
            {plan === "FREE" && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                {reports.upgradeButton}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de limite de plano */}
      <PlanLimitModal
        open={showModal}
        onOpenChange={setShowModal}
        feature={blockedFeature || undefined}
        onUpgrade={() => {
          window.location.href = "/#pricing";
        }}
      />
    </div>
  );
}

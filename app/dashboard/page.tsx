"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus } from "lucide-react";
import { dashboard } from "@/lib/content";
import { mockDashboardData } from "@/lib/mock-data";

// Tipagem opcional para garantir monthlySummary
type MonthlySummary = {
  largestIncome?: { description: string; amount: number };
  largestExpense?: { description: string; amount: number };
  totalIncome: number;
  totalExpenses: number;
  balance: number;
};

type DashboardData = typeof mockDashboardData & {
  members: typeof mockDashboardData.members & {
    limit?: number;
  };
  financial: typeof mockDashboardData.financial & {
    monthlySummary?: MonthlySummary;
  };
};
import Link from "next/link";

export default function DashboardPage() {
  const data = mockDashboardData as DashboardData;

  // Calcula se está próximo do limite de membros (exemplo: 90% do limite)
  const isNearLimit =
    data.members.total >= Math.floor((data.members.limit ?? 0) * 0.9);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{dashboard.title}</h1>
        <p className="text-muted-foreground mt-2">{dashboard.subtitle}</p>
      </div>

      {/* Plano atual */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">{dashboard.planNotice}</p>
                <p className="text-sm text-amber-700 mt-1">{dashboard.sections.plan.upgradeDescription}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {dashboard.sections.plan.upgradeButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={dashboard.summaryCards.members.label}
          value={data.members.total.toString()}
          icon={<Users className="h-4 w-4" />}
        />
        <SummaryCard
          label={dashboard.summaryCards.income.label}
          value={formatCurrency(data.financial.income)}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="success"
        />
        <SummaryCard
          label={dashboard.summaryCards.expenses.label}
          value={formatCurrency(data.financial.expenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          variant="danger"
        />
        <SummaryCard
          label={dashboard.summaryCards.balance.label}
          value={formatCurrency(data.financial.balance)}
          icon={<DollarSign className="h-4 w-4" />}
          variant={data.financial.balance >= 0 ? "success" : "warning"}
        />
      </div>

      {/* Seção Financeira */}
      <Card>
        <CardHeader>
          <CardTitle>{dashboard.sections.financial.title}</CardTitle>
          <CardDescription>{dashboard.sections.financial.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {data.financial.monthlySummary ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Maior entrada</p>
                  <p className="font-semibold text-green-900">
                    {data.financial.monthlySummary.largestIncome?.description || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-2">
                    {formatCurrency(data.financial.monthlySummary.largestIncome?.amount || 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-muted-foreground mb-1">Maior saída</p>
                  <p className="font-semibold text-red-900">
                    {data.financial.monthlySummary.largestExpense?.description || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-red-700 mt-2">
                    {formatCurrency(data.financial.monthlySummary.largestExpense?.amount || 0)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Resumo do mês: Entradas de {formatCurrency(data.financial.monthlySummary.totalIncome)}, 
                  saídas de {formatCurrency(data.financial.monthlySummary.totalExpenses)}, 
                  resultando em um saldo de {formatCurrency(data.financial.monthlySummary.balance)}.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{dashboard.sections.financial.noData}</p>
              <Button asChild>
                <Link href="/dashboard/financial">
                  Registrar primeiro lançamento
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Membros */}
      <Card>
        <CardHeader>
          <CardTitle>{dashboard.sections.members.title}</CardTitle>
          <CardDescription>{dashboard.sections.members.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{data.members.total} membros</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isNearLimit ? (
                  <span className="text-amber-600 font-medium">
                    {dashboard.sections.members.limitWarning}
                  </span>
                ) : (
                  `Limite do plano: ${data.members.limit} membros`
                )}
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/members">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar membro
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Anúncios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{dashboard.sections.announcements.title}</CardTitle>
              <CardDescription>{dashboard.sections.announcements.description}</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/announcements">
                <Plus className="h-4 w-4 mr-2" />
                {dashboard.sections.announcements.createButton}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.announcements.recent.length > 0 ? (
            <div className="space-y-3">
              {data.announcements.recent.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg border border-border bg-background">
                  <p className="font-medium mb-1">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{announcement.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{dashboard.sections.announcements.noData}</p>
              <Button variant="outline" asChild>
                <Link href="/dashboard/announcements">
                  Criar primeiro anúncio
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

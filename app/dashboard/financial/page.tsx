"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { AddEntryModal } from "@/components/financial/add-entry-modal";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { dashboard } from "@/lib/content";
import { mockFinancialEntries } from "@/lib/mock-data";

const financial = dashboard.financial;

export default function FinancialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entriesList, setEntriesList] = useState(mockFinancialEntries);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Calcular resumos
  const summary = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthEntries = entriesList.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });

    const income = monthEntries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.value, 0);

    const expenses = monthEntries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.value, 0);

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance
    };
  }, [entriesList]);

  const handleEntryAdded = () => {
    // Simulação: adicionar novo lançamento à lista
    // Em produção, isso viria de uma chamada à API
    const newEntry = {
      id: String(entriesList.length + 1),
      type: "income" as const,
      category: "Dízimos",
      description: "Novo lançamento",
      value: 100.00,
      date: new Date().toISOString()
    };
    setEntriesList([...entriesList, newEntry]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{financial.title}</h1>
          <p className="text-muted-foreground mt-2">{financial.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {financial.addButton}
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label={financial.summaryCards.income.label}
          value={formatCurrency(summary.income)}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="success"
        />
        <SummaryCard
          label={financial.summaryCards.expenses.label}
          value={formatCurrency(summary.expenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          variant="danger"
        />
        <SummaryCard
          label={financial.summaryCards.balance.label}
          value={formatCurrency(summary.balance)}
          icon={<DollarSign className="h-4 w-4" />}
          variant={summary.balance >= 0 ? "success" : "warning"}
        />
      </div>

      {/* Tabela de lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos financeiros</CardTitle>
          <CardDescription>
            Todos os lançamentos registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entriesList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {financial.noData}
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar primeiro lançamento
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{financial.table.date}</TableHead>
                    <TableHead>{financial.table.type}</TableHead>
                    <TableHead>{financial.table.category}</TableHead>
                    <TableHead>{financial.table.description}</TableHead>
                    <TableHead className="text-right">{financial.table.value}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entriesList
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={entry.type === "income" ? "default" : "outline"}
                          >
                            {entry.type === "income"
                              ? financial.types.income
                              : financial.types.expense}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.category}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            entry.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {entry.type === "income" ? "+" : "-"} {formatCurrency(entry.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de adicionar lançamento */}
      <AddEntryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleEntryAdded}
      />
    </div>
  );
}

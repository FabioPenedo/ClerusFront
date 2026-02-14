"use client";

import { useEffect, useMemo, useState } from "react";
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
import { EditEntryModal } from "@/components/financial/edit-entry-modal";
import { DeleteEntryModal } from "@/components/financial/delete-entry-modal";
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle, Loader2, Pencil, Trash2 } from "lucide-react";
import { dashboard } from "@/lib/content";
import {
  createTransaction,
  CreateTransactionDTO,
  deleteTransaction,
  getTransactions,
  TransactionListItem,
  updateTransaction,
  UpdateTransactionDTO,
} from "@/lib/services/transaction.service";
import { CategoriesService, Category } from "@/lib/services/categories.service";
import { sessionStore } from "@/lib/info.store";

const financial = dashboard.financial;

const isPlanFree = sessionStore.get()?.tenant.plan === "free"
const maxMonthEntriesCount = financial.maxMonthEntriesCount ?? 15;

export default function FinancialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionListItem | null>(null);
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const entriesList = useMemo(() => {
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        typeTransaction: transaction.typeTransaction,
        categoryName: transaction.categoryName,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        date: transaction.date,
      };
    });
  }, [transactions]);

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
      .filter((e) => e.typeTransaction === "Income")
      .reduce((sum, e) => sum + e.amount, 0);

    const expenses = monthEntries
      .filter((e) => e.typeTransaction === "Expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const balance = income - expenses;

    return {
      monthEntriesCount: monthEntries.length,
      income,
      expenses,
      balance
    };
  }, [entriesList]);

  const handleGetTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [transactionsResponse, categoriesResponse] = await Promise.all([
        getTransactions(),
        CategoriesService.getCategories(),
      ]);
      setTransactions(transactionsResponse);
      setCategories(categoriesResponse);
    } catch (err) {
      setError("Erro ao carregar lancamentos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (data: CreateTransactionDTO) => {
    try {
      setError(null);
      await createTransaction(data);
      await handleGetTransactions();
    } catch (err) {
      setError("Erro ao cadastrar lancamento");
      throw err;
    }
  };

  const handleUpdateTransaction = async (data: UpdateTransactionDTO) => {
    if (!selectedTransaction) return;

    try {
      setError(null);
      await updateTransaction(selectedTransaction.id, data);
      await handleGetTransactions();
    } catch (err) {
      setError("Erro ao atualizar lancamento");
      throw err;
    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      setError(null);
      await deleteTransaction(selectedTransaction.id);
      await handleGetTransactions();
    } catch (err) {
      setError("Erro ao deletar lancamento");
      throw err;
    }
  };

  const handleOpenEdit = (transaction: TransactionListItem) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (transaction: TransactionListItem) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleEditModalChange = (open: boolean) => {
    setIsEditModalOpen(open);
    if (!open) {
      setSelectedTransaction(null);
    }
  };

  const handleDeleteModalChange = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setSelectedTransaction(null);
    }
  };

  useEffect(() => {
    handleGetTransactions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{financial.title}</h1>
          <p className="text-muted-foreground mt-2">{financial.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={isPlanFree && summary.monthEntriesCount >= maxMonthEntriesCount}>
          <Plus className="h-4 w-4 mr-2" />
          {financial.addButton}
        </Button>
      </div>

      {/* Demonstrativo de lançamentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de lançamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entriesList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lançamentos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lançamentos do mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.monthEntriesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados no mês atual
            </p>
          </CardContent>
        </Card>

        {isPlanFree && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Limite do plano gratuito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{maxMonthEntriesCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lançamentos por mês
              </p>
            </CardContent>
          </Card>
        )}
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

      {/* Error Alert */}
      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <div className="flex">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Erro</h3>
              <div className="mt-2 text-sm text-destructive">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de limite do plano */}
      {isPlanFree && summary.monthEntriesCount >= maxMonthEntriesCount && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    {financial.limitReached}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Faça upgrade para registrar mais lançamentos.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { window.location.href = "/#pricing"; }}>
                {financial.upgradeButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela de lançamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos financeiros</CardTitle>
          <CardDescription>
            Todos os lançamentos registrados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : entriesList.length === 0 ? (
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
                    <TableHead className="text-right">{financial.table.value}</TableHead>
                    <TableHead className="text-right">Acoes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entriesList
                    .slice()
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={entry.typeTransaction === "Income" ? "default" : "outline"}
                          >
                            {entry.typeTransaction === "Income"
                              ? financial.types.income
                              : financial.types.expense}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.categoryName}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            entry.typeTransaction === "Income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {entry.typeTransaction === "Income" ? "+" : "-"} {formatCurrency(entry.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(entry)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleOpenDelete(entry)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
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
        categories={categories}
        onCreate={handleCreateTransaction}
      />

      <EditEntryModal
        open={isEditModalOpen}
        onOpenChange={handleEditModalChange}
        categories={categories}
        transaction={selectedTransaction}
        onUpdate={handleUpdateTransaction}
      />

      <DeleteEntryModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalChange}
        transaction={selectedTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}

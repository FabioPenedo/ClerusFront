"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Users, DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Cake, MessageCircle } from "lucide-react";
import { dashboard } from "@/lib/content";
import { getMembers, Member } from "@/lib/services/member.service";
import { getTransactions, TransactionListItem } from "@/lib/services/transaction.service";
import { sessionStore } from "@/lib/info.store";
import Link from "next/link";

export default function DashboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<ReturnType<typeof sessionStore.get>>(null);

  useEffect(() => {
    const currentSession = sessionStore.get();
    setSession(currentSession);
    
    const fetchData = async () => {
      try {
        const [membersData, transactionsData] = await Promise.all([
          getMembers(),
          getTransactions()
        ]);
        setMembers(membersData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Limites do plano
  const memberLimit = session?.tenant.plan === "free" ? 50 : Infinity;

  // Calcula totais de membros
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.active).length;

  // Obtém data atual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();
  
  const monthNames = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const currentMonthName = monthNames[currentMonth];

  // Filtra transações do mês atual
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  // Calcula totais financeiros do mês
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.typeTransaction === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.typeTransaction === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = monthlyIncome - monthlyExpenses;

  // Encontra maior entrada e maior saída
  const incomeTransactions = currentMonthTransactions.filter(t => t.typeTransaction === "Income");
  const expenseTransactions = currentMonthTransactions.filter(t => t.typeTransaction === "Expense");

  const largestIncome = incomeTransactions.length > 0
    ? incomeTransactions.reduce((max, t) => t.amount > max.amount ? t : max)
    : null;

  const largestExpense = expenseTransactions.length > 0
    ? expenseTransactions.reduce((max, t) => t.amount > max.amount ? t : max)
    : null;

  // Filtra aniversariantes do mês atual
  const monthBirthdays = members.filter(member => {
    const birthday = new Date(member.birthday);
    return birthday.getMonth() === currentMonth;
  }).sort((a, b) => {
    // Ordena por dia do mês
    return new Date(a.birthday).getDate() - new Date(b.birthday).getDate();
  });

  // Calcula se está próximo do limite de membros (90% do limite)
  const isNearLimit = totalMembers >= Math.floor(memberLimit * 0.9);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const formatWhatsAppNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Se não começar com 55 (código do Brasil), adiciona
    return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const formattedNumber = formatWhatsAppNumber(phone);
    const message = encodeURIComponent(`Olá ${name}! Feliz aniversário! Que Deus abençoe sua vida hoje e sempre!`);
    return `https://wa.me/${formattedNumber}?text=${message}`;
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
            <Button 
            variant="outline" 
            size="sm"
            onClick={() => { window.location.href = "/#pricing"; }}
            >
              {dashboard.sections.plan.upgradeButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={dashboard.summaryCards.members.label}
          value={loading ? "..." : totalMembers.toString()}
          icon={<Users className="h-4 w-4" />}
        />
        <SummaryCard
          label={dashboard.summaryCards.income.label}
          value={loading ? "..." : formatCurrency(monthlyIncome)}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="success"
        />
        <SummaryCard
          label={dashboard.summaryCards.expenses.label}
          value={loading ? "..." : formatCurrency(monthlyExpenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          variant="danger"
        />
        <SummaryCard
          label={dashboard.summaryCards.balance.label}
          value={loading ? "..." : formatCurrency(balance)}
          icon={<DollarSign className="h-4 w-4" />}
          variant={balance >= 0 ? "success" : "warning"}
        />
      </div>

      {/* Seção Financeira */}
      <Card>
        <CardHeader>
          <CardTitle>{dashboard.sections.financial.title}</CardTitle>
          <CardDescription>{dashboard.sections.financial.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && currentMonthTransactions.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Maior entrada</p>
                  <p className="font-semibold text-green-900">
                    {largestIncome?.categoryName || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-2">
                    {formatCurrency(largestIncome?.amount || 0)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-muted-foreground mb-1">Maior saída</p>
                  <p className="font-semibold text-red-900">
                    {largestExpense?.categoryName || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-red-700 mt-2">
                    {formatCurrency(largestExpense?.amount || 0)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Resumo do mês: Entradas de {formatCurrency(monthlyIncome)}, 
                  saídas de {formatCurrency(monthlyExpenses)}, 
                  resultando em um saldo de {formatCurrency(balance)}.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {loading ? "Carregando..." : dashboard.sections.financial.noData}
              </p>
              {!loading && (
                <Button asChild>
                  <Link href="/dashboard/financial">
                    Registrar primeiro lançamento
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seção de Aniversariantes */}
      {!loading && monthBirthdays.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cake className="h-5 w-5 text-blue-600" />
              Aniversariantes do mês
            </CardTitle>
            <CardDescription>Membros que fazem aniversário este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {monthBirthdays.map((member) => {
                const birthDate = new Date(member.birthday);
                const day = birthDate.getDate();
                const age = new Date().getFullYear() - birthDate.getFullYear();
                const isToday = day === today;
                
                return (
                  <div 
                    key={member.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isToday 
                        ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-400' 
                        : 'bg-white border-blue-200'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`font-semibold ${isToday ? 'text-blue-900' : 'text-blue-800'}`}>
                        {member.name}
                        {isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">HOJE</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {day} de {currentMonthName} • {age} anos
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.phone && (
                        <a
                          href={getWhatsAppLink(member.phone, member.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                          title="Enviar mensagem de parabéns"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      )}
                      <Cake className={`h-5 w-5 ${isToday ? 'text-blue-600' : 'text-blue-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção de Membros */}
      <Card>
        <CardHeader>
          <CardTitle>{dashboard.sections.members.title}</CardTitle>
          <CardDescription>{dashboard.sections.members.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {loading ? "..." : `${totalMembers} membros`}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {!loading && isNearLimit ? (
                  <span className="text-amber-600 font-medium">
                    {dashboard.sections.members.limitWarning}
                  </span>
                ) : (
                  session?.tenant.plan === "free" 
                    ? `Limite do plano: ${memberLimit} membros` 
                    : "Membros ilimitados"
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
    </div>
  );
}

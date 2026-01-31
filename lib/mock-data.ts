export const mockDashboardData = {
  church: {
    id: 1,
    name: "Igreja Batista Central",
    plan: "free",
    createdAt: "2024-01-15",
  },
  members: {
    total: 45,
    active: 42,
    inactive: 3,
  },
  financial: {
    balance: 12500.50,
    income: 8900.00,
    expenses: 2150.75,
    lastMonth: {
      income: 7200.00,
      expenses: 1950.00,
    },
  },
  announcements: {
    recent: [
      {
        id: 1,
        title: "Culto de Ação de Graças",
        description: "Próximo culto especial de ação de graças",
        date: "2024-02-10",
      },
      {
        id: 2,
        title: "Reunião do Conselho",
        description: "Reunião mensal do conselho da igreja",
        date: "2024-02-05",
      },
    ],
  },
};

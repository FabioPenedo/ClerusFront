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
};

export const mockFinancialEntries = [
  {
    id: "1",
    type: "income" as const,
    category: "Dízimos",
    description: "Dízimo - João Silva",
    value: 500.00,
    date: "2024-02-01T10:00:00.000Z"
  },
  {
    id: "2",
    type: "income" as const,
    category: "Ofertas",
    description: "Oferta - Culto de domingo",
    value: 350.00,
    date: "2024-02-04T19:00:00.000Z"
  },
  {
    id: "3",
    type: "expense" as const,
    category: "Utilidades",
    description: "Conta de luz",
    value: 280.50,
    date: "2024-02-05T14:00:00.000Z"
  },
  {
    id: "4",
    type: "income" as const,
    category: "Dízimos",
    description: "Dízimo - Maria Santos",
    value: 450.00,
    date: "2024-02-08T10:00:00.000Z"
  },
  {
    id: "5",
    type: "expense" as const,
    category: "Manutenção",
    description: "Conserto do ar condicionado",
    value: 520.00,
    date: "2024-02-10T16:00:00.000Z"
  }
];

export const mockReportsData = {
  currentMonth: {
    totalIncome: 8900.00,
    totalExpenses: 2150.75,
    balance: 6749.25,
    incomeByCategory: [
      {
        category: "Dízimos",
        amount: 5400.00,
        percentage: 60.7
      },
      {
        category: "Ofertas",
        amount: 2500.00,
        percentage: 28.1
      },
      {
        category: "Doações",
        amount: 1000.00,
        percentage: 11.2
      }
    ],
    expensesByCategory: [
      {
        category: "Salários",
        amount: 1200.00,
        percentage: 55.8
      },
      {
        category: "Utilidades",
        amount: 450.75,
        percentage: 21.0
      },
      {
        category: "Manutenção",
        amount: 500.00,
        percentage: 23.2
      }
    ]
  }
};

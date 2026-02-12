export const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Planos", href: "#pricing" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" }
];

export const hero = {
  eyebrow: "Sistema de gestão para igrejas",
  headline: "Organize membros, finanças e anúncios da sua igreja em um só lugar.",
  subheadline:
    "Plataforma simples para pastores e tesoureiros gerenciarem cadastro de membros, lançamentos financeiros, categorias, anúncios internos e relatórios com transparência e controle de acesso.",
  primaryCta: { label: "Começar grátis", href: "#pricing" },
  secondaryCta: { label: "Ver como funciona", href: "#how-it-works" },
  highlights: [
    "Cadastro completo de membros",
    "Gestão financeira organizada",
    "Relatórios transparentes"
  ],
  stats: [
    { label: "Membros cadastrados", value: "Ilimitado" },
    { label: "Transparência total", value: "100%" },
    { label: "Igrejas organizadas", value: "+150" }
  ]
};

export const problem = {
  title: "O problema de gerir uma igreja de forma manual",
  bullets: [
    "Planilhas espalhadas para membros, dízimos, ofertas e despesas que nunca batem.",
    "Falta de transparência com a liderança sobre o uso dos recursos financeiros.",
    "Dificuldade para organizar anúncios e comunicados internos de forma centralizada.",
    "Impossibilidade de gerar relatórios claros para apresentar à diretoria."
  ]
};

export const solution = {
  title: "Sistema simples para organizar sua igreja",
  description:
    "Uma plataforma multi-tenant onde cada igreja gerencia seus próprios membros, lançamentos financeiros por categorias, anúncios internos e relatórios, com controle de acesso por usuário.",
  pillars: [
    {
      title: "Gestão de membros",
      copy: "Cadastre e organize todos os membros da sua igreja de forma centralizada."
    },
    {
      title: "Financeiro organizado",
      copy: "Registre entradas e saídas financeiras organizadas por categorias personalizadas."
    },
    {
      title: "Anúncios e comunicação",
      copy: "Crie e gerencie anúncios internos para sua igreja de forma simples."
    },
    {
      title: "Relatórios transparentes",
      copy: "Visualize relatórios financeiros e administrativos prontos para apresentação."
    },
    {
      title: "Controle de acesso",
      copy: "Gerencie usuários e papéis para garantir acesso adequado às informações."
    }
  ]
};

export const features = [
  {
    title: "Registro e gestão de membros",
    description: "Cadastre e organize todos os membros da sua igreja com informações completas e atualizadas.",
    tag: "Membros"
  },
  {
    title: "Lançamentos financeiros",
    description: "Registre entradas e saídas financeiras de forma simples e organizada, com categorias personalizadas.",
    tag: "Financeiro"
  },
  {
    title: "Categorias financeiras",
    description: "Organize receitas e despesas por categorias para facilitar o controle e análise dos recursos.",
    tag: "Organização"
  },
  {
    title: "Anúncios internos",
    description: "Crie e gerencie anúncios para comunicar informações importantes à sua igreja.",
    tag: "Comunicação"
  },
  {
    title: "Relatórios de visualização",
    description: "Acesse relatórios financeiros e administrativos prontos para análise e apresentação à liderança.",
    tag: "Relatórios"
  },
  {
    title: "Controle de acesso por usuário",
    description: "Gerencie múltiplos usuários por igreja com diferentes papéis e permissões de acesso.",
    tag: "Segurança"
  },
  {
    title: "Disparo de anúncios por WhatsApp",
    description: "Envie anúncios diretamente pelo WhatsApp para sua congregação. (Em breve)",
    tag: "Integração",
    comingSoon: true
  },
  {
    title: "Envio de comunicados por email",
    description: "Dispare comunicados e anúncios por email de forma automatizada. (Em breve)",
    tag: "Integração",
    comingSoon: true
  }
];

export const plans = [
  {
    name: "Plano Gratuito",
    price: "R$0",
    description: "Ideal para igrejas pequenas que estão começando a se organizar.",
    features: [
      "Até 50 membros cadastrados",
      "Registro financeiro básico",
      "Categorias financeiras padrão",
      "Criação de anúncios internos",
      "Relatórios apenas na visualização (sem exportação)",
      "1 usuário por igreja",
      "Suporte por e-mail"
    ],
    cta: "Começar grátis",
    highlight: false
  },
  {
    name: "Plano Pago",
    price: "Sob consulta",
    description: "Para igrejas que precisam de recursos completos e integrações.",
    features: [
      "Membros ilimitados",
      "Registros financeiros ilimitados",
      "Categorias personalizadas",
      "Anúncios ilimitados",
      "Relatórios completos com exportação",
      "Usuários ilimitados por igreja",
      "Recursos inteligentes (IA)",
      "Integrações futuras (WhatsApp e Email)",
      "Suporte prioritário"
    ],
    cta: "Falar com vendas",
    highlight: true
  }
];

export const howItWorks = [
  {
    title: "Cadastre sua igreja",
    copy: "Crie sua conta, configure sua igreja como tenant e convide os primeiros usuários."
  },
  {
    title: "Organize membros e finanças",
    copy: "Cadastre os membros, configure categorias financeiras e comece a registrar entradas e saídas."
  },
  {
    title: "Visualize relatórios",
    copy: "Acesse relatórios financeiros e administrativos prontos para apresentar à liderança."
  }
];

export const testimonials = [
  {
    name: "Pr. Marcos",
    role: "Pastor",
    text: "Agora temos controle total dos membros e das finanças em um só lugar. A transparência com a diretoria melhorou muito."
  },
  {
    name: "Ana",
    role: "Tesoureira",
    text: "Organizar as entradas e saídas por categorias facilitou demais. Os relatórios ficaram claros e fáceis de apresentar."
  },
  {
    name: "Lucas",
    role: "Líder de Ministérios",
    text: "Conseguimos cadastrar todos os membros e criar anúncios de forma centralizada. Muito mais prático que planilhas."
  }
];

export const faq = [
  {
    question: "Quantos membros posso cadastrar no plano gratuito?",
    answer: "O plano gratuito permite até 50 membros cadastrados. Para igrejas maiores, o plano pago oferece membros ilimitados."
  },
  {
    question: "Posso ter mais de um usuário no plano gratuito?",
    answer: "O plano gratuito permite 1 usuário por igreja. O plano pago oferece usuários ilimitados com controle de papéis e permissões."
  },
  {
    question: "Como funcionam os relatórios?",
    answer: "No plano gratuito, você pode visualizar os relatórios na plataforma. No plano pago, você também pode exportá-los para apresentações e análises."
  },
  {
    question: "Quando as integrações de WhatsApp e Email estarão disponíveis?",
    answer: "Essas integrações estão em desenvolvimento e estarão disponíveis em breve, inicialmente para o plano pago."
  },
  {
    question: "Como funciona o controle de acesso por usuário?",
    answer: "Cada igreja pode ter múltiplos usuários com diferentes papéis (pastor, tesoureiro, secretário, etc.) e permissões específicas para acessar diferentes áreas do sistema."
  },
  {
    question: "Posso personalizar as categorias financeiras?",
    answer: "No plano gratuito, você usa categorias padrão. No plano pago, você pode criar categorias personalizadas para melhor organização das receitas e despesas."
  }
];

export const signupModal = {
  title: "Crie sua igreja gratuitamente",
  subtitle: "Comece agora a organizar membros, finanças e relatórios em um só lugar. Sem cartão de crédito.",
  contextText: "Em poucos minutos, sua igreja estará pronta para usar o sistema. Você será o administrador inicial e poderá convidar outras pessoas depois.",
  fields: {
    churchName: {
      label: "Nome da igreja",
      placeholder: "Igreja Batista Central",
      helperText: "Este será o nome exibido no sistema."
    },
    location: {
      label: "Tipo de igreja",
      helperText: "Selecione o tipo de estrutura da sua igreja.",
      options: [
        {
          value: "central",
          label: "Central",
          description: "Igreja central ou matriz"
        },
        {
          value: "regional",
          label: "Regional",
          description: "Igreja regional ou distrital"
        },
        {
          value: "local",
          label: "Local",
          description: "Igreja local ou congregação"
        }
      ]
    },
    userName: {
      label: "Seu nome",
      placeholder: "João da Silva",
      helperText: "Você será o administrador da igreja."
    },
    email: {
      label: "Email",
      placeholder: "contato@igreja.com",
      helperText: "Usado para acesso e comunicações importantes."
    },
    phone: {
      label: "Telefone / WhatsApp",
      placeholder: "(31) 99999-9999",
      helperText: "Para suporte e avisos importantes."
    },
    password: {
      label: "Senha",
      placeholder: "Crie uma senha segura",
      helperText: "Mínimo de 6 caracteres."
    }
  },
  cta: "Criar conta gratuita",
  trustText: [
    "✔ Plano gratuito para sempre",
    "✔ Até 50 membros",
    "✔ 1 usuário administrador",
    "✔ Upgrade quando quiser"
  ],
  legalText: "Ao criar a conta, você concorda com nossos Termos de Uso e Política de Privacidade."
};

export const dashboard = {
  title: "Visão geral da sua igreja",
  subtitle: "Acompanhe os principais dados em um só lugar.",
  planNotice: "Você está no plano gratuito. Até 50 membros.",
  menu: [
    { label: "Visão geral", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Membros", href: "/dashboard/members", icon: "Users" },
    { label: "Usuários", href: "/dashboard/users", icon: "UserCog" },
    { label: "Financeiro", href: "/dashboard/financial", icon: "DollarSign" },
    { label: "Categorias", href: "/dashboard/categories", icon: "Tags" },
    { label: "Relatórios", href: "/dashboard/reports", icon: "FileText" }
  ],
  summaryCards: {
    members: {
      label: "Total de membros",
      value: "0"
    },
    income: {
      label: "Entradas do mês",
      value: "R$ 0,00"
    },
    expenses: {
      label: "Saídas do mês",
      value: "R$ 0,00"
    },
    balance: {
      label: "Saldo atual",
      value: "R$ 0,00"
    }
  },
  sections: {
    financial: {
      title: "Resumo financeiro do mês",
      description: "Acompanhe as movimentações financeiras da sua igreja.",
      noData: "Ainda não há lançamentos financeiros registrados."
    },
    members: {
      title: "Membros cadastrados",
      description: "Gerencie os membros da sua igreja.",
      limitWarning: "Você está próximo do limite do plano gratuito (50 membros).",
      noData: "Ainda não há membros cadastrados."
    },
    users: {
      title: "Usuários do sistema",
      description: "Gerencie os usuários com acesso ao sistema.",
      createButton: "Adicionar usuário",
      noData: "Ainda não há usuários cadastrados."
    },
    plan: {
      title: "Plano atual",
      upgradeButton: "Fazer upgrade",
      upgradeDescription: "Desbloqueie recursos ilimitados e integrações."
    }
  },
  members: {
    title: "Membros da igreja",
    subtitle: "Gerencie os membros cadastrados da sua igreja.",
    addButton: "Adicionar membro",
    limitReached: "Você atingiu o limite de membros do plano gratuito.",
    upgradeButton: "Conhecer plano completo",
    table: {
      name: "Nome",
      email: "Email",
      phone: "Telefone",
      age: "Idade",
      group: "Grupo",
      status: "Status",
      birthday: "Data de nascimento",
      createdAt: "Data de cadastro",
      actions: "Ações"
    },
    status: {
      active: "Ativo",
      inactive: "Inativo"
    },
    groups: {
      child: "Criança",
      teen: "Adolescente",
      young: "Jovem",
      adult: "Adulto",
      elder: "Idoso"
    },
    modal: {
      title: "Adicionar novo membro",
      subtitle: "Preencha os dados do membro para cadastrá-lo na igreja.",
      fields: {
        name: {
          label: "Nome completo",
          placeholder: "João da Silva",
          helperText: "Nome completo do membro."
        },
        email: {
          label: "Email",
          placeholder: "joao@email.com",
          helperText: "Email para contato e comunicação."
        },
        phone: {
          label: "Telefone",
          placeholder: "(31) 99999-9999",
          helperText: "Telefone ou WhatsApp do membro."
        },
        age: {
          label: "Idade",
          placeholder: "30",
          helperText: "Idade do membro."
        },
        group: {
          label: "Grupo",
          helperText: "Classificação por faixa etária."
        },
        birthday: {
          label: "Data de nascimento",
          helperText: "Data de nascimento do membro."
        },
        status: {
          label: "Status",
          helperText: "Status atual do membro na igreja."
        }
      },
      submitButton: "Cadastrar membro",
      cancelButton: "Cancelar"
    }
  },
  users: {
    title: "Usuários do sistema",
    subtitle: "Gerencie os usuários com acesso ao sistema da sua igreja.",
    addButton: "Adicionar usuário",
    limitReached: "Você atingiu o limite de usuários do plano gratuito.",
    upgradeButton: "Conhecer plano completo",
    table: {
      name: "Nome",
      email: "Email",
      phone: "Telefone",
      role: "Papel",
      status: "Status",
      createdAt: "Data de cadastro",
      actions: "Ações"
    },
    status: {
      active: "Ativo",
      inactive: "Inativo"
    },
    roles: {
      admin: "Administrador",
      financial: "Financeiro",
      secretary: "Secretário"
    },
    modal: {
      title: "Adicionar novo usuário",
      subtitle: "Preencha os dados do usuário para cadastrá-lo no sistema.",
      fields: {
        name: {
          label: "Nome completo",
          placeholder: "João da Silva",
          helperText: "Nome completo do usuário."
        },
        email: {
          label: "Email",
          placeholder: "joao@email.com",
          helperText: "Email para login e comunicação."
        },
        phone: {
          label: "Telefone",
          placeholder: "(31) 99999-9999",
          helperText: "Telefone ou WhatsApp do usuário."
        },
        password: {
          label: "Senha",
          placeholder: "Crie uma senha segura",
          helperText: "Mínimo de 6 caracteres."
        },
        role: {
          label: "Papel",
          helperText: "Papel do usuário no sistema."
        },
        status: {
          label: "Status",
          helperText: "Status do usuário no sistema."
        }
      },
      submitButton: "Cadastrar usuário",
      cancelButton: "Cancelar"
    }
  },
  financial: {
    title: "Financeiro",
    subtitle: "Acompanhe as entradas e saídas da igreja.",
    addButton: "Novo lançamento",
    summaryCards: {
      income: {
        label: "Entradas do mês",
        value: "R$ 0,00"
      },
      expenses: {
        label: "Saídas do mês",
        value: "R$ 0,00"
      },
      balance: {
        label: "Saldo atual",
        value: "R$ 0,00"
      }
    },
    table: {
      date: "Data",
      type: "Tipo",
      category: "Categoria",
      description: "Descrição",
      value: "Valor"
    },
    types: {
      income: "Entrada",
      expense: "Saída"
    },
    categories: {
      income: [
        "Dízimos",
        "Ofertas",
        "Doações",
        "Eventos",
        "Outros"
      ],
      expense: [
        "Salários",
        "Manutenção",
        "Utilidades",
        "Eventos",
        "Doações",
        "Outros"
      ]
    },
    modal: {
      title: "Novo lançamento financeiro",
      subtitle: "Registre uma entrada ou saída financeira.",
      fields: {
        type: {
          label: "Tipo",
          helperText: "Selecione se é uma entrada ou saída."
        },
        category: {
          label: "Categoria",
          helperText: "Categoria do lançamento."
        },
        description: {
          label: "Descrição",
          placeholder: "Ex: Dízimo de João Silva",
          helperText: "Descrição do lançamento."
        },
        value: {
          label: "Valor",
          placeholder: "0,00",
          helperText: "Valor do lançamento."
        },
        date: {
          label: "Data",
          helperText: "Data do lançamento."
        }
      },
      submitButton: "Registrar lançamento",
      cancelButton: "Cancelar"
    },
    noData: "Ainda não há lançamentos financeiros registrados."
  },
  categories: {
    title: "Categorias financeiras",
    subtitle: "Organize entradas e saídas por categorias.",
    addButton: "Nova categoria",
    table: {
      name: "Nome",
      type: "Tipo",
      actions: "Ações"
    },
    types: {
      income: "Entrada",
      expense: "Saída"
    },
    modal: {
      title: "Nova categoria",
      subtitle: "Crie uma categoria para organizar os lançamentos.",
      fields: {
        name: {
          label: "Nome",
          placeholder: "Ex: Dízimos",
          helperText: "Nome da categoria."
        },
        description: {
          label: "Descrição",
          placeholder: "Ex: Categoria para dízimos recebidos",
          helperText: "Descrição da categoria."
        },
        type: {
          label: "Tipo",
          helperText: "Selecione se é entrada ou saída."
        }
      },
      submitButton: "Salvar categoria",
      cancelButton: "Cancelar"
    },
    noData: "Ainda não há categorias cadastradas."
  },
  reports: {
    title: "Relatórios",
    subtitle: "Acompanhe os relatórios da igreja.",
    freePlanNotice: "No plano gratuito, os relatórios podem ser visualizados na tela.",
    exportButton: "Exportar relatório",
    upgradeText: "Desbloqueie a exportação de relatórios no plano completo.",
    upgradeButton: "Conhecer plano completo",
    filters: {
      period: "Período",
      month: "Mês",
      year: "Ano"
    },
    types: {
      financial: "Financeiro mensal",
      incomeByCategory: "Entradas por categoria",
      expensesByCategory: "Saídas por categoria",
      summary: "Resumo geral"
    },
    noData: "Não há dados para o período selecionado."
  }
};

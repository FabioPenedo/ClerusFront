# ?? Documentação de API - Clerus

Esta documentação descreve todos os endpoints disponíveis na API Clerus.

## ?? Autenticação

A maioria dos endpoints requer autenticação via JWT. O token de acesso deve ser enviado no header `Authorization: Bearer {token}`.

---

## ?? Índice

- [Auth](#auth)
- [Categories](#categories)
- [Members](#members)
- [Transactions](#transactions)
- [Users](#users)
- [Financial Reports](#financial-reports)
- [Payments](#payments)
- [Webhooks](#webhooks)

---

## Auth

Endpoints de autenticação e gerenciamento de sessão.

### `POST /api/auth/signup`

Registra um novo usuário no sistema.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "tenantName": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "expiresIn": "number"
}
```

**Cookies:** Define um cookie `refresh_token` httpOnly

---

### `POST /api/auth/identify`

Identifica um usuário pelo email.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "exists": "boolean",
  "tenantName": "string"
}
```

---

### `POST /api/auth/login`

Autentica um usuário no sistema.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "expiresIn": "number"
}
```

**Cookies:** Define um cookie `refresh_token` httpOnly

---

### `POST /api/auth/logout`

Encerra a sessão do usuário.

**Autenticação:** Requerida

**Response:** `204 No Content`

**Cookies:** Remove o cookie `refresh_token`

---

## Categories

Gerenciamento de categorias de transações.

### `POST /api/categories`

Cria uma nova categoria.

**Autenticação:** Requerida

**Request Body:**
```json
{
  "name": "string",
  "typeCategory": "Income | Expense",
  "tenantId": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "typeCategory": "string",
    "tenantId": "number"
  }
}
```

---

### `GET /api/categories/{id}`

Busca uma categoria pelo ID.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da categoria

**Response:**
```json
{
  "success": true,
  "message": "Categoria encontrada com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "typeCategory": "string",
    "tenantId": "number",
    "transactions": []
  }
}
```

---

### `GET /api/categories`

Lista todas as categorias de um tenant.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant

**Response:**
```json
{
  "success": true,
  "message": "Categorias encontradas com sucesso",
  "data": [
    {
      "id": "number",
      "name": "string",
      "typeCategory": "string"
    }
  ]
}
```

---

### `PUT /api/categories/{id}`

Atualiza uma categoria existente.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da categoria

**Request Body:**
```json
{
  "name": "string",
  "typeCategory": "Income | Expense"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "typeCategory": "string",
    "tenantId": "number"
  }
}
```

---

### `DELETE /api/categories/{id}`

Remove uma categoria.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da categoria

**Response:**
```json
{
  "success": true,
  "message": "Categoria deletada com sucesso",
  "data": ""
}
```

---

## Members

Gerenciamento de membros da igreja.

### `POST /api/members`

Cria um novo membro.

**Autenticação:** Requerida

**Limites de Plano:** Este endpoint verifica os limites do plano (PlanLimitType.Member)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "birthDate": "datetime",
  "groupMember": "Adult | Child | Youth",
  "locality": "string",
  "tenantId": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Membro criado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "birthDate": "datetime",
    "groupMember": "string",
    "locality": "string",
    "tenantId": "number"
  }
}
```

---

### `GET /api/members/{id}`

Busca um membro pelo ID.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do membro

**Response:**
```json
{
  "success": true,
  "message": "Membro encontrado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "birthDate": "datetime",
    "groupMember": "string",
    "locality": "string",
    "tenantId": "number"
  }
}
```

---

### `GET /api/members`

Lista todos os membros de um tenant.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant

**Response:**
```json
{
  "success": true,
  "message": "Membros encontrados com sucesso",
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "groupMember": "string"
    }
  ]
}
```

---

### `PUT /api/members/{id}`

Atualiza um membro existente.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do membro

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "birthDate": "datetime",
  "groupMember": "Adult | Child | Youth",
  "locality": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Membro atualizado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phone": "string",
    "birthDate": "datetime",
    "groupMember": "string",
    "locality": "string",
    "tenantId": "number"
  }
}
```

---

### `DELETE /api/members/{id}`

Remove um membro.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do membro

**Response:**
```json
{
  "success": true,
  "message": "Membro deletado com sucesso",
  "data": ""
}
```

---

## Transactions

Gerenciamento de transações financeiras.

### `POST /api/transactions`

Cria uma nova transação.

**Autenticação:** Requerida

**Limites de Plano:** Este endpoint verifica os limites do plano (PlanLimitType.Transaction)

**Request Body:**
```json
{
  "description": "string",
  "amount": "decimal",
  "date": "datetime",
  "categoryId": "number",
  "memberId": "number (opcional)",
  "tenantId": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transação criada com sucesso",
  "data": {
    "id": "number",
    "description": "string",
    "amount": "decimal",
    "date": "datetime",
    "categoryId": "number",
    "memberId": "number",
    "tenantId": "number"
  }
}
```

---

### `GET /api/transactions/{id}`

Busca uma transação pelo ID.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da transação

**Response:**
```json
{
  "success": true,
  "message": "Transação encontrada com sucesso",
  "data": {
    "id": "number",
    "description": "string",
    "amount": "decimal",
    "date": "datetime",
    "category": {
      "id": "number",
      "name": "string"
    },
    "member": {
      "id": "number",
      "name": "string"
    },
    "tenantId": "number"
  }
}
```

---

### `GET /api/transactions`

Lista todas as transações de um tenant.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant

**Response:**
```json
{
  "success": true,
  "message": "Transações encontradas com sucesso",
  "data": [
    {
      "id": "number",
      "description": "string",
      "amount": "decimal",
      "date": "datetime",
      "categoryName": "string"
    }
  ]
}
```

---

### `PUT /api/transactions/{id}`

Atualiza uma transação existente.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da transação

**Request Body:**
```json
{
  "description": "string",
  "amount": "decimal",
  "date": "datetime",
  "categoryId": "number",
  "memberId": "number (opcional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transação atualizada com sucesso",
  "data": {
    "id": "number",
    "description": "string",
    "amount": "decimal",
    "date": "datetime",
    "categoryId": "number",
    "memberId": "number",
    "tenantId": "number"
  }
}
```

---

### `DELETE /api/transactions/{id}`

Remove uma transação.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID da transação

**Response:**
```json
{
  "success": true,
  "message": "Transação deletada com sucesso",
  "data": ""
}
```

---

## Users

Gerenciamento de usuários do sistema.

### `POST /api/users`

Cria um novo usuário.

**Autenticação:** Requerida

**Limites de Plano:** Este endpoint verifica os limites do plano (PlanLimitType.User)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "Admin | User",
  "tenantId": "number"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "tenantId": "number"
  }
}
```

---

### `GET /api/users/{id}`

Busca um usuário pelo ID.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do usuário

**Response:**
```json
{
  "success": true,
  "message": "Usuário encontrado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "tenantId": "number"
  }
}
```

---

### `GET /api/users`

Lista todos os usuários de um tenant.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant

**Response:**
```json
{
  "success": true,
  "message": "Usuários encontrados com sucesso",
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  ]
}
```

---

### `PUT /api/users/{id}`

Atualiza um usuário existente.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do usuário

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (opcional)",
  "role": "Admin | User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário atualizado com sucesso",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "tenantId": "number"
  }
}
```

---

### `DELETE /api/users/{id}`

Remove um usuário.

**Autenticação:** Requerida

**URL Parameters:**
- `id` (number): ID do usuário

**Response:**
```json
{
  "success": true,
  "message": "Usuário deletado com sucesso",
  "data": ""
}
```

---

## Financial Reports

Geração de relatórios financeiros.

### `GET /api/reports/financial/summary`

Obtém um resumo financeiro do período.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant
- `startDate` (datetime): Data inicial do período
- `endDate` (datetime): Data final do período

**Response:**
```json
{
  "success": true,
  "message": "Resumo financeiro gerado com sucesso",
  "data": {
    "totalIncome": "decimal",
    "totalExpense": "decimal",
    "balance": "decimal",
    "period": {
      "startDate": "datetime",
      "endDate": "datetime"
    }
  }
}
```

---

### `GET /api/reports/financial/by-category`

Obtém relatório de transações agrupadas por categoria.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant
- `startDate` (datetime): Data inicial do período
- `endDate` (datetime): Data final do período

**Response:**
```json
{
  "success": true,
  "message": "Relatório por categoria gerado com sucesso",
  "data": {
    "categories": [
      {
        "categoryName": "string",
        "totalAmount": "decimal",
        "transactionCount": "number",
        "percentage": "decimal"
      }
    ]
  }
}
```

---

### `GET /api/reports/financial/monthly`

Obtém relatório mensal de transações.

**Autenticação:** Requerida

**Query Parameters:**
- `tenantId` (number): ID do tenant
- `startDate` (datetime): Data inicial do período
- `endDate` (datetime): Data final do período

**Response:**
```json
{
  "success": true,
  "message": "Relatório mensal gerado com sucesso",
  "data": {
    "months": [
      {
        "month": "string",
        "year": "number",
        "totalIncome": "decimal",
        "totalExpense": "decimal",
        "balance": "decimal"
      }
    ]
  }
}
```

---

### `GET /api/reports/financial/export/pdf`

Exporta relatório financeiro em PDF.

**Autenticação:** Requerida

**Limites de Plano:** Este endpoint verifica os limites do plano (PlanLimitType.ExportPdfExcel)

**Query Parameters:**
- `tenantId` (number): ID do tenant
- `startDate` (datetime): Data inicial do período
- `endDate` (datetime): Data final do período

**Response:** Arquivo PDF (`application/pdf`)

**Nome do arquivo:** `relatorio-financeiro-{startDate}-{endDate}.pdf`

---

### `GET /api/reports/financial/export/excel`

Exporta relatório financeiro em Excel.

**Autenticação:** Requerida

**Limites de Plano:** Este endpoint verifica os limites do plano (PlanLimitType.ExportPdfExcel)

**Query Parameters:**
- `tenantId` (number): ID do tenant
- `startDate` (datetime): Data inicial do período
- `endDate` (datetime): Data final do período

**Response:** Arquivo Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

**Nome do arquivo:** `relatorio-financeiro-{startDate}-{endDate}.xlsx`

---

## Payments

Gerenciamento de pagamentos via PIX.

### `POST /api/payments`

Cria um QR Code PIX para pagamento.

**Autenticação:** Requerida

**Request Body:** Nenhum (usa o tenantId do token JWT)

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": "string",
    "qrCodeUrl": "string",
    "externalId": "string",
    "amount": "decimal",
    "expiresAt": "datetime"
  },
  "error": null
}
```

**Observação:** O `tenantId` é extraído automaticamente das claims do usuário autenticado.

---

## Webhooks

Recebimento de webhooks de gateways de pagamento.

### `POST /api/webhooks/abacatepay`

Recebe notificações de webhook do AbacatePay.

**Autenticação:** Não requerida (AllowAnonymous)

**Request Body:**
```json
{
  "event": "string",
  "data": {
    "pixQrCode": {
      "id": "string",
      "status": "string",
      "amount": "decimal"
    }
  }
}
```

**Response:** `200 OK`

**Observação:** 
- Este endpoint registra o evento em uma fila para processamento assíncrono
- Eventos duplicados (mesmo `externalId` e `eventType`) são ignorados
- O processamento é feito via Hangfire job em background

---

## ?? Notas Gerais

### Formato de Resposta Padrão

A maioria dos endpoints retorna respostas no formato:

```json
{
  "success": boolean,
  "message": "string",
  "data": object | array | string
}
```

### Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `204 No Content`: Requisição bem-sucedida sem conteúdo de retorno
- `400 Bad Request`: Dados inválidos ou erro de validação
- `401 Unauthorized`: Token de autenticação ausente ou inválido
- `403 Forbidden`: Limite de plano excedido
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

### Validação de Limites de Plano

Alguns endpoints possuem validação de limites baseada no plano do tenant:

- **Members**: Limite de membros cadastrados
- **Transactions**: Limite de transações registradas
- **Users**: Limite de usuários do sistema
- **Export PDF/Excel**: Funcionalidade disponível apenas em planos premium

### Multi-tenancy

O sistema utiliza arquitetura multi-tenant. O `tenantId` é usado para isolar os dados de cada organização/igreja.

### Refresh Token

Os tokens de acesso são renovados automaticamente através de um middleware que verifica o cookie `refresh_token`.

---

**Versão da API:** 1.0  
**Projeto:** Clerus - Sistema de Gestão Eclesiástica  
**Framework:** .NET 10

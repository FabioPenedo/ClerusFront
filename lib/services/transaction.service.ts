import { httpClient } from "@/lib/http-client";
import { sessionStore } from "../info.store";

export type TransactionType = "Income" | "Expense";

export interface Transaction {
    id: number;
    amount: number;
    typeTransaction: TransactionType;
    date: string;
    createdAt: string;
    CreatedByUserId: number;
    categoryId: number;
    tenantId: number;
}

export interface TransactionDetails {
    id: number;
    amount: number;
    typeTransaction: TransactionType;
    date: string;
    createdAt: string;
    createdByUserId: number;
    tenantId: number;
    categoryId: number;
    categoryName: string;
    tenantName: string;
}

export interface TransactionListItem {
    id: number;
    amount: number;
    typeTransaction: TransactionType;
    date: string;
    categoryId: number;
    categoryName: string;
}

export interface CreateTransactionDTO {
    amount: number;
    typeTransaction: TransactionType;
    date: string;
    createdByUserId: number;
    categoryId: number;
    tenantId: number;
}

export interface UpdateTransactionDTO {
    amount?: number;
    typeTransaction?: TransactionType;
    date?: string;
    categoryId?: number;
}

// Create transaction
export async function createTransaction(
    data: CreateTransactionDTO
): Promise<Transaction> {
    return httpClient.post<Transaction>("/transactions", data);
}

// List transactions by tenant
export async function getTransactions(): Promise<TransactionListItem[]> {
    const session = sessionStore.get();
    if (!session) throw new Error("Sessao nao encontrada");
    const tenantId = session.tenant.id;
    return httpClient.get<TransactionListItem[]>(
        `/transactions?tenantId=${tenantId}`
    );
}

// Get transaction by id
export async function getTransactionById(
    transactionId: number
): Promise<TransactionDetails> {
    return httpClient.get<TransactionDetails>(
        `/transactions/${transactionId}`
    );
}

// Update transaction
export async function updateTransaction(
    transactionId: number,
    data: UpdateTransactionDTO
): Promise<Transaction> {
    return httpClient.put<Transaction>(
        `/transactions/${transactionId}`,
        data
    );
}

// Delete transaction
export async function deleteTransaction(transactionId: number): Promise<void> {
    return httpClient.delete<void>(`/transactions/${transactionId}`);
}
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { TransactionListItem } from "@/lib/services/transaction.service";

interface DeleteEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionListItem | null;
  onDelete?: () => Promise<void>;
}

export function DeleteEntryModal({
  open,
  onOpenChange,
  transaction,
  onDelete,
}: DeleteEntryModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      if (onDelete) {
        await onDelete();
      }
      onOpenChange(false);
    } catch (err) {
      setError("Erro ao deletar lancamento. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            Deletar lancamento
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Tem certeza que deseja deletar o lancamento de
            {" "}
            <strong>
              {transaction
                ? `${transaction.categoryName} (${formatCurrency(transaction.amount)})`
                : ""}
            </strong>
            ? Esta acao nao pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deletando..." : "Deletar lancamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

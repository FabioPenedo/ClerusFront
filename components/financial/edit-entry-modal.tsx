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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { dashboard } from "@/lib/content";
import { Category } from "@/lib/services/categories.service";
import {
  TransactionListItem,
  TransactionType,
  UpdateTransactionDTO,
} from "@/lib/services/transaction.service";

const financial = dashboard.financial;

interface EditEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  transaction: TransactionListItem | null;
  onUpdate?: (data: UpdateTransactionDTO) => Promise<void>;
}

export function EditEntryModal({
  open,
  onOpenChange,
  categories,
  transaction,
  onUpdate,
}: EditEntryModalProps) {
  const [formData, setFormData] = React.useState({
    typeTransaction: "Income" as TransactionType,
    categoryId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!transaction) {
      return;
    }

    setFormData({
      typeTransaction: transaction.typeTransaction,
      categoryId: transaction.categoryId.toString(),
      amount: String(transaction.amount),
      date: new Date(transaction.date).toISOString().split("T")[0]
    });
    setErrors({});
  }, [transaction, open]);

  const availableCategories = React.useMemo(() => {
    return categories;
  }, [categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.categoryId) {
      newErrors.categoryId = "A categoria e obrigatoria.";
    }

    const parsedValue = parseFloat(formData.amount.replace(",", "."));
    if (!formData.amount || Number.isNaN(parsedValue) || parsedValue <= 0) {
      newErrors.amount = "O valor deve ser maior que zero.";
    }

    if (!formData.date) {
      newErrors.date = "A data e obrigatoria.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryId = parseInt(formData.categoryId, 10);
      if (Number.isNaN(categoryId)) {
        throw new Error("Categoria invalida");
      }

      if (onUpdate) {
        await onUpdate({
          amount: parsedValue,
          typeTransaction: formData.typeTransaction,
          date: new Date(formData.date).toISOString(),
          categoryId,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar lancamento";
      setErrors({ submit: message });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      typeTransaction: value as TransactionType,
      categoryId: ""
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar lancamento</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Atualize os dados do lancamento selecionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type">{financial.modal.fields.type.label}</Label>
            <select
              id="type"
              name="typeTransaction"
              value={formData.typeTransaction}
              onChange={handleTypeChange}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Income">{financial.types.income}</option>
              <option value="Expense">{financial.types.expense}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {financial.modal.fields.type.helperText}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{financial.modal.fields.category.label}</Label>
            <select
              id="category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.categoryId ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              required
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.categoryId}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {availableCategories.length === 0
                  ? "Nenhuma categoria encontrada."
                  : financial.modal.fields.category.helperText}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">{financial.modal.fields.value.label}</Label>
              <Input
                id="value"
                name="amount"
                type="text"
                placeholder={financial.modal.fields.value.placeholder}
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.amount ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {financial.modal.fields.value.helperText}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{financial.modal.fields.date.label}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.date ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.date}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {financial.modal.fields.date.helperText}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Salvar alteracoes"}
            </Button>
          </div>
          {errors.submit && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.submit}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

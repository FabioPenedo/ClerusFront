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
import { dashboard } from "@/lib/content";
import { AlertCircle } from "lucide-react";

const financial = dashboard.financial;

interface AddEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEntryModal({ open, onOpenChange, onSuccess }: AddEntryModalProps) {
  const [formData, setFormData] = React.useState({
    type: "income" as "income" | "expense",
    category: "",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const availableCategories = formData.type === "income" 
    ? financial.categories.income 
    : financial.categories.expense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.category) {
      newErrors.category = "A categoria é obrigatória.";
    }
    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória.";
    }
    if (!formData.value || parseFloat(formData.value.replace(",", ".")) <= 0) {
      newErrors.value = "O valor deve ser maior que zero.";
    }
    if (!formData.date) {
      newErrors.date = "A data é obrigatória.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulação de cadastro - substituir por chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onOpenChange(false);
    
    // Resetar formulário
    setFormData({
      type: "income",
      category: "",
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0]
    });

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      type: value as "income" | "expense",
      category: "" // Resetar categoria ao mudar tipo
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{financial.modal.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {financial.modal.subtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type">{financial.modal.fields.type.label}</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="income">{financial.types.income}</option>
              <option value="expense">{financial.types.expense}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {financial.modal.fields.type.helperText}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{financial.modal.fields.category.label}</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.category ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              required
            >
              <option value="">Selecione uma categoria</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {financial.modal.fields.category.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{financial.modal.fields.description.label}</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder={financial.modal.fields.description.placeholder}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.description ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {financial.modal.fields.description.helperText}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">{financial.modal.fields.value.label}</Label>
              <Input
                id="value"
                name="value"
                type="text"
                placeholder={financial.modal.fields.value.placeholder}
                value={formData.value}
                onChange={handleChange}
                className={errors.value ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errors.value ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.value}
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
              {financial.modal.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : financial.modal.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

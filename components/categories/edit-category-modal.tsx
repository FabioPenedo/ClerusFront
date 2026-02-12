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
import { Category, CategoryType, UpdateCategoryDTO } from "@/lib/services/categories.service";

const categoriesContent = dashboard.categories;

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onUpdate?: (data: UpdateCategoryDTO) => Promise<void>;
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onUpdate,
}: EditCategoryModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
      });
      setErrors({});
    }
  }, [category, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[name];
        delete nextErrors.form;
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "A descrição é obrigatória.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (onUpdate) {
        await onUpdate({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
      }

      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao atualizar categoria";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar categoria</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Atualize os dados da categoria
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="name">{categoriesContent.modal.fields.name.label}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={categoriesContent.modal.fields.name.placeholder}
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.name ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {categoriesContent.modal.fields.name.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{categoriesContent.modal.fields.description.label}</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder={categoriesContent.modal.fields.description.placeholder}
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
                {categoriesContent.modal.fields.description.helperText}
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

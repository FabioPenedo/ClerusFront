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

const members = dashboard.members;

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddMemberModal({ open, onOpenChange, onSuccess }: AddMemberModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive"
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email inválido.";
      }
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
      name: "",
      email: "",
      phone: "",
      status: "active"
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{members.modal.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {members.modal.subtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">{members.modal.fields.name.label}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={members.modal.fields.name.placeholder}
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
                {members.modal.fields.name.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{members.modal.fields.email.label}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={members.modal.fields.email.placeholder}
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.email ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {members.modal.fields.email.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{members.modal.fields.phone.label}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={members.modal.fields.phone.placeholder}
              value={formData.phone}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">
              {members.modal.fields.phone.helperText}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{members.modal.fields.status.label}</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="active">{members.status.active}</option>
              <option value="inactive">{members.status.inactive}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {members.modal.fields.status.helperText}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {members.modal.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : members.modal.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

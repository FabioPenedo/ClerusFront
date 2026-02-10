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
import { User, UserRole } from "@/lib/services/user.service";

const users = dashboard.users;
const ROLES: UserRole[] = ["Administrador", "Financeiro", "Secretário"];

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUpdate?: (data: { name: string; email: string; phone: string; role: UserRole; active: boolean }) => Promise<void>;
}

export function EditUserModal({ open, onOpenChange, user, onUpdate }: EditUserModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "Secretário" as UserRole,
    active: true,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        active: user.active,
      });
      setErrors({});
    }
  }, [user, open]);

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
    if (!formData.phone.trim()) {
      newErrors.phone = "O telefone é obrigatório.";
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
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          active: formData.active,
        });
      }

      onOpenChange(false);
    } catch (err) {
      setErrors({ form: "Erro ao atualizar usuário." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.form;
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Usuário</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Atualize os dados do usuário
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="name">{users.modal.fields.name.label}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={users.modal.fields.name.placeholder}
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
                {users.modal.fields.name.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{users.modal.fields.email.label}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={users.modal.fields.email.placeholder}
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
                {users.modal.fields.email.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{users.modal.fields.phone.label}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={users.modal.fields.phone.placeholder}
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.phone ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {users.modal.fields.phone.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{users.modal.fields.role.label}</Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {users.modal.fields.role.helperText}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="active">{users.modal.fields.status.label}</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="active" className="font-normal cursor-pointer">
                {users.status.active}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {users.modal.fields.status.helperText}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {users.modal.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

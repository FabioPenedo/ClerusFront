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
import { CreateMemberDTO } from "@/lib/services/member.service";
import { sessionStore } from "@/lib/info.store";

const members = dashboard.members;

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: CreateMemberDTO) => Promise<void>;
}

export function AddMemberModal({ open, onOpenChange, onCreate }: AddMemberModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    group: "criança" as "criança" | "adolescente" | "jovem" | "adulto" | "idoso",
    birthday: "",
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
    if (!formData.phone.trim()) {
      newErrors.phone = "O telefone é obrigatório.";
    }
    if (!formData.age.trim()) {
      newErrors.age = "A idade é obrigatória.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const session = sessionStore.get();
      if (!session?.tenant?.id)  throw new Error("Tenant não encontrado na sessão");
      const tenantId = parseInt(session.tenant.id.toString());
      


      if (onCreate) {
        await onCreate({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          age: parseInt(formData.age.trim()),
          group: formData.group,
          birthday: formData.birthday,
          tenantId: tenantId,
        });
      }

      onOpenChange(false);

      // Resetar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        age: "",
        group: "criança",
        birthday: "",
      });
    } catch (err) {
      setErrors({ form: "Erro ao cadastrar membro." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <DialogTitle className="text-2xl">{members.modal.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {members.modal.subtitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.form ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          ) : null}
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
                {members.modal.fields.phone.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">{members.modal.fields.age.label}</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder={members.modal.fields.age.placeholder}
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? "border-red-500 focus-visible:ring-red-500" : ""}
              required
            />
            {errors.age ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.age}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {members.modal.fields.age.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">{members.modal.fields.birthday.label}</Label>
            <Input
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              className={errors.birthday ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.birthday ? (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.birthday}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {members.modal.fields.birthday.helperText}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">{members.modal.fields.group.label}</Label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleChange}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="criança">{members.groups.child}</option>
              <option value="adolescente">{members.groups.teen}</option>
              <option value="jovem">{members.groups.young}</option>
              <option value="adulto">{members.groups.adult}</option>
              <option value="idoso">{members.groups.elder}</option>
            </select>
            <p className="text-xs text-muted-foreground">
              {members.modal.fields.group.helperText}
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

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
import { Member, UpdateMemberDTO } from "@/lib/services/member.service";

const members = dashboard.members;

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onUpdate?: (data: UpdateMemberDTO) => Promise<void>;
}

export function EditMemberModal({ open, onOpenChange, member, onUpdate }: EditMemberModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    group: "criança" as "criança" | "adolescente" | "jovem" | "adulto" | "idoso",
    active: true,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        age: member.age.toString(),
        group: member.group,
        active: member.active,
      });
      setErrors({});
    }
  }, [member, open]);

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
      if (onUpdate) {
        await onUpdate({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          age: parseInt(formData.age.trim()),
          group: formData.group,
          active: formData.active,
        });
      }

      onOpenChange(false);
    } catch (err) {
      setErrors({ form: "Erro ao atualizar membro." });
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
          <DialogTitle className="text-2xl">Editar Membro</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Atualize os dados do membro
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

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-input bg-background"
              />
              <span className="text-sm font-medium">{members.status.active}</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Desative para inativar este membro
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
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

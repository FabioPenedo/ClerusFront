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
import { Member } from "@/lib/services/member.service";

interface DeleteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onDelete?: () => Promise<void>;
}

export function DeleteMemberModal({ open, onOpenChange, member, onDelete }: DeleteMemberModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      if (onDelete) {
        await onDelete();
      }
      onOpenChange(false);
    } catch (err) {
      setError("Erro ao deletar membro. Tente novamente.");
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
            Deletar Membro
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Tem certeza que deseja deletar o membro <strong>{member?.name}</strong>? Esta ação não pode ser desfeita.
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
            {isDeleting ? "Deletando..." : "Deletar Membro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

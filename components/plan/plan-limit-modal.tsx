"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  onUpgrade?: () => void;
}

const featureMessages: Record<string, string> = {
  members: "Você atingiu o limite de membros do plano gratuito (50 membros).",
  users: "Você atingiu o limite de usuários do plano gratuito (1 usuário).",
  canExportReports: "A exportação de relatórios está disponível apenas no plano completo.",
  canUseAI: "Os recursos de IA estão disponíveis apenas no plano completo."
};

export function PlanLimitModal({
  open,
  onOpenChange,
  feature,
  onUpgrade
}: PlanLimitModalProps) {
  const featureMessage = feature ? featureMessages[feature] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">
              Limite do plano gratuito
            </DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            {featureMessage || "Você atingiu o limite do plano gratuito."}
            <br />
            <br />
            Para continuar usando esta funcionalidade, conheça o plano completo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={() => {
              if (onUpgrade) {
                onUpgrade();
              }
              onOpenChange(false);
            }}
            className="w-full"
          >
            Conhecer plano completo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

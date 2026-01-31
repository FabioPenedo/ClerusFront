"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Bell, Plus, LogOut } from "lucide-react";
import { PlanLimitModal } from "@/components/plan/plan-limit-modal";
import { useAuth } from "@/contexts/auth-context";

interface TopbarProps {
  churchName?: string;
  userName?: string;
}

export function Topbar({ churchName, userName }: TopbarProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      
      // Redireciona para login após logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">teste</h1>
              <p className="text-xs text-muted-foreground">
                Tenant ID: teste
              </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Só mostra botão se for Admin */}
             <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar usuário
              </Button>


            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">teste</p>
                <p className="text-xs text-muted-foreground">teste</p>
              </div>
              
              {/* Botão de Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">
                  {isLoggingOut ? 'Saindo...' : 'Sair'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de limite de plano */}
      <PlanLimitModal
        open={false}
        onOpenChange={() => {}}
        feature={undefined}
        onUpgrade={() => {
          window.location.href = "/#pricing";
        }}
      />
    </>
  );
}

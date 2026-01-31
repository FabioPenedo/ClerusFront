"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddMemberModal } from "@/components/members/add-member-modal";
import { PlanLimitModal } from "@/components/plan/plan-limit-modal";
import { Plus, AlertCircle } from "lucide-react";
import { dashboard } from "@/lib/content";
import { mockDashboardData } from "@/lib/mock-data";

const members = dashboard.members;

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const data = mockDashboardData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const handleMemberAdded = () => {

  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{members.title}</h1>
          <p className="text-muted-foreground mt-2">{members.subtitle}</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={false}
        >
          <Plus className="h-4 w-4 mr-2" />
          {members.addButton}
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">{members.limitReached}</p>
                <p className="text-sm text-amber-700 mt-1">
                  Faça upgrade para cadastrar mais membros.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              {members.upgradeButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do plano */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          membros cadastrados
        </p>
        <p className="text-amber-600 font-medium">
          Você está próximo do limite do plano gratuito.
        </p>
      </div>

      {/* Tabela de membros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de membros</CardTitle>
          <CardDescription>
            Todos os membros cadastrados na sua igreja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Ainda não há membros cadastrados.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro membro
            </Button>
          </div>
          ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{members.table.name}</TableHead>
                  <TableHead>{members.table.email}</TableHead>
                  <TableHead>{members.table.phone}</TableHead>
                  <TableHead>{members.table.status}</TableHead>
                  <TableHead>{members.table.createdAt}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersList && membersList.length > 0 ? (
                  membersList.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.status === "active" ? "default" : "outline"}
                        >
                          {member.status === "active"
                            ? members.status.active
                            : members.status.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(member.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>
          )
        </CardContent>
      </Card>

      {/* Modal de adicionar membro */}
      <AddMemberModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleMemberAdded}
      />

      {/* Modal de limite de plano */}
    </div>
  );
}

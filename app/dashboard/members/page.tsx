"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { EditMemberModal } from "@/components/members/edit-member-modal";
import { DeleteMemberModal } from "@/components/members/delete-member-modal";
import { PlanLimitModal } from "@/components/plan/plan-limit-modal";
import { Plus, AlertCircle, Loader2, Edit2, Trash2 } from "lucide-react";
import { dashboard } from "@/lib/content";
import {
  createMember,
  CreateMemberDTO,
  getMembers,
  updateMember,
  UpdateMemberDTO,
  deleteMember,
  Member
} from "@/lib/services/member.service";

const members = dashboard.members;

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); 
  };

  const handleCreateMember = async (data: CreateMemberDTO) => {
    try {
      setError(null);
      await createMember(data);
      await handleGetMembers();
    } catch (err) {
      setError("Erro ao cadastrar membro");
      throw err;
    }
  };

  const handleUpdateMember = async (data: UpdateMemberDTO) => {
    try {
      setError(null);
      if (selectedMember) {
        await updateMember(selectedMember.id, data);
        await handleGetMembers();
      }
    } catch (err) {
      setError("Erro ao atualizar membro");
      throw err;
    }
  };

  const handleDeleteMember = async () => {
    try {
      setError(null);
      if (selectedMember) {
        await deleteMember(selectedMember.id);
        await handleGetMembers();
      }
    } catch (err) {
      setError("Erro ao deletar membro");
      throw err;
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleGetMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMembers();
      setMembersList(response);
    } catch (err) {
      setError("Erro ao carregar membros");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetMembers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{members.title}</h1>
          <p className="text-muted-foreground mt-2">{members.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {members.addButton}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <div className="flex">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">Erro</h3>
              <div className="mt-2 text-sm text-destructive">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Aviso de limite do plano */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">
                  {members.limitReached}
                </p>
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

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de membros</CardTitle>
          <CardDescription>
            Todos os membros cadastrados na sua igreja.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : membersList.length === 0 ? (
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
                    <TableHead>{members.table.age}</TableHead>
                    <TableHead>{members.table.group}</TableHead>
                    <TableHead>{members.table.birthday}</TableHead>
                    <TableHead>{members.table.status}</TableHead>
                    <TableHead>{members.table.createdAt}</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersList.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{member.group}</TableCell>
                      <TableCell>{formatDate(member.birthday)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={member.active ? "default" : "outline"}
                        >
                          {member.active
                            ? members.status.active
                            : members.status.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(member.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Editar membro"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(member)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Deletar membro"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal adicionar membro */}
      <AddMemberModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateMember}
      />

      {/* Modal editar membro */}
      <EditMemberModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        member={selectedMember}
        onUpdate={handleUpdateMember}
      />

      {/* Modal deletar membro */}
      <DeleteMemberModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        member={selectedMember}
        onDelete={handleDeleteMember}
      />

      {/* Modal limite do plano */}
      <PlanLimitModal
        open={false}
        onOpenChange={() => {}}
        feature="members"
        onUpgrade={() => {
          window.location.href = "/#pricing";
        }}
      />
    </div>
  );
}

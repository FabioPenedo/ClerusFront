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
import { AddUserModal } from "@/components/dashboard/add-user-modal";
import { EditUserModal } from "@/components/users/edit-user-modal";
import { DeleteUserModal } from "@/components/users/delete-user-modal";
import { PlanLimitModal } from "@/components/plan/plan-limit-modal";
import { Plus, AlertCircle, Loader2, Edit2, Trash2 } from "lucide-react";
import { dashboard } from "@/lib/content";
import {
  createUser,
  CreateUserDTO,
  getUsers,
  updateUser,
  deleteUser,
  User
} from "@/lib/services/user.service";
import { sessionStore } from "@/lib/info.store";

const users = dashboard.users;
const isPlanFree = sessionStore.get()?.tenant.plan === "free"

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCreateUser = async (data: CreateUserDTO) => {
    try {
      setError(null);
      await createUser(data);
      await handleGetUsers();
    } catch (err) {
      setError("Erro ao cadastrar usuário");
      throw err;
    }
  };

  const handleUpdateUser = async (data: Partial<CreateUserDTO>) => {
    try {
      setError(null);
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        await handleGetUsers();
      }
    } catch (err) {
      setError("Erro ao atualizar usuário");
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    try {
      setError(null);
      if (selectedUser) {
        await deleteUser(selectedUser.id);
        await handleGetUsers();
      }
    } catch (err) {
      setError("Erro ao deletar usuário");
      throw err;
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleGetUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUsers();
      setUsersList(response);
    } catch (err) {
      setError("Erro ao carregar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{users.title}</h1>
          <p className="text-muted-foreground mt-2">{users.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={isPlanFree}>
          <Plus className="h-4 w-4 mr-2" />
          {users.addButton}
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
      {isPlanFree && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    {users.limitReached}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Faça upgrade para cadastrar mais usuários.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { window.location.href = "/#pricing"; }}>
                {users.upgradeButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de usuários</CardTitle>
          <CardDescription>
            Todos os usuários cadastrados na sua igreja.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : usersList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Ainda não há usuários cadastrados.
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar primeiro usuário
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{users.table.name}</TableHead>
                    <TableHead>{users.table.email}</TableHead>
                    <TableHead>{users.table.phone}</TableHead>
                    <TableHead>{users.table.role}</TableHead>
                    <TableHead>{users.table.status}</TableHead>
                    <TableHead>{users.table.createdAt}</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.active ? "default" : "outline"}
                        >
                          {user.active
                            ? users.status.active
                            : users.status.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Editar usuário"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Deletar usuário"
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

      {/* Modal adicionar usuário */}
      <AddUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateUser}
      />

      {/* Modal editar usuário */}
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        onUpdate={handleUpdateUser}
      />

      {/* Modal deletar usuário */}
      <DeleteUserModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        user={selectedUser}
        onDelete={handleDeleteUser}
      />

      {/* Modal limite do plano */}
      <PlanLimitModal
        open={false}
        onOpenChange={() => { }}
        feature="users"
        onUpgrade={() => {
          window.location.href = "/#pricing";
        }}
      />
    </div>
  );
}

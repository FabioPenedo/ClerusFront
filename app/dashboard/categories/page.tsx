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
import { Plus, AlertCircle, Loader2, Edit2, Trash2 } from "lucide-react";
import { dashboard } from "@/lib/content";
import {
  CategoriesService,
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from "@/lib/services/categories.service";
import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { EditCategoryModal } from "@/components/categories/edit-category-modal";
import { DeleteCategoryModal } from "@/components/categories/delete-category-modal";

const categoriesContent = dashboard.categories;

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await CategoriesService.getCategories();
      setCategories(response);
    } catch (err) {
      setError("Erro ao carregar categorias");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (data: CreateCategoryDTO) => {
    try {
      setError(null);
      await CategoriesService.createCategory(data);
      await handleGetCategories();
    } catch (err) {
      setError("Erro ao cadastrar categoria");
      throw err;
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryDTO) => {
    try {
      setError(null);
      if (selectedCategory) {
        await CategoriesService.updateCategory(selectedCategory.id, data);
        await handleGetCategories();
      }
    } catch (err) {
      setError("Erro ao atualizar categoria");
      throw err;
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setError(null);
      if (selectedCategory) {
        await CategoriesService.deleteCategory(selectedCategory.id);
        await handleGetCategories();
      }
    } catch (err) {
      setError("Erro ao deletar categoria");
      throw err;
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{categoriesContent.title}</h1>
          <p className="text-muted-foreground mt-2">{categoriesContent.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {categoriesContent.addButton}
        </Button>
      </div>

      {/* Demonstrativo de categorias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Categorias cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de categorias</CardTitle>
          <CardDescription>
            Gerencie as categorias financeiras da sua igreja.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {categoriesContent.noData}
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar primeira categoria
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{categoriesContent.table.name}</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>{categoriesContent.table.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Editar categoria"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                            title="Deletar categoria"
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

      <AddCategoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={selectedCategory}
        onUpdate={handleUpdateCategory}
      />

      <DeleteCategoryModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}

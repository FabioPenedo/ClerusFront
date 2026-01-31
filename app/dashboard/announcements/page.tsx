"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddAnnouncementModal } from "@/components/announcements/add-announcement-modal";
import { Plus, MessageSquare, Mail, AlertCircle, Edit, Trash2 } from "lucide-react";
import { dashboard } from "@/lib/content";
import { mockAnnouncements } from "@/lib/mock-data";

const announcements = dashboard.announcements;

export default function AnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementsList, setAnnouncementsList] = useState(mockAnnouncements);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleAnnouncementAdded = () => {
    // Simulação: adicionar novo anúncio à lista
    // Em produção, isso viria de uma chamada à API
    const newAnnouncement = {
      id: String(announcementsList.length + 1),
      title: "Novo anúncio",
      message: "Mensagem do novo anúncio",
      status: "active" as const,
      channels: {
        internal: true,
        whatsapp: false,
        email: false
      },
      createdAt: new Date().toISOString()
    };
    setAnnouncementsList([newAnnouncement, ...announcementsList]);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este anúncio?")) {
      setAnnouncementsList(announcementsList.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{announcements.title}</h1>
          <p className="text-muted-foreground mt-2">{announcements.subtitle}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {announcements.addButton}
        </Button>
      </div>

      {/* Aviso de integração futura */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-900">
              {announcements.integrationNotice}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de anúncios */}
      {announcementsList.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {announcements.noData}
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro anúncio
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {announcementsList.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{announcement.title}</CardTitle>
                      <Badge
                        variant={announcement.status === "active" ? "default" : "outline"}
                      >
                        {announcement.status === "active"
                          ? announcements.status.active
                          : announcements.status.draft}
                      </Badge>
                    </div>
                    <CardDescription className="text-base mt-2">
                      {announcement.message}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Em produção, abrir modal de edição
                        console.log("Editar anúncio:", announcement.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Canais:</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 border-green-200">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {announcements.channels.internal}
                        </Badge>
                        <Badge variant="outline" className="opacity-50">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {announcements.channels.whatsapp}
                        </Badge>
                        <Badge variant="outline" className="opacity-50">
                          <Mail className="h-3 w-3 mr-1" />
                          {announcements.channels.email}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(announcement.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de criar anúncio */}
      <AddAnnouncementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleAnnouncementAdded}
      />
    </div>
  );
}

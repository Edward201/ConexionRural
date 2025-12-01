import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { DashboardNav } from "@/components/dashboard-nav";
import { Edit, Eye, EyeOff, Save, X, Plus, Trash2, Users, Image as ImageIcon } from "lucide-react";
import type { TeamCard } from "@shared/schema";

export default function TeamCardsManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<TeamCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  // Verificar autenticación
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("No autenticado");
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !authData) {
      setLocation("/login");
    } else if (authData) {
      setCurrentUser(authData.user);
      if (authData.user.role !== "admin") {
        toast({
          variant: "destructive",
          title: "Acceso denegado",
          description: "Solo administradores pueden gestionar cards del equipo",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation, toast]);

  // Obtener cards del equipo
  const { data: cardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["cms-team-cards"],
    queryFn: async () => {
      const response = await fetch("/api/cms/team-cards/admin", {
        credentials: "include",
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("Error al obtener cards del equipo");
      const data = await response.json();
      return data;
    },
    enabled: !!authData,
    staleTime: 0,
  });

  // Crear/Actualizar card
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreating
        ? "/api/cms/team-cards"
        : `/api/cms/team-cards/${selectedCard?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Error al guardar card";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Error del servidor: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error parseando respuesta JSON:", error);
        throw new Error("La respuesta del servidor no es válida");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-team-cards"] });
      queryClient.invalidateQueries({ queryKey: ["team-cards"] }); // Invalidar también la query pública
      toast({
        title: isCreating ? "Card creada" : "Card actualizada",
        description: "Los cambios se guardaron correctamente",
      });
      setEditDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Eliminar card
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cms/team-cards/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al eliminar card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-team-cards"] });
      queryClient.invalidateQueries({ queryKey: ["team-cards"] }); // Invalidar también la query pública
      toast({
        title: "Card eliminada",
        description: "La card se eliminó correctamente",
      });
      setDeleteDialogOpen(false);
      setSelectedCard(null);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      isActive: true,
      order: 0,
    });
    setSelectedCard(null);
    setIsCreating(false);
  };

  const handleEdit = (card: TeamCard) => {
    setSelectedCard(card);
    setFormData({
      title: card.title,
      description: card.description || "",
      imageUrl: card.imageUrl || "",
      isActive: card.isActive,
      order: card.order || 0,
    });
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleDelete = (card: TeamCard) => {
    setSelectedCard(card);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    // Limpiar campos vacíos antes de enviar
    const dataToSend = {
      title: formData.title,
      description: formData.description?.trim() || null,
      imageUrl: formData.imageUrl?.trim() || null,
      order: formData.order || 0,
      isActive: formData.isActive ?? true,
    };
    saveMutation.mutate(dataToSend);
  };

  const confirmDelete = () => {
    if (selectedCard) {
      deleteMutation.mutate(selectedCard.id);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const cards: TeamCard[] = cardsData?.cards || [];

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Cards del Equipo</h1>
              <p className="text-gray-600 mt-1">
                Gestiona las cards de la sección "Quiénes somos"
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Card
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{cards.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Cards Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {cards.filter((c) => c.isActive).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Cards Inactivas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-400">
                  {cards.filter((c) => !c.isActive).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de cards */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Cards</CardTitle>
              <CardDescription>
                Administra las cards que se muestran en la sección "Quiénes somos"
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cardsLoading ? (
                <p>Cargando cards...</p>
              ) : cards.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay cards disponibles</p>
                  <Button onClick={handleCreate} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primera card
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Orden</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Actualizado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cards.map((card) => (
                        <TableRow key={card.id}>
                          <TableCell className="font-medium">{card.order}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{card.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {card.description || "-"}
                          </TableCell>
                          <TableCell>
                            {card.imageUrl ? (
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <ImageIcon className="h-3 w-3" />
                                Imagen
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-400">Sin imagen</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {card.isActive ? (
                              <Badge variant="default" className="flex items-center gap-1 w-fit">
                                <Eye className="h-3 w-3" />
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <EyeOff className="h-3 w-3" />
                                Inactivo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(card.updatedAt).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(card)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(card)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
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

          {/* Dialog de Edición/Creación */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isCreating ? "Crear Nueva Card" : "Editar Card"}
                </DialogTitle>
                <DialogDescription>
                  {isCreating
                    ? "Completa los campos para agregar una nueva card del equipo"
                    : "Modifica los campos para actualizar la card"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Coinvestigadores"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Equipo multidisciplinario de investigadores especializados"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL de Imagen o Icono</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://ejemplo.com/imagen.jpg o nombre de icono (Users, BookOpen, School)"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    URL completa de la imagen o nombre de icono de lucide-react (Users, BookOpen, School, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Orden de visualización</Label>
                  <Input
                    id="order"
                    type="number"
                    placeholder="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-gray-500">
                    Define el orden en que aparecerá la card (menor número aparece primero)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">
                    Mostrar en la página principal
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saveMutation.isPending || !formData.title}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog de Confirmación de Eliminación */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar la card "{selectedCard?.title}"?
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}


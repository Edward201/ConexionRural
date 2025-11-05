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
import { Edit, Eye, EyeOff, Save, X, Plus, Trash2, Image as ImageIcon, Play } from "lucide-react";
import type { GalleryItem } from "@shared/schema";

export default function GalleryManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
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
          description: "Solo administradores pueden gestionar la galería",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Obtener items de galería
  const { data: galleryData, isLoading: galleryLoading } = useQuery({
    queryKey: ["cms-gallery"],
    queryFn: async () => {
      const response = await fetch("/api/cms/gallery", {
        credentials: "include",
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("Error al obtener galería");
      const data = await response.json();
      return data;
    },
    enabled: !!authData,
    staleTime: 0,
  });

  // Crear/Actualizar item
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreating
        ? "/api/cms/gallery"
        : `/api/cms/gallery/${selectedItem?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-gallery"] });
      toast({
        title: isCreating ? "Item creado" : "Item actualizado",
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

  // Eliminar item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cms/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al eliminar item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-gallery"] });
      toast({
        title: "Item eliminado",
        description: "El item se eliminó correctamente",
      });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
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
      videoUrl: "",
      isActive: true,
      order: 0,
    });
    setSelectedItem(null);
    setIsCreating(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl || "",
      isActive: item.isActive,
      order: item.order || 0,
    });
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleDelete = (item: GalleryItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutation.mutate(selectedItem.id);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const items: GalleryItem[] = galleryData?.items || [];

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Galería Interactiva</h1>
              <p className="text-gray-600 mt-1">
                Gestiona las imágenes y videos de la galería
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Item
              </Button>
            </div>
          </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Items Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {items.filter((item) => item.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Items Inactivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-400">
                {items.filter((item) => !item.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de items */}
        <Card>
          <CardHeader>
            <CardTitle>Items de Galería</CardTitle>
            <CardDescription>
              Administra las imágenes y videos que se muestran en la galería interactiva
            </CardDescription>
          </CardHeader>
          <CardContent>
            {galleryLoading ? (
              <p>Cargando galería...</p>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay items en la galería</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer item
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Actualizado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.order}</TableCell>
                        <TableCell>
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/100?text=Error';
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{item.title}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500 truncate">{item.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.videoUrl ? (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                              <Play className="h-3 w-3" />
                              Video
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.isActive ? (
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
                          {new Date(item.updatedAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item)}
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? "Crear Nuevo Item de Galería" : "Editar Item de Galería"}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Completa los campos para agregar un nuevo item a la galería"
                  : "Modifica los campos para actualizar el item"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Talleres de reconocimiento territorial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Actividades de cartografía social desarrolladas en el patio escolar con estudiantes"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de la Imagen *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  URL completa de la imagen (puede ser de Unsplash, tu servidor, etc.)
                </p>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-2">Vista Previa:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview"
                      className="w-full max-w-md h-48 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL del Video (opcional)</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  URL del video a donde redirige cuando el usuario hace click en el item (YouTube, Vimeo, etc.)
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
                  Define el orden en que aparecerá el item (menor número aparece primero)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">
                  Mostrar en la galería
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
                disabled={saveMutation.isPending || !formData.title || !formData.imageUrl}
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
                ¿Estás seguro de que deseas eliminar "{selectedItem?.title}"?
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


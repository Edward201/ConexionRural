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
import { Edit, Eye, EyeOff, Save, X, Plus, Trash2, FileText, Download } from "lucide-react";
import type { DownloadableMaterial } from "@shared/schema";

export default function MaterialsManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<DownloadableMaterial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileType: "PDF",
    fileSize: "",
    fileUrl: "",
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
          description: "Solo administradores pueden gestionar materiales",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Obtener materiales
  const { data: materialsData, isLoading: materialsLoading } = useQuery({
    queryKey: ["cms-materials"],
    queryFn: async () => {
      const response = await fetch("/api/cms/materials", {
        credentials: "include",
        cache: "no-cache",
      });
      if (!response.ok) throw new Error("Error al obtener materiales");
      const data = await response.json();
      return data;
    },
    enabled: !!authData,
    staleTime: 0,
  });

  // Crear/Actualizar material
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreating
        ? "/api/cms/materials"
        : `/api/cms/materials/${selectedMaterial?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar material");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-materials"] });
      toast({
        title: isCreating ? "Material creado" : "Material actualizado",
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

  // Eliminar material
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cms/materials/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al eliminar material");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-materials"] });
      toast({
        title: "Material eliminado",
        description: "El material se eliminó correctamente",
      });
      setDeleteDialogOpen(false);
      setSelectedMaterial(null);
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
      fileType: "PDF",
      fileSize: "",
      fileUrl: "",
      isActive: true,
      order: 0,
    });
    setSelectedMaterial(null);
    setIsCreating(false);
  };

  const handleEdit = (material: DownloadableMaterial) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || "",
      fileType: material.fileType,
      fileSize: material.fileSize || "",
      fileUrl: material.fileUrl,
      isActive: material.isActive,
      order: material.order || 0,
    });
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleDelete = (material: DownloadableMaterial) => {
    setSelectedMaterial(material);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const confirmDelete = () => {
    if (selectedMaterial) {
      deleteMutation.mutate(selectedMaterial.id);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const materials: DownloadableMaterial[] = materialsData?.materials || [];

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Materiales Descargables</h1>
              <p className="text-gray-600 mt-1">
                Gestiona los materiales disponibles para descarga
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Material
              </Button>
            </div>
          </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Materiales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{materials.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Materiales Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {materials.filter((m) => m.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Materiales Inactivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-400">
                {materials.filter((m) => !m.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de materiales */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Materiales</CardTitle>
            <CardDescription>
              Administra los materiales descargables que se muestran en la página principal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {materialsLoading ? (
              <p>Cargando materiales...</p>
            ) : materials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay materiales disponibles</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer material
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Actualizado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.order}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{material.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{material.fileType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {material.fileSize || "-"}
                        </TableCell>
                        <TableCell>
                          {material.isActive ? (
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
                          {new Date(material.updatedAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(material)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(material)}
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
                {isCreating ? "Crear Nuevo Material" : "Editar Material"}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Completa los campos para agregar un nuevo material descargable"
                  : "Modifica los campos para actualizar el material"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  placeholder="Marco Teórico"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Fundamentos teóricos de la investigación"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileType">Tipo de Archivo *</Label>
                  <select
                    id="fileType"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                  >
                    <option value="PDF">PDF</option>
                    <option value="ZIP">ZIP</option>
                    <option value="XLSX">XLSX</option>
                    <option value="DOCX">DOCX</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="IMAGE">IMAGE</option>
                    <option value="OTRO">OTRO</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileSize">Tamaño</Label>
                  <Input
                    id="fileSize"
                    placeholder="2.5 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileUrl">URL del Archivo *</Label>
                <Input
                  id="fileUrl"
                  type="url"
                  placeholder="https://ejemplo.com/archivo.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  URL completa del archivo descargable (puede ser un enlace de Google Drive, Dropbox, etc.)
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
                  Define el orden en que aparecerá el material (menor número aparece primero)
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
                disabled={saveMutation.isPending || !formData.title || !formData.fileUrl}
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
                ¿Estás seguro de que deseas eliminar el material "{selectedMaterial?.title}"?
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


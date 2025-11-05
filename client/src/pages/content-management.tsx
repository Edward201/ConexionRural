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
import { Edit, Eye, EyeOff, Save, X } from "lucide-react";
import type { PageContent } from "@shared/schema";

export default function ContentManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    section: "",
    title: "",
    subtitle: "",
    description: "",
    content: "",
    imageUrl: "",
    videoUrl: "",
    backgroundType: "gradient",
    buttonText: "",
    buttonLink: "",
    button2Text: "",
    button2Link: "",
    card1Number: 0,
    card1Label: "",
    card1Description: "",
    card2Number: 0,
    card2Label: "",
    card2Description: "",
    card3Number: 0,
    card3Label: "",
    card3Description: "",
    inst1Title: "",
    inst1Description: "",
    inst1Link: "",
    inst1Image: "",
    inst2Title: "",
    inst2Description: "",
    inst2Link: "",
    inst2Image: "",
    feature1Text: "",
    feature2Text: "",
    feature3Text: "",
    feature4Text: "",
    leadName: "",
    leadRole: "",
    leadBio: "",
    leadEmail: "",
    leadPhoto: "",
    teamCard1Title: "",
    teamCard1Description: "",
    teamCard2Title: "",
    teamCard2Description: "",
    teamCard3Title: "",
    teamCard3Description: "",
    phase1Number: 1,
    phase1Title: "",
    phase1Description: "",
    phase1Sub1Title: "",
    phase1Sub1Description: "",
    phase1Sub2Title: "",
    phase1Sub2Description: "",
    phase2Number: 2,
    phase2Title: "",
    phase2Description: "",
    phase2Sub1Title: "",
    phase2Sub1Description: "",
    phase2Sub2Title: "",
    phase2Sub2Description: "",
    phase2Sub3Title: "",
    phase2Box1Title: "",
    phase2Box1Items: "",
    phase2Box2Title: "",
    phase2Box2Items: "",
    phase3Number: 3,
    phase3Title: "",
    phase3Description: "",
    phase3Sub1Title: "",
    phase3Sub1Description: "",
    phase3Sub2Title: "",
    phase3Sub2Description: "",
    phase3BoxTitle: "",
    phase3BoxItems: "",
    footerTitle: "",
    footerDescription: "",
    footerInstitTitle: "",
    footerInstit1: "",
    footerInstit2: "",
    footerInstit3: "",
    footerCopyright: "",
    isVisible: true,
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
          description: "Solo administradores pueden gestionar contenido",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Obtener contenido
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["cms-content"],
    queryFn: async () => {
      const response = await fetch("/api/cms/content", {
        credentials: "include",
        cache: "no-cache", // Forzar recarga sin caché
      });
      if (!response.ok) throw new Error("Error al obtener contenido");
      const data = await response.json();
      console.log('📦 Datos recibidos del CMS:', data); // Debug
      return data;
    },
    enabled: !!authData,
    staleTime: 0, // Los datos siempre están "stale"
  });

  // Crear/Actualizar contenido
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreating
        ? "/api/cms/content"
        : `/api/cms/content/${selectedContent?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al guardar contenido");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      toast({
        title: isCreating ? "Contenido creado" : "Contenido actualizado",
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

  // Eliminar contenido
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cms/content/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al eliminar contenido");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      toast({
        title: "Contenido eliminado",
        description: "El contenido se eliminó correctamente",
      });
      setDeleteDialogOpen(false);
      setSelectedContent(null);
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
      section: "",
      title: "",
      subtitle: "",
      description: "",
      content: "",
      imageUrl: "",
      videoUrl: "",
      backgroundType: "gradient",
      buttonText: "",
      buttonLink: "",
      button2Text: "",
      button2Link: "",
      card1Number: 0,
      card1Label: "",
      card1Description: "",
      card2Number: 0,
      card2Label: "",
      card2Description: "",
      card3Number: 0,
      card3Label: "",
      card3Description: "",
      inst1Title: "",
      inst1Description: "",
      inst1Link: "",
      inst1Image: "",
      inst2Title: "",
      inst2Description: "",
      inst2Link: "",
      inst2Image: "",
      feature1Text: "",
      feature2Text: "",
      feature3Text: "",
      feature4Text: "",
      leadName: "",
      leadRole: "",
      leadBio: "",
      leadEmail: "",
      leadPhoto: "",
      teamCard1Title: "",
      teamCard1Description: "",
      teamCard2Title: "",
      teamCard2Description: "",
      teamCard3Title: "",
      teamCard3Description: "",
      phase1Number: 1,
      phase1Title: "",
      phase1Description: "",
      phase1Sub1Title: "",
      phase1Sub1Description: "",
      phase1Sub2Title: "",
      phase1Sub2Description: "",
      phase2Number: 2,
      phase2Title: "",
      phase2Description: "",
      phase2Sub1Title: "",
      phase2Sub1Description: "",
      phase2Sub2Title: "",
      phase2Sub2Description: "",
      phase2Sub3Title: "",
      phase2Box1Title: "",
      phase2Box1Items: "",
      phase2Box2Title: "",
      phase2Box2Items: "",
      phase3Number: 3,
      phase3Title: "",
      phase3Description: "",
      phase3Sub1Title: "",
      phase3Sub1Description: "",
      phase3Sub2Title: "",
      phase3Sub2Description: "",
      phase3BoxTitle: "",
      phase3BoxItems: "",
      footerTitle: "",
      footerDescription: "",
      footerInstitTitle: "",
      footerInstit1: "",
      footerInstit2: "",
      footerInstit3: "",
      footerCopyright: "",
      isVisible: true,
      order: 0,
    });
    setSelectedContent(null);
    setIsCreating(false);
  };

  const handleEdit = (content: PageContent) => {
    console.log('✏️ Editando contenido:', content); // Debug
    console.log('📊 Cards:', {
      card1: { n: content.card1Number, l: content.card1Label, d: content.card1Description },
      card2: { n: content.card2Number, l: content.card2Label, d: content.card2Description },
      card3: { n: content.card3Number, l: content.card3Label, d: content.card3Description }
    });
    console.log('🏫 Instituciones:', {
      inst1: { t: content.inst1Title, d: content.inst1Description },
      inst2: { t: content.inst2Title, d: content.inst2Description }
    });
    
    setSelectedContent(content);
    setFormData({
      section: content.section,
      title: content.title || "",
      subtitle: content.subtitle || "",
      description: content.description || "",
      content: content.content || "",
      imageUrl: content.imageUrl || "",
      videoUrl: content.videoUrl || "",
      backgroundType: content.backgroundType || "gradient",
      buttonText: content.buttonText || "",
      buttonLink: content.buttonLink || "",
      button2Text: content.button2Text || "",
      button2Link: content.button2Link || "",
      card1Number: content.card1Number || 0,
      card1Label: content.card1Label || "",
      card1Description: content.card1Description || "",
      card2Number: content.card2Number || 0,
      card2Label: content.card2Label || "",
      card2Description: content.card2Description || "",
      card3Number: content.card3Number || 0,
      card3Label: content.card3Label || "",
      card3Description: content.card3Description || "",
      inst1Title: content.inst1Title || "",
      inst1Description: content.inst1Description || "",
      inst1Link: content.inst1Link || "",
      inst1Image: content.inst1Image || "",
      inst2Title: content.inst2Title || "",
      inst2Description: content.inst2Description || "",
      inst2Link: content.inst2Link || "",
      inst2Image: content.inst2Image || "",
      feature1Text: content.feature1Text || "",
      feature2Text: content.feature2Text || "",
      feature3Text: content.feature3Text || "",
      feature4Text: content.feature4Text || "",
      leadName: content.leadName || "",
      leadRole: content.leadRole || "",
      leadBio: content.leadBio || "",
      leadEmail: content.leadEmail || "",
      leadPhoto: content.leadPhoto || "",
      teamCard1Title: content.teamCard1Title || "",
      teamCard1Description: content.teamCard1Description || "",
      teamCard2Title: content.teamCard2Title || "",
      teamCard2Description: content.teamCard2Description || "",
      teamCard3Title: content.teamCard3Title || "",
      teamCard3Description: content.teamCard3Description || "",
      phase1Number: content.phase1Number || 1,
      phase1Title: content.phase1Title || "",
      phase1Description: content.phase1Description || "",
      phase1Sub1Title: content.phase1Sub1Title || "",
      phase1Sub1Description: content.phase1Sub1Description || "",
      phase1Sub2Title: content.phase1Sub2Title || "",
      phase1Sub2Description: content.phase1Sub2Description || "",
      phase2Number: content.phase2Number || 2,
      phase2Title: content.phase2Title || "",
      phase2Description: content.phase2Description || "",
      phase2Sub1Title: content.phase2Sub1Title || "",
      phase2Sub1Description: content.phase2Sub1Description || "",
      phase2Sub2Title: content.phase2Sub2Title || "",
      phase2Sub2Description: content.phase2Sub2Description || "",
      phase2Sub3Title: content.phase2Sub3Title || "",
      phase2Box1Title: content.phase2Box1Title || "",
      phase2Box1Items: content.phase2Box1Items || "",
      phase2Box2Title: content.phase2Box2Title || "",
      phase2Box2Items: content.phase2Box2Items || "",
      phase3Number: content.phase3Number || 3,
      phase3Title: content.phase3Title || "",
      phase3Description: content.phase3Description || "",
      phase3Sub1Title: content.phase3Sub1Title || "",
      phase3Sub1Description: content.phase3Sub1Description || "",
      phase3Sub2Title: content.phase3Sub2Title || "",
      phase3Sub2Description: content.phase3Sub2Description || "",
      phase3BoxTitle: content.phase3BoxTitle || "",
      phase3BoxItems: content.phase3BoxItems || "",
      footerTitle: content.footerTitle || "",
      footerDescription: content.footerDescription || "",
      footerInstitTitle: content.footerInstitTitle || "",
      footerInstit1: content.footerInstit1 || "",
      footerInstit2: content.footerInstit2 || "",
      footerInstit3: content.footerInstit3 || "",
      footerCopyright: content.footerCopyright || "",
      isVisible: content.isVisible,
      order: content.order || 0,
    });
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleDelete = (content: PageContent) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const confirmDelete = () => {
    if (selectedContent) {
      deleteMutation.mutate(selectedContent.id);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  const contents: PageContent[] = contentData?.contents || [];

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Contenido</h1>
              <p className="text-gray-600 mt-1">
                Administra el contenido de la página principal
              </p>
            </div>
          </div>

        {/* Tabla de contenido */}
        <Card>
          <CardHeader>
            <CardTitle>Secciones de Contenido</CardTitle>
            <CardDescription>
              Lista de todas las secciones de la página principal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <p>Cargando contenido...</p>
            ) : contents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No hay contenido disponible</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Actualizado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contents.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell className="font-medium">{content.order}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{content.section}</Badge>
                        </TableCell>
                        <TableCell>{content.title || "-"}</TableCell>
                        <TableCell>
                          {content.isVisible ? (
                            <Badge variant="default" className="flex items-center gap-1 w-fit">
                              <Eye className="h-3 w-3" />
                              Visible
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <EyeOff className="h-3 w-3" />
                              Oculto
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(content.updatedAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(content)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
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
              <DialogTitle>Editar Sección</DialogTitle>
              <DialogDescription>
                Modifica los campos para actualizar el contenido de la sección
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section">Sección *</Label>
                  <Input
                    id="section"
                    placeholder="hero, about, services, etc."
                    value={formData.section}
                    disabled
                    className="bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Título principal de la sección"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  placeholder="Subtítulo o texto secundario"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción corta de la sección"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  placeholder="Contenido principal (texto largo, HTML, JSON, etc.)"
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              {/* Configuración de fondo (para sección Hero) */}
              {formData.section === "hero" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Configuración de Fondo del Hero</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backgroundType">Tipo de Fondo</Label>
                    <select
                      id="backgroundType"
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.backgroundType}
                      onChange={(e) => setFormData({ ...formData, backgroundType: e.target.value })}
                    >
                      <option value="gradient">Gradiente Naranja (Actual)</option>
                      <option value="image">Imagen de Fondo</option>
                    </select>
                  </div>

                  {formData.backgroundType === "image" && (
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">URL de Imagen de Fondo</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">
                        URL completa de la imagen de fondo (reemplazará el gradiente naranja)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Cards de Estadísticas (para sección Hero) */}
              {formData.section === "hero" && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900">Cards de Estadísticas (3 Cards)</h4>
                  
                  {/* Card 1 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-purple-100">
                    <h5 className="font-medium text-purple-800">Card 1</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="card1Number">Número</Label>
                        <Input
                          id="card1Number"
                          type="number"
                          placeholder="2"
                          value={formData.card1Number}
                          onChange={(e) => setFormData({ ...formData, card1Number: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card1Label">Etiqueta</Label>
                        <Input
                          id="card1Label"
                          placeholder="Participantes"
                          value={formData.card1Label}
                          onChange={(e) => setFormData({ ...formData, card1Label: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card1Description">Descripción</Label>
                      <Input
                        id="card1Description"
                        placeholder="Instituciones Educativas"
                        value={formData.card1Description}
                        onChange={(e) => setFormData({ ...formData, card1Description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-purple-100">
                    <h5 className="font-medium text-purple-800">Card 2</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="card2Number">Número</Label>
                        <Input
                          id="card2Number"
                          type="number"
                          placeholder="150"
                          value={formData.card2Number}
                          onChange={(e) => setFormData({ ...formData, card2Number: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card2Label">Etiqueta</Label>
                        <Input
                          id="card2Label"
                          placeholder="Beneficiados"
                          value={formData.card2Label}
                          onChange={(e) => setFormData({ ...formData, card2Label: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card2Description">Descripción</Label>
                      <Input
                        id="card2Description"
                        placeholder="Estudiantes"
                        value={formData.card2Description}
                        onChange={(e) => setFormData({ ...formData, card2Description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-purple-100">
                    <h5 className="font-medium text-purple-800">Card 3</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="card3Number">Número</Label>
                        <Input
                          id="card3Number"
                          type="number"
                          placeholder="4"
                          value={formData.card3Number}
                          onChange={(e) => setFormData({ ...formData, card3Number: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card3Label">Etiqueta</Label>
                        <Input
                          id="card3Label"
                          placeholder="Temáticas"
                          value={formData.card3Label}
                          onChange={(e) => setFormData({ ...formData, card3Label: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card3Description">Descripción</Label>
                      <Input
                        id="card3Description"
                        placeholder="Ejes Temáticos"
                        value={formData.card3Description}
                        onChange={(e) => setFormData({ ...formData, card3Description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Instituciones Educativas (para sección Hero) */}
              {formData.section === "hero" && (
                <div className="space-y-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-900">Instituciones Educativas (2 Cards)</h4>
                  
                  {/* Institución 1 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-teal-100">
                    <h5 className="font-medium text-teal-800">Institución 1</h5>
                    <div className="space-y-2">
                      <Label htmlFor="inst1Title">Título</Label>
                      <Input
                        id="inst1Title"
                        placeholder="Escuela Rural Multigrado El Volcán"
                        value={formData.inst1Title}
                        onChange={(e) => setFormData({ ...formData, inst1Title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst1Description">Descripción</Label>
                      <Textarea
                        id="inst1Description"
                        placeholder="Pertenece a la IEDRI..."
                        rows={2}
                        value={formData.inst1Description}
                        onChange={(e) => setFormData({ ...formData, inst1Description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst1Link">Link de Ubicación</Label>
                      <Input
                        id="inst1Link"
                        placeholder="https://maps.app.goo.gl/..."
                        value={formData.inst1Link}
                        onChange={(e) => setFormData({ ...formData, inst1Link: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst1Image">URL de Imagen de Fondo (Opcional)</Label>
                      <Input
                        id="inst1Image"
                        placeholder="URL de imagen"
                        value={formData.inst1Image}
                        onChange={(e) => setFormData({ ...formData, inst1Image: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Institución 2 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-teal-100">
                    <h5 className="font-medium text-teal-800">Institución 2</h5>
                    <div className="space-y-2">
                      <Label htmlFor="inst2Title">Título</Label>
                      <Input
                        id="inst2Title"
                        placeholder="Colegio Nuevo San Andrés de los Altos"
                        value={formData.inst2Title}
                        onChange={(e) => setFormData({ ...formData, inst2Title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst2Description">Descripción</Label>
                      <Textarea
                        id="inst2Description"
                        placeholder="Ubicado en la localidad de Usme..."
                        rows={2}
                        value={formData.inst2Description}
                        onChange={(e) => setFormData({ ...formData, inst2Description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst2Link">Link de Ubicación</Label>
                      <Input
                        id="inst2Link"
                        placeholder="https://maps.app.goo.gl/..."
                        value={formData.inst2Link}
                        onChange={(e) => setFormData({ ...formData, inst2Link: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inst2Image">URL de Imagen de Fondo (Opcional)</Label>
                      <Input
                        id="inst2Image"
                        placeholder="URL de imagen"
                        value={formData.inst2Image}
                        onChange={(e) => setFormData({ ...formData, inst2Image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Características con Íconos (para sección About) */}
              {formData.section === "about" && (
                <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900">Características con Íconos (4 Features)</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="feature1Text">Característica 1</Label>
                      <Input
                        id="feature1Text"
                        placeholder="Contenidos territorializados"
                        value={formData.feature1Text}
                        onChange={(e) => setFormData({ ...formData, feature1Text: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feature2Text">Característica 2</Label>
                      <Input
                        id="feature2Text"
                        placeholder="Herramientas de gamificación"
                        value={formData.feature2Text}
                        onChange={(e) => setFormData({ ...formData, feature2Text: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feature3Text">Característica 3</Label>
                      <Input
                        id="feature3Text"
                        placeholder="Capacitaciones para toda la comunidad educativa"
                        value={formData.feature3Text}
                        onChange={(e) => setFormData({ ...formData, feature3Text: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feature4Text">Característica 4</Label>
                      <Input
                        id="feature4Text"
                        placeholder="Adaptado a condiciones rurales de conectividad"
                        value={formData.feature4Text}
                        onChange={(e) => setFormData({ ...formData, feature4Text: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Investigador Principal (para sección Team) */}
              {formData.section === "team" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Investigador Principal</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="leadName">Nombre Completo</Label>
                      <Input
                        id="leadName"
                        placeholder="Teresila Barona Villamizar"
                        value={formData.leadName}
                        onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadRole">Rol/Badge</Label>
                      <Input
                        id="leadRole"
                        placeholder="Investigadora Principal"
                        value={formData.leadRole}
                        onChange={(e) => setFormData({ ...formData, leadRole: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadBio">Biografía</Label>
                      <Textarea
                        id="leadBio"
                        placeholder="Socióloga y Doctora en Educación..."
                        rows={3}
                        value={formData.leadBio}
                        onChange={(e) => setFormData({ ...formData, leadBio: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadEmail">Email</Label>
                      <Input
                        id="leadEmail"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.leadEmail}
                        onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadPhoto">URL de Foto</Label>
                      <Input
                        id="leadPhoto"
                        placeholder="https://ejemplo.com/foto.jpg"
                        value={formData.leadPhoto}
                        onChange={(e) => setFormData({ ...formData, leadPhoto: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cards de Equipo (para sección Team) */}
              {formData.section === "team" && (
                <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-900">Cards del Equipo (3 Cards)</h4>
                  
                  {/* Card 1 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-indigo-100">
                    <h5 className="font-medium text-indigo-800">Card 1 - Coinvestigadores</h5>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard1Title">Título</Label>
                      <Input
                        id="teamCard1Title"
                        placeholder="Coinvestigadores"
                        value={formData.teamCard1Title}
                        onChange={(e) => setFormData({ ...formData, teamCard1Title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard1Description">Descripción</Label>
                      <Textarea
                        id="teamCard1Description"
                        placeholder="Equipo multidisciplinario..."
                        rows={2}
                        value={formData.teamCard1Description}
                        onChange={(e) => setFormData({ ...formData, teamCard1Description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-indigo-100">
                    <h5 className="font-medium text-indigo-800">Card 2 - Pasantes</h5>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard2Title">Título</Label>
                      <Input
                        id="teamCard2Title"
                        placeholder="Pasantes de Investigación"
                        value={formData.teamCard2Title}
                        onChange={(e) => setFormData({ ...formData, teamCard2Title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard2Description">Descripción</Label>
                      <Textarea
                        id="teamCard2Description"
                        placeholder="Estudiantes en formación..."
                        rows={2}
                        value={formData.teamCard2Description}
                        onChange={(e) => setFormData({ ...formData, teamCard2Description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="space-y-3 p-3 bg-white rounded border border-indigo-100">
                    <h5 className="font-medium text-indigo-800">Card 3 - Comunidad</h5>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard3Title">Título</Label>
                      <Input
                        id="teamCard3Title"
                        placeholder="Comunidad Educativa"
                        value={formData.teamCard3Title}
                        onChange={(e) => setFormData({ ...formData, teamCard3Title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamCard3Description">Descripción</Label>
                      <Textarea
                        id="teamCard3Description"
                        placeholder="Directivos, docentes y estudiantes..."
                        rows={2}
                        value={formData.teamCard3Description}
                        onChange={(e) => setFormData({ ...formData, teamCard3Description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Fases del Proyecto (para sección phases) */}
              {formData.section === "phases" && (
                <div className="space-y-6">
                  {/* FASE 1 - CONECTAR */}
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-4">FASE 1 - CONECTAR</h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="phase1Number">Número</Label>
                          <Input
                            id="phase1Number"
                            type="number"
                            value={formData.phase1Number}
                            onChange={(e) => setFormData({ ...formData, phase1Number: parseInt(e.target.value) || 1 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phase1Title">Título</Label>
                          <Input
                            id="phase1Title"
                            placeholder="CONECTAR"
                            value={formData.phase1Title}
                            onChange={(e) => setFormData({ ...formData, phase1Title: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phase1Description">Descripción Corta</Label>
                        <Textarea
                          id="phase1Description"
                          placeholder="Fase inicial de revisión documental..."
                          rows={2}
                          value={formData.phase1Description}
                          onChange={(e) => setFormData({ ...formData, phase1Description: e.target.value })}
                        />
                      </div>

                      <div className="p-3 bg-white rounded border border-orange-100">
                        <h5 className="font-medium text-orange-800 mb-2">Subsección 1</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Título subsección 1"
                            value={formData.phase1Sub1Title}
                            onChange={(e) => setFormData({ ...formData, phase1Sub1Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción subsección 1"
                            rows={3}
                            value={formData.phase1Sub1Description}
                            onChange={(e) => setFormData({ ...formData, phase1Sub1Description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border border-orange-100">
                        <h5 className="font-medium text-orange-800 mb-2">Subsección 2</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Título subsección 2"
                            value={formData.phase1Sub2Title}
                            onChange={(e) => setFormData({ ...formData, phase1Sub2Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción subsección 2"
                            rows={3}
                            value={formData.phase1Sub2Description}
                            onChange={(e) => setFormData({ ...formData, phase1Sub2Description: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FASE 2 - CONSTRUIR */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-4">FASE 2 - CONSTRUIR</h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="phase2Number">Número</Label>
                          <Input
                            id="phase2Number"
                            type="number"
                            value={formData.phase2Number}
                            onChange={(e) => setFormData({ ...formData, phase2Number: parseInt(e.target.value) || 2 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phase2Title">Título</Label>
                          <Input
                            id="phase2Title"
                            placeholder="CONSTRUIR - LA CALERA"
                            value={formData.phase2Title}
                            onChange={(e) => setFormData({ ...formData, phase2Title: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phase2Description">Descripción Corta</Label>
                        <Textarea
                          id="phase2Description"
                          placeholder="Implementación de talleres..."
                          rows={2}
                          value={formData.phase2Description}
                          onChange={(e) => setFormData({ ...formData, phase2Description: e.target.value })}
                        />
                      </div>

                      <div className="p-3 bg-white rounded border border-blue-100">
                        <h5 className="font-medium text-blue-800 mb-2">Subsección 1</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Talleres de asentimiento informado"
                            value={formData.phase2Sub1Title}
                            onChange={(e) => setFormData({ ...formData, phase2Sub1Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción..."
                            rows={3}
                            value={formData.phase2Sub1Description}
                            onChange={(e) => setFormData({ ...formData, phase2Sub1Description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border border-blue-100">
                        <h5 className="font-medium text-blue-800 mb-2">Subsección 2</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Talleres de línea base"
                            value={formData.phase2Sub2Title}
                            onChange={(e) => setFormData({ ...formData, phase2Sub2Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción..."
                            rows={3}
                            value={formData.phase2Sub2Description}
                            onChange={(e) => setFormData({ ...formData, phase2Sub2Description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border border-blue-100">
                        <h5 className="font-medium text-blue-800 mb-2">Subsección 3</h5>
                        <Input
                          placeholder="Talleres de saberes propios"
                          value={formData.phase2Sub3Title}
                          onChange={(e) => setFormData({ ...formData, phase2Sub3Title: e.target.value })}
                          className="mb-3"
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Box 1</Label>
                            <Input
                              placeholder="Formación de Ciudadanías"
                              value={formData.phase2Box1Title}
                              onChange={(e) => setFormData({ ...formData, phase2Box1Title: e.target.value })}
                            />
                            <Textarea
                              placeholder="Items (uno por línea)&#10;Taller sobre participación&#10;Taller sobre territorio"
                              rows={4}
                              value={formData.phase2Box1Items}
                              onChange={(e) => setFormData({ ...formData, phase2Box1Items: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Box 2</Label>
                            <Input
                              placeholder="Educación para la Paz"
                              value={formData.phase2Box2Title}
                              onChange={(e) => setFormData({ ...formData, phase2Box2Title: e.target.value })}
                            />
                            <Textarea
                              placeholder="Items (uno por línea)&#10;Taller sobre ética del cuidado&#10;Taller sobre justicia"
                              rows={4}
                              value={formData.phase2Box2Items}
                              onChange={(e) => setFormData({ ...formData, phase2Box2Items: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FASE 3 - MAPEO */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-4">FASE 3 - MAPEO GENERAL</h4>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="phase3Number">Número</Label>
                          <Input
                            id="phase3Number"
                            type="number"
                            value={formData.phase3Number}
                            onChange={(e) => setFormData({ ...formData, phase3Number: parseInt(e.target.value) || 3 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phase3Title">Título</Label>
                          <Input
                            id="phase3Title"
                            placeholder="MAPEO GENERAL"
                            value={formData.phase3Title}
                            onChange={(e) => setFormData({ ...formData, phase3Title: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phase3Description">Descripción Corta</Label>
                        <Textarea
                          id="phase3Description"
                          placeholder="Análisis de datos, creación de la plataforma..."
                          rows={2}
                          value={formData.phase3Description}
                          onChange={(e) => setFormData({ ...formData, phase3Description: e.target.value })}
                        />
                      </div>

                      <div className="p-3 bg-white rounded border border-purple-100">
                        <h5 className="font-medium text-purple-800 mb-2">Subsección 1</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Identificación de Temas, Intereses y Necesidades"
                            value={formData.phase3Sub1Title}
                            onChange={(e) => setFormData({ ...formData, phase3Sub1Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción..."
                            rows={3}
                            value={formData.phase3Sub1Description}
                            onChange={(e) => setFormData({ ...formData, phase3Sub1Description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border border-purple-100">
                        <h5 className="font-medium text-purple-800 mb-2">Subsección 2</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Creación de la malla curricular"
                            value={formData.phase3Sub2Title}
                            onChange={(e) => setFormData({ ...formData, phase3Sub2Title: e.target.value })}
                          />
                          <Textarea
                            placeholder="Descripción..."
                            rows={3}
                            value={formData.phase3Sub2Description}
                            onChange={(e) => setFormData({ ...formData, phase3Sub2Description: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded border border-purple-100">
                        <h5 className="font-medium text-purple-800 mb-2">Box Final</h5>
                        <div className="space-y-2">
                          <Input
                            placeholder="Apropiación Social del Conocimiento"
                            value={formData.phase3BoxTitle}
                            onChange={(e) => setFormData({ ...formData, phase3BoxTitle: e.target.value })}
                          />
                          <Textarea
                            placeholder="Items (uno por línea)&#10;Presentación en evento académico internacional&#10;Presentación ante pares académicos"
                            rows={4}
                            value={formData.phase3BoxItems}
                            onChange={(e) => setFormData({ ...formData, phase3BoxItems: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer (para sección contact) */}
              {formData.section === "contact" && (
                <div className="space-y-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-900">Configuración del Footer</h4>
                  
                  <div className="space-y-3">
                    {/* Columna 1 - Logo y descripción */}
                    <div className="p-3 bg-white rounded border border-emerald-100">
                      <h5 className="font-medium text-emerald-800 mb-2">Columna 1 - Marca</h5>
                      <div className="space-y-2">
                        <Label htmlFor="footerTitle">Título del Footer</Label>
                        <Input
                          id="footerTitle"
                          placeholder="Conexión Rural 360"
                          value={formData.footerTitle}
                          onChange={(e) => setFormData({ ...formData, footerTitle: e.target.value })}
                        />
                        <Label htmlFor="footerDescription">Descripción</Label>
                        <Textarea
                          id="footerDescription"
                          placeholder="Educando en Contexto - Una investigación..."
                          rows={3}
                          value={formData.footerDescription}
                          onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Columna 2 - Contacto (usa campos existentes: title, subtitle, content, description) */}
                    <div className="p-3 bg-white rounded border border-emerald-100">
                      <h5 className="font-medium text-emerald-800 mb-2">Columna 2 - Contacto</h5>
                      <p className="text-sm text-gray-600 mb-2">
                        Usa los campos: <strong>Título</strong> (título de la sección), 
                        <strong> Subtítulo</strong> (nombre), <strong>Contenido</strong> (email), 
                        <strong> Descripción</strong> (universidad)
                      </p>
                    </div>

                    {/* Columna 3 - Instituciones */}
                    <div className="p-3 bg-white rounded border border-emerald-100">
                      <h5 className="font-medium text-emerald-800 mb-2">Columna 3 - Instituciones Participantes</h5>
                      <div className="space-y-2">
                        <Label htmlFor="footerInstitTitle">Título de la Sección</Label>
                        <Input
                          id="footerInstitTitle"
                          placeholder="Instituciones Participantes"
                          value={formData.footerInstitTitle}
                          onChange={(e) => setFormData({ ...formData, footerInstitTitle: e.target.value })}
                        />
                        <Label htmlFor="footerInstit1">Institución 1</Label>
                        <Input
                          id="footerInstit1"
                          placeholder="IEDRI Mundo Nuevo - La Calera"
                          value={formData.footerInstit1}
                          onChange={(e) => setFormData({ ...formData, footerInstit1: e.target.value })}
                        />
                        <Label htmlFor="footerInstit2">Institución 2</Label>
                        <Input
                          id="footerInstit2"
                          placeholder="Colegio Nuevo San Andrés de los Altos - Usme"
                          value={formData.footerInstit2}
                          onChange={(e) => setFormData({ ...formData, footerInstit2: e.target.value })}
                        />
                        <Label htmlFor="footerInstit3">Institución 3</Label>
                        <Input
                          id="footerInstit3"
                          placeholder="Universidad Compensar"
                          value={formData.footerInstit3}
                          onChange={(e) => setFormData({ ...formData, footerInstit3: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Copyright */}
                    <div className="p-3 bg-white rounded border border-emerald-100">
                      <h5 className="font-medium text-emerald-800 mb-2">Copyright</h5>
                      <Input
                        id="footerCopyright"
                        placeholder="© 2025 Conexión Rural 360. Todos los derechos reservados."
                        value={formData.footerCopyright}
                        onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* URL de Imagen para otras secciones */}
              {formData.section !== "hero" && formData.section !== "about" && formData.section !== "team" && formData.section !== "phases" && formData.section !== "contact" && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
              )}

              {/* Botones de Acción (solo para secciones que no sean about, team, phases ni contact) */}
              {formData.section !== "about" && formData.section !== "team" && formData.section !== "phases" && formData.section !== "contact" && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900">Botones de Acción</h4>
                
                {/* Primer Botón */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="buttonText">Texto del Botón 1</Label>
                  <Input
                    id="buttonText"
                      placeholder="Conocer más"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="buttonLink">Enlace del Botón 1</Label>
                  <Input
                    id="buttonLink"
                      placeholder="#proyecto"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  />
                </div>
              </div>

                {/* Segundo Botón */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button2Text">Texto del Botón 2</Label>
                    <Input
                      id="button2Text"
                      placeholder="Ver Video"
                      value={formData.button2Text}
                      onChange={(e) => setFormData({ ...formData, button2Text: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button2Link">Enlace del Botón 2</Label>
                    <Input
                      id="button2Link"
                      placeholder="#video"
                      value={formData.button2Link}
                      onChange={(e) => setFormData({ ...formData, button2Link: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">
                  Visible en la página principal
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
              <Button onClick={handleSave} disabled={saveMutation.isPending || !formData.section}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
  );
}


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
import { Edit, Trash2, Plus, Eye, EyeOff, Save, X } from "lucide-react";
import type { PageContent } from "@shared/schema";

/**
 * A page for managing content.
 * @returns {JSX.Element} The rendered content management page.
 */
export default function ContentManagementPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    section: "",
    title: "",
    subtitle: "",
    description: "",
    content: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    isVisible: true,
    order: 0,
  });

  // Verify authentication
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Not authenticated");
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
          title: "Access denied",
          description: "Only administrators can manage content",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Get content
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["cms-content"],
    queryFn: async () => {
      const response = await fetch("/api/cms/content", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error getting content");
      return response.json();
    },
    enabled: !!authData,
  });

  // Create/Update content
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
        throw new Error(error.message || "Error saving content");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      toast({
        title: isCreating ? "Content created" : "Content updated",
        description: "The changes were saved correctly",
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

  // Delete content
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cms/content/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error deleting content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      toast({
        title: "Content deleted",
        description: "The content was deleted successfully",
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

  /**
   * Resets the form data.
   */
  const resetForm = () => {
    setFormData({
      section: "",
      title: "",
      subtitle: "",
      description: "",
      content: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      isVisible: true,
      order: 0,
    });
    setSelectedContent(null);
    setIsCreating(false);
  };

  /**
   * Handles editing a content item.
   * @param {PageContent} content - The content item to edit.
   */
  const handleEdit = (content: PageContent) => {
    setSelectedContent(content);
    setFormData({
      section: content.section,
      title: content.title || "",
      subtitle: content.subtitle || "",
      description: content.description || "",
      content: content.content || "",
      imageUrl: content.imageUrl || "",
      buttonText: content.buttonText || "",
      buttonLink: content.buttonLink || "",
      isVisible: content.isVisible,
      order: content.order || 0,
    });
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  /**
   * Handles creating a new content item.
   */
  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  /**
   * Handles deleting a content item.
   * @param {PageContent} content - The content item to delete.
   */
  const handleDelete = (content: PageContent) => {
    setSelectedContent(content);
    setDeleteDialogOpen(true);
  };

  /**
   * Handles saving a content item.
   */
  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  /**
   * Confirms the deletion of a content item.
   */
  const confirmDelete = () => {
    if (selectedContent) {
      deleteMutation.mutate(selectedContent.id);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const contents: PageContent[] = contentData?.contents || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-600 mt-1">
              Manage the content of the main page
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Section
            </Button>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Back
            </Button>
          </div>
        </div>

        {/* Content table */}
        <Card>
          <CardHeader>
            <CardTitle>Content Sections</CardTitle>
            <CardDescription>
              List of all sections of the main page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <p>Loading content...</p>
            ) : contents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No content created yet</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Section
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
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
                              Hidden
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(content.updatedAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(content)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(content)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
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

        {/* Edit/Create Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isCreating ? "Create New Section" : "Edit Section"}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Complete the fields to create a new content section"
                  : "Modify the fields to update the section"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    placeholder="hero, about, services, etc."
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    disabled={!isCreating}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Main title of the section"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Subtitle or secondary text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Short description of the section"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Main content (long text, HTML, JSON, etc.)"
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    placeholder="More information"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Button Link</Label>
                  <Input
                    id="buttonLink"
                    placeholder="/contact"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">
                  Visible on the main page
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
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending || !formData.section}>
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete section?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The section "{selectedContent?.section}" will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedContent(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { DashboardNav } from "@/components/dashboard-nav";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import type { SafeUser } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
  });

  // Verificar autenticación
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No autenticado");
      }

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
        // Usuarios regulares son redirigidos a analytics
        toast({
          title: "Redirigiendo",
          description: "Los usuarios regulares solo tienen acceso a Analytics",
        });
        setLocation("/analytics");
      }
    }
  }, [authData, authLoading, setLocation, toast]);

  // Obtener estadísticas
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener estadísticas");
      return response.json();
    },
    enabled: !!authData,
  });

  // Obtener usuarios
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/users", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener usuarios");
      return response.json();
    },
    enabled: !!authData,
  });

  // Mutation para crear usuario
  const createUserMutation = useMutation({
    mutationFn: async (data: { username: string; email: string; password: string; role: string }) => {
      console.log("📝 Creando usuario:", data);
      const response = await fetch("/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      console.log("📡 Respuesta del servidor:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Error al crear usuario:", error);
        throw new Error(error.message || "Error al crear usuario");
      }
      const result = await response.json();
      console.log("✅ Usuario creado:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsCreateDialogOpen(false);
      setFormData({ username: "", email: "", password: "", role: "user" });
      toast({
        title: "Usuario creado",
        description: "El usuario se creó exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Mutation para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SafeUser> }) => {
      const response = await fetch(`/api/dashboard/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar usuario");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast({
        title: "Usuario actualizado",
        description: "Los cambios se guardaron correctamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Mutation para eliminar usuario
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("🗑️ Eliminando usuario ID:", id);
      const response = await fetch(`/api/dashboard/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log("📡 Respuesta del servidor:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Error al eliminar usuario:", error);
        throw new Error(error.message || "Error al eliminar usuario");
      }
      const result = await response.json();
      console.log("✅ Usuario eliminado:", result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario se eliminó exitosamente",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Cerrar sesión
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al cerrar sesión");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      setLocation("/login");
    },
  });

  const stats: DashboardStats = statsData?.stats || {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  };

  const users: SafeUser[] = usersData?.users || [];

  const toggleUserActive = (user: SafeUser) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive },
    });
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Intentando crear usuario con datos:", formData);
    createUserMutation.mutate(formData);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      id: editingUser.id,
      data: {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      },
    });
  };

  const openEditDialog = (user: SafeUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role as "admin" | "user",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    console.log("🚀 Intentando eliminar usuario ID:", userId);
    deleteUserMutation.mutate(userId);
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, <span className="font-medium">{currentUser.username}</span>
              </p>
            </div>
          </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Usuarios</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Usuarios Activos</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.activeUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Administradores</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.adminUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Usuarios Regulares</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.regularUsers}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Lista completa de usuarios registrados en el sistema
                </CardDescription>
              </div>
              <Dialog 
                open={isCreateDialogOpen} 
                onOpenChange={(open) => {
                  setIsCreateDialogOpen(open);
                  if (open) {
                    // Limpiar formulario al abrir
                    setFormData({ username: "", email: "", password: "", role: "user" });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa los datos del nuevo usuario
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="create-username">Usuario</Label>
                        <Input
                          id="create-username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                          minLength={3}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="create-email">Email</Label>
                        <Input
                          id="create-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="create-password">Contraseña</Label>
                        <Input
                          id="create-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="create-role">Rol</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Usuario</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={createUserMutation.isPending}>
                        {createUserMutation.isPending ? "Creando..." : "Crear Usuario"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p>Cargando usuarios...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">ID</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Admin" : "Usuario"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "destructive"}>
                            {user.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => toggleUserActive(user)}
                              disabled={user.id === currentUser.id}
                            />
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={user.id === currentUser.id}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el usuario <strong>{user.username}</strong>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {user.id === currentUser.id && (
                              <span className="text-xs text-gray-500 ml-2">(Tú)</span>
                            )}
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
      </div>

      {/* Dialog para editar usuario */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            // Limpiar al cerrar
            setEditingUser(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Usuario</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-500">
                Nota: No se puede cambiar la contraseña desde este formulario
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}


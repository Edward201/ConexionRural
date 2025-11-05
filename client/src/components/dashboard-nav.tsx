import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Download, 
  Image as ImageIcon,
  LogOut,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function DashboardNav() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Obtener usuario actual
  const { data: authData } = useQuery({
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

  const currentUser = authData?.user;
  const isAdmin = currentUser?.role === "admin";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Limpiar localStorage y sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // Limpiar todas las queries del cache de React Query
        queryClient.clear();
        
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente",
        });
        
        // Redirigir al login
        setLocation("/login");
        
        // Forzar recarga de la página para limpiar todo el estado
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión",
      });
    }
  };

  // Items del menú según el rol
  const allNavItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      adminOnly: true,
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
      adminOnly: false, // Todos pueden ver analytics
    },
    {
      icon: FileText,
      label: "Gestión de Contenido",
      path: "/content-management",
      adminOnly: true,
    },
    {
      icon: Download,
      label: "Materiales",
      path: "/materials-management",
      adminOnly: true,
    },
    {
      icon: ImageIcon,
      label: "Galería",
      path: "/gallery-management",
      adminOnly: true,
    },
  ];

  // Filtrar items según el rol del usuario
  const navItems = isAdmin 
    ? allNavItems 
    : allNavItems.filter(item => !item.adminOnly);

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors
                      ${isActive(item.path)
                        ? "border-rural-orange-main text-rural-orange-dark bg-rural-orange-light/10"
                        : "border-transparent text-gray-500 hover:text-rural-orange-dark hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{currentUser.username}</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  {isAdmin ? "Admin" : "Usuario"}
                </span>
              </div>
            )}
            
            <Link href="/">
              <a className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-rural-orange-dark transition-colors">
                <Home className="h-5 w-5 mr-2" />
                Ver Sitio
              </a>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:text-rural-orange-dark hover:bg-rural-orange-light/10"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


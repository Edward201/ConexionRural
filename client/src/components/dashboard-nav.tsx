import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Download, 
  Image as ImageIcon,
  Users,
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
    {
      icon: Users,
      label: "Equipo",
      path: "/team-cards-management",
      adminOnly: true,
    },
  ];

  // Filtrar items según el rol del usuario
  const navItems = isAdmin 
    ? allNavItems 
    : allNavItems.filter(item => !item.adminOnly);

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-rural-orange-dark">Conexión Rural</h1>
          </div>

          {/* Menú de navegación - Desktop */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive(item.path)
                        ? "bg-rural-orange-main text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-rural-orange-dark"
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                  </a>
                </Link>
              );
            })}
          </div>
          
          {/* Menú móvil - Dropdown */}
          <div className="md:hidden relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rural-orange-main focus:border-transparent"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Usuario y acciones - Completamente a la derecha */}
          <div className="flex items-center space-x-3 ml-auto">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center text-gray-700 hover:text-rural-orange-dark hover:bg-rural-orange-light/10"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Ver Sitio</span>
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>

            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{currentUser.username}</div>
                  <div className="text-xs text-gray-500">{isAdmin ? "Administrador" : "Usuario"}</div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  isAdmin ? "bg-rural-orange-main" : "bg-gray-400"
                }`}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


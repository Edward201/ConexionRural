import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, Users, Clock, MousePointerClick, TrendingUp, Smartphone,
  Monitor, Tablet, Globe, Target, ArrowUp, ArrowDown
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface AnalyticsOverview {
  totalVisits: number;
  newUsers: number;
  returningUsers: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversions: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30");
  const [currentUser, setCurrentUser] = useState<any>(null);

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
          description: "Solo administradores pueden acceder a analytics",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Obtener datos de analytics
  const { data: overviewData } = useQuery({
    queryKey: ["analytics-overview", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/overview?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener overview");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: sourcesData } = useQuery({
    queryKey: ["analytics-sources", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/sources?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener fuentes");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: pagesData } = useQuery({
    queryKey: ["analytics-pages", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/pages?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener páginas");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: devicesData } = useQuery({
    queryKey: ["analytics-devices", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/devices?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener dispositivos");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: conversionsData } = useQuery({
    queryKey: ["analytics-conversions", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/conversions?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener conversiones");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: timelineData } = useQuery({
    queryKey: ["analytics-timeline", timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/timeline?days=${timeRange}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener timeline");
      return response.json();
    },
    enabled: !!authData,
  });

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando analytics...</p>
      </div>
    );
  }

  const overview: AnalyticsOverview = overviewData?.overview || {
    totalVisits: 0,
    newUsers: 0,
    returningUsers: 0,
    avgTimeOnPage: 0,
    bounceRate: 0,
    conversions: 0,
  };

  // Preparar datos para gráficos
  const deviceChartData = devicesData?.devices.reduce((acc: any[], device: any) => {
    const existing = acc.find(d => d.name === device.deviceType);
    if (existing) {
      existing.value += device.visits;
    } else {
      acc.push({ name: device.deviceType, value: device.visits });
    }
    return acc;
  }, []) || [];

  const userTypeData = [
    { name: "Nuevos", value: overview.newUsers },
    { name: "Recurrentes", value: overview.returningUsers },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Web Analytics</h1>
            <p className="text-gray-600 mt-1">Panel de métricas y estadísticas del sitio</p>
          </div>
          <div className="flex gap-4 items-center">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 90 días</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Volver al Dashboard
            </Button>
          </div>
        </div>

        {/* Tarjetas de métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Visitas Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overview.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">En los últimos {timeRange} días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                Usuarios Nuevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{overview.newUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                {overview.returningUsers.toLocaleString()} recurrentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{formatTime(overview.avgTimeOnPage)}</div>
              <p className="text-xs text-gray-500 mt-1">Por visita</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-orange-600" />
                Tasa de Rebote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{overview.bounceRate}%</div>
              <p className="text-xs text-gray-500 mt-1">
                {overview.bounceRate < 40 ? "Excelente" : overview.bounceRate < 60 ? "Buena" : "Mejorable"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-red-600" />
                Conversiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{overview.conversions.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">
                {overview.totalVisits > 0 
                  ? `${((overview.conversions / overview.totalVisits) * 100).toFixed(2)}%`
                  : "0%"} tasa de conversión
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Promedio Diario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                {Math.round(overview.totalVisits / Number(timeRange)).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Visitas por día</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="traffic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="traffic">Tráfico</TabsTrigger>
            <TabsTrigger value="pages">Páginas</TabsTrigger>
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="conversions">Conversiones</TabsTrigger>
          </TabsList>

          {/* Tab: Tráfico */}
          <TabsContent value="traffic" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico de Timeline */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Visitas en el Tiempo</CardTitle>
                  <CardDescription>Evolución diaria de visitas y conversiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData?.timeline || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#0088FE" name="Visitas" />
                      <Line type="monotone" dataKey="newUsers" stroke="#00C49F" name="Nuevos Usuarios" />
                      <Line type="monotone" dataKey="conversions" stroke="#FF8042" name="Conversiones" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Fuentes de Tráfico */}
              <Card>
                <CardHeader>
                  <CardTitle>Fuentes de Tráfico</CardTitle>
                  <CardDescription>De dónde vienen tus visitantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sourcesData?.sources.slice(0, 5).map((source: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium capitalize">{source.source}</p>
                            {source.medium && (
                              <p className="text-xs text-gray-500">{source.medium}</p>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">{source.visits} visitas</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usuarios Nuevos vs Recurrentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Usuario</CardTitle>
                  <CardDescription>Nuevos vs Recurrentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Páginas */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Páginas Más Visitadas</CardTitle>
                <CardDescription>Top 10 páginas con más tráfico</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Página</TableHead>
                      <TableHead>Visitas</TableHead>
                      <TableHead>Tiempo Promedio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagesData?.pages.map((page: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{page.pageTitle || page.pageUrl}</p>
                            <p className="text-xs text-gray-500">{page.pageUrl}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{page.visits}</Badge>
                        </TableCell>
                        <TableCell>{formatTime(Math.round(page.avgTime))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Dispositivos */}
          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                  <CardDescription>Distribución por tipo de dispositivo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detalles de Dispositivos</CardTitle>
                  <CardDescription>Navegadores y sistemas operativos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {devicesData?.devices.slice(0, 8).map((device: any, index: number) => {
                      const Icon = device.deviceType === 'mobile' 
                        ? Smartphone 
                        : device.deviceType === 'tablet' 
                        ? Tablet 
                        : Monitor;
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium capitalize">{device.deviceType}</p>
                              <p className="text-xs text-gray-500">
                                {device.browser} • {device.os}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{device.visits}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Conversiones */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Conversiones por Tipo</CardTitle>
                <CardDescription>Objetivos alcanzados en el período</CardDescription>
              </CardHeader>
              <CardContent>
                {conversionsData?.conversions.length > 0 ? (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={conversionsData?.conversions || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="conversionType" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#0088FE" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Valor Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conversionsData?.conversions.map((conversion: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium capitalize">
                              {conversion.conversionType}
                            </TableCell>
                            <TableCell>
                              <Badge>{conversion.count}</Badge>
                            </TableCell>
                            <TableCell>
                              {conversion.totalValue 
                                ? `$${conversion.totalValue.toLocaleString()}`
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay conversiones registradas en este período</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


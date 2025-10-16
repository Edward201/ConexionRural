import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, Users, Clock, MousePointerClick, TrendingUp, Smartphone,
  Monitor, Tablet, Globe, Target, ArrowUp, ArrowDown, Filter, X
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

export default function AnalyticsEnhancedPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30");
  const [compareEnabled, setCompareEnabled] = useState(false);
  
  // Filtros avanzados
  const [filters, setFilters] = useState({
    source: "all",
    deviceType: "all",
    page: "",
  });
  
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

  // Construir query string con filtros
  const buildQueryString = (days: string) => {
    const params = new URLSearchParams({ days });
    if (filters.source !== "all") params.append("source", filters.source);
    if (filters.deviceType !== "all") params.append("deviceType", filters.deviceType);
    if (filters.page) params.append("pageUrl", filters.page);
    return params.toString();
  };

  // Datos período actual
  const { data: overviewData } = useQuery({
    queryKey: ["analytics-overview", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/overview?${buildQueryString(timeRange)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener overview");
      return response.json();
    },
    enabled: !!authData,
  });

  // Datos período anterior (para comparación)
  const { data: overviewPreviousData } = useQuery({
    queryKey: ["analytics-overview-previous", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/overview?${buildQueryString(String(Number(timeRange) * 2))}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener overview anterior");
      return response.json();
    },
    enabled: !!authData && compareEnabled,
  });

  const { data: sourcesData } = useQuery({
    queryKey: ["analytics-sources", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/sources?${buildQueryString(timeRange)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener fuentes");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: pagesData } = useQuery({
    queryKey: ["analytics-pages", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/pages?${buildQueryString(timeRange)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener páginas");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: devicesData } = useQuery({
    queryKey: ["analytics-devices", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/devices?${buildQueryString(timeRange)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener dispositivos");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: conversionsData } = useQuery({
    queryKey: ["analytics-conversions", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/conversions?${buildQueryString(timeRange)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al obtener conversiones");
      return response.json();
    },
    enabled: !!authData,
  });

  const { data: timelineData } = useQuery({
    queryKey: ["analytics-timeline", timeRange, filters],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/timeline?${buildQueryString(timeRange)}`, {
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

  const overviewPrevious: AnalyticsOverview | null = compareEnabled && overviewPreviousData
    ? overviewPreviousData.overview
    : null;

  // Calcular cambios porcentuales
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

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

  const clearFilters = () => {
    setFilters({ source: "all", deviceType: "all", page: "" });
  };

  const hasActiveFilters = filters.source !== "all" || filters.deviceType !== "all" || filters.page !== "";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Web Analytics</h1>
            <p className="text-gray-600 mt-1">Panel de métricas y estadísticas del sitio</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant={compareEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareEnabled(!compareEnabled)}
            >
              {compareEnabled ? "Comparando" : "Comparar Períodos"}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Volver
            </Button>
          </div>
        </div>

        {/* Filtros Avanzados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avanzados
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Filtros Activos
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Período</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 días</SelectItem>
                    <SelectItem value="30">Últimos 30 días</SelectItem>
                    <SelectItem value="90">Últimos 90 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fuente de Tráfico</Label>
                <Select value={filters.source} onValueChange={(value) => setFilters({...filters, source: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fuentes</SelectItem>
                    <SelectItem value="organic">Orgánico</SelectItem>
                    <SelectItem value="social">Redes Sociales</SelectItem>
                    <SelectItem value="direct">Directo</SelectItem>
                    <SelectItem value="referral">Referido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dispositivo</Label>
                <Select value={filters.deviceType} onValueChange={(value) => setFilters({...filters, deviceType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los dispositivos</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Móvil</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Página</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="/ruta/pagina"
                    value={filters.page}
                    onChange={(e) => setFilters({...filters, page: e.target.value})}
                  />
                  {hasActiveFilters && (
                    <Button variant="ghost" size="icon" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjetas de métricas principales con comparación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Visitas Totales"
            icon={<Eye className="h-4 w-4 text-blue-600" />}
            value={overview.totalVisits}
            previous={overviewPrevious?.totalVisits}
            compareEnabled={compareEnabled}
          />

          <MetricCard
            title="Usuarios Nuevos"
            icon={<Users className="h-4 w-4 text-green-600" />}
            value={overview.newUsers}
            previous={overviewPrevious?.newUsers}
            compareEnabled={compareEnabled}
            subtitle={`${overview.returningUsers} recurrentes`}
            valueColor="text-green-600"
          />

          <MetricCard
            title="Tiempo Promedio"
            icon={<Clock className="h-4 w-4 text-purple-600" />}
            value={formatTime(overview.avgTimeOnPage)}
            previous={overviewPrevious ? formatTime(overviewPrevious.avgTimeOnPage) : undefined}
            compareEnabled={compareEnabled}
            subtitle="Por visita"
            valueColor="text-purple-600"
            isTime
          />

          <MetricCard
            title="Tasa de Rebote"
            icon={<MousePointerClick className="h-4 w-4 text-orange-600" />}
            value={`${overview.bounceRate}%`}
            previous={overviewPrevious ? `${overviewPrevious.bounceRate}%` : undefined}
            compareEnabled={compareEnabled}
            subtitle={overview.bounceRate < 40 ? "Excelente" : overview.bounceRate < 60 ? "Buena" : "Mejorable"}
            valueColor="text-orange-600"
            isPercent
          />

          <MetricCard
            title="Conversiones"
            icon={<Target className="h-4 w-4 text-red-600" />}
            value={overview.conversions}
            previous={overviewPrevious?.conversions}
            compareEnabled={compareEnabled}
            subtitle={`${overview.totalVisits > 0 ? ((overview.conversions / overview.totalVisits) * 100).toFixed(2) : 0}% tasa de conversión`}
            valueColor="text-red-600"
          />

          <MetricCard
            title="Promedio Diario"
            icon={<TrendingUp className="h-4 w-4 text-indigo-600" />}
            value={Math.round(overview.totalVisits / Number(timeRange))}
            previous={overviewPrevious ? Math.round(overviewPrevious.totalVisits / Number(timeRange)) : undefined}
            compareEnabled={compareEnabled}
            subtitle="Visitas por día"
            valueColor="text-indigo-600"
          />
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

// Componente de tarjeta de métrica con comparación
function MetricCard({
  title,
  icon,
  value,
  previous,
  compareEnabled,
  subtitle,
  valueColor = "text-gray-900",
  isTime = false,
  isPercent = false,
}: {
  title: string;
  icon: React.ReactNode;
  value: number | string;
  previous?: number | string;
  compareEnabled: boolean;
  subtitle?: string;
  valueColor?: string;
  isTime?: boolean;
  isPercent?: boolean;
}) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const numericPrevious = typeof previous === "string" ? parseFloat(previous) : previous;
  
  const change = compareEnabled && numericPrevious 
    ? ((numericValue - numericPrevious) / numericPrevious) * 100
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor}`}>
          {typeof value === "number" && !isTime && !isPercent ? value.toLocaleString() : value}
        </div>
        {compareEnabled && change !== null && (
          <div className="flex items-center gap-1 mt-1">
            {change > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${change > 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
          </div>
        )}
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}


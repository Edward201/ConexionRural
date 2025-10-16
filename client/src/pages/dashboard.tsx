import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import type { SafeUser } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  regularUsers: number;
}

/**
 * A page that displays the admin dashboard.
 * @returns {JSX.Element} The rendered dashboard page.
 */
export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);

  // Verify authentication
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
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
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "Only administrators can access the dashboard",
        });
        setLocation("/");
      }
    }
  }, [authData, authLoading, setLocation]);

  // Get statistics
  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/stats", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error getting statistics");
      return response.json();
    },
    enabled: !!authData,
  });

  // Get users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/users", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error getting users");
      return response.json();
    },
    enabled: !!authData,
  });

  // Mutation to update a user
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SafeUser> }) => {
      const response = await fetch(`/api/dashboard/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error updating user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "User updated",
        description: "The changes were saved correctly",
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

  // Log out
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error logging out");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
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

  /**
   * Toggles the active state of a user.
   * @param {SafeUser} user - The user to toggle.
   */
  const toggleUserActive = (user: SafeUser) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive },
    });
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-medium">{currentUser.username}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation("/content")}>
              Manage Content
            </Button>
            <Button onClick={() => setLocation("/analytics")}>
              View Analytics
            </Button>
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Log Out
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.activeUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Administrators</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.adminUsers}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Regular Users</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{stats.regularUsers}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Complete list of users registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Actions</TableHead>
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
                            {user.role === "admin" ? "Admin" : "User"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? "default" : "destructive"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => toggleUserActive(user)}
                              disabled={user.id === currentUser.id}
                            />
                            <span className="text-xs text-gray-500">
                              {user.id === currentUser.id ? "(You)" : ""}
                            </span>
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
    </div>
  );
}


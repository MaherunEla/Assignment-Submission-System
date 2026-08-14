"use client";

import { Users, GraduationCap, ClipboardList, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getAuth } from "@/lib/auth";

export default function AdminDashboard() {
  const auth = getAuth();

  const stats = [
    {
      title: "Students",
      value: "—",
      icon: GraduationCap,
      description: "Registered students",
    },
    {
      title: "Teachers",
      value: "—",
      icon: Users,
      description: "Registered teachers",
    },
    {
      title: "Assignments",
      value: "—",
      icon: ClipboardList,
      description: "Total assignments",
    },
    {
      title: "Submissions",
      value: "—",
      icon: FileText,
      description: "Total submissions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Admin Dashboard
        </h1>

        <p className="text-muted-foreground">Welcome back, {auth?.fullName}.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>System Management</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to manage students, teachers, classes, subjects,
            teacher assignments, assignments and submissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

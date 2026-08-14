"use client";

import { ClipboardList, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getAuth } from "@/lib/auth";

export default function TeacherDashboard() {
  const auth = getAuth();

  const stats = [
    {
      title: "My Assignments",
      value: "—",
      icon: ClipboardList,
      description: "Assignments created",
    },
    {
      title: "Submissions",
      value: "—",
      icon: FileText,
      description: "Student submissions",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Teacher Dashboard
        </h1>

        <p className="text-muted-foreground">Welcome back, {auth?.fullName}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Teaching Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create assignments and review submissions from your students.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

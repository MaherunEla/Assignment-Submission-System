"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardList,
  FileText,
  UserCheck,
} from "lucide-react";

import { getAuth } from "@/lib/auth";

interface SidebarProps {
  onNavigate?: () => void;
}

const adminMenu = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    href: "/dashboard/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Teachers",
    href: "/dashboard/admin/teachers",
    icon: Users,
  },
  {
    label: "Classes",
    href: "/dashboard/admin/classes",
    icon: School,
  },
  {
    label: "Subjects",
    href: "/dashboard/admin/subjects",
    icon: BookOpen,
  },
  {
    label: "Teacher Assignments",
    href: "/dashboard/admin/teacher-assignments",
    icon: UserCheck,
  },
  {
    label: "Assignments",
    href: "/dashboard/admin/assignments",
    icon: ClipboardList,
  },
  {
    label: "Submissions",
    href: "/dashboard/admin/submissions",
    icon: FileText,
  },
];

const teacherMenu = [
  {
    label: "Dashboard",
    href: "/dashboard/teacher",
    icon: LayoutDashboard,
  },
  {
    label: "My Assignments",
    href: "/dashboard/teacher/assignments",
    icon: ClipboardList,
  },
  {
    label: "Submissions",
    href: "/dashboard/teacher/submissions",
    icon: FileText,
  },
];

const studentMenu = [
  {
    label: "Dashboard",
    href: "/dashboard/student",
    icon: LayoutDashboard,
  },
  {
    label: "My Assignments",
    href: "/dashboard/student/assignments",
    icon: ClipboardList,
  },
  {
    label: "My Submissions",
    href: "/dashboard/student/submissions",
    icon: FileText,
  },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const auth = getAuth();

  if (!auth) {
    return null;
  }

  let menu = adminMenu;

  if (auth.role === "Teacher") {
    menu = teacherMenu;
  }

  if (auth.role === "Student") {
    menu = studentMenu;
  }

  const dashboardUrl =
    auth.role === "Admin"
      ? "/dashboard/admin"
      : auth.role === "Teacher"
        ? "/dashboard/teacher"
        : "/dashboard/student";

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href={dashboardUrl}
          onClick={onNavigate}
          className="text-lg font-bold"
        >
          Assignment System
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t p-4">
        <p className="truncate text-sm font-medium">{auth.fullName}</p>

        <p className="text-xs text-muted-foreground">{auth.role}</p>
      </div>
    </aside>
  );
}

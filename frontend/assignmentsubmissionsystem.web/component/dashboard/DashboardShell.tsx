"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getAuth, logout } from "@/lib/auth";

import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();

  const auth = getAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6">
          {/* Mobile sidebar */}
          <MobileSidebar />

          <Separator orientation="vertical" className="mx-3 h-6 md:hidden" />

          {/* Title */}
          <div className="flex-1">
            <h1 className="text-sm font-semibold md:text-base">
              Assignment Submission System
            </h1>
          </div>

          {/* User */}
          {auth && (
            <div className="mr-4 hidden text-right sm:block">
              <p className="text-sm font-medium">{auth.fullName}</p>

              <p className="text-xs text-muted-foreground">{auth.role}</p>
            </div>
          )}

          {/* Logout */}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />

            <span className="hidden sm:inline">Logout</span>
          </Button>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

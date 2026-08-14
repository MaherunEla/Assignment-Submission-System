"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth } from "@/lib/auth";

type Role = "Admin" | "Teacher" | "Student";

interface DashboardAuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function DashboardAuthGuard({
  children,
  allowedRoles,
}: DashboardAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // No authentication
    if (!auth?.token || !auth?.role) {
      router.replace("/login");
      return;
    }

    // Check whether the logged-in role is allowed
    if (allowedRoles && !allowedRoles.includes(auth.role as Role)) {
      // Send user to their own dashboard
      switch (auth.role) {
        case "Admin":
          router.replace("/dashboard/admin");
          break;

        case "Teacher":
          router.replace("/dashboard/teacher");
          break;

        case "Student":
          router.replace("/dashboard/student");
          break;

        default:
          router.replace("/login");
      }

      return;
    }

    setIsChecking(false);
  }, [router, pathname, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Checking authentication...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

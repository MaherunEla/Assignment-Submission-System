import DashboardAuthGuard from "@/component/auth/DashboardAuthGuard";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard allowedRoles={["Admin"]}>{children}</DashboardAuthGuard>
  );
}

import DashboardAuthGuard from "@/component/auth/DashboardAuthGuard";

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard allowedRoles={["Teacher"]}>
      {children}
    </DashboardAuthGuard>
  );
}

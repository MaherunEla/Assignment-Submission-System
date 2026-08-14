import DashboardAuthGuard from "@/component/auth/DashboardAuthGuard";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard allowedRoles={["Student"]}>
      {children}
    </DashboardAuthGuard>
  );
}

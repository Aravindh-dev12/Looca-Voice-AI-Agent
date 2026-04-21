import { DashboardLayout } from '@/components/DashboardLayout';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout type="user">{children}</DashboardLayout>;
}

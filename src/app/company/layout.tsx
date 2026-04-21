import { DashboardLayout } from '@/components/DashboardLayout';

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout type="company">{children}</DashboardLayout>;
}

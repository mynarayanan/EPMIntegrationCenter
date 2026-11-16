import { redirect } from 'next/navigation';
import { getActiveTenantContext } from '@/lib/tenant-context';
import { AppShell } from '@/components/AppShell';

export default async function ControlPlaneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getActiveTenantContext();

  if (!context) {
    redirect('/login');
  }

  return (
    <AppShell
      tenant={context.tenant}
      role={context.membership.role}
      userEmail={context.user.email}
    >
      {children}
    </AppShell>
  );
}

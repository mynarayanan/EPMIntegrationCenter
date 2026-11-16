'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatRoleLabel } from '@/lib/rbac';
import type { Tenant, TenantRole } from '@integration-centre/shared-types';
import {
  LayoutDashboard,
  Blocks,
  Plug,
  Workflow,
  GitCompareArrows,
  PlayCircle,
  ShieldAlert,
  Settings,
  LogOut,
  Layers,
  Building2,
} from 'lucide-react';

interface AppShellProps {
  tenant: Tenant;
  role: TenantRole;
  userEmail: string;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 'M1' },
  { href: '/connectors', label: 'Connector Catalogue', icon: Blocks, phase: 'M1' },
  { href: '/connections', label: 'Connections', icon: Plug, phase: 'M2' },
  { href: '/integrations', label: 'Integrations', icon: Workflow, phase: 'M3' },
  { href: '/mappings', label: 'Mapping Studio', icon: GitCompareArrows, phase: 'M4' },
  { href: '/jobs', label: 'Jobs & Runs', icon: PlayCircle, phase: 'M5' },
  { href: '/data-quality', label: 'Data Quality', icon: ShieldAlert, phase: 'M6' },
  { href: '/settings', label: 'Governance & Settings', icon: Settings, phase: 'M1' },
];

export function AppShell({ tenant, role, userEmail, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800 shrink-0">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <div className="truncate">
            <div className="text-sm font-semibold text-white tracking-tight">
              Integration Centre
            </div>
            <div className="text-[11px] text-slate-400">Control Plane v0.1</div>
          </div>
        </div>

        {/* Active Tenant Card */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <span className="uppercase tracking-wider font-semibold text-[10px]">
                Active Tenant
              </span>
            </div>
            <div className="mt-1 text-sm font-medium text-white truncate" title={tenant.name}>
              {tenant.name}
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20 uppercase">
                {tenant.environment}
              </span>
              <span className="text-[11px] text-slate-400">{formatRoleLabel(role)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isFuturePhase = item.phase !== 'M1';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {isFuturePhase && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {item.phase}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="truncate">
            <div className="text-xs font-medium text-slate-300 truncate">{userEmail}</div>
            <div className="text-[11px] text-slate-500">Authenticated Session</div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

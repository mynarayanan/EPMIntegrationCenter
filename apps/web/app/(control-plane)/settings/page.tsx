import { getActiveTenantContext } from '@/lib/tenant-context';
import { formatRoleLabel } from '@/lib/rbac';
import { Building2, ShieldCheck, Key } from 'lucide-react';

export default async function SettingsPage() {
  const context = await getActiveTenantContext();

  if (!context) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Tenant Governance & Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Workspace identity, environment classification, and role-based access control details.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold text-slate-900">Workspace Profile</h2>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="text-xs font-medium text-slate-500">Tenant Name</dt>
            <dd className="mt-1 font-medium text-slate-900">{context.tenant.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Tenant Slug</dt>
            <dd className="mt-1 font-mono text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">
              {context.tenant.slug}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Tenant ID (UUID)</dt>
            <dd className="mt-1 font-mono text-xs text-slate-700">{context.tenant.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Environment</dt>
            <dd className="mt-1 uppercase text-xs font-semibold text-emerald-700">
              {context.tenant.environment}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-semibold text-slate-900">Your Session Access</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
          <div>
            <div className="font-medium text-slate-900">{context.user.email}</div>
            <div className="text-xs text-slate-500 mt-0.5">
              Enforced via PostgreSQL Row-Level Security (RLS)
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <Key className="h-3.5 w-3.5" />
            {formatRoleLabel(context.membership.role)}
          </span>
        </div>
      </div>
    </div>
  );
}

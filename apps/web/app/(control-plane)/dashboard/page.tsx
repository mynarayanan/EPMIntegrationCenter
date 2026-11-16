import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getActiveTenantContext } from '@/lib/tenant-context';
import type { AuditLogEntry } from '@integration-centre/shared-types';
import {
  Plug,
  PlayCircle,
  CheckCircle2,
  ShieldAlert,
  Blocks,
  Server,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default async function DashboardPage() {
  const context = await getActiveTenantContext();
  const supabase = await createClient();

  const [{ count: connectorCount }, { data: auditLogs }] = await Promise.all([
    supabase
      .from('connector_definitions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('audit_logs')
      .select('*')
      .eq('tenant_id', context?.tenant.id ?? '')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const kpis = [
    {
      label: 'Active Connections',
      value: '0',
      subtext: 'Unlocks in Milestone 2',
      icon: Plug,
      accent: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Scheduled Integrations',
      value: '0',
      subtext: 'Unlocks in Milestone 3 & 5',
      icon: PlayCircle,
      accent: 'text-indigo-600 bg-indigo-50',
    },
    {
      label: '24h Job Success Rate',
      value: '—',
      subtext: 'Awaiting first execution run',
      icon: CheckCircle2,
      accent: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Open Data Exceptions',
      value: '0',
      subtext: 'No quarantine records',
      icon: ShieldAlert,
      accent: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Integration Centre Overview
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Tenant control plane status, connector readiness, and governance audit trail.
          </p>
        </div>

        <Link
          href="/connectors"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition self-start"
        >
          <Blocks className="h-4 w-4" />
          Browse Connector Catalogue ({connectorCount ?? 7})
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                <div className={`p-2 rounded-lg ${kpi.accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{kpi.value}</div>
              <div className="mt-1 text-xs text-slate-500">{kpi.subtext}</div>
            </div>
          );
        })}
      </div>

      {/* Architecture & Audit Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Execution Plane Topology Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <Server className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Runtime Plane Topology
            </h2>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900">Vercel Control Plane</div>
                <div className="text-xs text-slate-500">Next.js UI, Auth & Config API</div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900">Cloud Worker Pool</div>
                <div className="text-xs text-slate-500">Oracle EPM, Anaplan, Snowflake</div>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                Phase 6 Target
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-900">Hybrid Private Agent</div>
                <div className="text-xs text-slate-500">IBM TM1, Board, Private SFTP</div>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                Phase 8 Target
              </span>
            </div>
          </div>
        </div>

        {/* Tenant Audit Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-slate-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Recent Governance & Audit Events
              </h2>
            </div>
            <span className="text-xs text-slate-500">Tenant-isolated via RLS</span>
          </div>

          {!auditLogs || auditLogs.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No audit events recorded for this tenant yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(auditLogs as AuditLogEntry[]).map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-900 font-mono">
                      {log.action}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Actor: {log.actor_email ?? 'System'} • Resource: {log.resource_type}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

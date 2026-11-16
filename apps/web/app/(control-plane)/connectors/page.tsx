import { createClient } from '@/lib/supabase/server';
import { ConnectorCatalogueClient } from '@/components/ConnectorCatalogueClient';
import type { ConnectorDefinition } from '@integration-centre/shared-types';

export default async function ConnectorsPage() {
  const supabase = await createClient();

  const { data: connectors, error } = await supabase
    .from('connector_definitions')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Enterprise Connector Catalogue
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Supported enterprise source and target systems across Cloud EPM, OLAP cubes, Data Warehouses, and Hybrid file protocols.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Failed to load connector catalogue: {error.message}. Ensure database seed script{' '}
          <code className="font-mono">001_connectors.sql</code> has been executed in Supabase.
        </div>
      ) : (
        <ConnectorCatalogueClient connectors={(connectors as ConnectorDefinition[]) ?? []} />
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import type { ConnectorDefinition, DeploymentModel } from '@integration-centre/shared-types';
import {
  Search,
  Cloud,
  Server,
  Layers,
  CheckCircle2,
  KeyRound,
  FileCode2,
  X,
  ArrowUpRight,
} from 'lucide-react';

interface ConnectorCatalogueClientProps {
  connectors: ConnectorDefinition[];
}

const CATEGORY_LABELS: Record<string, string> = {
  epm: 'Enterprise Performance Management',
  olap: 'OLAP & Multidimensional Cubes',
  data_warehouse: 'Cloud Data Warehouse',
  file_storage: 'Structured Flat Files',
  api_integration: 'APIs & File Transfer',
};

export function ConnectorCatalogueClient({ connectors }: ConnectorCatalogueClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deploymentFilter, setDeploymentFilter] = useState<'all' | DeploymentModel>('all');
  const [selectedConnector, setSelectedConnector] = useState<ConnectorDefinition | null>(null);

  const filteredConnectors = useMemo(() => {
    return connectors.filter((connector) => {
      const matchesDeployment =
        deploymentFilter === 'all' || connector.deployment_model === deploymentFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        connector.name.toLowerCase().includes(q) ||
        connector.vendor.toLowerCase().includes(q) ||
        connector.summary.toLowerCase().includes(q) ||
        connector.code.toLowerCase().includes(q);

      return matchesDeployment && matchesSearch;
    });
  }, [connectors, searchQuery, deploymentFilter]);

  function renderDeploymentBadge(model: DeploymentModel) {
    if (model === 'cloud') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 border border-sky-200">
          <Cloud className="h-3 w-3" />
          Cloud
        </span>
      );
    }
    if (model === 'hybrid') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200">
          <Server className="h-3 w-3" />
          Hybrid / Agent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-200">
        <Layers className="h-3 w-3" />
        Cloud & Hybrid
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connectors by name, vendor, or capability..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'cloud', 'hybrid', 'both'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setDeploymentFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                deploymentFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter === 'all'
                ? 'All Runtimes'
                : filter === 'cloud'
                ? 'Cloud Only'
                : filter === 'hybrid'
                ? 'Hybrid / Private'
                : 'Cloud & Hybrid'}
            </button>
          ))}
        </div>
      </div>

      {/* Connector Cards Grid */}
      {filteredConnectors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-sm font-medium text-slate-900">No connectors match your filter</p>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing your search term or switching the runtime filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredConnectors.map((connector) => (
            <div
              key={connector.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      {connector.vendor}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                      {connector.name}
                    </h3>
                  </div>
                  {renderDeploymentBadge(connector.deployment_model)}
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {connector.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {connector.technical_specs.supported_operations?.map((op) => (
                    <span
                      key={op}
                      className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-700"
                    >
                      {op}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {CATEGORY_LABELS[connector.category] ?? connector.category}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedConnector(connector)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Inspect Specs
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Technical Specification Drawer / Modal */}
      {selectedConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {selectedConnector.vendor}
                  </span>
                  <span className="text-xs text-slate-400">• v{selectedConnector.version}</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mt-1">
                  {selectedConnector.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedConnector(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close technical specifications"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Overview
                </h4>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                  {selectedConnector.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500">Protocol</span>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">
                    {selectedConnector.technical_specs.protocol}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Private Runtime Agent</span>
                  <p className="text-sm font-medium text-slate-900 mt-0.5">
                    {selectedConnector.technical_specs.requires_private_agent
                      ? 'Supported / Required for On-Prem'
                      : 'Not Required (Direct Cloud)'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5" />
                  Supported Authentication Mechanisms
                </h4>
                <ul className="mt-2.5 space-y-1.5">
                  {selectedConnector.technical_specs.auth_methods?.map((method) => (
                    <li key={method} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5" />
                  Enterprise Finance Use Cases
                </h4>
                <ul className="mt-2.5 space-y-1.5">
                  {selectedConnector.technical_specs.typical_use_cases?.map((uc) => (
                    <li key={uc} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedConnector.technical_specs.supported_formats && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Supported Payload Formats
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedConnector.technical_specs.supported_formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-mono font-medium text-slate-800"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Connection setup unlocks in Milestone 2
              </span>
              <button
                type="button"
                onClick={() => setSelectedConnector(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

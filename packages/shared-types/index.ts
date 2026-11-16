export type TenantRole = 'admin' | 'developer' | 'operator' | 'viewer';

export type DeploymentModel = 'cloud' | 'hybrid' | 'both';

export type ConnectorCategory =
  | 'epm'
  | 'olap'
  | 'data_warehouse'
  | 'file_storage'
  | 'api_integration';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  environment: 'production' | 'sandbox' | 'development';
  created_at: string;
}

export interface TenantMembership {
  id: string;
  tenant_id: string;
  user_id: string;
  role: TenantRole;
  created_at: string;
  tenant?: Tenant;
}

export interface ConnectorTechnicalSpecs {
  protocol: string;
  supported_operations: ('extract' | 'load' | 'metadata_discovery' | 'cube_view' | 'file_transfer')[];
  auth_methods: string[];
  requires_private_agent: boolean;
  typical_use_cases: string[];
  supported_formats?: string[];
}

export interface ConnectorDefinition {
  id: string;
  code: string;
  name: string;
  vendor: string;
  category: ConnectorCategory;
  deployment_model: DeploymentModel;
  summary: string;
  description: string;
  version: string;
  is_active: boolean;
  technical_specs: ConnectorTechnicalSpecs;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  tenant_id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface DashboardMetrics {
  activeConnections: number;
  scheduledJobs: number;
  successRate24h: number | null;
  openExceptions: number;
}

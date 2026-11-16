import type { TenantRole } from '@integration-centre/shared-types';

const ROLE_HIERARCHY: Record<TenantRole, number> = {
  viewer: 1,
  operator: 2,
  developer: 3,
  admin: 4,
};

export function hasMinimumRole(
  userRole: TenantRole | null | undefined,
  requiredRole: TenantRole
): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageConnections(role: TenantRole | null | undefined): boolean {
  return hasMinimumRole(role, 'developer');
}

export function canExecuteJobs(role: TenantRole | null | undefined): boolean {
  return hasMinimumRole(role, 'operator');
}

export function canManageTenantSettings(role: TenantRole | null | undefined): boolean {
  return hasMinimumRole(role, 'admin');
}

export function formatRoleLabel(role: TenantRole): string {
  const labels: Record<TenantRole, string> = {
    admin: 'Tenant Admin',
    developer: 'Integration Developer',
    operator: 'Job Operator',
    viewer: 'Read-Only Viewer',
  };
  return labels[role];
}

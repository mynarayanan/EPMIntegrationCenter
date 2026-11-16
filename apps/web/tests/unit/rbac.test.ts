import { describe, it, expect } from 'vitest';
import {
  hasMinimumRole,
  canManageConnections,
  canExecuteJobs,
  canManageTenantSettings,
  formatRoleLabel,
} from '@/lib/rbac';

describe('RBAC Permission Helpers', () => {
  it('enforces role hierarchy accurately', () => {
    expect(hasMinimumRole('admin', 'viewer')).toBe(true);
    expect(hasMinimumRole('admin', 'admin')).toBe(true);
    expect(hasMinimumRole('developer', 'operator')).toBe(true);
    expect(hasMinimumRole('developer', 'admin')).toBe(false);
    expect(hasMinimumRole('operator', 'developer')).toBe(false);
    expect(hasMinimumRole('viewer', 'operator')).toBe(false);
    expect(hasMinimumRole(null, 'viewer')).toBe(false);
  });

  it('grants connection management only to developer and admin', () => {
    expect(canManageConnections('admin')).toBe(true);
    expect(canManageConnections('developer')).toBe(true);
    expect(canManageConnections('operator')).toBe(false);
    expect(canManageConnections('viewer')).toBe(false);
  });

  it('grants job execution to operator, developer, and admin', () => {
    expect(canExecuteJobs('admin')).toBe(true);
    expect(canExecuteJobs('developer')).toBe(true);
    expect(canExecuteJobs('operator')).toBe(true);
    expect(canExecuteJobs('viewer')).toBe(false);
  });

  it('restricts tenant settings exclusively to admin', () => {
    expect(canManageTenantSettings('admin')).toBe(true);
    expect(canManageTenantSettings('developer')).toBe(false);
    expect(canManageTenantSettings('operator')).toBe(false);
    expect(canManageTenantSettings('viewer')).toBe(false);
  });

  it('formats human-readable role labels', () => {
    expect(formatRoleLabel('admin')).toBe('Tenant Admin');
    expect(formatRoleLabel('developer')).toBe('Integration Developer');
  });
});

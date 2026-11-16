import { createClient } from '@/lib/supabase/server';
import type { Tenant, TenantMembership } from '@integration-centre/shared-types';

export interface ActiveTenantContext {
  user: {
    id: string;
    email: string;
  };
  membership: TenantMembership;
  tenant: Tenant;
}

export async function getActiveTenantContext(): Promise<ActiveTenantContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const { data: memberships, error } = await supabase
    .from('tenant_memberships')
    .select(`
      id,
      tenant_id,
      user_id,
      role,
      created_at,
      tenant:tenants (
        id,
        name,
        slug,
        environment,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error || !memberships || memberships.length === 0) {
    return null;
  }

  const primary = memberships[0];
  const tenantRecord = Array.isArray(primary.tenant)
    ? primary.tenant[0]
    : primary.tenant;

  if (!tenantRecord) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    membership: {
      id: primary.id,
      tenant_id: primary.tenant_id,
      user_id: primary.user_id,
      role: primary.role,
      created_at: primary.created_at,
    },
    tenant: tenantRecord as Tenant,
  };
}

-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core multi-tenant control plane schema, RBAC, connector catalogue,
--              audit logging, Row-Level Security (RLS), and auto-onboarding.
-- ============================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type tenant_role as enum ('admin', 'developer', 'operator', 'viewer');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type deployment_model as enum ('cloud', 'hybrid', 'both');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type connector_category as enum (
    'epm',
    'olap',
    'data_warehouse',
    'file_storage',
    'api_integration'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  environment text not null default 'production' check (environment in ('production', 'sandbox', 'development')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role tenant_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists idx_tenant_memberships_user_id on public.tenant_memberships(user_id);
create index if not exists idx_tenant_memberships_tenant_id on public.tenant_memberships(tenant_id);

create table if not exists public.connector_definitions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  vendor text not null,
  category connector_category not null,
  deployment_model deployment_model not null,
  summary text not null,
  description text not null,
  version text not null default '1.0.0',
  is_active boolean not null default true,
  technical_specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_tenant_created on public.audit_logs(tenant_id, created_at desc);

alter table public.tenants enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.connector_definitions enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_tenant_member(check_tenant_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.tenant_memberships
    where tenant_id = check_tenant_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_tenant_admin(check_tenant_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.tenant_memberships
    where tenant_id = check_tenant_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Users can view tenants they belong to" on public.tenants;
create policy "Users can view tenants they belong to"
  on public.tenants for select
  to authenticated
  using (public.is_tenant_member(id));

drop policy if exists "Admins can update their tenant" on public.tenants;
create policy "Admins can update their tenant"
  on public.tenants for update
  to authenticated
  using (public.is_tenant_admin(id));

drop policy if exists "Users can view memberships in their tenants" on public.tenant_memberships;
create policy "Users can view memberships in their tenants"
  on public.tenant_memberships for select
  to authenticated
  using (public.is_tenant_member(tenant_id));

drop policy if exists "Admins can manage memberships in their tenants" on public.tenant_memberships;
create policy "Admins can manage memberships in their tenants"
  on public.tenant_memberships for all
  to authenticated
  using (public.is_tenant_admin(tenant_id));

drop policy if exists "Authenticated users can read connector definitions" on public.connector_definitions;
create policy "Authenticated users can read connector definitions"
  on public.connector_definitions for select
  to authenticated
  using (true);

drop policy if exists "Users can view audit logs for their tenants" on public.audit_logs;
create policy "Users can view audit logs for their tenants"
  on public.audit_logs for select
  to authenticated
  using (public.is_tenant_member(tenant_id));

drop policy if exists "Members can insert audit logs for their tenants" on public.audit_logs;
create policy "Members can insert audit logs for their tenants"
  on public.audit_logs for insert
  to authenticated
  with check (public.is_tenant_member(tenant_id));

create or replace function public.handle_new_user_onboarding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  user_prefix text;
begin
  user_prefix := split_part(coalesce(new.email, 'enterprise'), '@', 1);

  insert into public.tenants (name, slug, environment)
  values (
    initcap(user_prefix) || ' Enterprise Workspace',
    lower(regexp_replace(user_prefix, '[^a-zA-Z0-9]', '-', 'g')) || '-' || substr(new.id::text, 1, 6),
    'production'
  )
  returning id into new_tenant_id;

  insert into public.tenant_memberships (tenant_id, user_id, role)
  values (new_tenant_id, new.id, 'admin');

  insert into public.audit_logs (tenant_id, actor_id, actor_email, action, resource_type, resource_id, details)
  values (
    new_tenant_id,
    new.id,
    new.email,
    'tenant.provisioned',
    'tenant',
    new_tenant_id::text,
    jsonb_build_object('initial_role', 'admin', 'source', 'auto_onboarding')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user_onboarding();

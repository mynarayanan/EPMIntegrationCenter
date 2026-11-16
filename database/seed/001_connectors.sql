-- ============================================================================
-- Seed: 001_connectors.sql
-- Description: Populates the 7 enterprise connector groups in the catalogue.
-- ============================================================================

insert into public.connector_definitions (
  code,
  name,
  vendor,
  category,
  deployment_model,
  summary,
  description,
  version,
  is_active,
  technical_specs
)
values
  (
    'oracle_epm',
    'Oracle EPM Cloud',
    'Oracle',
    'epm',
    'cloud',
    'Extract and load planning cubes, financial consolidation data, and dimension metadata via Oracle EPM REST APIs.',
    'Connects to Oracle Cloud EPM (Planning, FCCS, ARCS, PCMCS) using standard REST APIs and EPM Automate-compatible data export/import jobs. Supports asynchronous job polling for large data slices and outline metadata discovery.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS / REST API (EPM Cloud v3)",
      "supported_operations": ["extract", "load", "metadata_discovery"],
      "auth_methods": ["OAuth 2.0", "Basic Auth (Identity Domain)"],
      "requires_private_agent": false,
      "typical_use_cases": ["Actuals extraction", "Budget/Forecast write-back", "Chart of Accounts sync"],
      "supported_formats": ["CSV", "DAT", "JSON"]
    }'::jsonb
  ),
  (
    'anaplan',
    'Anaplan',
    'Anaplan',
    'epm',
    'cloud',
    'Execute Anaplan Integration API v2 exports, imports, and transactional list reads across workspaces and models.',
    'Integrates directly with Anaplan Cloud models via Bulk API v2 and Transactional APIs. Handles chunked file uploads/downloads, process execution, and module view extraction with automatic retry handling.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS / Anaplan Integration API v2",
      "supported_operations": ["extract", "load", "metadata_discovery"],
      "auth_methods": ["OAuth 2.0 (Authorization Code / Device)", "CA Certificate Auth", "Basic Auth"],
      "requires_private_agent": false,
      "typical_use_cases": ["Connected planning exports", "Hierarchy & list updates", "Model-to-warehouse sync"],
      "supported_formats": ["CSV", "JSON"]
    }'::jsonb
  ),
  (
    'snowflake',
    'Snowflake Data Cloud',
    'Snowflake',
    'data_warehouse',
    'cloud',
    'High-throughput SQL query extraction and staged bulk loading via Snowflake Python Connector and Arrow.',
    'Provides native connectivity to Snowflake virtual warehouses for analytical extraction, curated finance mart consumption, and staging table ingestion using key-pair or OAuth authentication.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS / Snowflake SQL & Arrow Flight",
      "supported_operations": ["extract", "load", "metadata_discovery"],
      "auth_methods": ["RSA Key-Pair Auth", "OAuth 2.0", "Username & Password"],
      "requires_private_agent": false,
      "typical_use_cases": ["GL warehouse extraction", "EPM staging tables", "Cross-system reconciliation"],
      "supported_formats": ["Parquet", "Arrow", "CSV", "JSON"]
    }'::jsonb
  ),
  (
    'tm1',
    'IBM Planning Analytics (TM1)',
    'IBM',
    'olap',
    'hybrid',
    'Extract MDX cube views, dimension hierarchies, and TurboIntegrator process outputs via TM1 REST API.',
    'Supports both IBM Planning Analytics Cloud and on-premise TM1 servers behind corporate firewalls using the OData v4 TM1 REST API. Designed for hybrid execution via the customer-side runtime agent.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS / TM1 OData v4 REST API",
      "supported_operations": ["extract", "load", "metadata_discovery", "cube_view"],
      "auth_methods": ["CAM Namespace Auth", "IBM Cloud API Key", "Basic Native TM1 Auth"],
      "requires_private_agent": true,
      "typical_use_cases": ["MDX cube slice extraction", "Dimension hierarchy sync", "TI process orchestration"],
      "supported_formats": ["JSON (OData)", "CSV"]
    }'::jsonb
  ),
  (
    'board',
    'Board Intelligent Planning',
    'Board International',
    'olap',
    'hybrid',
    'Trigger Board Data Reader procedures, extract cube layouts, and exchange structured datasets.',
    'Connects to Board Cloud or on-premise Board servers via Board REST APIs and Data Reader staging interfaces. Supports hybrid deployment topologies for private network installations.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS / Board REST API & Staging Interface",
      "supported_operations": ["extract", "load", "metadata_discovery"],
      "auth_methods": ["OAuth 2.0 Client Credentials", "API Token"],
      "requires_private_agent": true,
      "typical_use_cases": ["Board cube extraction", "Data Reader ingestion", "Planning cycle triggers"],
      "supported_formats": ["CSV", "JSON"]
    }'::jsonb
  ),
  (
    'excel_csv',
    'Excel & Structured Flat Files',
    'Standard / Microsoft',
    'file_storage',
    'both',
    'Parse multi-sheet Excel workbooks (.xlsx) and delimited CSV/TSV files with schema validation.',
    'Handles manual uploads via Supabase Storage or automated file ingestion from cloud/hybrid buckets. Supports named ranges, multi-tab selection, header normalization, and strict data-type enforcement.',
    '1.0.0',
    true,
    '{
      "protocol": "Object Storage / HTTPS Upload",
      "supported_operations": ["extract", "metadata_discovery", "file_transfer"],
      "auth_methods": ["Signed Storage Token", "Service Role Scoped Access"],
      "requires_private_agent": false,
      "typical_use_cases": ["Manual journal templates", "Mapping lookup tables", "Offline trial balances"],
      "supported_formats": ["XLSX", "XLS", "CSV", "TSV"]
    }'::jsonb
  ),
  (
    'rest_sftp',
    'Generic REST API & SFTP',
    'Open Standards',
    'api_integration',
    'both',
    'Configurable REST endpoints (pagination/OAuth) and SSH/SFTP file servers for ERP and bank feeds.',
    'Universal enterprise connector supporting custom HTTP REST endpoints (cursor, offset, or page pagination) and secure SFTP servers (public or private-network) for automated file pickup and drop-off.',
    '1.0.0',
    true,
    '{
      "protocol": "HTTPS REST / SSH File Transfer Protocol (SFTP)",
      "supported_operations": ["extract", "load", "file_transfer"],
      "auth_methods": ["SSH Private Key", "OAuth 2.0", "Bearer Token", "API Key", "Basic Auth"],
      "requires_private_agent": true,
      "typical_use_cases": ["ERP flat-file exports", "Treasury/Bank SFTP feeds", "Custom SaaS APIs"],
      "supported_formats": ["JSON", "CSV", "XML", "Fixed-Width TXT"]
    }'::jsonb
  )
on conflict (code) do update set
  name = excluded.name,
  vendor = excluded.vendor,
  category = excluded.category,
  deployment_model = excluded.deployment_model,
  summary = excluded.summary,
  description = excluded.description,
  version = excluded.version,
  is_active = excluded.is_active,
  technical_specs = excluded.technical_specs;

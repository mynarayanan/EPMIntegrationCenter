import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';

export default function ConnectionsPage() {
  return (
    <MilestonePlaceholder
      title="Connection Management"
      milestone="Milestone 2 (Phase 3)"
      description="Create, edit, test, disable, and delete source/target connections with encrypted credential storage and private-agent routing."
      plannedDeliverables={[
        'Connector-specific configuration forms (Oracle EPM, Anaplan, Snowflake, TM1, Board, Excel/CSV, REST/SFTP)',
        'Encrypted secret storage via Supabase Vault / server-side encryption',
        'Pre-flight connectivity validation and audit logging',
      ]}
    />
  );
}

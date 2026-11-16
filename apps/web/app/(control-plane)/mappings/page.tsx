import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';

export default function MappingsPage() {
  return (
    <MilestonePlaceholder
      title="Mapping Studio"
      milestone="Milestone 4 (Phase 5)"
      description="Map source fields and EPM/OLAP dimension members to canonical target structures with transformation rules."
      plannedDeliverables={[
        'Explicit 1:1, lookup table, and expression-based member mappings',
        'Unmapped member detection and default fallback policies',
        'Versioned mapping definitions with approval workflow',
      ]}
    />
  );
}

import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';

export default function IntegrationsPage() {
  return (
    <MilestonePlaceholder
      title="Integration Designer"
      milestone="Milestone 3 (Phase 4)"
      description="Discover source cubes, modules, tables, and files; configure extraction slices and preview sample payloads."
      plannedDeliverables={[
        'Metadata browser for dimensions, cubes, views, and SQL schemas',
        'Extraction filter & slice parameterization (Period, Scenario, Entity)',
        'Tabular data preview before pipeline activation',
      ]}
    />
  );
}

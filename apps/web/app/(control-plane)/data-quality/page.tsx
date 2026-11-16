import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';

export default function DataQualityPage() {
  return (
    <MilestonePlaceholder
      title="Data Quality & Reconciliation"
      milestone="Milestone 6 (Phase 7)"
      description="Enforce validation rules, control-total reconciliations, and quarantine exception handling prior to target load."
      plannedDeliverables={[
        'Configurable completeness, sign, and balance check assertions',
        'Source-to-target control total reconciliation reports',
        'Exception quarantine queue with row-level error diagnostics',
      ]}
    />
  );
}

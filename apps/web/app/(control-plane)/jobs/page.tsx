import { MilestonePlaceholder } from '@/components/MilestonePlaceholder';

export default function JobsPage() {
  return (
    <MilestonePlaceholder
      title="Job Orchestration & Execution Logs"
      milestone="Milestone 5 (Phase 6)"
      description="Schedule recurring extractions, trigger manual runs, inspect step-by-step worker logs, and retry failed jobs."
      plannedDeliverables={[
        'Decoupled queue dispatch to containerised Python integration workers',
        'Cron schedule builder and manual run trigger with parameter overrides',
        'Real-time job status, row counts, duration metrics, and structured logs',
      ]}
    />
  );
}

import Link from 'next/link';
import { Construction, ArrowLeft } from 'lucide-react';

interface MilestonePlaceholderProps {
  title: string;
  milestone: string;
  description: string;
  plannedDeliverables: string[];
}

export function MilestonePlaceholder({
  title,
  milestone,
  description,
  plannedDeliverables,
}: MilestonePlaceholderProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
        <Construction className="h-3.5 w-3.5" />
        Scheduled for {milestone}
      </div>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>

      <div className="mt-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Planned Deliverables
        </h3>
        <ul className="mt-3 space-y-2">
          {plannedDeliverables.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-100">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

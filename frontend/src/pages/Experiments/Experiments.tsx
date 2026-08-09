import PageHeader from "../../components/layout/PageHeader";

import {
  ExperimentToolbar,
  ExperimentList,
  ExperimentDetails,
  ExperimentLogs,
  ExperimentTimeline,
} from "../../components/experiments";

export default function Experiments() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Experiments"
        description="Run Kubernetes debugging and failure scenarios."
      />

      <ExperimentToolbar />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="min-w-0">
          <ExperimentList />
        </div>

        <div className="min-w-0 space-y-6">
          <ExperimentDetails />

          <div className="grid gap-6 lg:grid-cols-2">
            <ExperimentLogs />
            <ExperimentTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
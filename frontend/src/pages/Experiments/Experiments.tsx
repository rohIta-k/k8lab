import {
  ExperimentToolbar,
  ExperimentList,
  ExperimentDetails,
  ExperimentLogs
} from "../../components/experiments";

export default function Experiments() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="min-w-0">
          <ExperimentList />
        </div>

        <div className="min-w-0 space-y-6">
          <ExperimentDetails />

          <ExperimentToolbar />

          <div className="grid gap-6 ">
            <ExperimentLogs />
          </div>
        </div>
      </div>
    </div>
  );
}
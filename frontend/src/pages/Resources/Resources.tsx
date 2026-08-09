import PageHeader from "../../components/layout/PageHeader";

import {
  ResourceToolbar,
  ResourceTabs,
  ResourceTable,
  ResourceDetails,
} from "../../components/resources";

import { useResources } from "../../hooks";

export default function Resources() {
  const { selectedResourceId } = useResources();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="View and manage Kubernetes resources."
      />

      <ResourceToolbar />

      <ResourceTabs />

      <div
        className={
          selectedResourceId
            ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
            : "w-full"
        }
      >
        <ResourceTable />

        {selectedResourceId && (
          <ResourceDetails />
        )}
      </div>
    </div>
  );
}
import EmptyState from "../common/EmptyState";

import { useResources } from "../../hooks";

import type { Resource } from "../../types/resources";

import OverviewCard from "./OverviewCard";
import RelationshipsCard from "./RelationshipsCard";
import YAMLCard from "./ResourceYAML";

export default function ResourceDetails() {
  const {
    resources,
    selectedResourceId,
    selectedResourceType,
  } = useResources();

  const resource = (
    resources[selectedResourceType] as Resource[]
  ).find(
    (resource) =>
      resource.id === selectedResourceId
  );

  if (!resource) {
    return (
      <EmptyState
        title="No Resource Selected"
        description="Select a resource from the table to view its details."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <OverviewCard resource={resource} />

      <RelationshipsCard resource={resource} />

      <YAMLCard resource={resource} />
    </div>
  );
}
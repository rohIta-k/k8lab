import {
  ArrowDown,
  Box,
  Boxes,
} from "lucide-react";

import Card from "../common/Card";

import { resourcesData } from "../../data/resources";

import type { Resource } from "../../types/resources";

interface RelationshipsCardProps {
  resource: Resource;
}

export default function RelationshipsCard({
  resource,
}: RelationshipsCardProps) {
  const relatedPods =
    "replicas" in resource
      ? resourcesData.pods.filter(
          (pod) =>
            pod.owner === resource.name ||
            pod.owner === resource.id
        )
      : [];

  return (
    <Card>
      <h3 className="mb-5 text-base font-semibold text-[var(--text-primary)]">
        Relationships
      </h3>

      <div className="flex flex-col items-center gap-4">
        <RelationshipNode
          icon={<Boxes size={16} />}
          label={resource.name}
          variant="primary"
        />

        {"owner" in resource && (
          <>
            <ArrowDown
              size={16}
              className="text-[var(--text-muted)]"
            />

            <RelationshipNode
              icon={<Boxes size={16} />}
              label={resource.owner}
              variant="secondary"
            />
          </>
        )}

        {relatedPods.map((pod) => (
          <div
            key={pod.id}
            className="flex items-center gap-3"
          >
            <ArrowDown
              size={16}
              className="text-[var(--text-muted)]"
            />

            <RelationshipNode
              icon={<Box size={16} />}
              label={pod.name}
              variant="success"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

interface RelationshipNodeProps {
  label: string;
  icon: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success";
}

function RelationshipNode({
  label,
  icon,
  variant = "primary",
}: RelationshipNodeProps) {
  const styles = {
    primary:
      "border-[var(--primary)] bg-[var(--primary)]/10",

    secondary:
      "border-[var(--border-color)] bg-[var(--background-hover)]",

    success:
      "border-[var(--success)] bg-[var(--success)]/10",
  };

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3 ${styles[variant]}`}
    >
      {icon}

      <span className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </span>
    </div>
  );
}
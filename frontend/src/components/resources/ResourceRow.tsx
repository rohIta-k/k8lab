import Badge from "../common/Badge";
import StatusChip from "../common/StatusChip";

import type { Resource } from "../../types/resources";
import type { TableColumn } from "../../types/ui";

interface ResourceRowProps {
  resource: Resource;
  column: TableColumn;
}

export default function ResourceRow({
  resource,
  column,
}: ResourceRowProps) {
  switch (column.id) {
    case "name":
      return resource.name;

    case "namespace":
      return "namespace" in resource
        ? resource.namespace
        : "-";

    case "status":
      return "status" in resource ? (
        <StatusChip status={resource.status} />
      ) : (
        "-"
      );

    case "fields.ready":
      return "ready" in resource.fields
        ? resource.fields.ready
        : "-";

    case "fields.replicas":
      return "replicas" in resource.fields
        ? resource.fields.replicas
        : "-";

    case "fields.image":
      return "image" in resource.fields ? (
        <Badge variant="secondary">
          {resource.fields.image}
        </Badge>
      ) : (
        "-"
      );

    case "fields.strategy":
      return "strategy" in resource.fields
        ? resource.fields.strategy
        : "-";

    case "fields.node":
      return "node" in resource.fields
        ? resource.fields.node
        : "-";

    case "fields.restartCount":
      return "restartCount" in resource.fields
        ? resource.fields.restartCount
        : "-";

    case "fields.owner":
      return "owner" in resource.fields
        ? resource.fields.owner
        : "-";

    case "fields.type":
      return "type" in resource.fields
        ? resource.fields.type
        : "-";

    case "fields.clusterIP":
      return "clusterIP" in resource.fields
        ? resource.fields.clusterIP
        : "-";

    case "fields.ports":
      return "ports" in resource.fields
        ? resource.fields.ports.join(", ")
        : "-";

    case "fields.hosts":
      return "hosts" in resource.fields
        ? resource.fields.hosts.join(", ")
        : "-";

    case "fields.keys":
      return "keys" in resource.fields
        ? resource.fields.keys
        : "-";

    case "fields.capacity":
      return "capacity" in resource.fields
        ? resource.fields.capacity
        : "-";

    case "fields.completions":
      return "completions" in resource.fields
        ? resource.fields.completions
        : "-";

    case "fields.schedule":
      return "schedule" in resource.fields
        ? resource.fields.schedule
        : "-";

    default:
      return "-";
  }
}
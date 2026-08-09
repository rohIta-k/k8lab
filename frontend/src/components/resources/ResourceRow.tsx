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

    case "age":
      return resource.age;

    case "ready":
      return "ready" in resource
        ? resource.ready
        : "-";

    case "replicas":
      return "replicas" in resource
        ? resource.replicas
        : "-";

    case "image":
      return "image" in resource ? (
        <Badge variant="secondary">
          {resource.image}
        </Badge>
      ) : (
        "-"
      );

    case "node":
      return "node" in resource
        ? resource.node
        : "-";

    case "restartCount":
      return "restartCount" in resource
        ? resource.restartCount
        : "-";

    case "owner":
      return "owner" in resource
        ? resource.owner
        : "-";

    case "type":
      return "type" in resource
        ? resource.type
        : "-";

    case "clusterIP":
      return "clusterIP" in resource
        ? resource.clusterIP
        : "-";

    case "ports":
      return "ports" in resource
        ? resource.ports
        : "-";

    case "host":
      return "host" in resource
        ? resource.host
        : "-";

    case "service":
      return "service" in resource
        ? resource.service
        : "-";

    case "capacity":
      return "capacity" in resource
        ? resource.capacity
        : "-";

    case "schedule":
      return "schedule" in resource
        ? resource.schedule
        : "-";

    case "mountedInto":
      return "mountedInto" in resource
        ? resource.mountedInto.join(", ")
        : "-";

    case "completions":
      return "completions" in resource
        ? resource.completions
        : "-";

    default:
      return "-";
  }
}
import type {
  ResourceType,
} from "../types/resources";

import type {
  TableColumn,
} from "../types/ui";

export const RESOURCE_COLUMNS: Record<
  ResourceType,
  TableColumn[]
> = {
  namespaces: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  pods: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "node",
      label: "Node",
    },
    {
      id: "restartCount",
      label: "Restarts",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  deployments: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "ready",
      label: "Ready",
    },
    {
      id: "replicas",
      label: "Replicas",
    },
    {
      id: "image",
      label: "Image",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  replicaSets: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "ready",
      label: "Ready",
    },
    {
      id: "owner",
      label: "Owner",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  services: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "type",
      label: "Type",
    },
    {
      id: "clusterIP",
      label: "Cluster IP",
    },
    {
      id: "ports",
      label: "Ports",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  ingresses: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "host",
      label: "Host",
    },
    {
      id: "service",
      label: "Service",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  configMaps: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "mountedInto",
      label: "Mounted Into",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  secrets: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "type",
      label: "Type",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  persistentVolumeClaims: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "capacity",
      label: "Capacity",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  jobs: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "completions",
      label: "Completions",
    },
    {
      id: "age",
      label: "Age",
    },
  ],

  cronJobs: [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "namespace",
      label: "Namespace",
    },
    {
      id: "schedule",
      label: "Schedule",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "age",
      label: "Age",
    },
  ],
};
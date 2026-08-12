import type { ResourceType } from "../types/resources";

import type { TableColumn } from "../types/ui";

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
      id: "fields.ready",
      label: "Ready",
    },
    {
      id: "fields.node",
      label: "Node",
    },
    {
      id: "fields.restartCount",
      label: "Restarts",
    },
    {
      id: "fields.image",
      label: "Image",
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
      id: "status",
      label: "Status",
    },
    {
      id: "fields.ready",
      label: "Ready",
    },
    {
      id: "fields.replicas",
      label: "Replicas",
    },
    {
      id: "fields.image",
      label: "Image",
    },
    {
      id: "fields.strategy",
      label: "Strategy",
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
      id: "status",
      label: "Status",
    },
    {
      id: "fields.ready",
      label: "Ready",
    },
    {
      id: "fields.owner",
      label: "Owner",
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
      id: "fields.type",
      label: "Type",
    },
    {
      id: "fields.clusterIP",
      label: "Cluster IP",
    },
    {
      id: "fields.ports",
      label: "Ports",
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
      id: "status",
      label: "Status",
    },
    {
      id: "fields.hosts",
      label: "Hosts",
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
      id: "fields.keys",
      label: "Keys",
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
      id: "fields.capacity",
      label: "Capacity",
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
      id: "fields.completions",
      label: "Completions",
    },
    {
      id: "fields.image",
      label: "Image",
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
      id: "fields.schedule",
      label: "Schedule",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "fields.image",
      label: "Image",
    },
  ],
};
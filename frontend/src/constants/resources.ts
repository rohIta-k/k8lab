import type {
  ResourceStatus,
  ServiceType,
} from "../types/resources";

import {
  Boxes,
  BriefcaseBusiness,
  Clock3,
  Database,
  FileText,
  Folder,
  Network,
  Route,
  Rows3,
  Square,
} from "lucide-react";

export const RESOURCE_STATUS: ResourceStatus[] = [
  "Running",
  "Pending",
  "Active",
  "Completed",
  "Failed",
  "CrashLoopBackOff",
  "ImagePullBackOff",
  "OOMKilled",
  "Bound",
];

export const SERVICE_TYPES: ServiceType[] = [
  "ClusterIP",
  "NodePort",
  "LoadBalancer",
  "ExternalName",
];

export const RESOURCE_GROUPS = [
  {
    title: "Workloads",
    items: [
      {
        id: "deployments",
        label: "Deployments",
        icon: Boxes,
      },
      {
        id: "pods",
        label: "Pods",
        icon: Square,
      },
      {
        id: "replicaSets",
        label: "ReplicaSets",
        icon: Rows3,
      },
      {
        id: "jobs",
        label: "Jobs",
        icon: BriefcaseBusiness,
      },
      {
        id: "cronJobs",
        label: "CronJobs",
        icon: Clock3,
      },
    ],
  },
  {
    title: "Network",
    items: [
      {
        id: "services",
        label: "Services",
        icon: Network,
      },
      {
        id: "ingresses",
        label: "Ingresses",
        icon: Route,
      },
    ],
  },
  {
    title: "Config & Storage",
    items: [
      {
        id: "configMaps",
        label: "ConfigMaps",
        icon: FileText,
      },
      {
        id: "persistentVolumeClaims",
        label: "PVCs",
        icon: Database,
      },
    ],
  },
  {
    title: "Cluster",
    items: [
      {
        id: "namespaces",
        label: "Namespaces",
        icon: Folder,
      },
    ],
  },
] as const;

export const CREATABLE_RESOURCES = [
  "Namespace",
  "Deployment",
  "Service",
  "ConfigMap",
] as const;

export const RESOURCE_TABS = [
  {
    id: "namespaces",
    label: "Namespaces",
  },
  {
    id: "pods",
    label: "Pods",
  },
  {
    id: "deployments",
    label: "Deployments",
  },
  {
    id: "replicaSets",
    label: "ReplicaSets",
  },
  {
    id: "services",
    label: "Services",
  },
  {
    id: "ingresses",
    label: "Ingresses",
  },
  {
    id: "configMaps",
    label: "ConfigMaps",
  },
  {
    id: "persistentVolumeClaims",
    label: "PVCs",
  },
  {
    id: "jobs",
    label: "Jobs",
  },
  {
    id: "cronJobs",
    label: "CronJobs",
  },
] as const;
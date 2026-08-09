import type {
  ResourceStatus,
  ServiceType,
  SecretType,
} from "../types/resources";

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

export const SECRET_TYPES: SecretType[] = [
  "Opaque",
  "kubernetes.io/tls",
  "kubernetes.io/dockerconfigjson",
];

export const RESOURCE_GROUPS = [
  {
    title: "Workloads",
    resources: [
      "Deployment",
      "ReplicaSet",
      "Pod",
      "Job",
      "CronJob",
    ],
  },

  {
    title: "Networking",
    resources: [
      "Service",
      "Ingress",
    ],
  },

  {
    title: "Configuration",
    resources: [
      "ConfigMap",
      "Secret",
    ],
  },

  {
    title: "Storage",
    resources: [
      "PersistentVolumeClaim",
    ],
  },

  {
    title: "Cluster",
    resources: [
      "Namespace",
    ],
  },
] as const;

export const CREATABLE_RESOURCES = [
  "Namespace",
  "Deployment",
  "Service",
  "ConfigMap",
  "Secret",
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
    id: "secrets",
    label: "Secrets",
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
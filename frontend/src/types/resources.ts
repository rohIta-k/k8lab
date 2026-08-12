export type ResourceStatus = String;

export type ServiceType =
  | "ClusterIP"
  | "NodePort"
  | "LoadBalancer"
  | "ExternalName";

export type ResourceType =
  | "namespaces"
  | "pods"
  | "deployments"
  | "replicaSets"
  | "services"
  | "ingresses"
  | "configMaps"
  | "persistentVolumeClaims"
  | "jobs"
  | "cronJobs";

export interface ResourceLabels {
  [key: string]: string;
}

export interface Namespace {
  id: string;
  name: string;
  namespace: string;
  type: "namespaces";
  status: ResourceStatus;
  yaml: string;
  fields: {
    labels: ResourceLabels;
  };
}

export interface Deployment {
  id: string;
  name: string;
  namespace: string;
  type: "deployments";
  status: ResourceStatus;
  yaml: string;
  fields: {
    ready: string;
    replicas: number;
    image: string;
    strategy: string;
    labels: ResourceLabels;
  };
}

export interface ReplicaSet {
  id: string;
  name: string;
  namespace: string;
  type: "replicaSets";
  status: ResourceStatus;
  yaml: string;
  fields: {
    ready: string;
    owner: string;
    labels: ResourceLabels;
  };
}


export interface Pod {
  id: string;
  name: string;
  namespace: string;
  type: "pods";
  status: ResourceStatus;
  yaml: string;
  fields: {
    ready: string;
    restartCount: number;
    node: string;
    ip: string;
    image: string;
    owner: string;
    labels: ResourceLabels;
  };
}


export interface Service {
  id: string;
  name: string;
  namespace: string;
  type: "services";
  status: ResourceStatus;
  yaml: string;
  fields: {
    type: ServiceType | string;
    clusterIP: string;
    ports: string[];
    selector: ResourceLabels;
    labels: ResourceLabels;
  };
}


export interface ConfigMap {
  id: string;
  name: string;
  namespace: string;
  type: "configMaps";
  status: ResourceStatus;
  yaml: string;
  fields: {
    keys: number;
    labels: ResourceLabels;
  };
}


export interface Ingress {
  id: string;
  name: string;
  namespace: string;
  type: "ingresses";
  status: ResourceStatus;
  yaml: string;
  fields: {
    hosts: string[];
    labels: ResourceLabels;
  };
}


export interface PersistentVolumeClaim {
  id: string;
  name: string;
  namespace: string;
  type: "persistentVolumeClaims";
  status: ResourceStatus;
  yaml: string;
  fields: {
    capacity: string;
    labels: ResourceLabels;
  };
}


export interface Job {
  id: string;
  name: string;
  namespace: string;
  type: "jobs";
  status: ResourceStatus;
  yaml: string;
  fields: {
    completions: string;
    image: string;
    labels: ResourceLabels;
  };
}


export interface CronJob {
  id: string;
  name: string;
  namespace: string;
  type: "cronJobs";
  status: ResourceStatus;
  yaml: string;
  fields: {
    schedule: string;
    image: string;
    labels: ResourceLabels;
  };
}


export type Resource =
  | Namespace
  | Deployment
  | ReplicaSet
  | Pod
  | Service
  | ConfigMap
  | Ingress
  | PersistentVolumeClaim
  | Job
  | CronJob;

export interface ResourcesData {
  namespaces: Namespace[];
  deployments: Deployment[];
  replicaSets: ReplicaSet[];
  pods: Pod[];
  services: Service[];
  configMaps: ConfigMap[];
  ingresses: Ingress[];
  persistentVolumeClaims: PersistentVolumeClaim[];
  jobs: Job[];
  cronJobs: CronJob[];
}
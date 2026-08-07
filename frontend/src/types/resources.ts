export type ResourceStatus =
  | "Running"
  | "Pending"
  | "Active"
  | "Completed"
  | "Failed"
  | "CrashLoopBackOff"
  | "ImagePullBackOff"
  | "OOMKilled"
  | "Bound";

export type ServiceType =
  | "ClusterIP"
  | "NodePort"
  | "LoadBalancer"
  | "ExternalName";

export type SecretType =
  | "Opaque"
  | "kubernetes.io/tls"
  | "kubernetes.io/dockerconfigjson";

export interface Namespace {
  id: string;
  name: string;
  status: ResourceStatus;
  age: string;
}

export interface Deployment {
  id: string;
  name: string;
  namespace: string;
  status: ResourceStatus;
  ready: string;
  replicas: number;
  image: string;
  age: string;
  node: string;
  labels: Record<string, string>;
}

export interface ReplicaSet {
  id: string;
  name: string;
  namespace: string;
  status: ResourceStatus;
  ready: string;
  age: string;
  owner: string;
}

export interface Pod {
  id: string;
  name: string;
  namespace: string;
  status: ResourceStatus;
  ready: string;
  age: string;
  node: string;
  restartCount: number;
  image: string;
  ip: string;
  owner: string;
}

export interface Service {
  id: string;
  name: string;
  namespace: string;
  type: ServiceType;
  clusterIP: string;
  ports: string;
  selector: string;
  age: string;
}

export interface ConfigMap {
  id: string;
  name: string;
  namespace: string;
  mountedInto: string[];
  age: string;
}

export interface Secret {
  id: string;
  name: string;
  namespace: string;
  type: SecretType;
  age: string;
}

export interface Ingress {
  id: string;
  name: string;
  namespace: string;
  host: string;
  service: string;
  age: string;
}

export interface PersistentVolumeClaim {
  id: string;
  name: string;
  namespace: string;
  status: ResourceStatus;
  capacity: string;
  age: string;
}

export interface Job {
  id: string;
  name: string;
  namespace: string;
  status: ResourceStatus;
  completions: string;
  age: string;
}

export interface CronJob {
  id: string;
  name: string;
  namespace: string;
  schedule: string;
  status: ResourceStatus;
  age: string;
}

export interface ResourcesData {
  namespaces: Namespace[];
  deployments: Deployment[];
  replicaSets: ReplicaSet[];
  pods: Pod[];
  services: Service[];
  configMaps: ConfigMap[];
  secrets: Secret[];
  ingresses: Ingress[];
  persistentVolumeClaims: PersistentVolumeClaim[];
  jobs: Job[];
  cronJobs: CronJob[];
}
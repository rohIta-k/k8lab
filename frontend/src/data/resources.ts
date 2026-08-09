import type { ResourcesData } from "../types/resources";

export const resourcesData: ResourcesData = {
  namespaces: [
    {
      id: "default",
      name: "default",
      status: "Active",
      age: "12d",
    },
    {
      id: "kube-system",
      name: "kube-system",
      status: "Active",
      age: "12d",
    },
    {
      id: "frontend",
      name: "frontend",
      status: "Active",
      age: "8d",
    },
  ],

  deployments: [
    {
      id: "frontend-deployment",
      name: "frontend-deployment",
      namespace: "frontend",
      status: "Running",
      ready: "3/3",
      replicas: 3,
      image: "nginx:latest",
      age: "3d",
      node: "-",
      labels: {
        app: "frontend",
      },
      strategy: "RollingUpdate",
    },
    {
      id: "backend-deployment",
      name: "backend-deployment",
      namespace: "default",
      status: "Running",
      ready: "2/2",
      replicas: 2,
      image: "node:20",
      age: "6d",
      node: "-",
      labels: {
        app: "backend",
      },
      strategy: "RollingUpdate",
    },
  ],

  replicaSets: [
    {
      id: "frontend-rs",
      name: "frontend-rs",
      namespace: "frontend",
      status: "Running",
      ready: "3/3",
      age: "3d",
      owner: "frontend-deployment",
    },
  ],

  pods: [
    {
      id: "frontend-pod-a",
      name: "frontend-pod-a",
      namespace: "frontend",
      status: "Running",
      ready: "1/1",
      age: "3d",
      node: "worker-node-1",
      restartCount: 0,
      image: "nginx:latest",
      ip: "10.244.0.8",
      owner: "frontend-rs",
    },
    {
      id: "frontend-pod-b",
      name: "frontend-pod-b",
      namespace: "frontend",
      status: "Running",
      ready: "1/1",
      age: "3d",
      node: "worker-node-2",
      restartCount: 1,
      image: "nginx:latest",
      ip: "10.244.0.9",
      owner: "frontend-rs",
    },
    {
      id: "backend-pod",
      name: "backend-pod",
      namespace: "default",
      status: "CrashLoopBackOff",
      ready: "0/1",
      age: "20m",
      node: "worker-node-2",
      restartCount: 9,
      image: "node:20",
      ip: "10.244.0.15",
      owner: "backend-deployment",
    },
  ],

  services: [
    {
      id: "frontend-service",
      name: "frontend-service",
      namespace: "frontend",
      type: "ClusterIP",
      clusterIP: "10.96.0.25",
      ports: "80 → 8080",
      selector: "app=frontend",
      age: "3d",
    },
  ],

  configMaps: [
    {
      id: "frontend-config",
      name: "frontend-config",
      namespace: "frontend",
      mountedInto: ["frontend-pod-a", "frontend-pod-b"],
      age: "5d",
    },
  ],

  secrets: [
    {
      id: "db-secret",
      name: "db-secret",
      namespace: "default",
      type: "Opaque",
      age: "8d",
    },
  ],

  ingresses: [
    {
      id: "frontend-ingress",
      name: "frontend-ingress",
      namespace: "frontend",
      host: "k8lab.local",
      service: "frontend-service",
      age: "3d",
    },
  ],

  persistentVolumeClaims: [
    {
      id: "frontend-pvc",
      name: "frontend-pvc",
      namespace: "frontend",
      status: "Bound",
      capacity: "5Gi",
      age: "6d",
    },
  ],

  jobs: [
    {
      id: "backup-job",
      name: "backup-job",
      namespace: "default",
      status: "Completed",
      completions: "1/1",
      age: "2d",
    },
  ],

  cronJobs: [
    {
      id: "nightly-backup",
      name: "nightly-backup",
      namespace: "default",
      schedule: "0 2 * * *",
      status: "Active",
      age: "7d",
    },
  ],
};
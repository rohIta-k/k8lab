import type { Experiment } from "../types/experiment";

export const experimentsData: Experiment[] = [
  {
    id: "crashloopbackoff",

    name: "CrashLoopBackOff",

    category: "Pod Lifecycle",

    difficulty: "Beginner",

    description:
      "Creates a pod that repeatedly crashes to observe Kubernetes restart behavior.",

    namespace: "default",

    estimatedTime: "15 sec",

    resources: ["Deployment", "ReplicaSet", "Pod"],

    configuration: {
      deploymentName: "crash-demo",
      image: "busybox",
      replicas: 1,
      command: ["sh", "-c", "exit 1"],
    },

    expectedState: "CrashLoopBackOff",
  },

  {
    id: "imagepullbackoff",

    name: "ImagePullBackOff",

    category: "Pod Lifecycle",

    difficulty: "Beginner",

    description:
      "Deploys a pod with an invalid image to demonstrate image pull failures.",

    namespace: "default",

    estimatedTime: "10 sec",

    resources: ["Deployment", "Pod"],

    configuration: {
      deploymentName: "image-demo",
      image: "nginx:notfound",
      replicas: 1,
    },

    expectedState: "ImagePullBackOff",
  },

  {
    id: "oomkilled",

    name: "OOMKilled",

    category: "Pod Lifecycle",

    difficulty: "Intermediate",

    description:
      "Creates a memory constrained pod that exceeds its memory limit.",

    namespace: "default",

    estimatedTime: "20 sec",

    resources: ["Deployment", "Pod"],

    configuration: {
      memoryLimit: "64Mi",
      image: "polinux/stress",
    },

    expectedState: "OOMKilled",
  },

  {
    id: "pendingpod",

    name: "Pending Pod",

    category: "Scheduling",

    difficulty: "Intermediate",

    description:
      "Creates a pod requesting resources that cannot currently be scheduled.",

    namespace: "default",

    estimatedTime: "15 sec",

    resources: ["Pod"],

    configuration: {
      cpu: "32",
      memory: "64Gi",
    },

    expectedState: "Pending",
  },

  {
    id: "livenessprobe",

    name: "Failed Liveness Probe",

    category: "Health Checks",

    difficulty: "Advanced",

    description:
      "Creates a pod with an intentionally failing liveness probe.",

    namespace: "default",

    estimatedTime: "20 sec",

    resources: ["Deployment", "Pod"],

    configuration: {
      initialDelaySeconds: 5,
      periodSeconds: 5,
    },

    expectedState: "Restarting",
  },
];
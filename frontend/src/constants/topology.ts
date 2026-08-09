import {
  Box,
  Boxes,
  Cpu,
  HardDrive,
  KeyRound,
  Network,
  Server,
} from "lucide-react";

import { COLORS } from "./colors";

export const TOPOLOGY_NODE_CONFIG = {
  cluster: {
    label: "Cluster",
    icon: Server,
    color: COLORS.resources.cluster,
    borderWidth: 2,
  },

  node: {
    label: "Node",
    icon: Cpu,
    color: COLORS.resources.node,
    borderWidth: 2,
  },

  deployment: {
    label: "Deployment",
    icon: Boxes,
    color: COLORS.resources.deployment,
    borderWidth: 2,
  },

  replicaSet: {
    label: "ReplicaSet",
    icon: Boxes,
    color: COLORS.resources.replicaSet,
    borderWidth: 2,
  },

  pod: {
    label: "Pod",
    icon: Box,
    color: COLORS.resources.pod,
    borderWidth: 2,
  },

  service: {
    label: "Service",
    icon: Network,
    color: COLORS.resources.service,
    borderWidth: 2,
  },

  ingress: {
    label: "Ingress",
    icon: Network,
    color: COLORS.resources.ingress,
    borderWidth: 2,
  },

  configMap: {
    label: "ConfigMap",
    icon: HardDrive,
    color: COLORS.resources.configMap,
    borderWidth: 2,
  },

  secret: {
    label: "Secret",
    icon: KeyRound,
    color: COLORS.resources.secret,
    borderWidth: 2,
  },
} as const;

export type TopologyNodeConfig =
  typeof TOPOLOGY_NODE_CONFIG;
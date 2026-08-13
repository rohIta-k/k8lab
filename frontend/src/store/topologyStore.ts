import { create } from "zustand";

import type {
  TopologyDisplayFilters,
  TopologyEdge,
  TopologyGraph,
  TopologyNode,
  TopologySelection,
  TopologyViewport,
} from "../types/topology";

interface TopologyStore {
  topology: TopologyGraph;

  loading: boolean;
  error: string | null;

  selection: TopologySelection;

  viewport: TopologyViewport;

  displayFilters: TopologyDisplayFilters;

  setTopology: (topology: TopologyGraph) => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  setSelectedNode: (
    node: TopologyNode | null
  ) => void;

  setSelectedEdge: (
    edge: TopologyEdge | null
  ) => void;

  setZoom: (zoom: number) => void;

  setDisplayFilter: (
    type: keyof TopologyDisplayFilters,
    enabled: boolean
  ) => void;

  resetSelection: () => void;
}

const defaultDisplayFilters: TopologyDisplayFilters = {
  cluster: true,
  node: true,
  deployment: true,
  replicaSet: true,
  pod: true,
  service: true,
  ingress: true,
  configMap: true,
};

const emptyTopology: TopologyGraph = {
  clusterId: "",
  clusterName: "",
  nodes: [],
  edges: [],
};

export const useTopologyStore =
  create<TopologyStore>((set) => ({
    topology: emptyTopology,

    loading: false,

    error: null,

    selection: {
      node: null,
      edge: null,
    },

    viewport: {
      zoom: 1,
      x: 0,
      y: 0,
    },

    displayFilters:
      defaultDisplayFilters,

    setTopology: (topology) =>
      set({
        topology,
        error: null,
      }),

    setLoading: (loading) =>
      set({
        loading,
      }),

    setError: (error) =>
      set({
        error,
      }),

    setSelectedNode: (node) =>
      set((state) => ({
        selection: {
          ...state.selection,
          node,
        },
      })),

    setSelectedEdge: (edge) =>
      set((state) => ({
        selection: {
          ...state.selection,
          edge,
        },
      })),

    setZoom: (zoom) =>
      set((state) => ({
        viewport: {
          ...state.viewport,
          zoom,
        },
      })),

    setDisplayFilter: (
      type,
      enabled
    ) =>
      set((state) => ({
        displayFilters: {
          ...state.displayFilters,
          [type]: enabled,
        },
      })),

    resetSelection: () =>
      set({
        selection: {
          node: null,
          edge: null,
        },
      }),
  }));
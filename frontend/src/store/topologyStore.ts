import { create } from "zustand";

import { topologyData } from "../data/topology";

import type {
    TopologyEdge,
    TopologyGraph,
    TopologyNode,
    TopologySelection,
    TopologyViewport,
} from "../types/topology";

interface TopologyStore {
    topology: TopologyGraph;

    selection: TopologySelection;

    viewport: TopologyViewport;

    setSelectedNode: (node: TopologyNode | null) => void;

    setSelectedEdge: (edge: TopologyEdge | null) => void;

    setZoom: (zoom: number) => void;

    resetSelection: () => void;
}

export const useTopologyStore = create<TopologyStore>((set) => ({
    topology: topologyData,

    selection: {
        node: null,
        edge: null,
    },

    viewport: {
        zoom: 1,
        x: 0,
        y: 0,
    },

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

    resetSelection: () =>
        set({
            selection: {
                node: null,
                edge: null,
            },
        }),
}));
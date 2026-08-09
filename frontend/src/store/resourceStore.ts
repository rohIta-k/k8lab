import { create } from "zustand";

import { resourcesData } from "../data/resources";

import type {
  ResourcesData,
  ResourceType,
} from "../types/resources";

interface ResourceStore {
  resources: ResourcesData;

  selectedNamespace: string;

  selectedResourceType: ResourceType;

  selectedResourceId: string | null;

  searchQuery: string;

  setNamespace: (namespace: string) => void;

  setResourceType: (resourceType: ResourceType) => void;

  setSelectedResource: (resourceId: string | null) => void;

  setSearchQuery: (query: string) => void;

  resetSelection: () => void;
}

export const useResourceStore = create<ResourceStore>((set) => ({
  resources: resourcesData,

  selectedNamespace: "default",

  selectedResourceType: "deployments",

  selectedResourceId: null,

  searchQuery: "",

  setNamespace: (namespace) =>
    set({
      selectedNamespace: namespace,
    }),

  setResourceType: (resourceType) =>
    set({
      selectedResourceType: resourceType,
    }),

  setSelectedResource: (resourceId) =>
    set({
      selectedResourceId: resourceId,
    }),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  resetSelection: () =>
    set({
      selectedResourceId: null,
      searchQuery: "",
    }),
}));
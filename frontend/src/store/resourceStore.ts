import { create } from "zustand";

import type {
  Resource,
  ResourcesData,
  ResourceType,
} from "../types/resources";

interface ResourceStore {
  resources: ResourcesData;

  selectedNamespace: string;

  selectedResourceType: ResourceType;

  selectedResourceId: string | null;

  showCreateResource: boolean;

  searchQuery: string;

  setNamespace: (namespace: string) => void;

  setResourceType: (resourceType: ResourceType) => void;

  setSelectedResource: (
    resourceId: string | null
  ) => void;

  setSearchQuery: (query: string) => void;

  setShowCreateResource: (
    value: boolean
  ) => void;

  setResources: (
    resources: ResourcesData
  ) => void;

  createResource: (
    resource: Resource
  ) => void;

  resetSelection: () => void;
}

const emptyResources: ResourcesData = {
  namespaces: [],
  deployments: [],
  replicaSets: [],
  pods: [],
  services: [],
  configMaps: [],
  ingresses: [],
  persistentVolumeClaims: [],
  jobs: [],
  cronJobs: [],
};

export const useResourceStore =
  create<ResourceStore>((set) => ({
    resources: emptyResources,

    selectedNamespace: "default",

    selectedResourceType: "deployments",

    selectedResourceId: null,

    showCreateResource: false,

    searchQuery: "",

    setNamespace: (namespace) =>
      set({
        selectedNamespace: namespace,
      }),

    setResourceType: (resourceType) =>
      set({
        selectedResourceType: resourceType,
        selectedResourceId: null,
      }),

    setSelectedResource: (resourceId) =>
      set({
        selectedResourceId: resourceId,
      }),

    setSearchQuery: (query) =>
      set({
        searchQuery: query,
      }),

    setShowCreateResource: (value) =>
      set({
        showCreateResource: value,
      }),

    setResources: (resources) =>
      set({
        resources,
      }),

    createResource: (resource) =>
      set((state) => {
        const type =
          resource.type;

        return {
          resources: {
            ...state.resources,
            [type]: [
              ...state.resources[type],
              resource,
            ],
          },
        };
      }),

    resetSelection: () =>
      set({
        selectedResourceId: null,
        searchQuery: "",
      }),
  }));
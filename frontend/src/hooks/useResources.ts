import { useResourceStore } from "../store";

export function useResources() {
  const {
    resources,
    selectedNamespace,
    selectedResourceType,
    selectedResourceId,
    searchQuery,
    setNamespace,
    setResourceType,
    setSelectedResource,
    setSearchQuery,
    resetSelection,
  } = useResourceStore((state) => ({
    resources: state.resources,
    selectedNamespace: state.selectedNamespace,
    selectedResourceType: state.selectedResourceType,
    selectedResourceId: state.selectedResourceId,
    searchQuery: state.searchQuery,
    setNamespace: state.setNamespace,
    setResourceType: state.setResourceType,
    setSelectedResource: state.setSelectedResource,
    setSearchQuery: state.setSearchQuery,
    resetSelection: state.resetSelection,
  }));

  return {
    resources,
    selectedNamespace,
    selectedResourceType,
    selectedResourceId,
    searchQuery,
    setNamespace,
    setResourceType,
    setSelectedResource,
    setSearchQuery,
    resetSelection,
  };
}
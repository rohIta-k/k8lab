import { useResourceStore } from "../store";

export function useResources() {
  const resources = useResourceStore(
    (state) => state.resources
  );

  const selectedNamespace = useResourceStore(
    (state) => state.selectedNamespace
  );

  const selectedResourceType = useResourceStore(
    (state) => state.selectedResourceType
  );

  const selectedResourceId = useResourceStore(
    (state) => state.selectedResourceId
  );

  const searchQuery = useResourceStore(
    (state) => state.searchQuery
  );

  const setNamespace = useResourceStore(
    (state) => state.setNamespace
  );

  const setResourceType = useResourceStore(
    (state) => state.setResourceType
  );

  const setSelectedResource = useResourceStore(
    (state) => state.setSelectedResource
  );

  const setSearchQuery = useResourceStore(
    (state) => state.setSearchQuery
  );

  const resetSelection = useResourceStore(
    (state) => state.resetSelection
  );

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
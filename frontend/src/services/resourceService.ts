import { api } from "./api";

import type {
  Resource,
  ResourceType,
} from "../types/resources";

export interface CreateResourceRequest {
  name: string;
  namespace?: string;
  image?: string;
  replicas?: number;
  type?: string;
  port?: number;
  storage?: string;
  schedule?: string;
}

export const resourceService = {
  getResources<T extends Resource>(
  clusterId: string,
  resourceType: ResourceType
) {
  return api.get<T[]>(
    `/api/clusters/${encodeURIComponent(
      clusterId
    )}/resources/${resourceType}`
  );
},

  createResource(
    clusterId: string,
    resourceType: ResourceType,
    data: CreateResourceRequest
  ) {
    return api.post<Resource>(
      `/api/clusters/${encodeURIComponent(
        clusterId
      )}/resources/${resourceType}`,
      data
    );
  },

  deleteResource(
    clusterId: string,
    resourceType: ResourceType,
    name: string,
    namespace?: string
  ) {
    const query = namespace
      ? `?namespace=${encodeURIComponent(
          namespace
        )}`
      : "";

    return api.delete<{
      message: string;
    }>(
      `/api/clusters/${encodeURIComponent(
        clusterId
      )}/resources/${resourceType}/${encodeURIComponent(
        name
      )}${query}`
    );
  },
};
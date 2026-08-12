import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Plus } from "lucide-react";

import {
  ResourceTabs,
  ResourceTable,
  ResourceDetails,
  CreateResource,
} from "../../components/resources";

import {
  useCluster,
  useResources,
} from "../../hooks";

import { resourceService } from "../../services/resourceService";

import type {
  Namespace,
  Deployment,
  ReplicaSet,
  Pod,
  Service,
  ConfigMap,
  Ingress,
  PersistentVolumeClaim,
  Job,
  CronJob,
  Resource,
  ResourcesData,
} from "../../types/resources";

export default function Resources() {
  const { currentCluster } = useCluster();

  const {
    resources,
    selectedResourceType,
    selectedResourceId,
    showCreateResource,
    setShowCreateResource,
    setResources,
  } = useResources();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [isDetailsCollapsed, setIsDetailsCollapsed] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  const fetchResources = useCallback(
    async () => {
      if (!currentCluster) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [
          namespaces,
          deployments,
          replicaSets,
          pods,
          services,
          configMaps,
          ingresses,
          persistentVolumeClaims,
          jobs,
          cronJobs,
        ] = await Promise.all([
          resourceService.getResources<Namespace>(
            currentCluster.id,
            "namespaces"
          ),

          resourceService.getResources<Deployment>(
            currentCluster.id,
            "deployments"
          ),

          resourceService.getResources<ReplicaSet>(
            currentCluster.id,
            "replicaSets"
          ),

          resourceService.getResources<Pod>(
            currentCluster.id,
            "pods"
          ),

          resourceService.getResources<Service>(
            currentCluster.id,
            "services"
          ),

          resourceService.getResources<ConfigMap>(
            currentCluster.id,
            "configMaps"
          ),

          resourceService.getResources<Ingress>(
            currentCluster.id,
            "ingresses"
          ),

          resourceService.getResources<PersistentVolumeClaim>(
            currentCluster.id,
            "persistentVolumeClaims"
          ),

          resourceService.getResources<Job>(
            currentCluster.id,
            "jobs"
          ),

          resourceService.getResources<CronJob>(
            currentCluster.id,
            "cronJobs"
          ),
        ]);

        const data: ResourcesData = {
          namespaces,
          deployments,
          replicaSets,
          pods,
          services,
          configMaps,
          ingresses,
          persistentVolumeClaims,
          jobs,
          cronJobs,
        };

        setResources(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch resources."
        );
      } finally {
        setLoading(false);
      }
    },
    [currentCluster?.id, setResources]
  );

  const currentResources =
    resources[selectedResourceType] as Resource[];

  const selectedResource =
    currentResources.find(
      (item) =>
        item.id === selectedResourceId
    ) ?? null;

  const handleDelete = useCallback(
    async () => {
      if (!currentCluster || !selectedResource) {
        return;
      }

      setDeleting(true);
      setError(null);

      try {
        await resourceService.deleteResource(
          currentCluster.id,
          selectedResource.type,
          selectedResource.name,
          "namespace" in selectedResource
            ? selectedResource.namespace
            : undefined
        );

        setIsDetailsCollapsed(true);

        await fetchResources();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete resource."
        );
      } finally {
        setDeleting(false);
      }
    },
    [
      currentCluster?.id,
      selectedResource,
      fetchResources,
    ]
  );

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    setIsDetailsCollapsed(false);
  }, [selectedResourceId]);

  if (!currentCluster) {
    return (
      <div className="pt-8">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 text-sm text-[var(--text-secondary)]">
          No cluster connected.
        </div>
      </div>
    );
  }

  const detailsOpen =
    Boolean(selectedResourceId) &&
    !isDetailsCollapsed;

  return (
    <div className="pt-8">
      <div className="space-y-8">

        {/* Create button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setShowCreateResource(
                !showCreateResource
              )
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:opacity-90"
          >
            <Plus size={16} />

            {showCreateResource
              ? "Close"
              : "Create Resource"}
          </button>
        </div>

        {/* Create resource form */}
        {showCreateResource && (
          <CreateResource
            clusterId={currentCluster.id}
            onCreated={fetchResources}
          />
        )}

        {loading && (
          <div className="text-sm text-[var(--text-secondary)]">
            Loading resources...
          </div>
        )}

        {error && (
          <div className="rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {/* Tabs + table/details */}
        <div className="flex items-start gap-6">

          <aside className="w-[240px] shrink-0">
            <ResourceTabs />
          </aside>

          <div
            className={
              detailsOpen
                ? "grid min-w-0 flex-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
                : "min-w-0 flex-1"
            }
          >
            <ResourceTable
              resources={currentResources}
              onRowClick={() =>
                setIsDetailsCollapsed(false)
              }
            />

            {selectedResourceId && (
              <ResourceDetails
                resource={selectedResource}
                collapsed={isDetailsCollapsed}
                onToggle={() =>
                  setIsDetailsCollapsed(true)
                }
                onDelete={handleDelete}
                deleting={deleting}
              />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
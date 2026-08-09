import { useState } from "react";

import {
    Check,
    ChevronDown,
    ChevronUp,
    Circle,
    Cpu,
    Layers3,
    Loader2,
    Plus,
    Trash2,
    PlugZap,
    X,
} from "lucide-react";

import { useCluster } from "../../hooks";

export default function ClusterSelector() {
    const {
        clusters,
        currentCluster,
        setCurrentCluster,
    } = useCluster();

    const [showClusters, setShowClusters] =
        useState(false);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [connectingId, setConnectingId] =
        useState<string | null>(null);

    const [deletingId, setDeletingId] =
        useState<string | null>(null);

    const [clusterName, setClusterName] =
        useState("");

    const [provider, setProvider] =
        useState("kind");

    const handleConnect = (clusterId: string) => {
        setConnectingId(clusterId);

        // Temporary mock connection.
        // Replace with clusterService.connectCluster()
        // when the backend is available.
        setTimeout(() => {
            setCurrentCluster(clusterId);
            setConnectingId(null);
            setShowClusters(false);
        }, 800);
    };

    const handleCreate = () => {
        if (!clusterName.trim()) {
            return;
        }

        // TODO:
        // Replace with clusterService.createCluster()
        console.log({
            name: clusterName,
            provider,
        });

        setClusterName("");
        setProvider("kind");
        setShowCreateForm(false);
    };

    const handleDelete = (clusterId: string) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this cluster?"
            )
        ) {
            return;
        }

        setDeletingId(clusterId);

        // TODO:
        // Replace with clusterService.deleteCluster()
        setTimeout(() => {
            setDeletingId(null);
        }, 500);
    };

    const availableClusters = clusters.filter(
        (cluster) => cluster.id !== currentCluster.id
    );

    return (
        <>
            <section className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-5 shadow-[var(--shadow-md)]">
                {/* Header */}
                <div className="mb-5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Layers3
                        size={16}
                        className="text-[var(--primary-light)]"
                    />

                    <span className="text-base font-medium">
                        Cluster Selector
                    </span>
                </div>

                {/* Current cluster */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--background-hover)]">
                            <Cpu
                                size={18}
                                className="text-[var(--primary-light)]"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold text-[var(--text-primary)]">
                                {currentCluster.name}
                            </h2>

                            <p className="text-xs text-[var(--text-secondary)]">
                                {currentCluster.provider} •{" "}
                                {currentCluster.version}
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--success)]/20 bg-[var(--success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--success)]">
                        <Circle
                            size={7}
                            fill="currentColor"
                        />

                        Connected
                    </span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setShowClusters((value) => !value)
                        }
                        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--primary)]/20"
                    >
                        <PlugZap size={16} />

                        Connect Cluster

                        {showClusters ? (
                            <ChevronUp size={15} />
                        ) : (
                            <ChevronDown size={15} />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowCreateForm(true)
                        }
                        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-hover)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                    >
                        <Plus size={16} />

                        Create Cluster
                    </button>
                </div>

                {/* Available clusters */}
                {showClusters && (
                    <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-primary)] p-3">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                                    Available Clusters
                                </h3>

                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                    Select a cluster to connect.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowClusters(false)
                                }
                                className="rounded-md p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {availableClusters.length === 0 ? (
                                <p className="py-4 text-center text-sm text-[var(--text-muted)]">
                                    No other clusters available.
                                </p>
                            ) : (
                                availableClusters.map(
                                    (cluster) => {
                                        const connecting =
                                            connectingId ===
                                            cluster.id;

                                        const deleting =
                                            deletingId ===
                                            cluster.id;

                                        return (
                                            <div
                                                key={cluster.id}
                                                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-card)] p-3"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-hover)]">
                                                        <Cpu
                                                            size={16}
                                                            className="text-[var(--text-secondary)]"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                                                            {cluster.name}
                                                        </p>

                                                        <p className="text-xs text-[var(--text-muted)]">
                                                            {cluster.provider} •{" "}
                                                            {cluster.version}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2">
                                                    <span className="hidden rounded-full bg-[var(--background-hover)] px-2 py-1 text-xs text-[var(--text-muted)] sm:block">
                                                        {cluster.status}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            connecting ||
                                                            deleting
                                                        }
                                                        onClick={() =>
                                                            handleConnect(
                                                                cluster.id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {connecting ? (
                                                            <>
                                                                <Loader2
                                                                    size={14}
                                                                    className="animate-spin"
                                                                />

                                                                Connecting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check
                                                                    size={14}
                                                                />

                                                                Connect
                                                            </>
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            connecting ||
                                                            deleting
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                cluster.id
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Delete cluster"
                                                    >
                                                        {deleting ? (
                                                            <Loader2
                                                                size={15}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Trash2
                                                                size={15}
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Create Cluster Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] shadow-[var(--shadow-lg)]">
                        {/* Modal header */}
                        <div className="flex items-center justify-between border-b border-[var(--border-color)] p-5">
                            <div>
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                    Create Cluster
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-muted)]">
                                    Configure your new local cluster.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateForm(false)
                                }
                                className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-5 p-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                    Cluster Name
                                </label>

                                <input
                                    value={clusterName}
                                    onChange={(event) =>
                                        setClusterName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="my-cluster"
                                    className="w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                                    Provider
                                </label>

                                <select
                                    value={provider}
                                    onChange={(event) =>
                                        setProvider(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                                >
                                    <option value="kind">
                                        kind
                                    </option>

                                    <option value="minikube">
                                        minikube
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Modal actions */}
                        <div className="flex justify-end gap-3 border-t border-[var(--border-color)] p-5">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateForm(false)
                                }
                                className="rounded-[var(--radius-md)] border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--background-hover)]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!clusterName.trim()}
                                onClick={handleCreate}
                                className="rounded-[var(--radius-md)] bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Create Cluster
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
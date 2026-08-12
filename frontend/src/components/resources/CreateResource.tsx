import {
  X,
  Plus,
} from "lucide-react";

import { useState } from "react";

import { useResources } from "../../hooks";

import { resourceService } from "../../services/resourceService";

import type { CreateResourceRequest } from "../../services/resourceService";

interface FormData {
  name: string;
  namespace: string;
  image: string;
  replicas: string;
  type: string;
  port: string;
  storage: string;
  schedule: string;
}

interface CreateResourceProps {
  clusterId: string;
  onCreated: () => Promise<void>;
}

export default function CreateResource({
  clusterId,
  onCreated,
}: CreateResourceProps) {
  const {
    selectedResourceType,
    selectedNamespace,
    setShowCreateResource,
  } = useResources();

  const [form, setForm] = useState<FormData>({
    name: "",
    namespace:
      selectedNamespace || "default",
    image: "",
    replicas: "1",
    type: "ClusterIP",
    port: "80",
    storage: "1Gi",
    schedule: "0 2 * * *",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError(
        "Resource name is required.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data: CreateResourceRequest = {
        name: form.name.trim(),
      };

      if (
        selectedResourceType !==
        "namespaces"
      ) {
        data.namespace =
          form.namespace.trim() ||
          "default";
      }

      if (
        selectedResourceType ===
          "deployments" ||
        selectedResourceType === "pods"
      ) {
        data.image =
          form.image.trim() ||
          "nginx:latest";
      }

      if (
        selectedResourceType ===
        "deployments"
      ) {
        data.replicas =
          Number(form.replicas) || 1;
      }

      if (
        selectedResourceType ===
        "services"
      ) {
        data.type =
          form.type || "ClusterIP";

        data.port =
          Number(form.port) || 80;
      }

      if (
        selectedResourceType ===
        "persistentVolumeClaims"
      ) {
        data.storage =
          form.storage.trim() || "1Gi";
      }

      if (
        selectedResourceType ===
        "cronJobs"
      ) {
        data.schedule =
          form.schedule.trim() ||
          "0 2 * * *";
      }

      await resourceService.createResource(
        clusterId,
        selectedResourceType,
        data,
      );

      // Fetch the actual Kubernetes state
      // after creation.
      await onCreated();

      setShowCreateResource(false);

      setForm({
        name: "",
        namespace:
          selectedNamespace || "default",
        image: "",
        replicas: "1",
        type: "ClusterIP",
        port: "80",
        storage: "1Gi",
        schedule: "0 2 * * *",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create resource.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Create{" "}
          {formatResourceName(
            selectedResourceType,
          )}
        </h2>

        <button
          type="button"
          onClick={() =>
            setShowCreateResource(false)
          }
          className="rounded-[var(--radius-md)] p-2 text-[var(--text-muted)] transition hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]"
        >
          <X size={18} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger)]/10 px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <ResourceForm
        type={selectedResourceType}
        form={form}
        updateField={updateField}
      />

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} />

          {loading
            ? "Creating..."
            : "Create"}
        </button>
      </div>
    </div>
  );
}

function ResourceForm({
  type,
  form,
  updateField,
}: {
  type: string;
  form: FormData;
  updateField: (
    field: keyof FormData,
    value: string,
  ) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field
        label="Name"
        value={form.name}
        placeholder="resource-name"
        onChange={(value) =>
          updateField("name", value)
        }
      />

      {type !== "namespaces" && (
        <Field
          label="Namespace"
          value={form.namespace}
          placeholder="default"
          onChange={(value) =>
            updateField(
              "namespace",
              value,
            )
          }
        />
      )}

      {(type === "deployments" ||
        type === "pods") && (
        <Field
          label="Image"
          value={form.image}
          placeholder="nginx:latest"
          onChange={(value) =>
            updateField("image", value)
          }
        />
      )}

      {type === "deployments" && (
        <Field
          label="Replicas"
          value={form.replicas}
          placeholder="1"
          type="number"
          onChange={(value) =>
            updateField(
              "replicas",
              value,
            )
          }
        />
      )}

      {type === "services" && (
        <>
          <Field
            label="Type"
            value={form.type}
            placeholder="ClusterIP"
            onChange={(value) =>
              updateField(
                "type",
                value,
              )
            }
          />

          <Field
            label="Port"
            value={form.port}
            placeholder="80"
            type="number"
            onChange={(value) =>
              updateField(
                "port",
                value,
              )
            }
          />
        </>
      )}

      {type ===
        "persistentVolumeClaims" && (
        <Field
          label="Storage"
          value={form.storage}
          placeholder="1Gi"
          onChange={(value) =>
            updateField(
              "storage",
              value,
            )
          }
        />
      )}

      {type === "cronJobs" && (
        <Field
          label="Schedule"
          value={form.schedule}
          placeholder="0 2 * * *"
          onChange={(value) =>
            updateField(
              "schedule",
              value,
            )
          }
        />
      )}

      {![
        "namespaces",
        "deployments",
        "pods",
        "services",
        "persistentVolumeClaims",
        "cronJobs",
      ].includes(type) && (
        <div className="rounded-[var(--radius-md)] bg-[var(--background-hover)] p-4 text-sm text-[var(--text-secondary)]">
          Basic resource creation is
          available for this resource.
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        min={
          type === "number"
            ? 1
            : undefined
        }
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--background-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
      />
    </label>
  );
}

function formatResourceName(
  type: string,
) {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) =>
      char.toUpperCase(),
    )
    .replace(/s$/, "");
}
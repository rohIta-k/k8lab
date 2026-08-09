export function capitalize(value: string): string {
  if (!value.length) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatAge(value: string): string {
  return value;
}

export function formatMemory(memory: string): string {
  if (memory.endsWith("Mi")) {
    const size = Number(memory.replace("Mi", ""));

    if (size >= 1024) {
      return `${size / 1024} Gi`;
    }
  }

  return memory;
}

export function formatCPU(cpu: string): string {
  if (cpu.endsWith("m")) {
    const value = Number(cpu.replace("m", ""));

    return `${value / 1000} CPU`;
  }

  return cpu;
}

export function formatNamespace(namespace: string): string {
  return namespace === "default" ? "Default" : capitalize(namespace);
}

export function formatLabels(
  labels: Record<string, string>
): string[] {
  return Object.entries(labels).map(
    ([key, value]) => `${key}=${value}`
  );
}

export function formatRestartCount(count: number): string {
  return count === 1 ? "1 Restart" : `${count} Restarts`;
}

export function truncateText(
  value: string,
  maxLength = 24
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.substring(0, maxLength)}...`;
}

export function formatStatus(status: string): string {
  return status.replace(/([A-Z])/g, " $1").trim();
}
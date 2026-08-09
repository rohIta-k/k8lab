const RFC1123_REGEX =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

export function validateResourceName(
  value: string
): boolean {
  return RFC1123_REGEX.test(value);
}

export function validateNamespace(
  namespace: string
): boolean {
  return RFC1123_REGEX.test(namespace);
}

export function validateContainerImage(
  image: string
): boolean {
  return image.trim().length > 0;
}

export function validateReplicas(
  replicas: number
): boolean {
  return Number.isInteger(replicas) && replicas >= 0;
}

export function validateMemory(
  memory: string
): boolean {
  return /^[0-9]+(Mi|Gi)$/.test(memory);
}

export function validateCPU(
  cpu: string
): boolean {
  return /^[0-9]+m?$/.test(cpu);
}
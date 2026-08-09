import { FileCode } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/Button";

import type { Resource } from "../../types/resources";

interface YAMLCardProps {
  resource: Resource;
}

export default function YAMLCard({
  resource,
}: YAMLCardProps) {
  const yaml = `apiVersion: v1
kind: ${resource.constructor.name}
metadata:
  name: ${resource.name}
spec:
  # Live YAML will be fetched from backend`;

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode
            size={18}
            className="text-[var(--primary)]"
          />

          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            YAML Configuration
          </h3>
        </div>

        <Button
          variant="ghost"
          className="text-xs"
        >
          Copy
        </Button>
      </div>

      <pre className="overflow-auto rounded-[var(--radius-md)] bg-[var(--background-primary)] p-4 text-xs leading-6 text-[var(--text-secondary)]">
        <code>{yaml}</code>
      </pre>
    </Card>
  );
}
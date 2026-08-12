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
  const copyYAML = async () => {
    try {
      await navigator.clipboard.writeText(
        resource.yaml
      );
    } catch {
      // Ignore clipboard errors.
    }
  };

  return (
    <Card className="!p-2 shadow-none">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
        <div className="flex items-center gap-2">
          <FileCode
            size={16}
            className="text-[var(--primary)]"
          />

          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
            YAML Configuration
          </h3>
        </div>

        <Button
          variant="ghost"
          className="text-xs"
          onClick={copyYAML}
        >
          Copy
        </Button>
      </div>

      <pre className="max-h-[420px] overflow-auto bg-[var(--background-primary)] p-4 text-xs leading-6 text-[var(--text-secondary)]">
        <code>{resource.yaml}</code>
      </pre>
    </Card>
  );
}
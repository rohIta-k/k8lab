import {
  Plus,
  RefreshCw,
} from "lucide-react";

import { useResources } from "../../hooks";

import Button from "../common/Button";
import Dropdown from "../common/Dropdown";

export default function ResourceToolbar() {
  const {
    resources,
    selectedNamespace,
    setNamespace,
  } = useResources();

  const namespaces = resources.namespaces.map((namespace) => ({
    label: namespace.name,
    value: namespace.name,
  }));

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <Dropdown
        value={selectedNamespace}
        options={namespaces}
        onChange={setNamespace}
      />

      <div className="flex items-center gap-3">
        <Button variant="secondary">
          <RefreshCw size={16} />
          <span className="ml-2">Refresh</span>
        </Button>

        <Button>
          <Plus size={16} />
          <span className="ml-2">
            Create Resource
          </span>
        </Button>
      </div>
    </div>
  );
}
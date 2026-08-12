import Table from "../common/Table";

import ResourceRow from "./ResourceRow";

import { RESOURCE_COLUMNS } from "../../constants/tableColumns";

import { useResources } from "../../hooks";

import type {
  Resource,
} from "../../types/resources";

interface ResourceTableProps {
  resources: Resource[];
  onRowClick?: (resource: Resource) => void;
}

export default function ResourceTable({
  resources,
  onRowClick,
}: ResourceTableProps) {
  const {
    selectedResourceType,
    setSelectedResource,
  } = useResources();

  const columns =
    RESOURCE_COLUMNS[
      selectedResourceType
    ];

  return (
    <Table<Resource>
      columns={columns}
      data={resources}
      getRowKey={(row) => row.id}
      onRowClick={(row) => {
        setSelectedResource(row.id);
        onRowClick?.(row);
      }}
      renderCell={(row, column) => (
        <ResourceRow
          resource={row}
          column={column}
        />
      )}
    />
  );
}
import Table from "../common/Table";

import ResourceRow from "./ResourceRow";

import { RESOURCE_COLUMNS } from "../../constants/tableColumns";

import { useResources } from "../../hooks";

import type { Resource } from "../../types/resources";

export default function ResourceTable() {
  const {
    resources,
    selectedResourceType,
    setSelectedResource,
  } = useResources();

  const columns =
    RESOURCE_COLUMNS[selectedResourceType];

  const data =
    resources[selectedResourceType] as Resource[];

  return (
    <Table<Resource>
      columns={columns}
      data={data}
      getRowKey={(row) => row.id}
      onRowClick={(row) =>
        setSelectedResource(row.id)
      }
      renderCell={(row, column) => (
        <ResourceRow
          resource={row}
          column={column}
        />
      )}
    />
  );
}
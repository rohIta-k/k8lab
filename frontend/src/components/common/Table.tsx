import clsx from "clsx";

import type { TableColumn } from "../../types/ui";

interface TableProps<T extends { id: string }> {
  columns: TableColumn[];

  data: T[];

  getRowKey: (row: T) => string;

  renderCell: (
    row: T,
    column: TableColumn
  ) => React.ReactNode;

  onRowClick?: (row: T) => void;

  className?: string;
}

export default function Table<T extends { id: string }>({
  columns,
  data,
  getRowKey,
  renderCell,
  onRowClick,
  className,
}: TableProps<T>) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--background-card)]",
        className
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={{
                  width: column.width,
                }}
                className="px-5 py-4 text-left text-sm font-semibold text-[var(--text-secondary)]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={clsx(
                "border-b border-[var(--border-color)] transition-colors last:border-none",
                onRowClick &&
                  "cursor-pointer hover:bg-[var(--background-hover)]"
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-5 py-4 text-sm text-[var(--text-primary)]"
                >
                  {renderCell(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
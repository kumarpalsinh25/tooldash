"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Download
} from "lucide-react";

interface TableData {
  columns: string[];
  values: any[][];
}

interface AdvancedTableProps {
  data: TableData;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  onBulkDelete?: (selectedRows: any[]) => void;
  onBulkUpdate?: (selectedRows: any[]) => void;
  onDownloadCsv?: (data: TableData) => void;
  onSortChange?: (sortColumn: string, sortDirection: 'asc' | 'desc' | null) => void;
  enableSorting?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  showSearch?: boolean;
  pageSize?: number;
}

export function AdvancedTable({
  data,
  globalFilter: externalGlobalFilter,
  onGlobalFilterChange,
  onBulkDelete,
  onBulkUpdate,
  onDownloadCsv,
  onSortChange,
  enableSorting = true,
  enableSelection = true,
  enablePagination = true,
  showSearch = true,
  pageSize = 50,
}: AdvancedTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");

  const globalFilter = externalGlobalFilter !== undefined ? externalGlobalFilter : internalGlobalFilter;
  const setGlobalFilter = onGlobalFilterChange || setInternalGlobalFilter;

  // Convert data to TanStack format
  const tableData = useMemo(() => {
    return data.values.map((row, index) => {
      const rowObj: any = { id: index };
      data.columns.forEach((col, colIndex) => {
        rowObj[col] = row[colIndex];
      });
      return rowObj;
    });
  }, [data]);

  // Create columns dynamically
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = [];

    // Selection column
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="Select row"
          />
        ),
        size: 50,
        enableSorting: false,
      });
    }

    // Data columns
    data.columns.forEach((col, index) => {
      cols.push({
        accessorKey: col,
        header: ({ column }) => {
          if (!enableSorting) return col;

          return (
            <div className="flex items-center justify-between w-full group">
              <span className="font-medium truncate pr-2">{col}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting()}
                className="h-6 w-6 p-0 ml-2 flex-shrink-0"
              >
                {column.getIsSorted() === "asc" && (
                  <Icon icon={ChevronUp} size="sm" />
                )}
                {column.getIsSorted() === "desc" && (
                  <Icon icon={ChevronDown} size="sm" />
                )}
                {column.getIsSorted() === false && (
                  <Icon icon={ChevronUp} size="sm" className="opacity-30" />
                )}
              </Button>
            </div>
          );
        },
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <div
              className="max-w-sm truncate px-1"
              title={String(value)}
            >
              {String(value)}
            </div>
          );
        },
        size: 200,
        minSize: 100,
        maxSize: 500,
      });
    });

    return cols;
  }, [data.columns, enableSelection, enableSorting]);

  const handleSortingChange = (updaterOrValue: any) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);

    if (onSortChange && newSorting.length > 0) {
      const sort = newSorting[0];
      onSortChange(sort.id, sort.desc ? 'desc' : 'asc');
    } else if (onSortChange) {
      onSortChange('', null);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting && !onSortChange ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Always enable pagination
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
      pagination: { pageSize, pageIndex: 0 },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  const hasSelection = selectedRows.length > 0;
  const filteredRowCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Bulk Actions - Only show when rows are selected */}
      {hasSelection && (
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b flex-shrink-0">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} row{selectedRows.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            {onBulkDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkDelete(selectedRows)}
                className="text-destructive hover:text-destructive"
                leftIcon={<Icon icon={Trash2} size="sm" />}
              >
                Delete Selected
              </Button>
            )}
            {onBulkUpdate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkUpdate(selectedRows)}
                leftIcon={<Icon icon={Edit} size="sm" />}
              >
                Update Selected
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 border rounded-lg" style={{ minHeight: '300px' }}>
        <table className="w-full text-sm table-auto min-w-max border-collapse">
            <thead className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left p-3 font-medium border-b bg-muted whitespace-nowrap min-w-0 relative"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-muted/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3 whitespace-nowrap min-w-0"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {table.getRowModel().rows.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No data found
            </div>
          )}
      </div>

      {/* Pagination & Info */}
      <div className="flex items-center justify-between p-3 border-t bg-muted/10 flex-shrink-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {filteredRowCount} of {data.values.length} rows
          </span>
          {table.getPageCount() > 1 && (
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onDownloadCsv && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadCsv(data)}
              leftIcon={<Icon icon={Download} size="sm" />}
            >
              Export CSV
            </Button>
          )}

          {table.getPageCount() > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                leftIcon={<Icon icon={ChevronLeft} size="sm" />}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                rightIcon={<Icon icon={ChevronRight} size="sm" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
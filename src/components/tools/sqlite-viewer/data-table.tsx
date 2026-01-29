import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface TableData {
    columns: string[];
    values: any[][];
}

interface DataTableProps {
    data: TableData | null;
    onDownloadCsv?: () => void;
    pageSize?: number;
}

export function DataTable({ data, onDownloadCsv, pageSize = 50 }: DataTableProps) {
    const [filter, setFilter] = useState("");
    const [page, setPage] = useState(1);

    if (!data) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No data available
            </div>
        );
    }

    const filteredValues = data.values.filter(row =>
        row.some(cell => String(cell).toLowerCase().includes(filter.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredValues.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedValues = filteredValues.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        setPage(Math.max(1, Math.min(newPage, totalPages)));
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Icon icon={Search} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search data..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {filteredValues.length} of {data.values.length} rows
                    </span>
                </div>
                {onDownloadCsv && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDownloadCsv}
                        leftIcon={<Icon icon={ChevronRight} size="sm" />}
                    >
                        Export CSV
                    </Button>
                )}
            </div>

            <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                <div className="h-full overflow-auto">
                    <table className="w-full text-sm min-w-max">
                        <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                                {data.columns.map(col => (
                                    <th key={col} className="text-left p-3 font-medium border-b bg-muted whitespace-nowrap">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedValues.map((row, i) => (
                                <tr key={i} className="border-b hover:bg-muted/20 transition-colors">
                                    {row.map((cell, j) => (
                                        <td
                                            key={j}
                                            className="p-3 max-w-xs truncate whitespace-nowrap"
                                            title={String(cell)}
                                        >
                                            {String(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        leftIcon={<Icon icon={ChevronLeft} size="sm" />}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        rightIcon={<Icon icon={ChevronRight} size="sm" />}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
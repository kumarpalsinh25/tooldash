import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Play, Download, AlertCircle } from "lucide-react";
import Editor from '@monaco-editor/react';
import { AdvancedTable } from './advanced-table';

interface TableData {
    columns: string[];
    values: any[][];
}

interface QueryEditorProps {
    query: string;
    onQueryChange: (query: string) => void;
    onExecute: () => void;
    result: TableData | null;
    isLoading?: boolean;
    onDownloadCsv?: () => void;
}

export function QueryEditor({
    query,
    onQueryChange,
    onExecute,
    result,
    isLoading = false,
    onDownloadCsv
}: QueryEditorProps) {
    const [editorHeight, setEditorHeight] = useState(300);

    return (
        <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-3 py-2 border-b flex items-center gap-2">
                    <Icon icon={Play} size="sm" className="text-primary" />
                    <span className="text-sm font-medium">SQL Query</span>
                </div>
                <Editor
                    height={`${editorHeight}px`}
                    language="sql"
                    value={query}
                    onChange={(value) => onQueryChange(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>

            <div className="flex items-center gap-4">
                <Button
                    onClick={onExecute}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                >
                    <Icon icon={Play} size="sm" />
                    {isLoading ? 'Executing...' : 'Execute Query'}
                </Button>
                {result && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon icon={AlertCircle} size="sm" />
                        {result.values.length} rows returned
                    </div>
                )}
            </div>

            {result && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Results</h3>
                    </div>

                    <div className="min-h-[300px] max-h-[50vh]">
                        <AdvancedTable
                            data={result}
                            onDownloadCsv={onDownloadCsv}
                            enableSorting={true}
                            enableSelection={false}
                            enablePagination={true}
                            pageSize={25}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Link, Database, Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import Papa from 'papaparse';

import {
    DatabaseSidebar,
    TabNavigation,
    AdvancedTable,
    QueryEditor,
    ExportPanel
} from './sqlite-viewer/';

interface TableData {
    columns: string[];
    values: any[][];
}

export function SqliteViewerTool() {
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [db, setDb] = useState<any>(null);
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string>("");
    const [tableData, setTableData] = useState<TableData | null>(null);
    const [query, setQuery] = useState("SELECT * FROM ");
    const [queryResult, setQueryResult] = useState<TableData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentView, setCurrentView] = useState<'load' | 'view'>('load');
    const [initSqlJs, setInitSqlJs] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'data' | 'query' | 'export'>('data');
    const [isExecutingQuery, setIsExecutingQuery] = useState(false);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const handleBulkDelete = (selectedRows: any[]) => {
        // In a real application, this would execute DELETE queries
        const ids = selectedRows.map(row => row.id);
        alert(`Bulk delete selected rows: ${ids.join(', ')}\n\nThis would execute: DELETE FROM ${selectedTable} WHERE id IN (${ids.join(', ')})`);
    };

    const handleBulkUpdate = (selectedRows: any[]) => {
        // In a real application, this would show an update form
        const ids = selectedRows.map(row => row.id);
        alert(`Bulk update selected rows: ${ids.join(', ')}\n\nThis would show a form to update multiple records.`);
    };

    const handleSortChange = (column: string, direction: 'asc' | 'desc' | null) => {
        setSortColumn(column);
        setSortDirection(direction);
        if (selectedTable) {
            loadTableData(selectedTable);
        }
    };

    useEffect(() => {
        // Dynamically import sql.js to avoid server-side issues
        import('sql.js').then((SQL) => {
            setInitSqlJs(() => SQL.default);
        }).catch((err) => {
            setError("Failed to load SQL.js: " + err.message);
        });
    }, []);

    useEffect(() => {
        if (selectedTable) {
            loadTableData(selectedTable);
            setQuery(`SELECT * FROM ${selectedTable}`);
        }
    }, [selectedTable]);

    const handleFileChange = (files: File[]) => {
        setFile(files[0] || null);
        setError("");
    };

    const loadDatabase = async () => {
        if (!file && !url) {
            setError("Please upload a file or provide a URL.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (!initSqlJs) {
                throw new Error("SQL.js not loaded yet.");
            }

            let arrayBuffer: ArrayBuffer;
            if (file) {
                arrayBuffer = await file.arrayBuffer();
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch file from URL.");
                arrayBuffer = await response.arrayBuffer();
            }

            const SQL = await initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });

            const database = new SQL.Database(new Uint8Array(arrayBuffer));
            setDb(database);

            const result = database.exec("SELECT name FROM sqlite_master WHERE type='table'");
            const tableNames = result[0]?.values.map(row => row[0] as string) || [];
            setTables(tableNames);
            setCurrentView('view');
            if (tableNames.length > 0) {
                setSelectedTable(tableNames[0]);
                setQuery(`SELECT * FROM ${tableNames[0]}`);
                setActiveTab('data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load database.");
        } finally {
            setLoading(false);
        }
    };

    const loadTableData = (table: string) => {
        if (!db) return;
        try {
            let query = `SELECT * FROM \`${table}\``;

            if (sortColumn && sortDirection) {
                query += ` ORDER BY \`${sortColumn}\` ${sortDirection.toUpperCase()}`;
            }

            const result = db.exec(query);
            if (result.length > 0) {
                setTableData({
                    columns: result[0].columns,
                    values: result[0].values
                });
            } else {
                setTableData(null);
            }
            setError(""); // Clear errors on success
        } catch (err) {
            setError(`Failed to load table "${table}": ${(err as Error).message}`);
            setTableData(null);
        }
    };

    const runQuery = async () => {
        if (!db || !query) return;
        setIsExecutingQuery(true);
        try {
            const result = db.exec(query);
            if (result.length > 0) {
                setQueryResult({
                    columns: result[0].columns,
                    values: result[0].values
                });
            } else {
                setQueryResult(null);
            }
            setError(""); // Clear any previous errors
        } catch (err) {
            setError("Query execution failed: " + (err as Error).message);
            setQueryResult(null);
        } finally {
            setIsExecutingQuery(false);
        }
    };

    const downloadCsv = (data: TableData | null) => {
        if (!data) return;
        const csv = Papa.unparse({
            fields: data.columns,
            data: data.values
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedTable || 'query'}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };



    return (
        <div className="space-y-6">
            {currentView === 'load' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Load SQLite Database</CardTitle>
                        <CardDescription>
                            Upload an SQLite file or provide a URL to load the database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upload File</label>
                            <FileUpload
                                value={file ? [file] : []}
                                onChange={handleFileChange}
                                accept=".db,.sqlite,.sqlite3"
                                emptyText="Drop an SQLite file here or click to upload"
                            />
                        </div>
                        <div className="text-center text-sm text-muted-foreground">or</div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">File URL</label>
                            <Input
                                placeholder="Enter SQLite file URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={loadDatabase}
                            disabled={loading || (!file && !url) || !initSqlJs}
                            loading={loading}
                            leftIcon={<Icon icon={Upload} size="md" />}
                        >
                            {loading ? "Loading..." : initSqlJs ? "Load Database" : "Initializing..."}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {currentView === 'view' && (
                <div className="flex min-h-[70vh] max-h-[90vh] border rounded-lg overflow-hidden bg-background">
                    <DatabaseSidebar
                        tables={tables}
                        selectedTable={selectedTable}
                        onTableSelect={(table) => {
                            setSelectedTable(table);
                            setActiveTab('data');
                            setQuery(`SELECT * FROM \`${table}\``);
                            // Reset sorting and search when switching tables
                            setSortColumn('');
                            setSortDirection(null);
                            setGlobalFilter('');
                        }}
                        onLoadNew={() => setCurrentView('load')}
                    />

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="border-b p-4 bg-background">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Icon icon={Database} size="sm" className="text-primary" />
                                    <h2 className="text-lg font-semibold">
                                        {selectedTable || 'Database Viewer'}
                                    </h2>
                                    {tableData && (
                                        <span className="text-sm text-muted-foreground">
                                            {tableData.values.length} rows
                                        </span>
                                    )}
                                </div>
                                <TabNavigation
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                />
                            </div>
                            {activeTab === 'data' && tableData && (
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Icon icon={Search} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Search all columns..."
                                            value={globalFilter}
                                            onChange={(e) => setGlobalFilter(e.target.value)}
                                            className="pl-9 w-64"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col min-h-0 p-6">
                            {activeTab === 'data' && (
                                <AdvancedTable
                                    data={tableData || { columns: [], values: [] }}
                                    globalFilter={globalFilter}
                                    onGlobalFilterChange={setGlobalFilter}
                                    onBulkDelete={handleBulkDelete}
                                    onBulkUpdate={handleBulkUpdate}
                                    onDownloadCsv={tableData ? () => downloadCsv(tableData) : undefined}
                                    onSortChange={handleSortChange}
                                    showSearch={false}
                                />
                            )}

                            {activeTab === 'query' && (
                                <QueryEditor
                                    query={query}
                                    onQueryChange={setQuery}
                                    onExecute={runQuery}
                                    result={queryResult}
                                    isLoading={isExecutingQuery}
                                    onDownloadCsv={queryResult ? () => downloadCsv(queryResult) : undefined}
                                />
                            )}

                            {activeTab === 'export' && (
                                <ExportPanel
                                    selectedTable={selectedTable}
                                    tableData={tableData}
                                    filteredData={null}
                                    queryResult={queryResult}
                                    onDownloadCsv={downloadCsv}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
                    {error}
                </div>
            )}
        </div>
    );
}
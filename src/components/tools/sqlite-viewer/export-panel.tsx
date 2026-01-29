import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Download, Database, Filter, Code } from "lucide-react";

interface TableData {
    columns: string[];
    values: any[][];
}

interface ExportPanelProps {
    selectedTable: string;
    tableData: TableData | null;
    filteredData: TableData | null;
    queryResult: TableData | null;
    onDownloadCsv: (data: TableData) => void;
}

export function ExportPanel({
    selectedTable,
    tableData,
    filteredData,
    queryResult,
    onDownloadCsv
}: ExportPanelProps) {
    const hasFilter = filteredData && filteredData.values.length !== tableData?.values.length;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Icon icon={Download} size="lg" className="text-primary" />
                <h3 className="text-xl font-semibold">Export Options</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tableData && (
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Icon icon={Database} size="sm" className="text-primary" />
                                Table Data
                            </CardTitle>
                            <CardDescription>
                                Complete data from {selectedTable}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    {tableData.values.length} rows × {tableData.columns.length} columns
                                </div>
                                <Button
                                    onClick={() => onDownloadCsv(tableData)}
                                    leftIcon={<Icon icon={Download} size="sm" />}
                                    className="w-full"
                                    size="sm"
                                >
                                    Download {selectedTable}.csv
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {hasFilter && filteredData && (
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Icon icon={Filter} size="sm" className="text-primary" />
                                Filtered Results
                            </CardTitle>
                            <CardDescription>
                                Current search/filter results
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    {filteredData.values.length} rows × {filteredData.columns.length} columns
                                </div>
                                <Button
                                    onClick={() => onDownloadCsv(filteredData)}
                                    variant="outline"
                                    leftIcon={<Icon icon={Download} size="sm" />}
                                    className="w-full"
                                    size="sm"
                                >
                                    Download Filtered.csv
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {queryResult && (
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Icon icon={Code} size="sm" className="text-primary" />
                                Query Results
                            </CardTitle>
                            <CardDescription>
                                Results from last executed query
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">
                                    {queryResult.values.length} rows × {queryResult.columns.length} columns
                                </div>
                                <Button
                                    onClick={() => onDownloadCsv(queryResult)}
                                    variant="outline"
                                    leftIcon={<Icon icon={Download} size="sm" />}
                                    className="w-full"
                                    size="sm"
                                >
                                    Download Query.csv
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!tableData && !queryResult && (
                    <Card className="col-span-full">
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground">
                                <Icon icon={Download} size="lg" className="mx-auto mb-2 opacity-50" />
                                <p>No data available for export</p>
                                <p className="text-sm">Load a database and select data to export</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
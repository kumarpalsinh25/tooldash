import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Upload, Database, ChevronRight } from "lucide-react";

interface DatabaseSidebarProps {
    tables: string[];
    selectedTable: string;
    onTableSelect: (table: string) => void;
    onLoadNew: () => void;
}

export function DatabaseSidebar({
    tables,
    selectedTable,
    onTableSelect,
    onLoadNew
}: DatabaseSidebarProps) {
    return (
        <div className="w-64 bg-muted/50 border-r flex flex-col h-full flex-shrink-0">
            <div className="p-4 border-b bg-background/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon={Database} size="sm" className="text-primary" />
                        <span className="font-semibold text-sm">Tables</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {tables.length}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onLoadNew}
                        leftIcon={<Icon icon={Upload} size="sm" />}
                        title="Load another database"
                    ></Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
                {tables.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                        No tables found
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {tables.map(table => (
                            <li key={table}>
                                <button
                                    onClick={() => onTableSelect(table)}
                                    className={`w-full text-left p-3 rounded-lg text-sm hover:bg-background transition-colors flex items-center gap-3 group ${
                                        selectedTable === table
                                            ? 'bg-background shadow-sm border'
                                            : 'hover:shadow-sm'
                                    }`}
                                >
                                    <Icon
                                        icon={Database}
                                        size="sm"
                                        className="text-muted-foreground group-hover:text-primary"
                                    />
                                    <span className="flex-1 truncate">{table}</span>
                                    {selectedTable === table && (
                                        <Icon icon={ChevronRight} size="sm" className="text-primary" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
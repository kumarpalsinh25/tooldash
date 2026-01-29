import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Table, Code, Download } from "lucide-react";

interface TabNavigationProps {
    activeTab: 'data' | 'query' | 'export';
    onTabChange: (tab: 'data' | 'query' | 'export') => void;
}

const tabs = [
    { id: 'data' as const, label: 'Data', icon: Table },
    { id: 'query' as const, label: 'Query', icon: Code },
    { id: 'export' as const, label: 'Export', icon: Download },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
            {tabs.map(tab => (
                <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'solid' : 'ghost'}
                    size="sm"
                    onClick={() => onTabChange(tab.id)}
                    leftIcon={<Icon icon={tab.icon} size="sm" />}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
}
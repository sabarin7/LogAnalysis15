import { Filter, Calendar, Server, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface LogFiltersProps {
  selectedLevels: string[];
  selectedServices: string[];
  onLevelToggle: (level: string) => void;
  onServiceToggle: (service: string) => void;
  onClearFilters: () => void;
}

const LOG_LEVELS = [
  { name: 'error', color: 'text-terminal-red', count: 23 },
  { name: 'warn', color: 'text-terminal-yellow', count: 45 },
  { name: 'info', color: 'text-terminal-cyan', count: 156 },
  { name: 'debug', color: 'text-muted-foreground', count: 89 },
  { name: 'success', color: 'text-terminal-green', count: 67 }
];

const SERVICES = [
  { name: 'auth-service', count: 89 },
  { name: 'payment-api', count: 67 },
  { name: 'user-management', count: 45 },
  { name: 'notification-service', count: 34 },
  { name: 'analytics-pipeline', count: 23 },
  { name: 'email-service', count: 12 }
];

export const LogFilters = ({ 
  selectedLevels, 
  selectedServices, 
  onLevelToggle, 
  onServiceToggle, 
  onClearFilters 
}: LogFiltersProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const activeFilters = selectedLevels.length + selectedServices.length;

  return (
    <Card className="p-4 border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-semibold">Filters</span>
              {activeFilters > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilters}
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Log Levels */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Log Levels</span>
            </div>
            <div className="space-y-2">
              {LOG_LEVELS.map((level) => (
                <Button
                  key={level.name}
                  variant={selectedLevels.includes(level.name) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onLevelToggle(level.name)}
                  className="w-full justify-between h-8 px-3"
                >
                  <span className={`${level.color} font-mono uppercase text-xs`}>
                    {level.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {level.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Services</span>
            </div>
            <div className="space-y-2">
              {SERVICES.map((service) => (
                <Button
                  key={service.name}
                  variant={selectedServices.includes(service.name) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onServiceToggle(service.name)}
                  className="w-full justify-between h-8 px-3"
                >
                  <span className="font-mono text-xs">
                    {service.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {service.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Range</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Last Hour
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Last Day
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Last Week
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Custom
              </Button>
            </div>
          </div>

          {activeFilters > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full text-xs"
            >
              Clear All Filters
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
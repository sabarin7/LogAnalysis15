import { Clock, Server, AlertTriangle, Info, AlertCircle, CheckCircle, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface LogData {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug' | 'success';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

interface LogEntryProps {
  log: LogData;
  searchQuery: string;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'error': return <AlertCircle className="h-4 w-4" />;
    case 'warn': return <AlertTriangle className="h-4 w-4" />;
    case 'info': return <Info className="h-4 w-4" />;
    case 'debug': return <Bug className="h-4 w-4" />;
    case 'success': return <CheckCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'error': return 'log-error';
    case 'warn': return 'log-warn';
    case 'info': return 'log-info';
    case 'debug': return 'log-debug';
    case 'success': return 'log-success';
    default: return 'log-info';
  }
};

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/20 text-primary rounded px-1">
        {part}
      </mark>
    ) : part
  );
};

export const LogEntry = ({ log, searchQuery }: LogEntryProps) => {
  return (
    <Card className="p-4 hover:bg-muted/50 transition-colors border-border">
      <div className="flex items-start gap-4">
        <div className={`flex items-center gap-2 ${getLevelColor(log.level)} font-mono text-sm`}>
          {getLevelIcon(log.level)}
          <span className="uppercase font-bold">{log.level}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{log.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server className="h-3 w-3 text-accent" />
              <Badge variant="outline" className="text-xs">
                {log.service}
              </Badge>
            </div>
          </div>
          
          <div className="font-mono text-sm leading-relaxed">
            {highlightText(log.message, searchQuery)}
          </div>
          
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono text-muted-foreground">
              <details>
                <summary className="cursor-pointer hover:text-foreground">
                  Metadata ({Object.keys(log.metadata).length} fields)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
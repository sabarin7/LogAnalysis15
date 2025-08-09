import { Search, Sparkles, Filter, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LogSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAiSearch: () => void;
  resultCount: number;
}

export const LogSearchHeader = ({ 
  searchQuery, 
  onSearchChange, 
  onAiSearch, 
  resultCount 
}: LogSearchHeaderProps) => {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LogSearch AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligent log analysis and search powered by AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-terminal-green">
              {resultCount} logs
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs naturally: 'Show errors from payment service', 'Find timeouts last hour'..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 h-12 bg-muted border-border focus:border-primary"
            />
          </div>
          <Button 
            onClick={onAiSearch}
            className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Search
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
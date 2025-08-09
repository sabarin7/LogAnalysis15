import { Sparkles, TrendingUp, AlertTriangle, Clock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AISuggestionsProps {
  onSuggestionClick: (query: string) => void;
}

const AI_SUGGESTIONS = [
  {
    icon: AlertTriangle,
    title: "Recent Errors",
    query: "show errors from last hour",
    description: "Find critical issues that need attention",
    count: 12,
    severity: "high"
  },
  {
    icon: TrendingUp,
    title: "Performance Issues",
    query: "slow queries and timeouts",
    description: "Identify performance bottlenecks",
    count: 8,
    severity: "medium"
  },
  {
    icon: Clock,
    title: "Payment Service Logs",
    query: "payment-api logs today",
    description: "Monitor payment processing",
    count: 45,
    severity: "low"
  },
  {
    icon: Zap,
    title: "Auth Failures",
    query: "authentication failures",
    description: "Security-related log events",
    count: 6,
    severity: "high"
  }
];

export const AISuggestions = ({ onSuggestionClick }: AISuggestionsProps) => {
  return (
    <Card className="p-4 border-border">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-semibold">AI Suggestions</span>
        <Badge variant="secondary" className="text-xs bg-gradient-primary text-primary-foreground">
          Smart
        </Badge>
      </div>
      
      <div className="space-y-3">
        {AI_SUGGESTIONS.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onSuggestionClick(suggestion.query)}
              className="w-full p-3 h-auto justify-start hover:bg-gradient-accent group"
            >
              <div className="flex items-start gap-3 w-full">
                <Icon className={`h-4 w-4 mt-0.5 ${
                  suggestion.severity === 'high' ? 'text-terminal-red' :
                  suggestion.severity === 'medium' ? 'text-terminal-yellow' :
                  'text-terminal-cyan'
                }`} />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <p className="text-xs font-mono text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    "{suggestion.query}"
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-accent rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-primary">AI Tip</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Try natural language queries like "show me errors in payment service from last 2 hours" 
          or "find slow database queries today"
        </p>
      </div>
    </Card>
  );
};